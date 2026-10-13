const { createHmac, randomUUID } = require('node:crypto');
const { isIP } = require('node:net');
const { publicRooms } = require('./public-plan-feed');
const { parseCsv, fetchCsvText } = require('./lediga-rum');
const { GUIDE_URL } = require('../config/site');
const { sanitizeMessages, fallbackAnswer, requiresDirectAnswer, buildInstructions, ASSISTANT_LINKS } = require('./office-assistant');

const MODEL = 'gpt-4.1-mini-2025-04-14';
const MAX_OUTPUT_TOKENS = 400;
const MAX_INPUT_TOKENS = 16000;
const MAX_PAYLOAD_BYTES = 12000;
const RESERVATION_MICRO_USD = 7040;

function configured(env = process.env) {
  return env.OFFICE_ASSISTANT_ENABLED === 'true' && Boolean(env.OPENAI_API_KEY)
    && Boolean(env.DATABASE_URL) && env.OFFICE_ASSISTANT_IP_SALT?.length >= 32;
}

function validOrigin(req, env = process.env) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const allowed = new Set([GUIDE_URL]);
  if (env.VERCEL_URL) allowed.add(`https://${env.VERCEL_URL}`);
  if (env.NODE_ENV !== 'production' || (!env.VERCEL && env.DG97_LOCAL_VERIFICATION === 'true')) {
    allowed.add('http://localhost:3108');
    allowed.add('http://127.0.0.1:3108');
  }
  return allowed.has(origin);
}

function visitorHash(req, salt) {
  // Vercel overwrites x-forwarded-for with the connecting visitor address.
  const raw = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for']
    || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (!isIP(raw)) return null;
  return createHmac('sha256', salt).update(raw).digest('hex');
}

function actualCost(usage) {
  const input = usage?.input_tokens;
  const output = usage?.output_tokens;
  if (!Number.isSafeInteger(input) || input < 0 || input > MAX_INPUT_TOKENS
    || !Number.isSafeInteger(output) || output < 0 || output > MAX_OUTPUT_TOKENS) return null;
  // Pinned model pricing verified 2026-10-13: $0.40/$1.60 per million.
  // Ignore cached-input discount, conservatively retaining the higher amount.
  return Math.ceil((input * 4 + output * 16) / 10);
}

function outputText(response) {
  const text = (response.output || []).filter(item => item.type === 'message' && item.role === 'assistant')
    .flatMap(item => item.content || []).filter(item => item.type === 'output_text').map(item => item.text || '').join('\n').trim();
  if (!text || text.length > 3000 || /\d[\d\s.,]*\s*(?:kr|sek|kronor|dollar|usd|€|\$)/i.test(text)
    || /https?:\/\/|<\/?(?:script|iframe|img|a)\b/i.test(text)) return null;
  return text;
}

function createLedger(databaseUrl) {
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(databaseUrl);
  return {
    async reserve(id, visitor) {
      const rows = await sql`SELECT public.dg97_assistant_reserve(${id}::uuid, ${visitor}) AS status`;
      return rows[0]?.status;
    },
    async settle(id, cost) {
      await sql`SELECT public.dg97_assistant_settle(${id}::uuid, ${cost}::integer)`;
    },
  };
}

async function loadPublicFacts(fetchCsv = fetchCsvText, now = () => new Date()) {
  try {
    return { rooms: publicRooms(parseCsv(await fetchCsv())), checkedAt: now().toISOString() };
  } catch {
    return { rooms: [], checkedAt: null };
  }
}

function createAssistantHandler({ env = process.env, fetchProvider = fetch, loadFacts = loadPublicFacts,
  ledgerFactory = createLedger, uuid = randomUUID } = {}) {
  return async function officeAssistant(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method === 'GET') return res.status(200).json({ mode: configured(env) ? 'ai' : 'guide' });
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Metoden stöds inte.' });
    }
    if (!validOrigin(req, env)) return res.status(403).json({ error: 'Öppna chatten på DG97 Kontorsguiden.' });
    const messages = sanitizeMessages(req.body?.messages);
    if (!messages) return res.status(400).json({ error: 'Skriv en kort fråga om DG97, högst 600 tecken.' });
    const currentMessage = messages.at(-1).content;
    const facts = await loadFacts();
    const guide = reason => res.status(200).json({ mode: 'guide', reason,
      text: fallbackAnswer(currentMessage, facts), links: ASSISTANT_LINKS });
    if (!configured(env)) return guide('not_configured');
    if (requiresDirectAnswer(currentMessage)) return guide('public_information');
    const visitor = visitorHash(req, env.OFFICE_ASSISTANT_IP_SALT);
    if (!visitor) return guide('unavailable');
    const payload = {
      model: MODEL, instructions: buildInstructions(facts), input: messages,
      max_output_tokens: MAX_OUTPUT_TOKENS, store: false,
    };
    // UTF-8 text tokens cannot outnumber text bytes. The larger token reservation
    // also covers message framing; no images/tools/hidden reasoning are enabled.
    if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_PAYLOAD_BYTES) return guide('unavailable');
    let ledger;
    const id = uuid();
    try {
      ledger = ledgerFactory(env.DATABASE_URL);
      const status = await ledger.reserve(id, visitor);
      if (status !== 'accepted') return guide(status === 'budget_limit' ? 'budget_limit' : status === 'rate_limit' ? 'rate_limit' : 'unavailable');
    } catch {
      return guide('unavailable');
    }
    // After reservation there is exactly one provider attempt. On any uncertain
    // result keep the full reservation so a timeout cannot bypass the hard cap.
    try {
      const response = await fetchProvider('https://api.openai.com/v1/responses', {
        method: 'POST', headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) return guide('unavailable');
      const result = await response.json();
      const cost = actualCost(result.usage);
      if (!['completed', 'incomplete'].includes(result.status) || cost === null) return guide('unavailable');
      // Failed settlement retains a safe upper bound; never rerun generation.
      try { await ledger.settle(id, cost); } catch { /* reservation already covers the call */ }
      const text = outputText(result);
      if (!text) return guide('unavailable');
      return res.status(200).json({ mode: 'ai', text, links: ASSISTANT_LINKS });
    } catch {
      return guide('unavailable');
    }
  };
}

module.exports = { MODEL, MAX_OUTPUT_TOKENS, MAX_INPUT_TOKENS, MAX_PAYLOAD_BYTES, RESERVATION_MICRO_USD,
  configured, validOrigin, visitorHash, actualCost, outputText, loadPublicFacts, createAssistantHandler };

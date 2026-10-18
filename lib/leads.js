const { createHash } = require('node:crypto');
const { getSql, isDatabaseConfigured } = require('./db');

const SIZE_NEEDS = ['1-2', '3-4', '5-6', 'osaker'];
const RATE_LIMIT_PER_HOUR = 5;
const UNAVAILABLE_MESSAGE = 'Skicka din förfrågan till hej@dg97.se eller ring 0739 55 80 87.';

function trimField(value, max) {
  if (value == null) return '';
  return String(value).replace(/\s+/g, ' ').trim().slice(0, max);
}

function isHoneypot(body) {
  const bait = body?.website ?? body?.company_url ?? body?.fax;
  return typeof bait === 'string' && bait.trim() !== '';
}

function parseLead(body) {
  const name = trimField(body?.name, 100);
  const company = trimField(body?.company, 120);
  const email = trimField(body?.email, 254).toLowerCase();
  const phone = trimField(body?.phone, 50);
  const sizeNeed = trimField(body?.sizeNeed ?? body?.size_need, 20);
  const startDate = trimField(body?.startDate ?? body?.start_date, 40);
  const message = trimField(body?.message, 5000);
  const errors = [];
  if (name.length < 2) errors.push('Ange ditt namn.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Ange en giltig e-postadress.');
  if (message.length < 10) errors.push('Skriv ett kort meddelande om era behov.');
  if (sizeNeed && !SIZE_NEEDS.includes(sizeNeed)) errors.push('Ogiltigt storleksbehov.');
  return {
    ok: errors.length === 0,
    errors,
    value: {
      name,
      company: company || null,
      email,
      phone: phone || null,
      sizeNeed: sizeNeed || null,
      startDate: startDate || null,
      message,
    },
  };
}

function hashIp(ip) {
  const salt = process.env.LEAD_IP_SALT || process.env.ADMIN_SESSION_SECRET || 'dg97-org-leads';
  return createHash('sha256').update(`${salt}:${String(ip || 'unknown').slice(0, 128)}`).digest('hex');
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket?.remoteAddress;
  return String(raw || 'unknown').trim();
}

async function ensureLeadsTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS public.leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      name text NOT NULL,
      company text,
      email text NOT NULL,
      phone text,
      size_need text,
      start_date text,
      message text NOT NULL,
      ip_hash text,
      user_agent text
    )
  `;
}

async function submitLead({ lead, ip, userAgent }) {
  if (!isDatabaseConfigured()) {
    return { status: 503, body: { error: UNAVAILABLE_MESSAGE } };
  }
  const sql = getSql();
  await ensureLeadsTable(sql);
  const ipHash = hashIp(ip);
  const recent = await sql`
    SELECT count(*)::int AS n
    FROM public.leads
    WHERE ip_hash = ${ipHash}
      AND created_at > NOW() - INTERVAL '1 hour'
  `;
  if ((recent[0]?.n || 0) >= RATE_LIMIT_PER_HOUR) {
    return { status: 429, body: { error: 'För många försök. Mejla hej@dg97.se eller ring 0739 55 80 87.' } };
  }
  await sql`
    INSERT INTO public.leads (
      name, company, email, phone, size_need, start_date, message, ip_hash, user_agent
    ) VALUES (
      ${lead.name}, ${lead.company}, ${lead.email}, ${lead.phone},
      ${lead.sizeNeed}, ${lead.startDate}, ${lead.message}, ${ipHash},
      ${trimField(userAgent, 300) || null}
    )
  `;
  return { status: 200, body: { ok: true } };
}

async function listLeads(limit = 200) {
  if (!isDatabaseConfigured()) return null;
  const sql = getSql();
  await ensureLeadsTable(sql);
  const safeLimit = Math.min(Math.max(Number(limit) || 200, 1), 500);
  return sql`
    SELECT id, created_at, name, company, email, phone, size_need, start_date, message
    FROM public.leads
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;
}

module.exports = {
  SIZE_NEEDS,
  RATE_LIMIT_PER_HOUR,
  UNAVAILABLE_MESSAGE,
  isHoneypot,
  parseLead,
  hashIp,
  clientIp,
  submitLead,
  listLeads,
};

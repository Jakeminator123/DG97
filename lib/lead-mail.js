const { DG97_BUSINESS } = require('../config/site');

const DEFAULT_FROM = 'DG97 Kontorshotell <noreply@dg97.org>';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SEND_TIMEOUT_MS = 8000;
const SIZE_LABELS = {
  '1-2': '1–2 personer',
  '3-4': '3–4 personer',
  '5-6': '5–6 personer',
  osaker: 'Osäker / vill diskutera',
};

function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function mailFrom() {
  return process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM;
}

function mailTo() {
  return process.env.LEAD_NOTIFY_TO || DG97_BUSINESS.email;
}

function buildLeadEmail(lead) {
  const text = [
    'Ny förfrågan från formuläret på dg97.org.',
    '',
    `Namn: ${lead.name}`,
    `Företag: ${lead.company || '–'}`,
    `E-post: ${lead.email}`,
    `Telefon: ${lead.phone || '–'}`,
    `Storlek: ${SIZE_LABELS[lead.sizeNeed] || lead.sizeNeed || '–'}`,
    `Önskat startdatum: ${lead.startDate || '–'}`,
    '',
    'Meddelande:',
    lead.message,
  ].join('\n');
  return {
    from: mailFrom(),
    to: [mailTo()],
    reply_to: lead.email,
    subject: `Ny förfrågan från ${lead.name} via dg97.org`,
    text,
  };
}

async function notifyLeadByEmail(lead, { fetchImpl = globalThis.fetch } = {}) {
  if (!isMailConfigured()) {
    console.warn('[lead-mail] RESEND_API_KEY saknas; förfrågan sparad i Neon utan mejl.');
    return { sent: false, reason: 'unconfigured' };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  try {
    const response = await fetchImpl(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildLeadEmail(lead)),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.warn('[lead-mail] Resend svarade inte OK; förfrågan finns i Neon.');
      return { sent: false, reason: 'provider' };
    }
    return { sent: true };
  } catch {
    console.warn('[lead-mail] kunde inte skicka mejl; förfrågan finns i Neon.');
    return { sent: false, reason: 'network' };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  DEFAULT_FROM,
  isMailConfigured,
  buildLeadEmail,
  notifyLeadByEmail,
};

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildLeadEmail, isMailConfigured, notifyLeadByEmail } = require('../lib/lead-mail');

const lead = {
  name: 'Ada Andersson',
  company: 'Ada AB',
  email: 'ada@example.se',
  phone: '070-123 45 67',
  sizeNeed: '3-4',
  startDate: 'november 2026',
  message: 'Vi söker ett rum för fyra personer nära Odenplan.',
};

test('lead email uses official from/to and visitor reply-to', () => {
  delete process.env.LEAD_NOTIFY_FROM;
  delete process.env.LEAD_NOTIFY_TO;
  const payload = buildLeadEmail(lead);
  assert.equal(payload.from, 'DG97 Kontorshotell <noreply@dg97.org>');
  assert.deepEqual(payload.to, ['hej@dg97.se']);
  assert.equal(payload.reply_to, 'ada@example.se');
  assert.match(payload.subject, /Ada Andersson/);
  assert.match(payload.text, /3–4 personer/);
  assert.match(payload.text, /Odenplan/);
});

test('missing Resend key is not configured', () => {
  const previous = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  assert.equal(isMailConfigured(), false);
  if (previous) process.env.RESEND_API_KEY = previous;
});

test('notify without key skips the provider and does not fail', async () => {
  const previous = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  let called = false;
  const result = await notifyLeadByEmail(lead, { fetchImpl: async () => { called = true; return { ok: true }; } });
  assert.equal(result.sent, false);
  assert.equal(result.reason, 'unconfigured');
  assert.equal(called, false);
  if (previous) process.env.RESEND_API_KEY = previous;
});

test('notify with key posts to Resend', async () => {
  process.env.RESEND_API_KEY = 're_test_key';
  const calls = [];
  const result = await notifyLeadByEmail(lead, {
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return { ok: true };
    },
  });
  assert.equal(result.sent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer re_test_key');
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.reply_to, 'ada@example.se');
  assert.deepEqual(body.to, ['hej@dg97.se']);
  delete process.env.RESEND_API_KEY;
});

test('provider errors are swallowed so the visitor still succeeds', async () => {
  process.env.RESEND_API_KEY = 're_test_key';
  const result = await notifyLeadByEmail(lead, {
    fetchImpl: async () => ({ ok: false, status: 401 }),
  });
  assert.equal(result.sent, false);
  assert.equal(result.reason, 'provider');
  delete process.env.RESEND_API_KEY;
});

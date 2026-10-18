const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isHoneypot, parseLead, hashIp } = require('../lib/leads');

test('honeypot treats filled bait fields as spam', () => {
  assert.equal(isHoneypot({ name: 'Ada', website: 'https://spam.test' }), true);
  assert.equal(isHoneypot({ name: 'Ada', website: '' }), false);
  assert.equal(isHoneypot({ name: 'Ada' }), false);
});

test('lead parser requires name, email and a short message', () => {
  const invalid = parseLead({ name: 'A', email: 'nope', message: 'Hej' });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.length >= 2);

  const valid = parseLead({
    name: 'Ada Andersson',
    company: 'Ada AB',
    email: 'Ada@Example.se',
    phone: '070-123 45 67',
    sizeNeed: '3-4',
    startDate: 'november 2026',
    message: 'Vi söker ett rum för fyra personer nära Odenplan.',
  });
  assert.equal(valid.ok, true);
  assert.equal(valid.value.email, 'ada@example.se');
  assert.equal(valid.value.sizeNeed, '3-4');
});

test('unknown size need is rejected', () => {
  const parsed = parseLead({
    name: 'Ada Andersson',
    email: 'ada@example.se',
    sizeNeed: 'hela-huset',
    message: 'Vi söker ett rum för teamet i Vasastan.',
  });
  assert.equal(parsed.ok, false);
});

test('ip hashes are stable and do not contain the raw address', () => {
  process.env.LEAD_IP_SALT = 'test-salt';
  const hash = hashIp('203.0.113.10');
  assert.equal(hash, hashIp('203.0.113.10'));
  assert.equal(hash.length, 64);
  assert.doesNotMatch(hash, /203/);
});

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createHmac } = require('node:crypto');
const { createAdminToken, verifyAdminToken, credentialsConfigured, SESSION_SECONDS } = require('../lib/admin-session');
const { renderMarkdown } = require('../lib/blog-markdown');

const now = Date.UTC(2026, 9, 2);
const request = token => ({ headers: { cookie: `other=1; admin_token=${token}; more=2` } });

beforeEach(() => {
  process.env.ADMIN_USERNAME = 'test-admin';
  process.env.ADMIN_PASSWORD = 'test-password';
  process.env.ADMIN_SESSION_SECRET = 'test-secret-that-is-at-least-32-characters';
});

test('valid signed sessions authenticate until their expiry', () => {
  const token = createAdminToken(now);
  assert.equal(verifyAdminToken(request(token), now), true);
  assert.equal(verifyAdminToken(request(token), now + SESSION_SECONDS * 1000 - 1), true);
  assert.equal(verifyAdminToken(request(token), now + SESSION_SECONDS * 1000), false);
});

test('legacy base64 cookies cannot authenticate', () => {
  const token = Buffer.from(`test-admin:${now}`).toString('base64');
  assert.equal(verifyAdminToken(request(token), now), false);
});

test('tampered payloads and signatures cannot authenticate', () => {
  const token = createAdminToken(now);
  const [payload, signature] = token.split('.');
  const altered = Buffer.from(JSON.stringify({ username: 'test-admin', expires: now + 1000 })).toString('base64url');
  assert.equal(verifyAdminToken(request(`${altered}.${signature}`), now), false);
  assert.equal(verifyAdminToken(request(`${payload}.invalid`), now), false);
});

test('rotating the session secret revokes existing sessions', () => {
  const token = createAdminToken(now);
  process.env.ADMIN_SESSION_SECRET = 'a-different-secret-at-least-32-characters';
  assert.equal(verifyAdminToken(request(token), now), false);
});

test('missing credentials and short secrets fail closed', () => {
  const token = createAdminToken(now);
  delete process.env.ADMIN_PASSWORD;
  assert.equal(credentialsConfigured(), false);
  assert.equal(verifyAdminToken(request(token), now), false);
  process.env.ADMIN_PASSWORD = 'test-password';
  process.env.ADMIN_SESSION_SECRET = 'short';
  assert.equal(credentialsConfigured(), false);
  assert.throws(() => createAdminToken(now));
});

test('malformed signed JSON and missing cookies are rejected', () => {
  const payload = Buffer.from('not-json').toString('base64url');
  const signature = createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(payload).digest('base64url');
  assert.equal(verifyAdminToken(request(`${payload}.${signature}`), now), false);
  assert.equal(verifyAdminToken({ headers: {} }, now), false);
});

test('markdown preserves normal formatting and removes executable HTML', () => {
  const html = renderMarkdown('# Rubrik\n\n**Text** [Kontakt](/kontakt)\n\n<img src="/images/office_room.jpg" onerror="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)">bad</a><iframe src="https://example.org"></iframe>');
  assert.match(html, /<h1>Rubrik<\/h1>/);
  assert.match(html, /<strong>Text<\/strong>/);
  assert.match(html, /href="\/kontakt"/);
  assert.match(html, /src="\/images\/office_room.jpg"/);
  assert.doesNotMatch(html, /onerror|<script|javascript:|<iframe/);
});

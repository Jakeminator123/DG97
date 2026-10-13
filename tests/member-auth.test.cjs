const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  getAuthBaseUrl, hasSameOrigin, authCookies, sameOriginCookies, publicSession,
  normalizedBody, createAuthProxyHandler, getMemberSession,
} = require('../lib/member-auth');

const env = { NODE_ENV: 'production', NEON_AUTH_BASE_URL: 'https://ep-test.neonauth.eu-central-1.aws.neon.build/neondb/auth' };
const user = { id: 'user-1', email: 'member@example.test', name: 'Member', emailVerified: true, role: 'admin' };
const payload = { user, session: { token: 'private-token', expiresAt: new Date(Date.now() + 60000).toISOString() } };
function response() {
  return { statusCode: 200, headers: {}, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    getHeader(key) { return this.headers[key]; },
    status(value) { this.statusCode = value; return this; },
    json(value) { this.body = value; return this; },
  };
}
function request(path, body = { email: 'member@example.test', password: 'a-long-password' }) {
  return { method: 'POST', query: { path: path.split('/') }, body,
    headers: { host: 'www.dg97.org', origin: 'https://www.dg97.org', 'content-type': 'application/json' } };
}

test('auth URL accepts only managed HTTPS endpoints, not credentials or arbitrary hosts', () => {
  assert.equal(getAuthBaseUrl(env), env.NEON_AUTH_BASE_URL);
  for (const base of ['http://localhost/auth', 'https://evil.example/auth', 'https://user:secret@ep-test.neonauth.eu-central-1.aws.neon.build/neondb/auth', `${env.NEON_AUTH_BASE_URL}?url=https://evil.test`]) {
    assert.equal(getAuthBaseUrl({ NEON_AUTH_BASE_URL: base }), null);
  }
});

test('POST origin must be the actual allowed app origin', () => {
  assert.equal(hasSameOrigin(request('sign-in/email'), env), true);
  assert.equal(hasSameOrigin({ headers: { host: 'www.dg97.org', origin: 'https://evil.example' } }, env), false);
  assert.equal(hasSameOrigin({ headers: { host: 'www.dg97.org' } }, env), false);
  assert.equal(hasSameOrigin({ headers: { host: 'localhost:3108', origin: 'http://localhost:3108' } }, env), false);
  assert.equal(hasSameOrigin({ headers: { host: 'localhost:3108', origin: 'http://localhost:3108' } }, { NODE_ENV: 'development' }), true);
});

test('upstream sees only auth cookies, and cookies become same-origin HttpOnly cookies', () => {
  assert.equal(authCookies('analytics=ignore; __Secure-neon-auth.session_token=signed; better-auth.session_data=cache; admin_session=ignore'), '__Secure-neon-auth.session_token=signed; better-auth.session_data=cache');
  const headers = new Headers();
  headers.append('set-cookie', '__Secure-neon-auth.session_token=signed; Domain=neon.build; Path=/neondb/auth; SameSite=None; Secure; Partitioned; Max-Age=3600');
  headers.append('set-cookie', 'unrelated=do-not-copy; Path=/');
  const cookies = sameOriginCookies(headers);
  assert.equal(cookies.length, 1);
  assert.match(cookies[0], /Path=\/; HttpOnly; SameSite=Lax; Secure$/);
  assert.doesNotMatch(cookies[0], /Domain=|SameSite=None|neondb|Partitioned/);
  assert.match(cookies[0], /Max-Age=3600/);
});

test('session output strips tokens, roles and non-profile data and rejects expiry', () => {
  assert.deepEqual(publicSession(payload), { user: { id: 'user-1', email: 'member@example.test', name: 'Member', emailVerified: true } });
  assert.equal(publicSession({ user }), null);
  assert.equal(publicSession({ ...payload, session: { expiresAt: '2000-01-01' } }), null);
});

test('auth bodies discard privilege/redirect fields, fix verification purpose and enforce size', () => {
  assert.deepEqual(normalizedBody('sign-up/email', { email: ' Member@Example.test ', name: ' Member ', password: 'a-long-password', role: 'admin', callbackURL: 'https://evil.test' }), { email: 'member@example.test', name: 'Member', password: 'a-long-password' });
  assert.deepEqual(normalizedBody('email-otp/send-verification-otp', { email: 'member@example.test', type: 'sign-in' }), { email: 'member@example.test', type: 'email-verification' });
  assert.throws(() => normalizedBody('email-otp/reset-password', { email: 'member@example.test', otp: 'abc123', password: 'a-long-password' }));
  assert.throws(() => normalizedBody('sign-in/email', { email: 'member@example.test', password: 'x'.repeat(9000) }));
});

test('auth proxy denies arbitrary routes, extra query parameters, methods and CSRF before fetching', async () => {
  let calls = 0;
  const handler = createAuthProxyHandler({ env, fetchImpl: async () => { calls++; } });
  for (const [req, expected] of [[request('admin/list-users'), 404], [{ ...request('sign-in/email'), query: { path: ['sign-in', 'email'], url: 'https://evil.test' } }, 404], [{ ...request('sign-in/email'), method: 'GET' }, 405], [{ ...request('sign-in/email'), headers: { host: 'www.dg97.org', origin: 'https://evil.test' } }, 403]]) {
    const res = response(); await handler(req, res); assert.equal(res.statusCode, expected);
  }
  assert.equal(calls, 0);
});

test('successful login forwards cookies without leaking upstream tokens or secrets', async () => {
  const handler = createAuthProxyHandler({ env, fetchImpl: async (url, options) => {
    assert.equal(url, `${env.NEON_AUTH_BASE_URL}/sign-in/email`);
    assert.equal(options.redirect, 'manual');
    assert.equal(options.headers['x-neon-auth-middleware'], 'true');
    assert.equal(options.headers.Origin, 'https://www.dg97.org');
    return new Response(JSON.stringify({ ...payload, token: 'must-not-return' }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'better-auth.session_token=signed; Domain=neon.build; Path=/; HttpOnly; Secure; SameSite=None' } });
  } });
  const res = response(); await handler(request('sign-in/email'), res);
  assert.equal(res.statusCode, 200); assert.equal(res.body.user.email, user.email);
  assert.doesNotMatch(JSON.stringify(res.body), /token|admin/);
  assert.equal(res.headers['Cache-Control'], 'private, no-store, max-age=0');
  assert.match(res.headers['Set-Cookie'][0], /HttpOnly; SameSite=Lax; Secure/);
});

test('upstream failures fail closed without returning internal messages', async () => {
  const handler = createAuthProxyHandler({ env, fetchImpl: async () => new Response(JSON.stringify({ code: 'UNKNOWN', message: 'secret connection string' }), { status: 500 }) });
  const res = response(); await handler(request('sign-in/email'), res);
  assert.equal(res.statusCode, 503); assert.deepEqual(res.body, { error: 'AUTH_REQUEST_FAILED' });
  const unavailable = createAuthProxyHandler({ env: {}, fetchImpl: async () => { throw new Error('must not fetch'); } });
  const result = response(); await unavailable(request('sign-in/email'), result); assert.equal(result.statusCode, 503);
});

test('server-protected session checks deny forged/expired sessions and require upstream validity', async () => {
  assert.deepEqual(await getMemberSession({ headers: {} }, null, { env }), { configured: true, user: null });
  const req = { headers: { cookie: 'better-auth.session_token=forged' } };
  const rejected = await getMemberSession(req, null, { env, fetchImpl: async () => new Response('null') });
  assert.equal(rejected.user, null);
  const accepted = await getMemberSession(req, response(), { env, fetchImpl: async () => new Response(JSON.stringify(payload)) });
  assert.equal(accepted.user.emailVerified, true);
  assert.equal(accepted.user.role, undefined);
});

const AUTH_ROUTES = new Map([
  ['get-session', 'GET'],
  ['sign-up/email', 'POST'],
  ['sign-in/email', 'POST'],
  ['sign-out', 'POST'],
  ['email-otp/send-verification-otp', 'POST'],
  ['email-otp/verify-email', 'POST'],
  ['email-otp/request-password-reset', 'POST'],
  ['email-otp/reset-password', 'POST'],
]);
const AUTH_COOKIE_NAME = /^(?:__Secure-|__Host-)?(?:better-auth|neon-auth|neon_auth)[._-]/;

function getAuthBaseUrl(env = process.env) {
  if (!env.NEON_AUTH_BASE_URL) return null;
  try {
    const url = new URL(env.NEON_AUTH_BASE_URL);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash
      || !url.hostname.includes('.neonauth.') || !/\.(?:neon\.tech|neon\.build)$/.test(url.hostname)
      || !url.pathname.endsWith('/auth')) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function hasSameOrigin(req, env = process.env) {
  try {
    const origin = new URL(req.headers.origin);
    if (origin.origin !== req.headers.origin || origin.host !== req.headers.host) return false;
    const allowed = new Set(['https://www.dg97.org', 'https://dg97.org']);
    if (env.VERCEL_URL) allowed.add(`https://${env.VERCEL_URL}`);
    if (env.VERCEL_BRANCH_URL) allowed.add(`https://${env.VERCEL_BRANCH_URL}`);
    if ((env.NODE_ENV !== 'production' || (!env.VERCEL && env.DG97_LOCAL_VERIFICATION === 'true'))
      && ['localhost', '127.0.0.1'].includes(origin.hostname)) {
      return origin.protocol === 'http:' || origin.protocol === 'https:';
    }
    return allowed.has(origin.origin);
  } catch {
    return false;
  }
}

function requestOrigin(req, env) {
  if (hasSameOrigin(req, env)) return req.headers.origin;
  const origin = `${env.NODE_ENV === 'production' ? 'https' : 'http'}://${req.headers.host}`;
  return hasSameOrigin({ headers: { ...req.headers, origin } }, env) ? origin : 'https://www.dg97.org';
}

function authCookies(cookieHeader = '') {
  return cookieHeader.split(';').map((part) => part.trim()).filter((part) => {
    const name = part.slice(0, part.indexOf('='));
    return AUTH_COOKIE_NAME.test(name) && !/[\r\n]/.test(part);
  }).join('; ');
}

function sameOriginCookies(headers, secure = true) {
  const cookies = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [];
  return cookies.flatMap((cookie) => {
    const pieces = cookie.split(';').map((part) => part.trim());
    const name = pieces[0].slice(0, pieces[0].indexOf('='));
    if (!AUTH_COOKIE_NAME.test(name) || /[\r\n]/.test(cookie)) return [];
    const retained = pieces.filter((part, index) => index === 0 || !/^(domain|path|samesite|secure|httponly|partitioned)(?:=|$)/i.test(part));
    retained.push('Path=/', 'HttpOnly', 'SameSite=Lax');
    // __Secure- and __Host- names always require Secure, even on local HTTPS.
    if (secure || /^__(?:Secure|Host)-/.test(name)) retained.push('Secure');
    return [retained.join('; ')];
  });
}

function publicUser(user) {
  if (!user || typeof user.id !== 'string' || typeof user.email !== 'string') return null;
  return {
    id: user.id,
    email: user.email,
    name: typeof user.name === 'string' ? user.name : '',
    emailVerified: user.emailVerified === true,
  };
}

function publicAuthResult(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const user = publicUser(payload.user);
  if (user) return { user };
  return payload.success === true ? { success: true } : null;
}

function publicSession(payload) {
  if (!payload?.session || !Number.isFinite(Date.parse(payload.session.expiresAt))
    || Date.parse(payload.session.expiresAt) <= Date.now()) return null;
  const user = publicUser(payload.user);
  return user ? { user } : null;
}

function normalizedBody(path, body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('INVALID_INPUT');
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > 8192) throw new Error('INVALID_INPUT');
  if (path === 'sign-out') return {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('INVALID_INPUT');
  const result = { email };
  if (['sign-up/email', 'sign-in/email', 'email-otp/reset-password'].includes(path)) {
    const password = body.password;
    const minimum = path === 'sign-in/email' ? 1 : 8;
    if (typeof password !== 'string' || password.length < minimum || password.length > 128) throw new Error('INVALID_INPUT');
    result.password = password;
  }
  if (path === 'sign-up/email') {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (name.length < 2 || name.length > 80) throw new Error('INVALID_INPUT');
    result.name = name;
  }
  if (['email-otp/verify-email', 'email-otp/reset-password'].includes(path)) {
    if (typeof body.otp !== 'string' || !/^\d{6}$/.test(body.otp)) throw new Error('INVALID_INPUT');
    result.otp = body.otp;
  }
  if (path === 'email-otp/send-verification-otp') result.type = 'email-verification';
  return result;
}

function errorCode(payload) {
  const allowed = new Set([
    'EMAIL_NOT_VERIFIED', 'INVALID_EMAIL_OR_PASSWORD', 'INVALID_PASSWORD',
    'USER_ALREADY_EXISTS', 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
    'INVALID_OTP', 'OTP_EXPIRED', 'TOO_MANY_ATTEMPTS', 'TOO_MANY_REQUESTS',
    'PASSWORD_TOO_SHORT', 'PASSWORD_TOO_LONG', 'INVALID_EMAIL',
  ]);
  return allowed.has(payload?.code) ? payload.code : 'AUTH_REQUEST_FAILED';
}

function setCookies(res, cookies) {
  if (!cookies.length) return;
  const existing = res.getHeader('Set-Cookie');
  res.setHeader('Set-Cookie', [...(Array.isArray(existing) ? existing : existing ? [existing] : []), ...cookies]);
}

function createAuthProxyHandler({ fetchImpl = fetch, env = process.env } = {}) {
  return async function authProxy(req, res) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Vary', 'Cookie');
    const path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    const method = AUTH_ROUTES.get(path);
    if (!method || Object.keys(req.query).some((key) => key !== 'path')) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    if (req.method !== method) {
      res.setHeader('Allow', method);
      return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    }
    const baseUrl = getAuthBaseUrl(env);
    if (!baseUrl) return res.status(503).json({ error: 'AUTH_UNAVAILABLE' });
    if (method === 'POST' && !hasSameOrigin(req, env)) return res.status(403).json({ error: 'INVALID_ORIGIN' });
    let body;
    if (method === 'POST') {
      if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) {
        return res.status(415).json({ error: 'JSON_REQUIRED' });
      }
      try { body = normalizedBody(path, req.body); }
      catch { return res.status(400).json({ error: 'INVALID_INPUT' }); }
    }
    try {
      const upstream = await fetchImpl(`${baseUrl}/${path}`, {
        method,
        headers: {
          Accept: 'application/json',
          Origin: requestOrigin(req, env),
          'x-neon-auth-middleware': 'true',
          ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
          Cookie: authCookies(req.headers.cookie),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        redirect: 'manual',
        signal: AbortSignal.timeout(10000),
      });
      setCookies(res, sameOriginCookies(upstream.headers, env.NODE_ENV === 'production'));
      const payload = await upstream.json().catch(() => null);
      if (!upstream.ok) return res.status(upstream.status === 429 ? 429 : upstream.status >= 500 ? 503 : 400).json({ error: errorCode(payload) });
      return res.status(200).json(path === 'get-session' ? publicSession(payload) : publicAuthResult(payload));
    } catch {
      return res.status(503).json({ error: 'AUTH_UNAVAILABLE' });
    }
  };
}

async function getMemberSession(req, res, { fetchImpl = fetch, env = process.env } = {}) {
  const baseUrl = getAuthBaseUrl(env);
  if (!baseUrl) return { configured: false, user: null };
  const cookie = authCookies(req.headers.cookie);
  if (!cookie) return { configured: true, user: null };
  try {
    const upstream = await fetchImpl(`${baseUrl}/get-session`, {
      headers: { Accept: 'application/json', Cookie: cookie, Origin: requestOrigin(req, env), 'x-neon-auth-middleware': 'true' },
      redirect: 'manual', signal: AbortSignal.timeout(10000),
    });
    if (res) setCookies(res, sameOriginCookies(upstream.headers, env.NODE_ENV === 'production'));
    if (!upstream.ok) return { configured: true, user: null, unavailable: true };
    const payload = await upstream.json();
    return { configured: true, user: publicSession(payload)?.user || null };
  } catch {
    return { configured: true, user: null, unavailable: true };
  }
}

module.exports = {
  AUTH_ROUTES, getAuthBaseUrl, hasSameOrigin, authCookies, sameOriginCookies,
  publicUser, publicAuthResult, publicSession, normalizedBody, createAuthProxyHandler, getMemberSession,
};

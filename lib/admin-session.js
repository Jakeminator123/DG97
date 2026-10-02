const { createHmac, timingSafeEqual } = require('node:crypto');
const SESSION_SECONDS = 86400;

function credentialsConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET?.length >= 32);
}

function equalStrings(actual, expected) {
  if (typeof actual !== 'string' || typeof expected !== 'string') return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(payload) {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(payload).digest('base64url');
}

function createAdminToken(now = Date.now()) {
  if (!credentialsConfigured()) throw new Error('Admin authentication is not configured');
  const payload = Buffer.from(JSON.stringify({ username: process.env.ADMIN_USERNAME, expires: now + SESSION_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyAdminToken(req, now = Date.now()) {
  if (!credentialsConfigured()) return false;
  const token = req.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith('admin_token='))?.slice('admin_token='.length);
  if (!token || token.length > 2048) return false;
  const parts = token.split('.');
  if (parts.length !== 2 || !equalStrings(parts[1], sign(parts[0]))) return false;
  try {
    const session = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    return session.username === process.env.ADMIN_USERNAME && Number.isFinite(session.expires) && session.expires > now && session.expires <= now + SESSION_SECONDS * 1000;
  } catch {
    return false;
  }
}

module.exports = { credentialsConfigured, equalStrings, createAdminToken, verifyAdminToken, SESSION_SECONDS };

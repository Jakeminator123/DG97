import { credentialsConfigured, equalStrings, createAdminToken, verifyAdminToken, SESSION_SECONDS } from '../../../lib/admin-session';
export { verifyAdminToken } from '../../../lib/admin-session';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  if (req.method === 'GET') return res.status(200).json({ authenticated: verifyAdminToken(req) });
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`);
    return res.status(200).json({ success: true });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!credentialsConfigured()) return res.status(503).json({ error: 'Admininloggningen är inte konfigurerad.' });
  const { username, password } = req.body || {};
  if (!equalStrings(username, process.env.ADMIN_USERNAME) || !equalStrings(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
  }
  res.setHeader('Set-Cookie', `admin_token=${createAdminToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`);
  return res.status(200).json({ success: true });
}

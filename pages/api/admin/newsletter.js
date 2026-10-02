import { verifyAdminToken } from './auth';

// Paused until durable storage and a supported background/mail service exist.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!verifyAdminToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(503).json({ error: 'Funktionen är pausad. Kontakta DG97 för hjälp.' });
}

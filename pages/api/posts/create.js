import { verifyAdminToken } from '../../../lib/admin-session';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!verifyAdminToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(503).json({ error: 'Automatisk publicering är pausad. Blogginlägg publiceras via GitHub.' });
}

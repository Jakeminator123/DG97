import { verifyAdminToken } from './auth';
import { listLeads } from '../../../lib/leads';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const leads = await listLeads();
    if (leads == null) {
      return res.status(503).json({ error: 'DATABASE_URL saknas. Koppla Neon via Vercel Marketplace.' });
    }
    return res.status(200).json({ leads });
  } catch (error) {
    console.error('[admin/leads] read failed');
    return res.status(500).json({ error: 'Kunde inte läsa förfrågningar.' });
  }
}

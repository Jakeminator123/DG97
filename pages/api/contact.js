import { clientIp, isHoneypot, parseLead, submitLead, UNAVAILABLE_MESSAGE } from '../../lib/leads';
import { isDatabaseConfigured } from '../../lib/db';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isDatabaseConfigured()) {
    return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
  }
  if (isHoneypot(req.body || {})) {
    return res.status(200).json({ ok: true });
  }
  const parsed = parseLead(req.body || {});
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.errors[0], errors: parsed.errors });
  }
  try {
    const result = await submitLead({
      lead: parsed.value,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
    });
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('[contact] lead insert failed');
    return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
  }
}

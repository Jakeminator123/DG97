export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Never acknowledge delivery without a configured mail service.
  return res.status(503).json({ error: 'Skicka din förfrågan till hej@dg97.se eller ring 070-886 22 79.' });
}

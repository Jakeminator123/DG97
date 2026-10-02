export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(503).json({ error: 'Nyhetsbrevet är pausat. Kontakta oss på hej@dg97.se.' });
}

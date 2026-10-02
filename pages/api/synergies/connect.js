export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(503).json({ error: 'Företagsportalen är pausad. Inga förfrågningar skickas.' });
}

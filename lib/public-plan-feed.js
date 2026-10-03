const { parseCsv, fetchCsvText } = require('./lediga-rum');

const REFRESH_SECONDS = 300;

function booleanCell(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (['true', '1', 'yes', 'ja'].includes(text)) return true;
  if (['false', '0', 'no', 'nej', ''].includes(text)) return false;
  throw new Error('Invalid publication flag');
}

function dateCell(value) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error('Invalid availability date');
  const parsed = new Date(`${text}T12:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) {
    throw new Error('Invalid availability date');
  }
  return text;
}

// Explicit field projection: never return a source row, URL, internal note or price.
function publicRooms(rows) {
  const seen = new Set();
  const rooms = [];
  for (const row of rows) {
    if (!booleanCell(row.publish)) continue;
    const roomText = String(row.rum ?? '').trim();
    if (roomText === '23') continue; // Conference room is never a rentable office.
    if (!/^\d+$/.test(roomText)) throw new Error('Invalid room');
    const id = Number(roomText);
    const area = Number(String(row.kvm ?? '').trim().replace(',', '.'));
    if (!Number.isInteger(id) || id < 1 || id > 22 || seen.has(id)
      || !Number.isFinite(area) || area <= 0 || area > 200) throw new Error('Invalid room');
    seen.add(id);
    const available = booleanCell(row.available);
    rooms.push({ id, area, available, date: available ? dateCell(row.ledigt_fran) : null });
  }
  return rooms.sort((a, b) => a.id - b.id);
}

function createPlanFeedHandler({ fetchCsv = fetchCsvText, now = () => new Date() } = {}) {
  return async function planFeed(req, res) {
    // The response contains only intentionally public room facts, never credentials.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, OPTIONS');
      return res.status(405).json({ status: 'method_not_allowed' });
    }
    try {
      const rooms = publicRooms(parseCsv(await fetchCsv()));
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
      return res.status(200).json({
        status: 'ok', checkedAt: now().toISOString(), refreshSeconds: REFRESH_SECONDS, rooms,
      });
    } catch {
      // No stale vacancy fallback and no upstream URL/error in the public response.
      res.setHeader('Cache-Control', 'no-store');
      return res.status(503).json({ status: 'unavailable', rooms: [] });
    }
  };
}

module.exports = { publicRooms, createPlanFeedHandler, REFRESH_SECONDS };

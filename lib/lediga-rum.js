const fallbackData = require('../data/lediga-rum.json');
const planData = require('../data/plan-rooms.json');
const { LEDIGA_RUM_CSV_URL } = require('../config/site');

const REQUIRED_COLUMNS = ['rum', 'kvm', 'status', 'ledigt_fran', 'pris_exkl_moms', 'available', 'publish'];
const FETCH_TIMEOUT_MS = 8000;
// Konferensrum (rum 23) hyrs aldrig ut och får aldrig listas som ledigt, oavsett feed.
const CONFERENCE_ROOMS = new Set(planData.conferenceRooms || []);

function formatGroupedNumber(amount) {
  const [integer, fraction] = String(amount).split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return fraction ? `${grouped},${fraction}` : grouped;
}

function formatSek(amount) {
  return `${formatGroupedNumber(amount)} kr`;
}

function withExclVat(label) {
  return `${label} ${fallbackData.pricingModel.vat}`;
}

function formatMonthlyRent(amount) {
  return withExclVat(`${formatSek(amount)}/mån`);
}

function formatSqm(sizeSqm) {
  return `${formatGroupedNumber(sizeSqm)} kvm`;
}

function stockholmToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Stockholm', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatShortDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Stockholm', day: 'numeric', month: 'short',
  }).replace('.', '');
}

function formatDateTime(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
}

function parseBoolean(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (['true', '1', 'yes', 'ja'].includes(normalized)) return true;
  if (['false', '0', 'no', 'nej', ''].includes(normalized)) return false;
  return null;
}

function parseIsoDate(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const [year, month, day] = trimmed.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    return null;
  }
  return trimmed;
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function parseCsv(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Empty CSV');
  }
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).map(line => line.trimEnd()).filter(Boolean);
  const headers = splitCsvLine(lines[0]).map(header => header.trim().toLowerCase());
  if (REQUIRED_COLUMNS.some(column => !headers.includes(column))) {
    throw new Error('CSV is missing required columns');
  }
  return lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line).map(cell => cell.trim());
    const row = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] || '']));
    return { ...row, _line: index + 2 };
  });
}

function parseFeedRows(rows, now = new Date()) {
  const today = stockholmToday(now);
  const rooms = [];
  for (const row of rows) {
    const available = parseBoolean(row.available);
    const publish = parseBoolean(row.publish);
    if (available === null || publish === null) {
      throw new Error(`Invalid boolean on CSV line ${row._line}`);
    }
    if (!(available && publish)) continue;
    const id = Number.parseInt(row.rum, 10);
    if (CONFERENCE_ROOMS.has(id)) continue;
    const sizeSqm = Number.parseFloat(String(row.kvm).replace(',', '.'));
    const monthlyPrice = Number.parseInt(row.pris_exkl_moms, 10);
    const availableFrom = parseIsoDate(row.ledigt_fran);
    if (!Number.isInteger(id) || id < 1 || !Number.isFinite(sizeSqm) || sizeSqm <= 0
      || !Number.isInteger(monthlyPrice) || monthlyPrice <= 0) {
      throw new Error(`Invalid room row on CSV line ${row._line}`);
    }
    if (String(row.ledigt_fran || '').trim() && !availableFrom) {
      throw new Error(`Invalid ledigt_fran on CSV line ${row._line}`);
    }
    rooms.push({ id, sizeSqm, monthlyPrice, availableFrom });
  }
  return decorateRooms(rooms, today);
}

function decorateRooms(rooms, today) {
  const onPlan = new Set(planData.roomsOnPlan);
  return rooms.filter(room => !CONFERENCE_ROOMS.has(room.id)).map(room => {
    const isNow = !room.availableFrom || room.availableFrom <= today;
    return {
      ...room,
      sizeLabel: formatSqm(room.sizeSqm),
      monthlyLabel: formatMonthlyRent(room.monthlyPrice),
      availability: isNow ? 'now' : 'from',
      availabilityLabel: isNow ? 'ledigt nu' : `ledigt från ${formatDate(room.availableFrom)}`,
      planStatusLabel: isNow ? 'ledigt nu' : `från ${formatShortDate(room.availableFrom)}`,
      onPlan: onPlan.has(room.id),
    };
  }).sort((left, right) => (left.availableFrom || today).localeCompare(right.availableFrom || today)
    || left.id - right.id);
}

function buildSnapshot({ rooms, source, now = new Date() }) {
  const cheapest = rooms.reduce((min, room) => Math.min(min, room.monthlyPrice), Infinity);
  return {
    source,
    generatedAt: now.toISOString(),
    updatedLabel: `Senast uppdaterad ${formatDateTime(now)}`,
    pricingModel: fallbackData.pricingModel,
    rooms,
    roomsOnPlan: rooms.filter(room => room.onPlan),
    roomsOffPlan: rooms.filter(room => !room.onPlan),
    cheapestMonthlyLabel: Number.isFinite(cheapest) ? formatMonthlyRent(cheapest) : null,
    plan: {
      viewBox: planData.viewBox,
      image: planData.image,
      conferenceRooms: planData.conferenceRooms || [],
      rooms: planData.rooms,
      roomsOnPlan: planData.roomsOnPlan,
      roomsNotOnPlan: planData.roomsNotOnPlan,
    },
  };
}

function fallbackSnapshot(now = new Date()) {
  return buildSnapshot({
    rooms: decorateRooms(fallbackData.rooms, stockholmToday(now)),
    source: 'fallback',
    now,
  });
}

async function fetchCsvText(url = LEDIGA_RUM_CSV_URL) {
  const response = await fetch(url, {
    headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8' },
    cache: 'no-store',
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`CSV HTTP ${response.status}`);
  const text = await response.text();
  if (!text.trim()) throw new Error('CSV response was empty');
  return text;
}

async function loadLedigaRumSnapshot({ now = new Date(), fetchCsv = fetchCsvText } = {}) {
  try {
    const rooms = parseFeedRows(parseCsv(await fetchCsv()), now);
    return buildSnapshot({ rooms, source: 'feed', now });
  } catch (error) {
    return { ...fallbackSnapshot(now), feedError: error.message };
  }
}

function toPublicSnapshot(snapshot) {
  return {
    source: snapshot.source,
    generatedAt: snapshot.generatedAt,
    updatedLabel: snapshot.updatedLabel,
    pricingModel: snapshot.pricingModel,
    rooms: snapshot.rooms,
    roomsOnPlan: snapshot.roomsOnPlan,
    roomsOffPlan: snapshot.roomsOffPlan,
    cheapestMonthlyLabel: snapshot.cheapestMonthlyLabel,
    plan: snapshot.plan,
  };
}

function getLedigaRum(now = new Date()) {
  return fallbackSnapshot(now);
}

module.exports = {
  formatSek,
  formatMonthlyRent,
  formatSqm,
  formatGroupedNumber,
  withExclVat,
  stockholmToday,
  parseCsv,
  parseFeedRows,
  loadLedigaRumSnapshot,
  toPublicSnapshot,
  getLedigaRum,
  fallbackSnapshot,
};

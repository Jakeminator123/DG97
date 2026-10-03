const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { publicRooms, createPlanFeedHandler } = require('../lib/public-plan-feed');
const { parseCsv } = require('../lib/lediga-rum');

const csv = fs.readFileSync(path.join(__dirname, 'fixtures/tillganglighet-publik.sample.csv'), 'utf8');

test('public endpoint excludes hidden room 1, internal fields, rents and conference room', () => {
  const rows = parseCsv(csv).map(row => ({ ...row, kund: 'PRIVATE', hyra_avtal: 'PRIVATE' }));
  rows.push({ rum: '23', publish: 'true', available: 'true', kund: 'PRIVATE' });
  const rooms = publicRooms(rows);
  assert.equal(rooms.length, 21);
  assert.ok(!rooms.some(room => room.id === 1 || room.id === 23));
  assert.deepEqual(rooms.filter(room => room.available).map(room => room.id), [11, 20, 22]);
  assert.ok(!JSON.stringify(rooms).includes('PRIVATE'));
  assert.ok(!JSON.stringify(rooms).includes('14400'));
  assert.ok(rooms.every(room => Object.keys(room).join(',') === 'id,area,available,date'));
});

test('removing publication or availability removes information on the next read', () => {
  const rows = parseCsv(csv);
  rows.find(row => row.rum === '22').publish = 'false';
  rows.find(row => row.rum === '20').available = 'false';
  const rooms = publicRooms(rows);
  assert.ok(!rooms.some(room => room.id === 22));
  assert.equal(rooms.find(room => room.id === 20).date, null);
  assert.equal(rooms.find(room => room.id === 20).available, false);
});

test('malformed or ambiguous public rows are rejected instead of inventing availability', () => {
  const base = { rum: '20', kvm: '10', publish: 'true', available: 'true', ledigt_fran: '2026-11-01' };
  for (const change of [{ rum: '20abc' }, { kvm: '10abc' }, { publish: 'maybe' },
    { available: 'maybe' }, { ledigt_fran: '2026-02-30' }]) {
    assert.throws(() => publicRooms([{ ...base, ...change }]));
  }
  assert.throws(() => publicRooms([base, base]));
});

function response() {
  return { headers: {}, setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; }, end() {} };
}

test('live response supports anonymous WordPress reads and carries a real retrieval timestamp', async () => {
  const res = response();
  await createPlanFeedHandler({ fetchCsv: async () => csv, now: () => new Date('2026-10-04T01:00:00Z') })({ method: 'GET' }, res);
  assert.equal(res.code, 200);
  assert.equal(res.headers['Access-Control-Allow-Origin'], '*');
  assert.equal(res.body.checkedAt, '2026-10-04T01:00:00.000Z');
  assert.equal(res.body.rooms.length, 21);
});

test('feed failures never republish a stale hardcoded vacancy list or leak errors', async () => {
  const res = response();
  await createPlanFeedHandler({ fetchCsv: async () => { throw new Error('PRIVATE_SOURCE_URL'); } })({ method: 'GET' }, res);
  assert.equal(res.code, 503);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.deepEqual(res.body, { status: 'unavailable', rooms: [] });
});

test('a valid empty feed stays empty and mutation methods are rejected', async () => {
  const handler = createPlanFeedHandler({ fetchCsv: async () => csv.split('\n')[0] });
  const empty = response();
  await handler({ method: 'GET' }, empty);
  assert.equal(empty.code, 200);
  assert.deepEqual(empty.body.rooms, []);
  const mutation = response();
  await handler({ method: 'POST' }, mutation);
  assert.equal(mutation.code, 405);
});

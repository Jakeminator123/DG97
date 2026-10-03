const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  formatMonthlyRent, formatSqm, parseCsv, parseFeedRows, loadLedigaRumSnapshot, toPublicSnapshot, getLedigaRum,
} = require('../lib/lediga-rum');
const fallback = require('../data/lediga-rum.json');

const sampleCsv = fs.readFileSync(
  path.join(__dirname, 'fixtures/tillganglighet-publik.sample.csv'), 'utf8'
);
const october = new Date('2026-10-03T12:00:00+02:00');
const december = new Date('2026-12-01T12:00:00+01:00');

test('sample CSV publishes only available and publishable rooms', () => {
  const rooms = parseFeedRows(parseCsv(sampleCsv), october);
  assert.deepEqual(rooms.map(room => room.id), [18, 20, 9]);
  assert.ok(!rooms.some(room => room.id === 1));
  assert.equal(rooms.find(room => room.id === 18).availability, 'from');
  assert.equal(rooms.find(room => room.id === 18).availabilityLabel, 'ledigt från 1 november 2026');
  assert.equal(rooms.find(room => room.id === 9).monthlyLabel, '16 200 kr/mån exkl. moms');
  assert.equal(rooms.find(room => room.id === 20).planStatusLabel, 'från 15 nov');
  assert.equal(rooms.find(room => room.id === 9).onPlan, true);
  assert.equal(rooms.find(room => room.id === 18).onPlan, false);
});

test('past or empty ledigt_fran becomes ledigt nu in Stockholm time', () => {
  const csv = [
    'rum,kvm,status,ledigt_fran,pris_exkl_moms,available,publish',
    '9,13.5,ledigt,,16200,true,true',
    '18,10,ledigt från,2026-11-01,12000,true,true',
  ].join('\n');
  const nowRooms = parseFeedRows(parseCsv(csv), december);
  assert.equal(nowRooms.find(room => room.id === 9).availabilityLabel, 'ledigt nu');
  assert.equal(nowRooms.find(room => room.id === 18).availabilityLabel, 'ledigt nu');
});

test('trailing spaces and Swedish decimals are accepted', () => {
  // Live sheet uses dot-decimal. Unquoted 13,5 would split into extra CSV columns.
  const liveStyle = 'rum, kvm, status, ledigt_fran, pris_exkl_moms, available, publish \n9,13.5,ledigt från,2026-11-30,16200,true ,true \n';
  const rooms = parseFeedRows(parseCsv(liveStyle), october);
  assert.equal(rooms[0].id, 9);
  assert.equal(rooms[0].sizeSqm, 13.5);
});

test('empty or invalid CSV is rejected so the page can fall back', () => {
  assert.throws(() => parseCsv(''), /Empty CSV/);
  assert.throws(() => parseCsv('rum,kvm\n1,12'), /missing required columns/);
  assert.throws(() => parseFeedRows(parseCsv(
    'rum,kvm,status,ledigt_fran,pris_exkl_moms,available,publish\n9,13.5,ledigt,not-a-date,16200,true,true'
  ), october), /ledigt_fran/);
});

test('broken feed falls back to local vacancy data', async () => {
  const snapshot = await loadLedigaRumSnapshot({
    now: october,
    fetchCsv: async () => { throw new Error('network down'); },
  });
  assert.equal(snapshot.source, 'fallback');
  assert.match(snapshot.updatedLabel, /Senast uppdaterad/);
  assert.deepEqual(snapshot.rooms.map(room => room.id), [18, 20, 9]);
  assert.ok(snapshot.feedError);
  assert.equal('feedError' in toPublicSnapshot(snapshot), false);
});

test('HTML error page or empty body falls back instead of failing the build', async () => {
  const empty = await loadLedigaRumSnapshot({ now: october, fetchCsv: async () => '' });
  const html = await loadLedigaRumSnapshot({
    now: october,
    fetchCsv: async () => '<html><body>Sign in</body></html>',
  });
  assert.equal(empty.source, 'fallback');
  assert.equal(html.source, 'fallback');
});

test('successful empty feed is kept, not replaced by fallback', async () => {
  const csv = 'rum,kvm,status,ledigt_fran,pris_exkl_moms,available,publish\n1,12,ledigt,2027-01-01,14400,true,false\n';
  const snapshot = await loadLedigaRumSnapshot({ now: october, fetchCsv: async () => csv });
  assert.equal(snapshot.source, 'feed');
  assert.equal(snapshot.rooms.length, 0);
});

test('successful feed is used instead of fallback', async () => {
  const snapshot = await loadLedigaRumSnapshot({
    now: october,
    fetchCsv: async () => sampleCsv,
  });
  assert.equal(snapshot.source, 'feed');
  assert.equal(snapshot.roomsOffPlan.map(room => room.id).join(','), '18,20');
  assert.ok(snapshot.plan.rooms.some(room => room.rum === 9));
  assert.ok(!snapshot.plan.rooms.some(room => room.rum === 18));
});

test('fallback file still never lists room 1 and formats prices with exkl. moms', () => {
  const snapshot = getLedigaRum(october);
  assert.ok(!fallback.rooms.some(room => room.id === 1));
  assert.ok(!snapshot.rooms.some(room => room.id === 1));
  assert.equal(formatSqm(13.5), '13,5 kvm');
  assert.equal(formatMonthlyRent(8400), '8 400 kr/mån exkl. moms');
  for (const room of fallback.rooms) {
    assert.equal(room.monthlyPrice, Math.round(room.sizeSqm * fallback.pricingModel.pricePerSqm));
  }
});

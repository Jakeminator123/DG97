const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getLedigaRum, formatMonthlyRent, formatSqm } = require('../lib/lediga-rum');
const data = require('../data/lediga-rum.json');

test('vacancy data is the single source and never lists room 1', () => {
  const snapshot = getLedigaRum();
  assert.deepEqual(snapshot.rooms.map(room => room.id).sort((a, b) => a - b), [9, 18, 20]);
  assert.equal(snapshot.updatedLabel, 'Uppdaterad oktober 2026');
  assert.equal(snapshot.pricingModel.pricePerSqm, 1200);
  assert.equal(snapshot.pricingModel.vat, 'exkl. moms');
  assert.ok(!data.rooms.some(room => room.id === 1));
  for (const room of data.rooms) {
    assert.equal(room.monthlyPrice, Math.round(room.sizeSqm * snapshot.pricingModel.pricePerSqm));
    assert.match(formatMonthlyRent(room.monthlyPrice), /exkl\. moms/);
    assert.match(formatSqm(room.sizeSqm), /kvm/);
  }
  assert.equal(formatSqm(13.5), '13,5 kvm');
  assert.equal(formatMonthlyRent(8400), '8 400 kr/mån exkl. moms');
});

const test = require('node:test');
const assert = require('node:assert/strict');
const { getRoomCategory } = require('../lib/plan-presentation');

test('room 23 never becomes rentable even when vacancy data contradicts the plan', () => {
  assert.equal(getRoomCategory({ rum: 23, type: 'kontor' }, { id: 23 }), 'conference');
});

test('rentable office category does not imply a published vacancy', () => {
  assert.equal(getRoomCategory({ rum: 1, type: 'kontor' }, null), 'office');
  assert.equal(getRoomCategory({ rum: 22, type: 'kontor' }, { id: 22 }), 'vacant');
});

test('conference metadata overrides a published vacancy and unknown rooms are not labelled rentable', () => {
  assert.equal(getRoomCategory({ rum: 10, type: 'konferensrum' }, { id: 10 }), 'conference');
  assert.equal(getRoomCategory({ rum: 10, type: 'kontor' }, { id: 10 }, [10]), 'conference');
  assert.equal(getRoomCategory({ rum: 24, type: 'kontor' }, { id: 24 }), 'other');
});

const test = require('node:test');
const assert = require('node:assert/strict');
const { getRoomCategory } = require('../lib/plan-presentation');
const { OVERVIEW_VIEWBOX } = require('../lib/plan-overview');
const plan = require('../data/plan-rooms.json');

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

test('the cropped overview keeps every mapped room inside the visible bounds', () => {
  const [left, top, width, height] = OVERVIEW_VIEWBOX.split(' ').map(Number);
  for (const room of plan.rooms) {
    for (const [x, y] of room.polygon) {
      assert.ok(x >= left && x <= left + width && y >= top && y <= top + height, `room ${room.rum} would be cropped`);
    }
  }
});

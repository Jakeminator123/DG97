// Decorative outline for the orienting overview only. Coordinates use the
// existing 582 x 609 image space; the actual room polygons remain in plan-rooms.
// This simplification supplies no doors, dimensions, facilities or new rooms.
const PLAN_OVERVIEW = Object.freeze({
  viewBox: '235 30 345 540',
  sourceViewBox: '0 0 582 609',
  envelopePath: 'M252 118L349 47H556V102L563 104V554H400V383H433V223H380L352 266Z',
  // Extend the known left edge of room 1 (252,118 -> 277,155). The line is
  // a crop of the displayed overview, not an assertion that a wall ends here.
  cutEdgePath: 'M252 118L352 266',
  cutEdge: Object.freeze([
    Object.freeze([252, 118]),
    Object.freeze([352, 266]),
  ]),
  title: 'Orienterande översikt över DG97',
  note: 'Förenklad översikt. Den omarkerade vänstra flygeln visas inte. Gemensamma ytor är förenklade utan uppgift om funktion eller mått.',
});

module.exports = {
  PLAN_OVERVIEW,
  OVERVIEW_VIEWBOX: PLAN_OVERVIEW.viewBox,
  OVERVIEW_ENVELOPE: PLAN_OVERVIEW.envelopePath,
};

// Planritning för /lediga-rum: den riktiga planskissen (rum 1–23) som bakgrund,
// med klickbara/hovrbara polygoner ovanpå. Inga priser eller hyresgästnamn på ritningen.
const COLORS = {
  vacant: { fill: '#22A06B', opacity: 0.45, stroke: '#14532D', width: 2.2 },
  conference: { fill: '#9CA3AF', opacity: 0.55, stroke: '#4B5563', width: 1.6 },
  other: { fill: '#FFFFFF', opacity: 0, stroke: '#536E76', width: 0.8 },
};

export default function FloorPlan({ plan, vacantRooms = [] }) {
  const vacantById = Object.fromEntries(vacantRooms.map(room => [room.id, room]));
  const conference = new Set(plan.conferenceRooms || []);
  const image = plan.image;
  return (
    <figure className="w-full">
      <svg
        viewBox={plan.viewBox}
        className="w-full h-auto"
        role="img"
        aria-labelledby="dg97-plan-title dg97-plan-desc"
        fontFamily="DejaVu Sans, system-ui, sans-serif"
      >
        <title id="dg97-plan-title">Planritning över DG97 med rum 1–23</title>
        <desc id="dg97-plan-desc">
          Planskiss med kontorsrum 1–22 och konferensrum 23. Gröna rum är publicerade som lediga,
          rum 23 är konferensrum och hyrs inte ut. Priser och hyresgästnamn visas inte på ritningen.
        </desc>
        {image && (
          <image href={image.src} x="0" y="0" width={image.width} height={image.height}
            preserveAspectRatio="xMidYMid meet" />
        )}
        {plan.rooms.map(room => {
          const isConference = conference.has(room.rum) || room.type === 'konferensrum';
          const vacant = isConference ? null : vacantById[room.rum];
          const style = isConference ? COLORS.conference : vacant ? COLORS.vacant : COLORS.other;
          const title = isConference
            ? `Rum ${room.rum}, konferensrum (hyrs inte ut)`
            : vacant
              ? `Rum ${room.rum}, ${vacant.sizeLabel}, ${vacant.availabilityLabel}`
              : `Rum ${room.rum}`;
          return (
            <g key={room.rum} className="room" data-room-id={room.rum}
              data-available={vacant ? 'true' : 'false'}
              data-room-type={isConference ? 'konferensrum' : 'kontor'}>
              <title>{title}</title>
              <polygon
                points={room.points}
                fill={style.fill}
                fillOpacity={style.opacity}
                stroke={style.stroke}
                strokeWidth={style.width}
                strokeLinejoin="round"
              />
              {vacant && (
                <text x={room.label[0]} y={room.bbox[3] - 3} fontSize="6.5" fill="#14532D"
                  fontWeight="700" textAnchor="middle" paintOrder="stroke" stroke="#FFFFFF"
                  strokeWidth="2">{vacant.planStatusLabel}</text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-neutral-600">
        <span className="inline-flex items-center gap-2 mr-4">
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm border" style={{ background: 'rgba(34,160,107,.55)', borderColor: '#14532D' }} />
          Ledigt
        </span>
        <span className="inline-flex items-center gap-2 mr-4">
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm border" style={{ background: 'rgba(156,163,175,.7)', borderColor: '#4B5563' }} />
          Rum 23: konferensrum, hyrs inte ut
        </span>
        Övriga rum är inte publicerade som lediga. Inga priser eller namn på ritningen.
      </figcaption>
    </figure>
  );
}

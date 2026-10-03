const SHARED_CORE = [
  { d: 'M594 168 H640 V220 H611 Q580 205 594 168 Z', fill: '#E6EAE6', stroke: '#B6C3C5', width: 1.2 },
  { d: 'M640 168 H681 V220 H640 Z M681 168 H726 V194 H681 Z M681 194 H726 V220 H681 Z', fill: '#EDF0EB', stroke: '#ADBFC1', width: 1.1 },
  { d: 'M731 168 H779 V218 H731 Z M785 168 H811 V193 H785 Z M785 194 H811 V218 H785 Z', fill: '#EDF0EB', stroke: '#B6C3C5', width: 1.1 },
  { d: 'M609 248 H709 V327 H632 L595 274 Z M709 248 H743 V327 H709 Z M743 248 H800 V327 H743 Z', fill: '#E9EEEB', stroke: '#B6C3C5', width: 1.4 },
  { d: 'M558 194 L577 181 L603 218 L582 233 Z M522 225 L554 203 L577 237 L545 260 Z M489 248 L520 226 L540 254 L509 277 Z M511 280 L542 258 L561 284 L531 305 Z', fill: '#EDF0EB', stroke: '#B6C3C5', width: 1.1 },
  { d: 'M542 308 L584 279 L628 333 L577 369 Z', fill: '#E9EEEB', stroke: '#B6C3C5', width: 1.3 },
];

const DOORS = [
  'M493 211 L505 203', 'M538 180 L550 170', 'M575 151 L586 145', 'M607 141 L621 141',
  'M650 141 L664 141', 'M761 141 L775 141', 'M787 141 L801 141', 'M830 151 L830 162',
  'M830 180 L830 194', 'M830 305 L830 320', 'M783 374 L783 387', 'M783 395 L783 408',
  'M783 452 L783 465', 'M783 515 L783 528',
];

export default function FloorPlan({ plan, vacantRooms = [] }) {
  const vacantById = Object.fromEntries(vacantRooms.map(room => [room.id, room]));
  return (
    <figure className="w-full">
      <svg
        viewBox={plan.viewBox}
        className="w-full h-auto"
        role="img"
        aria-labelledby="dg97-plan-title dg97-plan-desc"
        fontFamily="DejaVu Sans, system-ui, sans-serif"
      >
        <title id="dg97-plan-title">Förenklad planritning över DG97</title>
        <desc id="dg97-plan-desc">
          Ej skalenlig översikt av rum 1–14. Gröna rum är publicerade som lediga.
          Priser och hyresgästnamn visas inte på ritningen.
        </desc>
        <path d={plan.outlinePath} fill="#F4F5F2" stroke="#536E76" strokeWidth="2.8" strokeLinejoin="round" />
        <g aria-hidden="true">
          {SHARED_CORE.map(item => (
            <path key={item.d} d={item.d} fill={item.fill} stroke={item.stroke}
              strokeWidth={item.width} strokeLinejoin="round" strokeLinecap="round" />
          ))}
        </g>
        {plan.rooms.map(room => {
          const vacant = vacantById[room.rum];
          const kvmLabel = `${String(room.kvm).replace('.', ',')} kvm`;
          const title = vacant
            ? `Rum ${room.rum}, ${kvmLabel}, ${vacant.availabilityLabel}`
            : `Rum ${room.rum}, ${kvmLabel}`;
          return (
            <g key={room.rum} className="room" data-room-id={room.rum} data-available={vacant ? 'true' : 'false'}>
              <title>{title}</title>
              <polygon
                points={room.points}
                fill={vacant ? '#C8E6C9' : '#E7ECEA'}
                stroke={vacant ? '#1B7A4A' : '#536E76'}
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <text x={room.label[0]} y={room.label[1]} fontSize="20" fill={vacant ? '#14532D' : '#214C54'}
                fontWeight="700" textAnchor="middle">{room.rum}</text>
              <text x={room.label[0]} y={room.label[1] + 14} fontSize="9.5" fill={vacant ? '#166534' : '#496F74'}
                textAnchor="middle">{kvmLabel}</text>
              {vacant && (
                <text x={room.label[0]} y={room.label[1] + 26} fontSize="8" fill="#14532D"
                  textAnchor="middle">{vacant.planStatusLabel}</text>
              )}
            </g>
          );
        })}
        <g aria-hidden="true">
          {DOORS.map(d => (
            <g key={d}>
              <path d={d} fill="none" stroke="#F4F5F2" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#A0B9B6" strokeWidth="0.7" strokeLinejoin="round"
                strokeLinecap="round" strokeDasharray="1.7 2" />
            </g>
          ))}
        </g>
        <text x="676" y="238" fontSize="7.5" fill="#7A8D90" fontWeight="500" textAnchor="middle"
          letterSpacing="0.9" aria-hidden="true">GEMENSAM PASSAGE</text>
      </svg>
      <figcaption className="mt-3 text-sm text-neutral-600">
        Förenklad planritning, ej skalenlig. Grönt rum är ledigt. Inga priser eller namn på ritningen.
      </figcaption>
    </figure>
  );
}

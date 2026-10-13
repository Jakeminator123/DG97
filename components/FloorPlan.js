import { useId, useState } from 'react';
import { DG97_CONTACT_URL, referralUrl } from '../config/site';
import { getRoomCategory } from '../lib/plan-presentation';
import RoomPreview from './RoomPreview';
import { OVERVIEW_VIEWBOX, OVERVIEW_ENVELOPE } from '../lib/plan-overview';

const palette = {
  vacant: { fill: '#63b58c', stroke: '#24634b', label: 'Publicerat som ledigt' },
  office: { fill: '#b6cbe2', stroke: '#496986', label: 'Kontorsrum · kan hyras' },
  conference: { fill: '#d9dcdf', stroke: '#747b82', label: 'Hyrs inte ut' },
  other: { fill: '#e8e9ea', stroke: '#747b82', label: 'Ej klassificerat' },
};

export default function FloorPlan({ plan, vacantRooms = [] }) {
  const instanceId = useId().replace(/:/g, '');
  const conferenceRooms = plan.conferenceRooms || [];
  const vacantById = Object.fromEntries(vacantRooms.map(room => [room.id, room]));
  const publishedOnPlan = vacantRooms.filter(vacancy => {
    const room = plan.rooms.find(item => item.rum === vacancy.id);
    return room && getRoomCategory(room, vacancy, conferenceRooms) === 'vacant';
  });
  const [selectedId, setSelectedId] = useState(publishedOnPlan[0]?.id || null);
  const [previewId, setPreviewId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [onlyVacant, setOnlyVacant] = useState(false);
  const selected = plan.rooms.find(room => room.rum === selectedId);
  const selectedCategory = getRoomCategory(selected, vacantById[selectedId], conferenceRooms);
  const vacancy = selectedCategory === 'vacant' ? vacantById[selectedId] : null;
  const isConference = selectedCategory === 'conference';
  const titleId = `dg97-plan-title-${instanceId}`;
  const descriptionId = `dg97-plan-desc-${instanceId}`;
  const hatchId = `dg97-plan-unavailable-${instanceId}`;
  const contact = new URL(referralUrl(DG97_CONTACT_URL, 'planritning'));
  if (selected && ['office', 'vacant'].includes(selectedCategory)) contact.searchParams.set('rum', String(selectedId));

  function chooseRoom(roomId) {
    setSelectedId(roomId);
    setPreviewId(roomId);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#d6dce2] bg-[#f7f9fb] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d6dce2] bg-white px-5 py-4 sm:px-7">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary-950">
          <input type="checkbox" checked={onlyVacant} onChange={event => setOnlyVacant(event.target.checked)} className="h-4 w-4 accent-[#24634b]" />
          Framhäv lediga rum
        </label>
        <div className="flex items-center gap-2" aria-label="Zooma planritningen">
          <button type="button" aria-label="Zooma ut" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - 0.5))} className="h-9 w-9 rounded-lg border border-[#d6dce2] bg-white text-lg text-primary-950 disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">−</button>
          <span className="w-12 text-center text-xs tabular-nums text-neutral-600">{Math.round(zoom * 100)} %</span>
          <button type="button" aria-label="Zooma in" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + 0.5))} className="h-9 w-9 rounded-lg border border-[#d6dce2] bg-white text-lg text-primary-950 disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">+</button>
          <button type="button" onClick={() => setZoom(1)} className="ml-1 rounded-lg px-2 py-2 text-xs font-medium text-primary-700 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">Återställ</button>
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <figure className="min-w-0 p-4 sm:p-7">
          <div className={`${zoom > 1 ? 'max-h-[680px]' : ''} overflow-auto rounded-xl border border-[#e1e6eb] bg-white`} tabIndex={0} aria-label="Planritning. Vid zoom kan du rulla för att se resten av kontoret.">
            <svg viewBox={OVERVIEW_VIEWBOX} data-plan-overview="true" style={{ width: `${zoom * 100}%`, maxWidth: `${zoom * 420}px` }} className="mx-auto block h-auto" aria-labelledby={`${titleId} ${descriptionId}`}>
              <title id={titleId}>Interaktiv planritning över DG97</title>
              <desc id={descriptionId}>Förenklad översikt över de markerade rummen, med den omarkerade vänstra delen borttagen. Gröna rum är publicerade som lediga. Blå rum är kontorsrum som kan hyras, men är inte publicerade som lediga. Rum 23 är konferensrum, visas grått med ränder och hyrs inte ut. Välj ett rum för detaljer och exempelbilder. Ritningen saknar synliga rumsnummer och priser.</desc>
              <defs>
                <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#d9dcdf" /><path d="M0 0V6" stroke="#aeb4ba" strokeWidth="1.5" /></pattern>
              </defs>
              <path d={OVERVIEW_ENVELOPE} fill="#eef1f4" stroke="#8795a3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="miter" />
              {plan.rooms.map(room => {
                const category = getRoomCategory(room, vacantById[room.rum], conferenceRooms);
                const available = category === 'vacant' ? vacantById[room.rum] : null;
                const active = room.rum === selectedId;
                const colours = palette[category];
                const label = category === 'conference' ? `Konferensrum ${room.rum}, hyrs inte ut` : available ? `Kontorsrum ${room.rum}, ${available.sizeLabel}, ${available.availabilityLabel}` : category === 'office' ? `Kontorsrum ${room.rum}, kan hyras men är inte publicerat som ledigt` : `Rum ${room.rum}, ej klassificerat för uthyrning`;
                return (
                  <g key={room.rum} data-room-id={room.rum} data-available={available ? 'true' : 'false'} data-room-category={category} data-room-type={category === 'conference' ? 'konferensrum' : 'kontor'} role="button" aria-label={label} aria-pressed={active} aria-haspopup="dialog" tabIndex={0} onClick={event => { event.currentTarget.focus(); chooseRoom(room.rum); }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseRoom(room.rum); } }} className="group cursor-pointer outline-none">
                    <title>{label}</title>
                    <polygon points={room.points} fill={category === 'conference' ? `url(#${hatchId})` : colours.fill} fillOpacity={onlyVacant && !available ? 0.2 : available ? 0.9 : 0.8} stroke={active ? '#182e44' : colours.stroke} strokeWidth={active ? 2.6 : 1.15} vectorEffect="non-scaling-stroke" strokeLinejoin="miter" className="transition-[fill-opacity,stroke-width] duration-150 group-hover:[fill-opacity:1] group-focus-visible:stroke-primary-700 group-focus-visible:stroke-[3]" />
                    {active && <polygon points={room.points} fill="none" stroke="#ffffff" strokeWidth="0.65" vectorEffect="non-scaling-stroke" strokeLinejoin="miter" pointerEvents="none" />}
                    {available && <g transform={`translate(${room.label[0]},${room.label[1]})`} pointerEvents="none"><circle r="5.2" fill="#24634b" /><path d="m-2.4 0 1.6 1.7 3.2-3.4" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
                    {category === 'conference' && <g transform={`translate(${room.label[0]},${room.label[1]})`} pointerEvents="none"><rect x="-4.5" y="-1" width="9" height="7" rx="1.2" fill="#59616b" /><path d="M-2.8-1v-2.2a2.8 2.8 0 0 1 5.6 0V-1" fill="none" stroke="#59616b" strokeWidth="1.5" /></g>}
                  </g>
                );
              })}
            </svg>
          </div>
          <figcaption className="mt-5">
            <div className="grid gap-3 sm:grid-cols-3 text-xs text-neutral-700">
              <div className="flex items-start gap-2"><span aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-[#24634b] bg-[#63b58c]" /><span><strong className="block font-semibold text-[#24634b]">Publicerat som ledigt</strong>Se datum och detaljer.</span></div>
              <div className="flex items-start gap-2"><span aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-[#496986] bg-[#b6cbe2]" /><span><strong className="block font-semibold text-[#355672]">Kontorsrum · kan hyras</strong>Ej publicerat som ledigt.</span></div>
              <div className="flex items-start gap-2"><span aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-[#747b82] bg-[#d9dcdf]" /><span><strong className="block font-semibold text-neutral-700">Konferensrum · hyrs inte ut</strong>Grått med ränder och lås.</span></div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-neutral-500">Förenklad översikt av de markerade rummen. Färgen visar rummets kategori. Klicka för detaljer och exempelbilder från DG97.</p>
          </figcaption>
        </figure>
        <aside className="border-t border-[#d6dce2] bg-white p-6 lg:border-l lg:border-t-0" aria-label="Information om valt rum">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#496986]">Utforska kontoret</p>
          <div aria-live="polite" aria-atomic="true">
            {selected && <p className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${vacancy ? 'bg-[#e1f2e8] text-[#24634b]' : isConference ? 'bg-[#e8eaed] text-[#535c65]' : 'bg-[#e8eff7] text-[#355672]'}`}>{palette[selectedCategory].label}</p>}
            <h3 className="mb-3 text-2xl font-bold tracking-tight text-primary-950">{selected ? isConference ? 'Konferensrummet' : vacancy ? `${vacancy.sizeLabel} för ert nästa steg` : selectedCategory === 'office' ? 'Ett eget kontorsrum' : 'Information om ytan' : 'Hitta din plats'}</h3>
            {selected ? <>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600">{isConference ? `Rum ${selected.rum} är konferensrum. Det visas för orientering i kontoret och hyrs inte ut.` : vacancy ? vacancy.availabilityLabel : selectedCategory === 'office' ? 'Det här är ett kontorsrum som kan hyras, men det är inte publicerat som ledigt. Fråga DG97 om aktuell tillgänglighet.' : 'Uthyrningsstatus är inte bekräftad för den här ytan. Kontakta DG97 för mer information.'}</p>
              {vacancy && <dl className="mb-5 space-y-3 rounded-xl border border-[#dce8df] bg-[#f7fbf8] p-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-neutral-600">Yta</dt><dd className="font-semibold text-primary-950">{vacancy.sizeLabel}</dd></div><div><dt className="text-neutral-600">Månadshyra</dt><dd className="mt-1 font-semibold text-primary-950">{vacancy.monthlyLabel}</dd></div></dl>}
              <p className="mb-5 text-xs text-neutral-500">Referens: rum {selected.rum}</p>
              <button type="button" onClick={() => setPreviewId(selectedId)} aria-haspopup="dialog" className="mb-5 flex w-full items-center justify-between rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800 hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">Se exempelbilder från DG97 <span aria-hidden="true">↗</span></button>
            </> : <p className="mb-5 text-sm leading-relaxed text-neutral-600">Tryck på ett rum i ritningen. Du kan också använda tabbtangenten och Enter för att välja.</p>}
          </div>
          <a href={contact.toString()} className="flex items-center justify-center rounded-xl bg-primary-700 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">{isConference || !selected ? 'Kontakta DG97' : 'Fråga DG97 om rummet'} <span aria-hidden="true" className="ml-2">↗</span></a>
          <p className="mt-4 text-xs leading-relaxed text-neutral-500">Tillgänglighet och villkor bekräftas av DG97. Planritningen är en orienterande översikt och är inte ett underlag för mått eller möblering.</p>
          {publishedOnPlan.length > 0 && <div className="mt-7 border-t border-[#e1e6eb] pt-5"><h4 className="mb-3 text-sm font-semibold text-primary-950">Publicerade lediga rum</h4><div className="flex flex-wrap gap-2">{publishedOnPlan.map(room => <button type="button" key={room.id} aria-pressed={selectedId === room.id} onClick={() => chooseRoom(room.id)} className={`rounded-lg border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${selectedId === room.id ? 'border-[#24634b] bg-[#e1f2e8] text-[#24634b]' : 'border-[#d6dce2] bg-white text-primary-800 hover:border-[#24634b]'}`}>{room.sizeLabel}<span className="sr-only">, rum {room.id}</span></button>)}</div></div>}
        </aside>
      </div>
      {previewId !== null && selected && <RoomPreview key={previewId} room={selected} category={selectedCategory} vacancy={vacancy} contactUrl={contact.toString()} onClose={() => setPreviewId(null)} />}
    </div>
  );
}

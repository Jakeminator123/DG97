import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const officePhotos = [
  { src: '/images/ekta_office_room.jpg', alt: 'Kontorsrum på DG97 med skrivbord, fönster och en sittgrupp' },
  { src: '/images/ekta_room_2.jpg', alt: 'Ett annat kontorsrum på DG97 med skrivbord och stora fönster' },
];
const sharedPhotos = [
  { src: '/images/ekta_reception_bred.jpg', alt: 'Reception och gemensam miljö på DG97' },
];

export default function RoomPreview({ room, category, vacancy, contactUrl, onClose }) {
  const dialogRef = useRef(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const conference = category === 'conference';
  const photos = conference ? sharedPhotos : officePhotos;
  const photo = photos[photoIndex];
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);
  const closeDialog = () => dialogRef.current.close();

  return (
    <dialog ref={dialogRef} aria-labelledby="dg97-room-preview-title" aria-describedby="dg97-room-preview-caption" onClose={onClose}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-white/60 bg-white p-0 text-primary-950 shadow-2xl backdrop:bg-primary-950/60 backdrop:backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">En inblick i DG97</p><h3 id="dg97-room-preview-title" className="text-2xl font-bold tracking-tight">{conference ? 'Konferensrummet' : `Kontorsrum ${room.rum}`}</h3></div>
        <button type="button" onClick={closeDialog} aria-label="Stäng rumsbilder" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-2xl text-primary-800 hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">×</button>
      </div>
      <div className="relative bg-[#edf1f5]">
        <Image src={photo.src} alt={photo.alt} width={1600} height={1067} sizes="(max-width: 640px) 100vw, 672px" className="aspect-[16/10] h-auto w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary-800 shadow-sm">Exempel från DG97</span>
        {photos.length > 1 && <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-full bg-white/95 px-2 py-1 shadow-sm">
          <button type="button" aria-label="Föregående exempelbild" onClick={() => setPhotoIndex(index => (index + photos.length - 1) % photos.length)} className="h-9 w-9 rounded-full text-lg hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">←</button>
          <span aria-live="polite" className="text-xs tabular-nums">{photoIndex + 1} / {photos.length}</span>
          <button type="button" aria-label="Nästa exempelbild" onClick={() => setPhotoIndex(index => (index + 1) % photos.length)} className="h-9 w-9 rounded-full text-lg hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">→</button>
        </div>}
      </div>
      <div className="p-6 sm:p-7">
        <p id="dg97-room-preview-caption" className="mb-5 text-sm leading-relaxed text-neutral-600">{conference ? 'Miljöbild från receptionen på DG97. Rum 23 är konferensrum och hyrs inte ut.' : 'Riktiga kontorsbilder från DG97, som exempel på miljön. Bilderna är inte kopplade till det valda rumsnumret. Se just ert rum vid en visning.'}</p>
        {vacancy && !conference ? <div className="mb-5 rounded-xl border border-[#dce8df] bg-[#f7fbf8] p-4"><p className="font-semibold text-[#24634b]">{vacancy.sizeLabel} · {vacancy.availabilityLabel}</p><p className="mt-1 text-sm text-neutral-600">{vacancy.monthlyLabel}</p></div> : !conference && <p className="mb-5 rounded-xl bg-primary-50 p-4 text-sm text-primary-800">Kontorsrum som kan hyras, men som inte är publicerat som ledigt. Fråga DG97 om aktuell tillgänglighet.</p>}
        <a href={contactUrl} className="flex items-center justify-center rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">{conference ? 'Kontakta DG97' : 'Fråga om visning hos DG97'} <span aria-hidden="true" className="ml-2">↗</span></a>
      </div>
    </dialog>
  );
}

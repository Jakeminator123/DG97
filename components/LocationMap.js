import { useId, useState } from 'react';
import { DG97_BUSINESS } from '../config/site';

const destination = 'Drottninggatan 97, 113 60 Stockholm';
const mapQuery = encodeURIComponent(destination);
const mapUrl = `https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

export default function LocationMap({ className = '' }) {
  const [mapVisible, setMapVisible] = useState(false);
  const mapId = useId().replace(/:/g, '');

  return (
    <section aria-labelledby={`${mapId}-heading`} className={`overflow-hidden rounded-3xl border border-primary-100 bg-white ${className}`}>
      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="p-7 sm:p-10 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 mb-3">Mitt i Vasastan</p>
          <h2 id={`${mapId}-heading`} className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-950 mb-4">Hitta till DG97</h2>
          <p className="text-neutral-700 leading-relaxed mb-6">Vid Observatorielunden, mellan Odenplan och Rådmansgatan. Kom och upptäck kontoret på plats.</p>
          <address className="not-italic text-primary-950 mb-7">
            <p className="text-lg font-semibold">{DG97_BUSINESS.streetAddress}</p>
            <p className="text-neutral-600">{DG97_BUSINESS.postalCode} {DG97_BUSINESS.addressLocality}</p>
          </address>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-primary-200 px-5 py-3 font-semibold text-primary-800 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">
            Vägbeskrivning i Google Maps
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </a>
          <p className="text-xs text-neutral-500 leading-relaxed mt-5">Kartan hämtas från Google först när du väljer att visa den. Vägbeskrivningen öppnas i en ny flik.</p>
        </div>
        <div className="relative min-h-[340px] bg-[#f3f1e9] border-t lg:border-t-0 lg:border-l border-primary-100">
          {mapVisible ? (
            <iframe title="Karta: DG97, Drottninggatan 97 i Stockholm" src={mapUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer" allowFullScreen />
          ) : (
            <>
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
                <defs><pattern id={`${mapId}-blocks`} width="140" height="112" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><rect x="14" y="14" width="112" height="84" rx="12" fill="#e2dfd3" /><path d="M0 0H140M0 0V112" stroke="#fffdf7" strokeWidth="17" /></pattern></defs>
                <rect width="600" height="420" fill={`url(#${mapId}-blocks)`} />
                <ellipse cx="435" cy="60" rx="110" ry="85" fill="#d7e3d1" />
                <path d="M-10 355 610 140" stroke="#fffdf7" strokeWidth="30" />
                <path d="M-10 355 610 140" stroke="#b4c4ae" strokeWidth="2" strokeDasharray="5 7" />
                <circle cx="300" cy="250" r="65" fill="#343d6a" fillOpacity="0.08" />
                <circle cx="300" cy="250" r="44" fill="#343d6a" fillOpacity="0.1" />
                <path d="M300 269c-8-11-23-25-23-42a23 23 0 0 1 46 0c0 17-15 31-23 42Z" fill="#343d6a" /><circle cx="300" cy="227" r="8" fill="#fff" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/10">
                <div className="rounded-2xl bg-white/95 shadow-lg border border-white p-6 text-center max-w-xs">
                  <span className="block text-2xl font-bold text-primary-950 mb-1">DG97</span>
                  <p className="text-sm text-neutral-600 mb-5">Drottninggatan 97 · Stockholm</p>
                  <button type="button" onClick={() => setMapVisible(true)} className="rounded-xl bg-primary-700 px-6 py-3 font-semibold text-white hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">Visa kartan</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

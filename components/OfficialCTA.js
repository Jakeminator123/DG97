import { DG97_URL, DG97_CONTACT_URL, referralUrl } from '../config/site';

export default function OfficialCTA({
  title = 'Ta nästa steg med DG97',
  description = 'På www.dg97.se hittar du information om kontorshotellet på Drottninggatan 97. Fråga DG97 om tillgängliga rum, aktuella priser och vad som ingår i ett upplägg för ditt företag.',
  primaryHref = DG97_CONTACT_URL,
  primaryLabel = 'Kontakta DG97 på dg97.se',
  placement = 'kontakt',
}) {
  return (
    <aside className="rounded-2xl bg-primary-50 border border-primary-100 p-6 md:p-10">
      <p className="text-sm text-primary-700 font-semibold mb-3">DG97:s huvudwebbplats</p>
      <h2 className="text-2xl md:text-3xl font-bold text-primary-950 mb-4">{title}</h2>
      <p className="text-neutral-700 leading-relaxed max-w-2xl mb-6">{description}</p>
      <div className="flex flex-wrap gap-4">
        <a href={referralUrl(primaryHref, placement)} className="btn-primary">{primaryLabel}</a>
        <a href={referralUrl(DG97_URL, 'huvudwebbplats')} className="btn-secondary">Besök www.dg97.se</a>
      </div>
    </aside>
  );
}

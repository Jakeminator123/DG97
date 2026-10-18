import { DG97_URL, DG97_CONTACT_URL, DG97_BUSINESS, referralUrl } from '../config/site';

export default function OfficialCTA({
  title = 'Ta nästa steg med DG97',
  description = 'På www.dg97.se finns kontorshotellet på Drottninggatan 97. Där bokar ni visning och får ett aktuellt förslag för just ert företag.',
  primaryHref = DG97_CONTACT_URL,
  primaryLabel = 'Kontakta DG97 på dg97.se',
  placement = 'kontakt',
}) {
  return (
    <aside className="rounded-2xl bg-primary-800 text-white p-6 md:p-10">
      <p className="text-sm text-blue-100 font-semibold mb-3">DG97:s huvudwebbplats</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      <p className="text-blue-50 leading-relaxed max-w-2xl mb-6">{description}</p>
      <div className="flex flex-wrap gap-4">
        <a href={referralUrl(primaryHref, placement)} className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-800 font-semibold rounded-xl hover:bg-primary-50">{primaryLabel}</a>
        <a href={referralUrl(DG97_URL, 'huvudwebbplats')} className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10">Besök www.dg97.se</a>
        <a href={DG97_BUSINESS.telephoneHref} className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold underline underline-offset-4">{DG97_BUSINESS.telephoneDisplay}</a>
      </div>
    </aside>
  );
}

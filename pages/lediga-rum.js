import Link from 'next/link';
import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';
import { DG97_VACANCY_URL } from '../config/site';
import { getLedigaRum, formatSek, withExclVat } from '../lib/lediga-rum';

const snapshot = getLedigaRum();
const { pricePerSqm, pricePerSqmOver24, largeFromSqm } = snapshot.pricingModel;

export default function LedigaRum() {
  return (
    <Layout
      title="Lediga kontorsrum i Vasastan hösten 2026 – från 8 400 kr/mån exkl. moms"
      description="Tre rum blir lediga på DG97 vid Odenplan i november: 7–13,5 kvm, 1 200 kr/kvm i månaden exkl. moms, allt ingår. Se storlek, datum och hur priset räknas."
      path="/lediga-rum"
      breadcrumbs={[{ name: 'Hem', path: '/' }, { name: 'Lediga rum', path: '/lediga-rum' }]}
    >
      <GuideHero title="Lediga kontorsrum hos DG97 hösten 2026">
        <p>
          En kort, daterad översikt så att du kan räkna på ytan innan du ber om visning.
          Själva bokningen sker på dg97.se.
        </p>
        <p className="mt-4 text-sm text-blue-200">{snapshot.updatedLabel}</p>
      </GuideHero>

      <section className="section-container">
        <div className="max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-8">
            Guiden listar inte ett bokningslager. Här syns tre rum som blir fria i november 2026,
            med samma räknegrund som DG97 använder: yta gånger {withExclVat(`${formatSek(pricePerSqm)}/kvm/mån`)}.
            Hyran är all-inclusive. Villkoren är flexibla, men det som gäller för just ditt företag
            bekräftas av DG97.
          </p>

          <div className="overflow-x-auto rounded-xl border border-primary-100 bg-white mb-10">
            <table className="w-full text-left text-base">
              <caption className="sr-only">Rum som blir lediga hos DG97 i november 2026</caption>
              <thead className="bg-primary-50 text-primary-950">
                <tr>
                  <th scope="col" className="p-5">Rum</th>
                  <th scope="col" className="p-5">Yta</th>
                  <th scope="col" className="p-5">Ledigt från</th>
                  <th scope="col" className="p-5">Månadshyra</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                {snapshot.rooms.map(room => (
                  <tr key={room.id} className="border-t border-primary-100">
                    <th scope="row" className="p-5 font-semibold text-primary-950">{`Rum ${room.id}`}</th>
                    <td className="p-5">{room.sizeLabel}</td>
                    <td className="p-5">{room.availableFromLabel}</td>
                    <td className="p-5">{room.monthlyLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6 md:p-8 mb-10">
            <h2 className="heading-2 mb-4">Så räknar du</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Månadshyran = kvm × {withExclVat(`${formatSek(pricePerSqm)}`)}.
              För rum över {largeFromSqm} kvm används {withExclVat(`${formatSek(pricePerSqmOver24)}/kvm/mån`)}.
              De tre rummen nedan ligger under den gränsen.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-700 mb-4">
              {snapshot.rooms.map(room => (
                <li key={room.id}>
                  {room.sizeLabel} × {formatSek(pricePerSqm)} = {room.monthlyLabel}
                </li>
              ))}
            </ul>
            <p className="text-neutral-700 leading-relaxed">
              All-inclusive betyder att du jämför mot en egen lokal där möbler, internet,
              städning, kaffe och mötesytor ofta är extra rader. Räkna samma innehåll i
              båda offerterna, och kontrollera moms och tillägg. Mer om det i{' '}
              <Link href="/blogg/vad-kostar-ett-kontorshotell-i-stockholm" className="text-primary-700 underline underline-offset-4">
                guidens artikel om vad ett kontorshotell kostar
              </Link>.
            </p>
          </aside>

          <p className="text-neutral-600 text-sm mb-10">
            {snapshot.updatedLabel}. Översikten kan ändras när ett rum hyrs ut.
            Den ersätter inte en offert.
          </p>
        </div>

        <OfficialCTA
          title="Boka visning på dg97.se"
          description="Berätta hur många som ska sitta i rummet och när ni vill flytta in. DG97 bekräftar tillgänglighet, villkor och nästa steg på huvudwebbplatsen."
          primaryHref={DG97_VACANCY_URL}
          primaryLabel="Boka visning på dg97.se"
          placement="lediga-rum"
        />
      </section>
    </Layout>
  );
}

import Link from 'next/link';
import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';
import FloorPlan from '../components/FloorPlan';
import { DG97_VACANCY_URL, LEDIGA_RUM_REVALIDATE_SECONDS } from '../config/site';
import { formatSek, loadLedigaRumSnapshot, toPublicSnapshot, withExclVat } from '../lib/lediga-rum';

export default function LedigaRum({ snapshot }) {
  const { pricePerSqm, pricePerSqmOver24, largeFromSqm } = snapshot.pricingModel;
  const fromPrice = snapshot.cheapestMonthlyLabel;
  return (
    <Layout
      title={fromPrice
        ? `Lediga kontorsrum i Vasastan hösten 2026 – från ${fromPrice}`
        : 'Lediga kontorsrum hos DG97 hösten 2026'}
      description="Publicerade lediga rum på DG97 vid Odenplan: storlek, datum och hur hyran räknas. Priser anges alltid exkl. moms. Bokning sker på dg97.se."
      path="/lediga-rum"
      breadcrumbs={[{ name: 'Hem', path: '/' }, { name: 'Lediga rum', path: '/lediga-rum' }]}
    >
      <GuideHero title="Lediga kontorsrum hos DG97 hösten 2026">
        <p>
          En kort översikt så att du kan räkna på ytan innan du ber om visning.
          Själva bokningen sker på dg97.se.
        </p>
        <p className="mt-4 text-sm text-blue-200">{snapshot.updatedLabel}</p>
      </GuideHero>

      <section className="section-container">
        <div className="max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-8">
            Guiden listar inte ett bokningslager. Här syns de rum DG97 just nu publicerar som lediga,
            med samma räknegrund: yta gånger {withExclVat(`${formatSek(pricePerSqm)}/kvm/mån`)}.
            Hyran är all-inclusive. Villkoren är flexibla, men det som gäller för just ditt företag
            bekräftas av DG97.
          </p>

          <h2 className="heading-2 mb-4">Planritning</h2>
          <p className="text-neutral-700 leading-relaxed mb-6">
            Ritningen visar alla rum, 1–23. Lediga rum är gröna. Rum 23 är konferensrum och
            hyrs inte ut. Övriga rum är inte publicerade som lediga. Håll muspekaren över ett grönt
            rum för yta och datum.
          </p>
          <div className="rounded-2xl border border-primary-100 bg-white p-4 md:p-6 mb-6">
            <FloorPlan plan={snapshot.plan} vacantRooms={snapshot.rooms} />
          </div>
          {snapshot.roomsOffPlan.length > 0 && (
            <aside className="rounded-xl border border-primary-100 bg-primary-50/50 p-5 mb-10" aria-label="Rum utanför ritningen">
              <h3 className="text-lg font-semibold text-primary-950 mb-3">Rum utanför ritningen</h3>
              <ul className="space-y-2 text-neutral-700">
                {snapshot.roomsOffPlan.map(room => (
                  <li key={room.id}>
                    {`Rum ${room.id}`}, {room.sizeLabel}, {room.availabilityLabel}
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {snapshot.rooms.length === 0 ? (
            <p className="rounded-xl border border-primary-100 bg-white p-5 mb-10 text-neutral-700">
              Just nu listas inga publicerade lediga rum. Hör av dig via dg97.se för aktuell status.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-primary-100 bg-white mb-10">
              <table className="w-full text-left text-base">
                <caption className="sr-only">Publicerade lediga rum hos DG97</caption>
                <thead className="bg-primary-50 text-primary-950">
                  <tr>
                    <th scope="col" className="p-5">Rum</th>
                    <th scope="col" className="p-5">Yta</th>
                    <th scope="col" className="p-5">Tillgängligt</th>
                    <th scope="col" className="p-5">Månadshyra</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-700">
                  {snapshot.rooms.map(room => (
                    <tr key={room.id} data-listed-room={room.id} className="border-t border-primary-100">
                      <th scope="row" className="p-5 font-semibold text-primary-950">{`Rum ${room.id}`}</th>
                      <td className="p-5">{room.sizeLabel}</td>
                      <td className="p-5">{room.availabilityLabel}</td>
                      <td className="p-5">{room.monthlyLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <aside className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6 md:p-8 mb-10">
            <h2 className="heading-2 mb-4">Så räknar du</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Månadshyran = kvm × {withExclVat(`${formatSek(pricePerSqm)}`)}.
              För rum över {largeFromSqm} kvm används {withExclVat(`${formatSek(pricePerSqmOver24)}/kvm/mån`)}.
            </p>
            {snapshot.rooms.length > 0 && (
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mb-4">
                {snapshot.rooms.map(room => (
                  <li key={room.id}>
                    {`Rum ${room.id}`}: {room.sizeLabel} = {room.monthlyLabel}
                  </li>
                ))}
              </ul>
            )}
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

export async function getStaticProps() {
  const snapshot = await loadLedigaRumSnapshot();
  if (snapshot.feedError) {
    console.warn(`[lediga-rum] using fallback: ${snapshot.feedError}`);
  }
  return {
    props: { snapshot: toPublicSnapshot(snapshot) },
    revalidate: LEDIGA_RUM_REVALIDATE_SECONDS,
  };
}

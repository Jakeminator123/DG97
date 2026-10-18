import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';
import NapBlock from '../components/NapBlock';
import LocationMap from '../components/LocationMap';
import LeadForm from '../components/LeadForm';
import { DG97_CONTACT_URL, JAKOB } from '../config/site';

export default function Kontakt() {
  return (
    <Layout
      title="Kontakta DG97"
      description="Skicka en förfrågan om kontorsrum på Drottninggatan 97, mejla hej@dg97.se eller ring Jakob på 0739 55 80 87. Visning bokas även på dg97.se."
      path="/kontakt"
      pageType="ContactPage"
    >
      <GuideHero title="Hör av er om nästa kontor">
        <p>Berätta hur många som ska sitta i rummet och när ni vill flytta in. Vi återkommer med visning och ett konkret förslag.</p>
      </GuideHero>
      <section className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mb-12">
          <div>
            <h2 className="heading-2 mb-5">Skicka en förfrågan</h2>
            <LeadForm />
          </div>
          <div>
            <h2 className="heading-2 mb-5">DG97 Kontorshotell</h2>
            <NapBlock className="text-lg text-neutral-700 leading-relaxed space-y-1" />
            <p className="mt-6 text-lg text-neutral-700">
              Jakob Eberg:{' '}
              <a className="underline underline-offset-4" href={JAKOB.telephoneHref}>{JAKOB.telephoneDisplay}</a>
            </p>
            <ul className="list-disc pl-6 space-y-3 text-lg text-neutral-700 mt-8">
              <li>Hur många som behöver arbeta på kontoret samtidigt.</li>
              <li>Ungefär när ni vill flytta in.</li>
              <li>Behov av mötesrum, ostörda samtal och plats för besökare.</li>
            </ul>
            <p className="mt-6 text-neutral-700 leading-relaxed">
              Ni kan också använda formuläret på{' '}
              <a className="underline underline-offset-4" href={DG97_CONTACT_URL}>www.dg97.se/kontakt/</a>.
            </p>
          </div>
        </div>
        <OfficialCTA title="Få svar för ert företag" primaryHref={DG97_CONTACT_URL} />
        <LocationMap className="mt-12" />
      </section>
    </Layout>
  );
}

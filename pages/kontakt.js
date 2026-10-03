import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';
import NapBlock from '../components/NapBlock';
import { DG97_CONTACT_URL } from '../config/site';

export default function Kontakt() {
  return (
    <Layout title="Kontakta DG97 via huvudwebbplatsen" description="Frågor om kontorsrum, priser eller en visning? Gå vidare till DG97:s kontakt på www.dg97.se." path="/kontakt" pageType="ContactPage">
      <GuideHero title="Prata med DG97 om ditt nästa kontor"><p>Förfrågningar om rum och visningar hanteras på www.dg97.se.</p></GuideHero>
      <section className="section-container">
        <OfficialCTA title="Få svar för ditt företag" primaryHref={DG97_CONTACT_URL} />
        <div className="mt-12 grid md:grid-cols-2 gap-12 max-w-5xl">
          <div>
            <h2 className="heading-2 mb-5">DG97 Kontorshotell</h2>
            <NapBlock className="text-lg text-neutral-700 leading-relaxed space-y-1" />
          </div>
          <div>
            <h2 className="heading-2 mb-5">Det här hjälper DG97 att förstå era behov</h2>
            <ul className="list-disc pl-6 space-y-3 text-lg text-neutral-700">
              <li>Hur många som behöver arbeta på kontoret samtidigt.</li>
              <li>Ungefär när ni vill flytta in och hur länge ni planerar att stanna.</li>
              <li>Behov av mötesrum, ostörda samtal och utrymme för besökare.</li>
              <li>Önskad budget och eventuella särskilda krav på arbetsplatsen.</li>
            </ul>
            <p className="mt-6 text-neutral-700 leading-relaxed">Be om ett aktuellt förslag med tydliga uppgifter om rum, total kostnad, tillägg och avtalsvillkor innan ni fattar beslut.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

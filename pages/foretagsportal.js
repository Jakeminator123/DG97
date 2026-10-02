import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';
export default function Foretagsportal() {
  return (
    <Layout title="Kontakt för hyresgäster" description="Hyresgäster hänvisas till DG97:s huvudwebbplats för kontakt." path="/foretagsportal">
      <GuideHero title="Behöver du hjälp med ditt kontor?"><p>Kontakta DG97 via huvudwebbplatsen för frågor som rör ditt kontor eller ditt avtal.</p></GuideHero>
      <section className="section-container"><OfficialCTA title="Kontakt med DG97" /></section>
    </Layout>
  );
}

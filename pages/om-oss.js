import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';
import { DG97_URL } from '../config/site';

export default function OmGuiden() {
  return (
    <Layout title="Om Kontorsguiden och DG97" description="Kontorsguiden är en separat guidesajt från DG97. Läs om sidans syfte och hitta vidare till DG97:s huvudwebbplats." path="/om-oss" pageType="AboutPage">
      <GuideHero title="Om guiden och DG97"><p>Kunskap inför kontorsvalet och en tydlig väg till kontorshotellet.</p></GuideHero>
      <section className="section-container">
        <div className="max-w-3xl text-lg text-neutral-700 leading-relaxed space-y-7 mb-12">
          <h2 className="heading-2">En guide med DG97 som avsändare</h2>
          <p>Kontorsguiden drivs av DG97 och är en separat webbplats med råd om kontorshotell, arbetsmiljö och livet på ett delat kontor. Här kan du förbereda frågor, jämföra upplägg och fundera på vad ditt företag behöver.</p>
          <p>Guiden har koppling till DG97 och är inte en oberoende jämförelsetjänst. Resonemangen om olika kontorslösningar är till för att hjälpa dig att bedöma vad som passar din verksamhet.</p>
          <h2 className="heading-2">Kontorshotellet på Drottninggatan 97</h2>
          <p>DG97 finns i Vasastan i Stockholm, nära Observatorielunden, Odenplan och Rådmansgatan. Läs mer om verksamheten på <a className="text-primary-700 underline" href={`${DG97_URL}/om-oss/`}>DG97:s egen presentation</a>.</p>
          <h2 className="heading-2">Aktuella uppgifter hos DG97</h2>
          <p>Vi publicerar inga prislistor eller besked om lediga rum här. Utbud, service och avtalsvillkor kan förändras. Kontrollera därför uppgifter på huvudwebbplatsen och be DG97 bekräfta vad som gäller för just ditt företag.</p>
        </div>
        <OfficialCTA />
      </section>
    </Layout>
  );
}

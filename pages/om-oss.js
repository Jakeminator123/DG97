import Link from 'next/link';
import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';
import { DG97_URL } from '../config/site';

export default function OmGuiden() {
  return (
    <Layout title="Om DG97.org och kontorshotellet" description="dg97.org är en stödsajt till DG97 Kontorshotell på Drottninggatan 97. Här finns lediga rum, blogg och förfrågan – bokning sker på dg97.se." path="/om-oss" pageType="AboutPage">
      <GuideHero title="Om sajten och DG97"><p>En modern stödsajt till kontorshotellet på Drottninggatan 97.</p></GuideHero>
      <section className="section-container">
        <div className="max-w-3xl text-lg text-neutral-700 leading-relaxed space-y-7 mb-12">
          <h2 className="heading-2">dg97.org kompletterar dg97.se</h2>
          <p>Den här sajten drivs av DG97 och ska göra det enklare att förstå rummen, läget och vad som ingår. Den ersätter inte huvudwebbplatsen. Bokning, officiella sidor och den löpande verksamheten finns på <a className="text-primary-700 underline" href={DG97_URL}>www.dg97.se</a>.</p>
          <h2 className="heading-2">Kontorshotellet på Drottninggatan 97</h2>
          <p>DG97 hyr privata, låsbara kontorsrum i Vasastan, mellan Odenplan och Rådmansgatan vid Observatorielunden. Läs mer om verksamheten på <a className="text-primary-700 underline" href={`${DG97_URL}/om-oss/`}>DG97:s egen presentation</a>.</p>
          <h2 className="heading-2">Lediga rum och priser</h2>
          <p>Publicerade lediga rum uppdateras från DG97:s lista ungefär varje timme. Se den <Link className="text-primary-700 underline" href="/lediga-rum">daterade översikten</Link>. Priser anges alltid exkl. moms. Bekräfta utbud och villkor på huvudwebbplatsen för just ert företag.</p>
          <h2 className="heading-2">Så tas texterna fram</h2>
          <p>Blogginläggen tar upp vanliga frågor inför ett kontorsval. De innehåller inte påhittade recensioner eller kundcitat. Bilderna är miljöbilder från DG97.</p>
        </div>
        <OfficialCTA />
      </section>
    </Layout>
  );
}

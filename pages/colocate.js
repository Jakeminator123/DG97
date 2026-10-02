import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';

export default function DelatKontor() {
  return (
    <Layout title="Eget rum och gemensamma ytor" description="Så kan du tänka kring privata kontorsrum, delade ytor och gemenskap när du väljer arbetsplats." path="/colocate">
      <GuideHero title="Eget rum. En delad vardag."><p>Gemensamma ytor kan ge utrymme för möten med andra. Det egna rummet kan ge plats för teamets arbete.</p></GuideHero>
      <section className="section-container">
        <div className="max-w-3xl text-lg leading-relaxed text-neutral-700 space-y-7 mb-12">
          <h2 className="heading-2">Bestäm vad ni vill dela</h2>
          <p>Att dela kök, lounge och mötesrum med andra företag är ett annat upplägg än att dela själva arbetsplatsen. Fundera på vilka delar av dagen ni vill ha för er själva och var det skulle vara trevligt att träffa andra.</p>
          <h2 className="heading-2">Undersök kulturen vid ett besök</h2>
          <p>Fråga hur gemensamma ytor används, vilka ordningsregler som gäller och hur sociala aktiviteter brukar fungera. En gemenskap kan vara en fördel, men den behöver också lämna utrymme för den som vill arbeta ostört.</p>
          <h2 className="heading-2">Skilj möjlighet från löfte</h2>
          <p>Att sitta nära andra företag innebär inte automatiskt nya kunder eller samarbeten. Välj först en miljö som passar arbetet. Låt nya kontakter växa fram i sin egen takt.</p>
        </div>
        <OfficialCTA title="Läs om DG97:s kontorsupplägg" />
      </section>
    </Layout>
  );
}

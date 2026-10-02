import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';

export default function KontorForTeam() {
  return (
    <Layout title="Välja kontor för ett mindre team" description="Förbered kontorsvalet för ett mindre företag. Fundera på närvaro, arbetsro, möten och möjlighet att förändra upplägget." path="/vara-foretag">
      <GuideHero title="När ett litet team behöver ett eget kontor"><p>Börja med hur ni arbetar tillsammans. Företagets storlek berättar bara en del av historien.</p></GuideHero>
      <section className="section-container">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            ['Olika dagar, olika behov', 'Räkna på hur många som är på plats samtidigt, vilka dagar ni samlas och om besökare behöver en egen plats. Ett upplägg ska fungera även på era mest intensiva dagar.'],
            ['Samtal och koncentration', 'Kartlägg vilka som har digitala möten och vilka som behöver sammanhängande arbetsro. Fråga hur ljudmiljön fungerar mellan rum och gemensamma ytor.'],
            ['Utrymme för förändring', 'Diskutera hur ett byte av rum går till om ni blir fler eller färre. Be om besked om tillgänglighet och avtalsvillkor, i stället för att utgå från att ett byte alltid är möjligt.'],
          ].map(([title, text]) => <article key={title} className="bg-white rounded-xl border border-primary-100 p-7"><h2 className="text-xl font-bold mb-4 text-primary-950">{title}</h2><p className="text-neutral-700 leading-relaxed">{text}</p></article>)}
        </div>
        <h2 className="heading-2 mb-5">Låt teamet vara med på visningen</h2>
        <p className="text-lg text-neutral-700 max-w-3xl leading-relaxed mb-12">Ta med någon som gör många kundmöten och någon som arbetar mer koncentrerat. Prova att sitta vid arbetsplatserna och diskutera vad som skulle behöva anpassas. Då blir bedömningen mer konkret än enbart antal skrivbord.</p>
        <OfficialCTA title="Undersök om DG97 passar ert team" />
      </section>
    </Layout>
  );
}

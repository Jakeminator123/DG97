import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import OfficialCTA from '../components/OfficialCTA';
import { DG97_URL } from '../config/site';

const questions = [
  ['Arbetsro', 'Hur mycket tid lägger ni på koncentrerat arbete, telefonsamtal och gemensamma möten? Prova ljudmiljön under en vanlig arbetsdag.'],
  ['Rätt storlek', 'Utgå från hur många som faktiskt sitter på kontoret samtidigt. Fråga hur ett byte av rum fungerar om teamet förändras.'],
  ['Möten', 'Be om villkoren för konferensrum, bokning och eventuella extra timmar. Testa utrustningen med era egna datorer.'],
  ['Hela kostnaden', 'Jämför samma innehåll i offerterna: möbler, internet, städning, utskrifter och mötesrum. Fråga också om moms och tillägg.'],
  ['Avtalet', 'Be om tydliga besked om bindningstid, uppsägning, deposition och vilket inflyttningsdatum som kan bekräftas.'],
  ['Vardagen', 'Testa resan till kontoret och fundera på lunch, kundbesök och de tider då ni behöver komma in.'],
];
const guides = [
  { slug: 'hur-fungerar-ett-kontorshotell', title: 'Hur fungerar ett kontorshotell?', text: 'Förstå upplägget och vilka frågor du bör ställa innan du väljer.' },
  { slug: 'vad-kostar-ett-kontorshotell-i-stockholm', title: 'Vad påverkar kostnaden?', text: 'Jämför hela erbjudandet och förbered en förfrågan som går att få en användbar offert på.' },
  { slug: 'fordelar-med-kontorshotell', title: 'Kontorshotell eller egen lokal?', text: 'Väg service och flexibilitet mot kontrollen över en egen lokal.' },
];

export default function Home() {
  return (
    <Layout title="Kontorsguiden: välj kontorshotell i Stockholm" path="/"
      description="En guide till kontorshotell i Stockholm: jämför kontorslösningar och förbered din visning. Besök dg97.se för aktuella rum, priser och kontakt.">
      <section className="bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-blue-200 mb-6">DG97 Kontorsguiden · Stockholm</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">Ett kontor som passar din vardag.</h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-8">
              Eget rum, delad arbetsplats eller egen lokal? Här får du hjälp att jämföra alternativen och ställa rätt frågor inför nästa kontor.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blogg" className="bg-white text-primary-950 font-semibold px-6 py-3 rounded-xl hover:bg-blue-100">Utforska guiderna</Link>
              <a href={DG97_URL} className="border border-blue-200 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10">Upptäck DG97 på dg97.se</a>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-blue-200">En separat guidesajt från DG97. Rum, aktuella priser och förfrågningar finns på www.dg97.se.</p>
          </div>
          <figure>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
              <Image src="/images/hero_reception_ekta_1600x900.jpg" alt="Ljus reception på DG97 Kontorshotell, Drottninggatan 97" fill priority
                sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-sm text-blue-200">En miljöbild från DG97 på Drottninggatan 97.</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-primary-50 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-primary-950 font-semibold">Just nu: tre rum blir lediga i november.</p>
          <Link href="/lediga-rum" className="text-primary-700 font-semibold underline underline-offset-4">
            Se storlek, datum och hur hyran räknas
          </Link>
        </div>
      </section>

      <section className="section-container">
        <p className="text-sm uppercase tracking-widest font-semibold text-primary-700 mb-3">Börja med arbetssättet</p>
        <h2 className="heading-2 mb-5">Vilken sorts kontor behöver ni?</h2>
        <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl mb-8">Namnen kan överlappa. Titta på vad ni faktiskt hyr, vilka ytor ni delar och vem som ansvarar för driften.</p>
        <div className="overflow-x-auto rounded-xl border border-primary-100 bg-white">
          <table className="w-full text-left text-base">
            <caption className="sr-only">Jämförelse av tre vanliga kontorslösningar</caption>
            <thead className="bg-primary-50 text-primary-950">
              <tr><th scope="col" className="p-5">Upplägg</th><th scope="col" className="p-5">Kan passa när</th><th scope="col" className="p-5">Undersök särskilt</th></tr>
            </thead>
            <tbody className="text-neutral-700">
              {[
                ['Privat rum på kontorshotell', 'Ni vill sitta tillsammans i ett eget rum och dela service med andra företag.', 'Vad som ingår, ljudmiljö och regler för gemensamma mötesrum.'],
                ['Plats i en coworkingmiljö', 'Ni vill arbeta från en delad miljö och inte behöver ett eget rum varje dag.', 'Om platsen är fast eller flexibel, samt möjligheten till ostörda samtal.'],
                ['Egen kontorslokal', 'Ni behöver kunna bestämma över lokalens utformning och drift.', 'Avtalets längd och ansvar för inredning, teknik, städning och underhåll.'],
              ].map(row => <tr key={row[0]} className="border-t border-primary-100"><th scope="row" className="p-5 font-semibold text-primary-950">{row[0]}</th><td className="p-5">{row[1]}</td><td className="p-5">{row[2]}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-container bg-white">
        <h2 className="heading-2 mb-5">Ta med de här frågorna på visningen</h2>
        <p className="text-lg text-neutral-700 mb-9 max-w-3xl">Ett fint foto berättar en del. Ett besök och tydliga svar hjälper er att avgöra om kontoret fungerar i praktiken.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map(([title, text], index) => (
            <article key={title} className="p-6 rounded-xl border border-primary-100 bg-primary-50/40">
              <p className="text-sm text-primary-700 font-semibold mb-3">Fråga {index + 1}</p>
              <h3 className="text-xl font-bold text-primary-950 mb-3">{title}</h3>
              <p className="text-neutral-700 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container">
        <div className="flex flex-wrap justify-between items-baseline gap-4 mb-8">
          <h2 className="heading-2">Läs vidare inför kontorsvalet</h2>
          <Link href="/blogg" className="text-primary-700 font-semibold underline underline-offset-4">Alla guider</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {guides.map(guide => (
            <article key={guide.slug} className="bg-white border border-primary-100 p-7 rounded-xl">
              <h3 className="text-xl font-bold text-primary-950 mb-4"><Link className="hover:underline" href={`/blogg/${guide.slug}`}>{guide.title}</Link></h3>
              <p className="text-neutral-700 leading-relaxed mb-5">{guide.text}</p>
              <Link href={`/blogg/${guide.slug}`} className="text-primary-700 font-semibold underline underline-offset-4">Läs guiden</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section-container pt-0"><OfficialCTA title="Nyfiken på ett eget kontorsrum i Vasastan?" /></section>
    </Layout>
  );
}

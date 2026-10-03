import Link from 'next/link';
import Layout from '../components/Layout';
import GuideHero from '../components/GuideHero';
import OfficialCTA from '../components/OfficialCTA';

const questions = [
  { question: 'Vad är ett kontorshotell?', answer: 'Ett kontorshotell samlar flera företag i samma fastighet eller lokaler. Du hyr vanligtvis ett eget rum och delar vissa ytor och tjänster. Möbler, internet och andra delar kan ingå, men omfattningen avgörs av erbjudandet och avtalet.' },
  { question: 'Vad är skillnaden mellan kontorshotell och coworking?', answer: 'Kontorshotell brukar förknippas med privata rum, medan coworking ofta handlar om arbetsplatser i en delad miljö. Begreppen överlappar. Fråga om du får ett eget rum, en fast plats eller tillgång till valfria platser.' },
  { question: 'Vad kostar det att hyra ett kontorsrum?', answer: 'Kostnaden beror på rum, läge, service och avtalsvillkor. Jämför offerter med samma omfattning och kontrollera moms och tillägg. En daterad översikt med räkneexempel för DG97 finns på sidan Lediga rum. Bekräfta alltid offerten på www.dg97.se.' },
  { question: 'Ingår mötesrum och utskrifter?', answer: 'Det varierar mellan olika upplägg. Fråga om en viss mängd timmar eller utskrifter ingår, vad extra användning kostar och hur bokningen fungerar. Tillgång till en tjänst behöver inte betyda obegränsad användning.' },
  { question: 'Hur vet jag vilka avtalsvillkor som gäller?', answer: 'Be om ett skriftligt förslag med bindningstid, uppsägningstid, eventuell deposition och villkor för att byta rum. Utgå från det aktuella avtalet när du bedömer flexibiliteten.' },
  { question: 'Kan jag se vilka rum som är lediga här?', answer: 'Ja. Guiden har en kort, daterad översikt på sidan Lediga rum. Den är inte en bokningssida. Bekräfta tillgänglighet och boka visning på www.dg97.se.' },
  { question: 'Var ligger DG97?', answer: 'Kontorshotellet DG97 ligger på Drottninggatan 97 i Vasastan, Stockholm. På huvudwebbplatsen finns kontaktuppgifter och information inför ett besök.' },
  { question: 'Vad bör jag kontrollera under en visning?', answer: 'Titta på ljud, ljus, möbler, internet, mötesutrustning och hur besökare tas emot. Fråga separat om tillträde till kontoret, bemannad service och eventuella behov av tillgänglighetsanpassning.' },
];
export default function FragorOchSvar() {
  return (
    <Layout title="Frågor inför valet av kontorshotell" description="Svar på vanliga frågor om kontorshotell, kostnader och avtal. Aktuella uppgifter om DG97 hittar du på dg97.se." path="/fragor-och-svar" faq={questions}>
      <GuideHero title="Frågor inför ditt nästa kontor"><p>Förstå upplägget, förbered visningen och ta reda på vad som behöver bekräftas i avtalet.</p></GuideHero>
      <section className="section-container">
        <div className="max-w-4xl mx-auto mb-12 space-y-4">
          {questions.map(item => (
            <details key={item.question} className="bg-white border border-primary-100 rounded-xl p-6">
              <summary className="cursor-pointer font-semibold text-lg text-primary-950">{item.question}</summary>
              <p className="mt-4 text-neutral-700 leading-relaxed">{item.answer}</p>
              {(item.question.startsWith('Vad kostar') || item.question.startsWith('Kan jag se')) && (
                <p className="mt-3">
                  <Link href="/lediga-rum" className="text-primary-700 font-semibold underline underline-offset-4">
                    Till översikten över lediga rum
                  </Link>
                </p>
              )}
            </details>
          ))}
        </div>
        <OfficialCTA title="Frågor om ett konkret rum eller upplägg?" />
      </section>
    </Layout>
  );
}

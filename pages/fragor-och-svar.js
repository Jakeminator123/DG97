import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import {
  FadeIn,
  ScrollReveal,
  StaggerChild,
  StaggerReveal,
} from "../components/animations";

const faqCategories = [
  {
    category: "Allmänt om kontorshotell",
    questions: [
      {
        question: "Vad är ett kontorshotell?",
        answer:
          "Ett kontorshotell är en flexibel kontorslösning där du hyr ett fullt utrustat kontorsrum. Allt från möbler, internet, telefoni till gemensamma ytor som kök och konferensrum ingår. Du betalar en fast månadsavgift och kan fokusera helt på ditt företag utan att behöva hantera kontorsdrift.",
      },
      {
        question: "Vad är skillnaden mellan kontorshotell och coworking?",
        answer:
          "På ett kontorshotell hyr du ett eget privat kontorsrum, medan coworking oftast innebär att du har en plats i ett öppet kontorslandskap. På DG97 erbjuder vi privata kontorsrum vilket ger dig och ditt team en egen ostörd arbetsmiljö.",
      },
      {
        question: "För vilka företag passar ett kontorshotell?",
        answer:
          "Kontorshotell passar alla typer av företag - från egenföretagare och startups till etablerade bolag som vill ha flexibilitet. Det är perfekt för dig som vill ha en professionell adress och arbetsmiljö utan långsiktiga åtaganden.",
      },
    ],
  },
  {
    category: "Hyra och avtal",
    questions: [
      {
        question: "Vad ingår i hyran?",
        answer:
          "I hyran ingår möblerat kontorsrum, snabbt fiber-internet (1 Gbit/s), telefonsystem, kök med kaffe/te, tillgång till konferensrum, reception, städning, el, värme, posthantering och mycket mer. Allt du behöver för att kunna börja arbeta direkt.",
      },
      {
        question: "Hur flexibla är avtalen?",
        answer:
          "Vi erbjuder mycket flexibla hyresavtal som passar både små och stora företag. Du kan välja mellan olika avtalsperioder beroende på dina behov. Kontakta oss så hittar vi en lösning som passar just dig.",
      },
      {
        question: "Vad kostar det att hyra på DG97?",
        answer:
          "Priset varierar beroende på rumsstorlek och antal arbetsplatser. Vi har lösningar för alla budgetar - från enskilda kontorsrum till större lokaler för team. Kontakta oss för en offert anpassad efter dina behov.",
      },
      {
        question: "Hur lång är uppsägningstiden?",
        answer:
          "Uppsägningstiden varierar beroende på vilken typ av avtal du väljer. Vi erbjuder allt från kortare avtal med 1-3 månaders uppsägningstid till längre avtal med bättre pris. Kontakta oss för mer information.",
      },
    ],
  },
  {
    category: "Faciliteter och tjänster",
    questions: [
      {
        question: "Finns det konferensrum att boka?",
        answer:
          "Ja, alla våra medlemmar har tillgång till moderna konferensrum som kan bokas efter behov. Rummen är utrustade med whiteboard, projektorer, högtalare för videomöten och allt du behöver för produktiva möten.",
      },
      {
        question: "Ingår kaffe och fika?",
        answer:
          "Ja, kaffe, te och lättare fika ingår alltid för våra medlemmar. Vi ser det som en självklarhet att kunna bjuda på en kopp kaffe när du har besök eller behöver en liten paus.",
      },
      {
        question: "Finns det parkering?",
        answer:
          "Det finns flera parkeringsgarage i närheten av DG97. Vi kan hjälpa dig med information om alternativ och priser. Tack vare det centrala läget i Vasastan är det också enkelt att ta sig hit med kollektivtrafik.",
      },
      {
        question: "Är receptionen bemannad?",
        answer:
          "Ja, vår reception är bemannad vardagar mellan 08:00-18:00. Som medlem har du dock tillgång till lokalerna dygnet runt, alla dagar i veckan via ditt passerkort.",
      },
      {
        question: "Har ni skrivare och kopiator?",
        answer:
          "Ja, vi har moderna multifunktionsskrivare som kan skriva ut, kopiera och scanna. Tillgång till skrivare ingår i hyran.",
      },
    ],
  },
  {
    category: "Läge och tillgänglighet",
    questions: [
      {
        question: "Var ligger DG97?",
        answer:
          "DG97 ligger på Drottninggatan 97 i Vasastan, mitt i Stockholm. Perfekt läge med nära till Odenplan och Rådmansgatan. Lätt att ta sig hit för både dig och dina kunder.",
      },
      {
        question: "Hur tar jag mig hit med kollektivtrafik?",
        answer:
          "Det är mycket enkelt! Närmaste tunnelbanestation är Rådmansgatan (gröna linjen) på cirka 5 minuters promenad. Även Odenplan ligger nära med både tunnelbana och pendeltåg. Flera bussar stannar också i närheten.",
      },
      {
        question: "Kan jag ta med mig besökare?",
        answer:
          "Självklart! Du är alltid välkommen att ta med besökare och kunder. Vår reception hjälper gärna till att visa vägen och erbjuda kaffe till dina gäster.",
      },
    ],
  },
  {
    category: "Community och nätverk",
    questions: [
      {
        question: "Anordnar ni några evenemang?",
        answer:
          "Ja, vi anordnar regelbundet frukostmingel, after work och andra sociala aktiviteter där du kan träffa och nätverka med andra företagare. Det är ett perfekt tillfälle att utbyta erfarenheter och hitta nya samarbetspartners.",
      },
      {
        question: "Vilka typer av företag finns på DG97?",
        answer:
          "På DG97 har vi en blandning av företag från olika branscher - allt från teknikstartups och konsultbolag till kreativa byråer och tjänsteföretag. Denna mångfald skapar ett dynamiskt och inspirerande community.",
      },
      {
        question: "Hur fungerar nätverkandet?",
        answer:
          "Nätverkande sker både spontant i våra gemensamma ytor och genom våra organiserade evenemang. Många av våra medlemmar uppskattar möjligheten att träffa andra företagare i liknande situation, vilket ofta leder till värdefulla samarbeten.",
      },
    ],
  },
  {
    category: "Praktiskt",
    questions: [
      {
        question: "Kan jag använda er adress som företagsadress?",
        answer:
          "Ja, som medlem hos oss kan du använda Drottninggatan 97 som din företagsadress. Det är en professionell adress mitt i Stockholm som ger ett bra intryck.",
      },
      {
        question: "Hur fungerar posthanteringen?",
        answer:
          "All post som kommer till ditt företag tas emot av vår reception. Du får ett meddelande när post har anlänt och kan sedan hämta den i receptionen.",
      },
      {
        question: "Kan jag ta med egna möbler?",
        answer:
          "Alla våra kontorsrum är fullt möblerade med högkvalitativa, ergonomiska möbler. Om du har särskilda önskemål om inredning kan vi diskutera detta.",
      },
      {
        question: "Hur gör jag för att boka en visning?",
        answer:
          "Du är varmt välkommen att boka en visning! Kontakta oss via telefon 070-886 22 79, skicka ett mail eller använd kontaktformuläret på vår hemsida. Vi visar gärna runt och svarar på alla dina frågor.",
      },
    ],
  },
];

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 px-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-8">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-700 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FragorOchSvar() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const breadcrumbs = [
    { name: "Hem", path: "/" },
    { name: "Frågor och svar", path: "/fragor-och-svar" },
  ];

  // Samla alla FAQ items för JSON-LD schema
  const allFaqItems = faqCategories.reduce((acc, category) => {
    return [...acc, ...category.questions];
  }, []);

  return (
    <Layout
      title="FAQ - Frågor & Svar om Kontorshotell | DG97"
      description="Här hittar du svar på de vanligaste frågorna om DG97 kontorshotell - från hyresavtal och faciliteter till läge och community. Allt du behöver veta om att hyra kontor på Drottninggatan 97."
      keywords="kontorshotell faq, frågor om kontorshotell, hyra kontor stockholm, kontorshotell stockholm frågor, kontorshotell pris, kontorshotell avtal"
      path="/fragor-och-svar"
      breadcrumbs={breadcrumbs}
      faq={allFaqItems}
    >
      {/* Hero Section - Same style as Galleri */}
      <PageHero
        title="FAQ"
        subtitle={
          <>
            Här hittar du svar på de vanligaste frågorna om DG97 kontorshotell.
            Hittar du inte svar på din fråga? Kontakta oss så hjälper vi dig!
          </>
        }
      />

      {/* FAQ Content */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <StaggerReveal staggerDelay={0.1}>
            {faqCategories.map((category, categoryIndex) => (
              <StaggerChild key={categoryIndex}>
                <div className="mb-12">
                  <h2 className="heading-3 mb-6 flex items-center">
                    <span className="w-1 h-8 bg-primary-600 mr-4 rounded"></span>
                    {category.category}
                  </h2>
                  <div className="card-gradient overflow-hidden">
                    {category.questions.map((item, questionIndex) => (
                      <FAQItem
                        key={questionIndex}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openItems[`${categoryIndex}-${questionIndex}`]}
                        onClick={() => toggleItem(categoryIndex, questionIndex)}
                      />
                    ))}
                  </div>
                </div>
              </StaggerChild>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-container bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="heading-2 mb-6">Har du fler frågor?</h2>
          </ScrollReveal>

          <FadeIn delay={0.2}>
            <p className="text-lg text-gray-700 mb-10">
              Vi hjälper dig gärna! Kontakta oss via telefon, e-post eller boka
              en visning så kan vi svara på alla dina frågor på plats.
            </p>
          </FadeIn>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+46708862279"
              className="inline-block px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Ring oss: 070-886 22 79
            </a>

            <Link
              href="/kontakt"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors duration-200"
            >
              Boka visning
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  AwardBadge,
  FadeIn,
  MagneticButton,
  MorphingDivider,
  ScrollReveal,
  StaggerChild,
  StaggerReveal,
} from "../components/animations";
import {
  BriefcaseIcon,
  BuildingIcon,
} from "../components/animations/AnimatedIcons";
import Layout from "../components/Layout";
import SectionBackground from "../components/SectionBackground";
import KineticStory from "../components/KineticStory";

// Lazy load VideoHero (heavy component with video)
const VideoHero = dynamic(() => import("../components/VideoHero"), {
  ssr: true,
  loading: () => <div className="min-h-[80vh] bg-gray-100" />,
});

// Lazy load heavy components
const FeatureList = dynamic(() => import("../components/FeatureList"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const FAQ = dynamic(() => import("../components/FAQ"), {
  loading: () => <div className="h-64 animate-pulse" />,
});

const BlogCard = dynamic(() => import("../components/BlogCard"), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />,
});

const TestimonialsComponent = dynamic(
  () => import("../components/Testimonials"),
  {
    loading: () => <div className="h-64 bg-gray-50 animate-pulse" />,
  }
);

const PricingComponent = dynamic(() => import("../components/Pricing"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

const EventsComponent = dynamic(() => import("../components/Events"), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse" />,
});

const TrustBadgesComponent = dynamic(
  () => import("../components/TrustBadges"),
  {
    loading: () => <div className="h-48 bg-gray-50 animate-pulse" />,
  }
);

const PriceCalculatorComponent = dynamic(
  () => import("../components/PriceCalculator"),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
  }
);

const faqItems = [
  {
    question: "Vad är ett kontorshotell?",
    answer:
      "Ett kontorshotell är en flexibel kontorslösning där du hyr ett fullt utrustat kontorsrum. Allt från möbler, internet, telefoni till gemensamma ytor som kök och konferensrum ingår. Du betalar en fast månadsavgift och kan fokusera på ditt företag.",
  },
  {
    question: "Vad ingår i hyran?",
    answer:
      "I hyran ingår möblerat kontorsrum, snabbt WiFi, skrivare/kopiator, telefonsystem, kök med kaffe/te, konferensrum, städning, el, värme och posthantering. Du får en komplett arbetsplats där allt är inkluderat.",
  },
  {
    question: "Hur flexibla är avtalen?",
    answer:
      "Vi erbjuder flexibla hyresavtal som passar både små och stora företag. Du kan välja mellan olika avtalsperioder och anpassa efter dina behov. Kontakta oss så hittar vi en lösning som passar just dig.",
  },
  {
    question: "Var ligger kontorshotellet?",
    answer:
      "DG97 ligger på Drottninggatan 97 i Vasastan, mitt i Stockholm. Perfekt läge med nära till kollektivtrafik, restauranger och service. Lätt att ta sig hit för både dig och dina kunder.",
  },
  {
    question: "Kan jag boka konferensrum?",
    answer:
      "Ja, alla våra medlemmar har tillgång till moderna konferensrum som kan bokas efter behov. Rummen är utrustade med whiteboard, projektorer och allt du behöver för produktiva möten.",
  },
];

export default function Home({ recentPosts }) {
  // Deterministic positions to avoid hydration mismatch (no Math.random on SSR)
  const blobPositions = [
    { top: "12%", left: "8%" },
    { top: "48%", left: "72%" },
    { top: "78%", left: "30%" },
  ];

  return (
    <Layout
      title="Kontorshotell Stockholm - Flexibla Kontorsrum | DG97 Vasastan"
      description="Sök kontorshotell i Stockholm? DG97 erbjuder moderna kontorsrum för startups & växande företag i Vasastan. Allt inkluderat från 4990kr/mån. Boka visning idag!"
      path="/"
      faq={faqItems}
    >
      {/* Hero Section */}
      <VideoHero />

      {/* Stats Bar - Overlapping hero with glassmorphism effect */}
      <section className="relative -mt-16 sm:-mt-20 md:-mt-24 z-20 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal>
            <div className="bg-primary-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 sm:p-10 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <StaggerChild>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      30+
                    </div>
                    <div className="text-sm md:text-base opacity-90">
                      Företag
                    </div>
                  </motion.div>
                </StaggerChild>
                <StaggerChild>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      150+
                    </div>
                    <div className="text-sm md:text-base opacity-90">
                      Arbetande människor
                    </div>
                  </motion.div>
                </StaggerChild>
                <StaggerChild>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      15+
                    </div>
                    <div className="text-sm md:text-base opacity-90">
                      Branscher
                    </div>
                  </motion.div>
                </StaggerChild>
                <StaggerChild>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      24/7
                    </div>
                    <div className="text-sm md:text-base opacity-90">
                      Tillgång
                    </div>
                  </motion.div>
                </StaggerChild>
              </div>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Interactive Story Section */}
      <KineticStory />

      {/* Offerings Section */}
      <section className="section-container section-gradient">
        <SectionBackground variant="light" intensity="subtle" />
        <StaggerReveal>
          <div className="text-center mb-16">
            <h2
              className="heading-1 mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #dbeafe 0%, #93c5fd 35%, #4b5b9c 70%, #1f3070 100%)",
                backgroundSize: "220% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 15s ease-in-out infinite",
              }}
            >
              Våra tjänster
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
              Vi erbjuder flexibla kontorslösningar som passar både nystartade
              företag och etablerade bolag
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Office Rooms */}
            <StaggerChild>
              <FadeIn direction="left">
                <div className="card-gradient p-8 h-full hover-lift">
                  <div className="mb-6 flex justify-center">
                    <BuildingIcon
                      size={80}
                      className="text-primary-600 animate-float"
                    />
                  </div>
                  <h3 className="heading-3 mb-4 text-center">
                    Hyr kontorsrum på DG97
                  </h3>
                  <p className="text-neutral-700 mb-8 text-center leading-relaxed">
                    Välj mellan olika storlekar på kontorsrum som passar ditt
                    företag. Alla rum är fullt möblerade och redo att användas
                    direkt. Med flexibla avtal och allt inkluderat får du en
                    professionell arbetsplats utan krångel.
                  </p>
                  <div className="text-center">
                    <MagneticButton variant="primary" href="/kontakt">
                      Boka visning
                    </MagneticButton>
                  </div>
                </div>
              </FadeIn>
            </StaggerChild>

            {/* Conference Rooms */}
            <StaggerChild>
              <FadeIn direction="right">
                <div className="card-gradient p-8 h-full hover-lift">
                  <div className="mb-6 flex justify-center">
                    <BriefcaseIcon
                      size={80}
                      className="text-primary-300 animate-float animation-delay-200"
                    />
                  </div>
                  <h3 className="heading-3 mb-4 text-center">
                    Konferensrum på DG97
                  </h3>
                  <p className="text-neutral-700 mb-8 text-center leading-relaxed">
                    Moderna konferensrum utrustade med projektorer, whiteboard
                    och ljud för videomöten. Perfekt för kundmöten,
                    presentationer eller workshops. Boka enkelt via vårt system
                    när du behöver.
                  </p>
                  <div className="text-center">
                    <MagneticButton
                      href="/kontakt"
                      className="bg-gradient-to-r from-primary-400 to-primary-500 text-white hover:from-primary-500 hover:to-primary-600 shadow-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold transition-all duration-300"
                    >
                      Läs mer
                    </MagneticButton>
                  </div>
                </div>
              </FadeIn>
            </StaggerChild>
          </div>
        </StaggerReveal>
      </section>

      {/* Features Section */}
      <FeatureList />

      {/* Trust Badges Section */}
      <TrustBadgesComponent />

      {/* Pricing Section */}
      <PricingComponent limit={3} showTitle={true} />

      {/* Price Calculator Section */}
      <PriceCalculatorComponent />

      {/* Award Section */}
      <section className="section-container section-gradient-primary relative overflow-hidden">
        <SectionBackground variant="blue" intensity="strong" />

        {/* Soft glowing orbs for depth - OPTIMIZED: Reduced blur for better performance */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-primary-200/10 rounded-full blur-2xl opacity-30 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-100/20 to-primary-100/10 rounded-full blur-2xl opacity-30 translate-x-1/2 translate-y-1/2 -z-10"></div>

        {/* Removed animated shimmer overlay to prevent flickering */}

        {/* Avoid reveal on initial load to prevent blink */}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="badge-primary mb-4 text-sm sm:text-base">
              🏆 Erkänd kvalitet
            </span>
            <h2
              className="heading-hero mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #f4f8ff 0%, #d7e5ff 30%, #9fb8ff 60%, #4b5b9c 90%, #f4f8ff 100%)",
                backgroundSize: "240% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 15s ease-in-out infinite",
                textShadow: "0 6px 24px rgba(63, 86, 150, 0.35)",
              }}
            >
              Årets Coworking Finalist 2023
            </h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <AwardBadge size={260} variant="float" showCaption={false} />
            </motion.div>
            <div className="max-w-xl text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Finalist i Årets Coworking Awards Stockholm
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vi är stolta över att ha blivit nominerade som finalist i den
                prestigefyllda Årets Coworking Awards 2023. Detta är ett
                erkännande av vårt engagemang för excellens.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                På DG97 kombinerar vi modern design, perfekt centralt läge och
                ett levande community för att erbjuda mer än bara ett kontorsrum
                – vi skapar en plats där företag växer, trivs och når sina mål
                tillsammans.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="badge-primary flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Modern design</span>
                </div>
                <div className="badge-accent flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Centralt läge</span>
                </div>
                <div className="badge-success flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>Aktivt community</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsComponent limit={3} showTitle={true} />

      {/* Events Section */}
      <EventsComponent limit={3} showTitle={true} />

      {/* FAQ Section */}
      <FAQ items={faqItems} />

      {/* Divider */}
      <MorphingDivider className="h-24 bg-gray-50" color="#4B5B9C" />

      {/* CTA Section */}
      <section className="section-dark relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          {blobPositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 bg-white rounded-full blur-3xl"
              style={{ top: pos.top, left: pos.left }}
              animate={{
                y: [0, -20, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Smooth gradient overlay to remove harsh edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent pointer-events-none"></div>

        <div className="section-container">
          <div className="relative max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2
                className="heading-hero text-white mb-6 shimmer-text"
                style={{
                  letterSpacing: "-0.02em",
                }}
              >
                Redo att ta steget?
              </h2>
            </ScrollReveal>

            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
                Boka en kostnadsfri visning och se varför så många företag
                väljer DG97 som sitt kontor.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton
                  href="/kontakt"
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-2xl text-lg px-8 py-4 border border-secondary-500/20"
                >
                  Boka visning nu →
                </MagneticButton>

                <MagneticButton
                  href="/vara-foretag"
                  variant="outline"
                  className="border-2 border-white/60 text-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  Se våra medlemmar
                </MagneticButton>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Inga bindningstider</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Allt inkluderat</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Flytta in direkt</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-container bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20">
        <SectionBackground variant="light" intensity="subtle" />
        <ScrollReveal>
          <h2
            className="heading-1 text-center mb-4"
            style={{
              background:
                "linear-gradient(135deg, #1e293b 0%, #4B5B9C 50%, #1e293b 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 15s ease-in-out infinite",
            }}
          >
            Senaste nytt om kontorshotell och flexibla arbetslösningar
          </h2>
          <p className="text-center text-gray-600 mb-12 text-base sm:text-lg">
            Tips, guider och nyheter om kontorshotell och flexibla
            arbetslösningar
          </p>
        </ScrollReveal>

        <StaggerReveal>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {recentPosts.map((post, idx) => (
              <StaggerChild key={post.slug}>
                <BlogCard post={post} index={idx} />
              </StaggerChild>
            ))}
          </div>
        </StaggerReveal>

        <ScrollReveal delay={0.8}>
          <div className="text-center">
            <MagneticButton variant="secondary" href="/blogg">
              Se alla inlägg
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { getPosts } = await import('../lib/posts');
  return { props: { recentPosts: getPosts().slice(0, 3) } };
}

import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import {
  MagneticButton,
  ScrollReveal,
  FadeIn,
  ScaleReveal,
  StaggerReveal,
  StaggerChild,
  BlobDivider,
  GradientMarquee
} from '../components/animations';
import { HandshakeIcon, LightbulbIcon, GlobeIcon, LightningIcon } from '../components/animations/AnimatedIcons';

export default function CoLocate() {
  const benefits = [
    {
      icon: HandshakeIcon,
      title: 'Samarbete',
      description: 'Arbeta tillsammans med andra företag och dela kunskap',
    },
    {
      icon: LightbulbIcon,
      title: 'Innovation',
      description: 'Inspireras av andra och utveckla nya idéer tillsammans',
    },
    {
      icon: GlobeIcon,
      title: 'Nätverk',
      description: 'Bygg värdefulla kontakter och affärsrelationer',
    },
    {
      icon: LightningIcon,
      title: 'Flexibilitet',
      description: 'Anpassa din arbetsplats efter dina behov',
    },
  ];

  return (
    <Layout
      title="CO-LOCATE Work Space"
      description="CO-LOCATE är vår flexibla workspace-lösning där företag kan samarbeta, nätverka och växa tillsammans på DG97 Kontorshotell."
      path="/colocate"
    >
      {/* Hero Section with Noise Gradient */}
      <PageHero
        title="CO-LOCATE"
        subtitle="Flexibel workspace där företag möts, samarbetar och växer tillsammans"
        minHeight={true}
        animationVariant="waves"
      >
        <MagneticButton variant="accent" href="/kontakt">
          Kom igång idag
        </MagneticButton>
      </PageHero>

      {/* Marquee */}
      <div className="py-8 bg-gray-50">
        <GradientMarquee
          items={["Samarbete", "Innovation", "Flexibilitet", "Community", "Nätverk", "Tillväxt"]}
          speed={40}
        />
      </div>

      {/* Main Content */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="heading-2 mb-6 text-center">Vad är CO-LOCATE?</h2>
          </ScrollReveal>

          <FadeIn direction="up" delay={0.2}>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              CO-LOCATE är vår moderna workspace-lösning som kombinerar det bästa från
              coworking och kontorshotell. Här får du tillgång till flexibla arbetsplatser
              i en inspirerande miljö där företag från olika branscher möts och samarbetar.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Perfekt för dig som vill ha en professionell arbetsmiljö utan att vara bunden
              till ett fast kontorsrum. Du får tillgång till alla våra faciliteter och blir
              en del av vår växande community av entreprenörer och företag.
            </p>
          </FadeIn>

          {/* Benefits Grid */}
          <StaggerReveal staggerDelay={0.15} className="mt-16">
            <ScrollReveal>
              <h2 className="heading-2 text-center mb-12">Fördelar med CO-LOCATE</h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {benefits.map((benefit, index) => (
                <StaggerChild key={index}>
                  <ScaleReveal>
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                      <div className="mb-4 flex justify-center">
                        <benefit.icon size={80} className="transition-transform" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </ScaleReveal>
                </StaggerChild>
              ))}
            </div>
          </StaggerReveal>

          {/* What's Included */}
          <FadeIn direction="up" className="mt-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg shadow-lg">
              <h2 className="heading-3 mb-8 text-center">Vad ingår?</h2>

              <StaggerReveal staggerDelay={0.1}>
                <ul className="space-y-4 text-gray-700">
                  {[
                    "Flexibla arbetsplatser i öppna ytor och tysta zoner",
                    "Tillgång till alla gemensamma ytor och faciliteter",
                    "Snabbt fiber-internet och teknikutrustning",
                    "Kaffe, te och frukost ingår",
                    "Möjlighet att boka konferensrum efter behov",
                    "Tillgång till nätverksevenemang och aktiviteter"
                  ].map((item, index) => (
                    <StaggerChild key={index}>
                      <li className="flex items-start group">
                        <motion.svg
                          className="w-6 h-6 text-accent-600 mr-3 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </motion.svg>
                        <span className="group-hover:text-accent-600 transition-colors duration-300">{item}</span>
                      </li>
                    </StaggerChild>
                  ))}
                </ul>
              </StaggerReveal>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Blob Divider */}
      <BlobDivider className="h-48" />

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-5"
              style={{
                width: `${300 + i * 100}px`,
                height: `${300 + i * 100}px`,
                left: `${i * 30}%`,
                top: `${i * 20}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative section-container text-white">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="heading-2 text-white mb-6">Intresserad av CO-LOCATE?</h2>
            </ScrollReveal>

            <FadeIn delay={0.2}>
              <p className="text-lg text-accent-100 mb-10">
                Kontakta oss idag för mer information om våra flexibla workspace-lösningar
                och hur CO-LOCATE kan passa ditt företag.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <MagneticButton
                className="bg-white text-accent-600 hover:bg-gray-100"
                onClick={() => window.location.href = '/kontakt'}
              >
                Boka en visning
              </MagneticButton>
            </FadeIn>
          </div>
        </div>
      </section>
    </Layout>
  );
}


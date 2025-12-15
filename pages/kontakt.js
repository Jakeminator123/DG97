import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FadeIn, MagneticButton, ScrollReveal } from "../components/animations";
import DistanceToOffice from "../components/DistanceToOffice";
import ContactForm from "../components/ContactForm";
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import NewsletterSignup from "../components/NewsletterSignup";
import SectionBackground from "../components/SectionBackground";

// Lazy load Testimonials
const Testimonials = dynamic(() => import("../components/Testimonials"), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse" />,
});

// Lazy load Google Maps
const GoogleMap = dynamic(() => import("../components/GoogleMap"), {
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-gray-100 animate-pulse flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Laddar karta...</p>
    </div>
  ),
  ssr: false,
});

// Contact info data med ikoner
const contactMethods = [
  {
    icon: "📱",
    title: "Ring oss",
    value: "070-886 22 79",
    link: "tel:0708862279",
    description: "Vardagar 08:00 - 18:00",
    cta: "Ring nu",
    primary: true,
  },
  {
    icon: "✉️",
    title: "E-post",
    value: "hej@dg97.se",
    link: "mailto:hej@dg97.se",
    description: "Svar inom 24 timmar",
    cta: "Skicka e-post",
  },
  {
    icon: "📍",
    title: "Besök oss",
    value: "Drottninggatan 97",
    link: "https://goo.gl/maps/xyz",
    description: "113 60 Stockholm",
    cta: "Se vägbeskrivning",
  },
];

// Fördelar med att kontakta oss
const benefits = [
  {
    icon: "⚡",
    title: "Snabba svar",
    description: "Vi svarar alltid inom 24 timmar på alla förfrågningar",
  },
  {
    icon: "🔑",
    title: "Flytta in direkt",
    description: "Lediga kontor redo för omedelbar inflyttning",
  },
  {
    icon: "💰",
    title: "Flexibla priser",
    description: "Anpassade lösningar för alla budgetar",
  },
  {
    icon: "🏆",
    title: "Personlig service",
    description: "Dedikerad kontaktperson som hjälper dig hela vägen",
  },
];

export default function Kontakt() {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const breadcrumbs = [
    { name: "Hem", path: "/" },
    { name: "Kontakt", path: "/kontakt" },
  ];

  return (
    <>
      <DistanceToOffice />
      <Layout
        title="Kontakt - Boka Visning Kontorshotell Stockholm"
        description="Kontakta DG97 Kontorshotell för visning av flexibla kontorsrum. Ring 070-886 22 79 eller boka online. Drottninggatan 97, Stockholm. Svar inom 24h."
        keywords="kontakt kontorshotell, boka visning kontor, dg97 kontakt, kontorshotell telefon, besöka kontorshotell stockholm"
        path="/kontakt"
        breadcrumbs={breadcrumbs}
        pageType="ContactPage"
      >
        {/* Hero Section - Same style as Galleri */}
        <PageHero
          title="Kontakt"
          animationVariant="orbs"
          subtitle={
            <>
              Boka en kostnadsfri visning idag och se varför över 30 företag
              valt DG97 som sitt kontorshotell
            </>
          }
          kicker={
            <span className="badge-primary bg-white/20 text-white border border-white/30 text-sm sm:text-base">
              💼 Lediga kontor från 4 990 kr/mån
            </span>
          }
          minHeight={true}
        >
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <MagneticButton
                href="tel:0708862279"
                variant="primary"
                className="bg-white text-primary-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 w-full sm:w-auto"
              >
                <span className="flex items-center gap-2 justify-center">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Ring direkt: 070-886 22 79
                </span>
              </MagneticButton>
              <MagneticButton
                href="#boka-visning"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-primary-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 w-full sm:w-auto"
              >
                Boka visning online →
              </MagneticButton>
            </div>
          </FadeIn>
        </PageHero>

        {/* Contact Methods Section - Förbättrad design */}
        <section className="section-container bg-gradient-to-br from-blue-50/20 via-white to-primary-50/15">
          <SectionBackground variant="light" intensity="subtle" />
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12">
                Välj det sätt som passar dig bäst
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contactMethods.map((method, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <motion.div
                    className={`card-interactive p-6 sm:p-8 text-center h-full ${
                      method.primary
                        ? "border-2 border-primary-500 bg-primary-50/30"
                        : ""
                    }`}
                    whileHover={{ y: -5 }}
                  >
                    {method.primary && (
                      <span className="badge-accent mb-3 sm:mb-4 text-xs sm:text-sm">
                        Rekommenderat
                      </span>
                    )}
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                      {method.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      {method.title}
                    </h3>
                    <p className="text-lg sm:text-2xl font-bold text-primary-600 mb-2 break-words">
                      {method.value}
                    </p>
                    <p className="text-neutral-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      {method.description}
                    </p>
                    <MagneticButton
                      href={method.link}
                      variant={method.primary ? "primary" : "secondary"}
                      className="w-full text-sm sm:text-base"
                    >
                      {method.cta}
                    </MagneticButton>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Online Booking Section - Förbättrad */}
        <section
          id="boka-visning"
          className="section-container section-gradient-primary"
        >
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="heading-1 text-center mb-6">
                Boka din visning nu
              </h2>
              <p className="text-lead text-center mb-10">
                Välj en tid som passar dig - vi finns tillgängliga alla vardagar
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Bokningsformulär */}
              <FadeIn delay={0.2}>
                <div className="card-gradient p-8">
                  <h3 className="heading-4 mb-6">Fyll i dina uppgifter</h3>
                  <ContactForm />
                </div>
              </FadeIn>

              {/* Fördelar */}
              <FadeIn delay={0.3}>
                <div className="space-y-4">
                  <h3 className="heading-4 mb-6">Därför ska du boka visning</h3>
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-3 sm:gap-4 items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-2xl sm:text-3xl flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-base sm:text-lg">
                          {benefit.title}
                        </h4>
                        <p className="text-neutral-600 text-sm sm:text-base">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Map Section - Förbättrad */}
        <section className="section-container bg-gradient-to-br from-primary-50/10 via-white to-blue-50/25">
          <SectionBackground variant="blue" intensity="subtle" />
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
                Hitta hit
              </h2>
              <p className="text-center text-neutral-600 mb-8 sm:mb-10 text-base sm:text-lg">
                Centralt läge på Drottninggatan 97, nära Odenplan
              </p>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <FadeIn delay={0.2}>
                <div ref={mapRef} className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
                  {showMap ? (
                    <GoogleMap />
                  ) : (
                    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                      <p className="text-gray-500">Laddar karta…</p>
                    </div>
                  )}
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="card p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                      📍 Adress
                    </h3>
                    <p className="text-base sm:text-lg font-semibold text-neutral-900">
                      Drottninggatan 97
                      <br />
                      113 60 Stockholm
                    </p>
                    <a
                      href="https://goo.gl/maps/xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost mt-4 inline-flex items-center gap-2"
                    >
                      Öppna i Google Maps
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="card p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                      🚇 Kommunikationer
                    </h3>
                    <ul className="space-y-2 text-neutral-600 text-sm sm:text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600">•</span>
                        <span>
                          <strong>Tunnelbana:</strong> Odenplan (5 min promenad)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600">•</span>
                        <span>
                          <strong>Buss:</strong> Flera linjer stannar vid
                          Observatorielunden
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600">•</span>
                        <span>
                          <strong>Pendeltåg:</strong> Odenplan station
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600">•</span>
                        <span>
                          <strong>Parkering:</strong> Finns i närområdet
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="card p-6">
                    <h3 className="heading-4 mb-4">
                      🕐 Öppettider för visning
                    </h3>
                    <div className="space-y-1 text-neutral-600">
                      <p>
                        <strong>Måndag - Fredag:</strong> 08:00 - 18:00
                      </p>
                      <p>
                        <strong>Lördag - Söndag:</strong> Efter överenskommelse
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-primary-600 font-medium">
                      Som medlem har du tillgång dygnet runt med egen nyckel
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="section-tight bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary-600">30+</div>
                <div className="text-neutral-600">Nöjda företag</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">150+</div>
                <div className="text-neutral-600">Arbetande människor</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">4.8/5</div>
                <div className="text-neutral-600">Kundbetyg</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">2018</div>
                <div className="text-neutral-600">Etablerat</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials limit={3} showTitle={true} />

        {/* Final CTA Section */}
        <section className="section-container section-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="heading-1 text-white mb-6">
                Ta första steget mot ditt nya kontor
              </h2>
            </ScrollReveal>

            <FadeIn delay={0.2}>
              <p className="text-lead text-white/90 mb-10">
                Vi har hjälpt över 30 företag att hitta sin perfekta
                kontorslösning.
                <br />
                Nu är det din tur.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton
                  href="tel:0708862279"
                  variant="primary"
                  className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-10 py-5"
                >
                  <span className="flex items-center gap-2">
                    📞 Ring nu och boka visning
                  </span>
                </MagneticButton>
                <MagneticButton
                  href="mailto:hej@dg97.se"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary-600 text-lg px-10 py-5"
                >
                  <span className="flex items-center gap-2">
                    ✉️ Skicka förfrågan
                  </span>
                </MagneticButton>
              </div>
            </FadeIn>

            {/* Urgency Badge */}
            <FadeIn delay={0.4}>
              <div className="mt-10">
                <span className="badge-primary bg-white/20 text-white border border-white/30">
                  🔥 Begränsat antal lediga kontor - Kontakta oss idag!
                </span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-br from-blue-50/30 to-primary-50/20 py-16 border-t border-blue-100/40">
          <NewsletterSignup variant="light" />
        </section>
      </Layout>
    </>
  );
}

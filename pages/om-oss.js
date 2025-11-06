"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  AnimatedLogo,
  AwardBadge,
  FadeIn,
  GeometricDivider,
  MagneticButton,
  ScrollReveal,
  StaggerChild,
  StaggerReveal,
} from "../components/animations";
import Founder3DModel from "../components/Founder3DModel";
import Layout from "../components/Layout";

export default function OmOss() {
  const breadcrumbs = [
    { name: "Hem", path: "/" },
    { name: "Om oss", path: "/om-oss" },
  ];

  const founders = [
    {
      name: "Jakob Eberg",
      jobTitle: "Medgrundare & Partner",
      sameAs: ["https://www.linkedin.com/in/jakobeberg"],
    },
    {
      name: "Oscar Guditz",
      jobTitle: "Medgrundare & Partner",
      sameAs: ["https://www.linkedin.com/in/oscarguditz"],
    },
  ];

  return (
    <Layout
      title="Om oss"
      description="DG97 är ett modernt kontorshotell beläget på Drottninggatan 97 i Vasastan, Stockholm. Vi erbjuder flexibla kontorslösningar med allt inkluderat."
      path="/om-oss"
      breadcrumbs={breadcrumbs}
      pageType="AboutPage"
      persons={founders}
    >
      {/* Hero Section with Panorama Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/panorama.jpg"
            alt="Panoramautsikt från DG97 kontorshotell"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="heading-hero text-white mb-6 drop-shadow-lg shimmer-text"
            style={{
              letterSpacing: "-0.03em",
              lineHeight: "1.1",
              textShadow:
                "0 4px 30px rgba(0,0,0,0.4), 0 10px 60px rgba(0,0,0,0.3)",
              background:
                "linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Om DG97
          </h1>
          <p
            className="text-2xl md:text-3xl text-white/95 drop-shadow-md font-light"
            style={{
              letterSpacing: "0.02em",
              textShadow: "0 2px 15px rgba(0,0,0,0.3)",
            }}
          >
            Din flexibla kontorspartner i{" "}
            <span className="font-semibold text-blue-200">
              hjärtat av Stockholm
            </span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Animated Logo */}
          <div className="flex justify-center mb-12">
            <AnimatedLogo size={120} />
          </div>

          <ScrollReveal>
            <h2
              className="heading-1 mb-6 text-center"
              style={{
                background:
                  "linear-gradient(135deg, #4B5B9C 0%, #5573b9 50%, #4B5B9C 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 15s ease-in-out infinite",
              }}
            >
              Välkommen till DG97
            </h2>
          </ScrollReveal>

          <FadeIn delay={0.2}>
            <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
              <p className="text-xl leading-relaxed mb-8">
                DG97 är faktiskt ett ganska personligt kontorshotell. Vi finns
                högst upp på Drottninggatan med utsikt över Observatorielunden –
                du vet, precis mellan Odenplan och Rådmansgatan där det är lugnt
                men ändå mitt i smeten. Här uppe har vi lyckats kombinera
                stillheten med närheten till stadens bästa lunchställen, gym och
                kollektivtrafik. Till Centralen? Tio minuter promenad, eller så
                lånar du en av våra elkickbikes.
              </p>
            </div>
          </FadeIn>

          {/* Founders Section */}
          <div className="mt-16 mb-16">
            <ScrollReveal>
              <h2 className="heading-2 mb-4 text-center">Möt grundarna</h2>
              <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                Två entreprenörer med en vision om att skapa Stockholms bästa
                kontorshotell
              </p>
            </ScrollReveal>

            {/* 3D Models */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <Founder3DModel
                modelPath="/models/jakob-original.glb"
                name="Jakob Eberg"
                title="Medgrundare & Partner"
                delay={0.2}
              />
              <Founder3DModel
                modelPath="/models/oscar-original.glb"
                name="Oscar Guditz"
                title="Medgrundare & Partner"
                delay={0.4}
              />
            </div>

            {/* Text content */}
            <div className="grid md:grid-cols-2 gap-8">
              <FadeIn delay={0.6}>
                <div className="card-gradient p-6 hover:shadow-xl transition-shadow duration-300 hover-lift">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong className="text-gray-900">Jakob</strong> är en
                    erfaren entreprenör och innovatör med en passion för att
                    skapa dynamiska företagsmiljöer. Med bakgrund inom tidig
                    fas-innovation och startup-ekosystemet, driver Jakob DG97:s
                    vision om att vara mer än bara ett kontorshotell - en plats
                    där företag växer tillsammans.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/jakobeberg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.8}>
                <div className="card-gradient p-6 hover:shadow-xl transition-shadow duration-300 hover-lift">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong className="text-gray-900">Oscar</strong> har lång
                    erfarenhet av att skapa och driva framgångsrika företag. Med
                    ett starkt fokus på kundupplevelse och operativ excellens
                    säkerställer Oscar att varje detalj på DG97 fungerar
                    smidigt. Hans engagemang för community-building gör DG97
                    till en plats där företag inte bara arbetar, utan trivs.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/oscarguditz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Performance optimization note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500 italic">
                💡 Tip: 3D-modellerna laddas automatiskt när du scrollar hit för
                bästa prestanda
              </p>
            </motion.div>
          </div>

          <StaggerReveal staggerDelay={0.2} className="space-y-12">
            <StaggerChild>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-lg">
                <h3 className="heading-3 mb-4 text-primary-700">
                  Vår tanke med stället
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Vi tror helt enkelt på en arbetsplats som är lika funktionell
                  som trivsam. Så vi erbjuder privata, låsbara kontorsrum för
                  små och medelstora team – med allt redan på plats – plus en
                  varm och social kultur som faktiskt gör vardagen lite
                  roligare. Du hyr veckovis eller månadsvis och kan växa i takt
                  med att teamet växer. Enkelt.
                </p>
              </div>
            </StaggerChild>

            <StaggerChild>
              <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-8 rounded-lg">
                <h3 className="heading-3 mb-4 text-accent-700">
                  Rummen & mötesplatserna
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Alla rum håller modern standard – höj- och sänkbara skrivbord,
                  ergonomiska stolar som ryggen gillar, och whiteboards
                  överallt. Saknas något? Vi löser det tillsammans. Våra två
                  konferensrum (16 och 20 kvm) är fullt utrustade för digitala
                  möten. Plus två mindre telefonbås där ingen hör dig.
                </p>
              </div>
            </StaggerChild>

            <StaggerChild>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg">
                <h3 className="heading-3 mb-4 text-gray-700">
                  Det här ingår (spoiler: nästan allt)
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  I hyran ingår i princip hela köret: snabbt internet som
                  faktiskt funkar, färgskrivare/skanner (alla format!),
                  copy/print, kaffe som är drickbart, läsk, frukt, plus tillgång
                  till dusch, innergård, reception och lounge. Posthantering och
                  företagsadress ingår såklart. Vill du bara ha adress och komma
                  hit ibland? Kör virtual office.
                </p>
              </div>
            </StaggerChild>

            <StaggerChild>
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-8 rounded-lg">
                <h3 className="heading-3 mb-4 text-primary-700">
                  Praktiska grejer & service
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Du kommer in dygnet runt med bricka och blåtandslås. Hundar?
                  Självklart välkomna! Städning tre gånger i veckan och
                  vaktmästaren nås enkelt på Slack om något krånglar.
                  Konferensrummen används förresten ibland för att varva ned
                  också – fredags-AW med VR-spel är inte ovanligt.
                </p>
              </div>
            </StaggerChild>

            <StaggerChild>
              <div className="bg-gradient-to-r from-accent-100 to-primary-100 p-8 rounded-lg">
                <h3 className="heading-3 mb-4 text-accent-700">Kulturen här</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Vi vill att det ska vara lätt att trivas, punkt. Minst en dag
                  i veckan dukar vi upp gemensam frukost (ofta blir det fler)
                  och AW ungefär en gång i månaden. Det skapar kontakter mellan
                  bolagen och gör helt enkelt arbetsdagarna roligare. Många
                  affärer har startats över en kaffe här.
                </p>
              </div>
            </StaggerChild>

            <StaggerChild>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg">
                <h3 className="heading-3 mb-4 text-gray-700">
                  Flexibilitet på riktigt
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  DG97 är totalt cirka 570 kvm med 22 moderna kontorsrum – från
                  små mysiga 8 kvm för 2 personer upp till rymliga 45 kvm för 11
                  personer. Våra avtal är korta och flexibla eftersom vi fattar
                  att du vill lägga tiden på verksamheten, inte på att förhandla
                  om lokaler.
                </p>
              </div>
            </StaggerChild>

            <StaggerChild>
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 rounded-lg text-white">
                <h3 className="heading-3 mb-4 text-white">Passar DG97 dig?</h3>
                <p className="text-primary-100 text-lg leading-relaxed">
                  Våra hyresgäster är allt från solo-konsulter som vill slippa
                  hemmakontoret till växande team som behöver skala upp. Det som
                  förenar dem? De vill ha en privat arbetsplats med full service
                  och mänsklig skala, där man snabbt får hjälp när det behövs
                  men också hittar samarbeten och affärsmöjligheter helt
                  naturligt.
                </p>
              </div>
            </StaggerChild>
          </StaggerReveal>
        </div>
      </section>

      {/* Award Section */}
      <section className="section-container bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
              <FadeIn direction="left" delay={0.2}>
                <div className="flex-shrink-0">
                  <AwardBadge size={280} variant="glow" showCaption={false} />
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.4}>
                <div className="max-w-xl">
                  <h2 className="heading-2 text-gradient mb-6">
                    Erkänd Kvalitet
                  </h2>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Finalist i Årets Coworking Awards Stockholm 2023
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Vi är stolta och hedrade över att ha blivit nominerade som
                    finalist i den prestigefyllda Årets Coworking Awards 2023.
                    Denna nominering är ett bevis på vårt engagemang och
                    dedikation för att skapa den bästa möjliga arbetsmiljön.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Nomineringen reflekterar vår strävan efter excellens i allt
                    vi gör - från våra moderna lokaler och professionella
                    service till det levande community vi bygger varje dag.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    På DG97 är vi mer än bara ett kontorshotell. Vi är en plats
                    där företag trivs, växer och når sina mål i en inspirerande
                    och stöttande miljö.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Image Section - Working Environment */}
      <section className="section-container bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/working_man.jpg"
                  alt="Man som arbetar vid skrivbord på DG97"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div>
                <h3 className="heading-3 mb-4">
                  En arbetsplats anpassad för dig
                </h3>
                <p className="text-gray-700 mb-4">
                  Våra kontorsrum är noggrant utformade för att skapa en
                  produktiv och inspirerande arbetsmiljö. Med ergonomiska
                  möbler, gott om naturligt ljus och en lugn atmosfär får du de
                  bästa förutsättningarna för att lyckas.
                </p>
                <p className="text-gray-700">
                  Oavsett om du behöver ett privat kontorsrum för dig själv
                  eller ett större rum för ditt team, har vi lösningen som
                  passar just dina behov.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Geometric Divider */}
      <GeometricDivider className="h-24" />

      {/* Reception Image Section */}
      <section className="section-container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left" delay={0.2}>
              <div className="order-2 md:order-1">
                <h3 className="heading-3 mb-4">Välkomnande reception</h3>
                <p className="text-gray-700 mb-4">
                  Vår bemannade reception är hjärtat i DG97. Här får du
                  personlig service och hjälp med allt från posthantering till
                  att boka konferensrum.
                </p>
                <p className="text-gray-700">
                  Receptionen är öppen vardagar 08:00-18:00, men som medlem har
                  du tillgång till lokalerna dygnet runt alla dagar i veckan.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl order-1 md:order-2">
                <Image
                  src="/images/reception1.jpg"
                  alt="Moderna receptionen på DG97"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-container bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="heading-2 mb-6">Vill du veta mer?</h2>
          </ScrollReveal>

          <FadeIn delay={0.2}>
            <p className="text-lg text-gray-700 mb-10">
              Boka en visning idag och se våra lokaler med egna ögon. Vi visar
              gärna runt och svarar på alla dina frågor.
            </p>
          </FadeIn>

          <StaggerReveal staggerDelay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <StaggerChild>
                <MagneticButton
                  onClick={() => (window.location.href = "tel:+46708862279")}
                >
                  Ring oss: 070-886 22 79
                </MagneticButton>
              </StaggerChild>

              <StaggerChild>
                <MagneticButton
                  variant="secondary"
                  onClick={() => (window.location.href = "/kontakt")}
                >
                  Kontaktformulär
                </MagneticButton>
              </StaggerChild>
            </div>
          </StaggerReveal>
        </div>
      </section>
    </Layout>
  );
}

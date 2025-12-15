import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import {
  FadeIn,
  ScrollReveal,
  StaggerChild,
  StaggerReveal,
} from "../components/animations";

// Lista över företag - lätt att uppdatera
const companies = [
  {
    name: "Pynn AI",
    industry: "Innovation & Tech",
    description:
      "Europas smartaste early-stage innovationsdatabas. Pynn AI hjälper investerare, inkubatorer och konferenser att hitta och bedöma de bästa startups i Europa.",
    website: "https://pynn.ai",
    linkedIn: "https://www.linkedin.com/company/pynn-ai",
    services: [
      "AI-driven innovation",
      "Startup-screening",
      "Investor-plattform",
    ],
    founded: "2024",
    highlight:
      "Nyligen uppnådde 35+ B2B-kunder och 850+ bedömda startups på bara 5 månader",
  },
  // Lägg till fler företag här efter samma struktur
  {
    name: "Ditt Företag",
    industry: "Din Bransch",
    description:
      "Vill ditt företag synas här? Kontakta oss för att lägga till er presentation på vår hemsida och bli en del av DG97-communityt.",
    website: null,
    linkedIn: null,
    services: [],
    isPlaceholder: true,
  },
];

function CompanyCard({ company, index }) {
  if (company.isPlaceholder) {
    return (
      <FadeIn delay={index * 0.1}>
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-300 h-full flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-600 mb-3">
            {company.name}
          </h3>
          <p className="text-gray-600 mb-6">{company.description}</p>
          <a
            href="/kontakt"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kontakta oss
          </a>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={index * 0.1}>
      <motion.div
        className="card-gradient p-8 hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover-lift"
        whileHover={{ y: -8 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {company.name}
              </h3>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {company.industry}
              </span>
            </div>
          </div>

          {company.founded && (
            <p className="text-sm text-gray-500">Grundat {company.founded}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
          {company.description}
        </p>

        {/* Highlight */}
        {company.highlight && (
          <div className="mb-6 p-4 bg-accent-50 border-l-4 border-accent-500 rounded">
            <p className="text-sm text-gray-700 font-medium">
              <span className="text-accent-600">★</span> {company.highlight}
            </p>
          </div>
        )}

        {/* Services */}
        {company.services && company.services.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Tjänster & Fokusområden:
            </h4>
            <div className="flex flex-wrap gap-2">
              {company.services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Webbplats
            </a>
          )}
          {company.linkedIn && (
            <a
              href={company.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
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
          )}
        </div>
      </motion.div>
    </FadeIn>
  );
}

export default function VaraForetag() {
  const breadcrumbs = [
    { name: "Hem", path: "/" },
    { name: "Våra företag", path: "/vara-foretag" },
  ];

  const activeCompanies = companies.filter((c) => !c.isPlaceholder);
  const placeholders = companies.filter((c) => c.isPlaceholder);
  const [publicProfiles, setPublicProfiles] = useState([]);

  // Load public profiles from localStorage
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    const loadPublicProfiles = () => {
      const profiles = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('company_')) {
          try {
            const rawData = localStorage.getItem(key);
            if (!rawData) continue;

            let data;
            try {
              data = JSON.parse(rawData);
            } catch (parseError) {
              // Skip invalid JSON
              continue;
            }

            if (data?.isPublic && data?.companyName) {
              profiles.push({
                ...data,
                id: key.replace('company_', '')
              });
            }
          } catch (e) {
            // Only log errors in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading profile:', e);
            }
          }
        }
      }
      setPublicProfiles(profiles);
    };

    loadPublicProfiles();
    window.addEventListener('storage', loadPublicProfiles);
    return () => window.removeEventListener('storage', loadPublicProfiles);
  }, []);

  const companyList = activeCompanies.map((company) => ({
    name: company.name,
    description: company.description,
    url: company.website || "",
  }));

  return (
    <Layout
      title="Våra företag - Medlemmar på DG97 Kontorshotell | Stockholm"
      description="Möt de innovativa företagen som är en del av DG97-communityt. Från teknikstartups till etablerade konsultbolag - här trivs företag i alla storlekar på vårt kontorshotell i Stockholm."
      keywords="kontorshotell medlemmar, företag på kontorshotell, dg97 företag, kontorshotell stockholm företag, startup kontorshotell, coworking community stockholm"
      path="/vara-foretag"
      breadcrumbs={breadcrumbs}
      itemList={companyList}
    >
      {/* Hero Section */}
      <PageHero
        title="Våra företag"
        subtitle={
          <>
            På DG97 samlas innovativa och framgångsrika företag från olika
            branscher. Möt några av medlemmarna i vårt växande community.
          </>
        }
        animationVariant="orbs"
      />

      {/* Stats Section */}
      <section className="section-container bg-gradient-to-br from-primary-50/20 via-white to-primary-50/10">
        <div className="max-w-4xl mx-auto">
          <StaggerReveal>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <StaggerChild>
                <div className="p-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    30+
                  </div>
                  <p className="text-gray-600">Företag på DG97</p>
                </div>
              </StaggerChild>
              <StaggerChild>
                <div className="p-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    15+
                  </div>
                  <p className="text-gray-600">Olika branscher</p>
                </div>
              </StaggerChild>
              <StaggerChild>
                <div className="p-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    150+
                  </div>
                  <p className="text-gray-600">Människor i communityt</p>
                </div>
              </StaggerChild>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="section-container bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Möt några av våra medlemmar</h2>
              <p className="text-lg text-gray-600">
                Ett dynamiskt mix av startups, tech-företag, konsultbolag och
                kreativa byråer
              </p>
            </div>
          </ScrollReveal>

          <StaggerReveal>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {activeCompanies.map((company, index) => (
                <StaggerChild key={index}>
                  <CompanyCard company={company} index={index} />
                </StaggerChild>
              ))}
            </div>
          </StaggerReveal>

          {/* Placeholder for new companies */}
          <StaggerReveal>
            <div className="grid md:grid-cols-2 gap-8">
              {placeholders.map((company, index) => (
                <StaggerChild key={index}>
                  <CompanyCard
                    company={company}
                    index={activeCompanies.length + index}
                  />
                </StaggerChild>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Community Benefits */}
      <section className="section-container bg-gradient-to-br from-primary-50/15 via-white to-primary-50/20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="heading-2 text-center mb-12">
              Fördelarna med vårt community
            </h2>
          </ScrollReveal>

          <StaggerReveal staggerDelay={0.15}>
            <div className="grid md:grid-cols-2 gap-8">
              <StaggerChild>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Nätverk & Samarbeten
                    </h3>
                    <p className="text-gray-600">
                      Möt andra företagare, hitta samarbetspartners och bygg
                      värdefulla relationer i vårt community.
                    </p>
                  </div>
                </div>
              </StaggerChild>

              <StaggerChild>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-accent-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Innovation & Inspiration
                    </h3>
                    <p className="text-gray-600">
                      Omge dig med ambitiösa entreprenörer och innovatörer som
                      driver dig framåt.
                    </p>
                  </div>
                </div>
              </StaggerChild>

              <StaggerChild>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-secondary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Regelbundna Evenemang
                    </h3>
                    <p className="text-gray-600">
                      Delta i frukostmingel, after work och workshops för att
                      lära känna communityt.
                    </p>
                  </div>
                </div>
              </StaggerChild>

              <StaggerChild>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Tillväxt & Utveckling
                    </h3>
                    <p className="text-gray-600">
                      Dra nytta av andras erfarenheter och kompetenser för att
                      accelerera din tillväxt.
                    </p>
                  </div>
                </div>
              </StaggerChild>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Public Company Profiles Section */}
      {publicProfiles.length > 0 && (
        <section className="section-container bg-gradient-to-br from-accent-50/20 via-white to-primary-50/20">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="heading-2 mb-4">Företagsprofiler</h2>
                <p className="text-lg text-gray-600">
                  Upptäck företagen som har valt att dela sin profil publikt
                </p>
              </div>
            </ScrollReveal>

            <StaggerReveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicProfiles.map((profile, index) => (
                  <StaggerChild key={profile.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {profile.companyName}
                          </h3>
                          {profile.industry && (
                            <span className="text-sm text-gray-600">{profile.industry}</span>
                          )}
                        </div>
                        {profile.roomNumber && (
                          <span className="badge-primary text-xs">Rum {profile.roomNumber}</span>
                        )}
                      </div>

                      {profile.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {profile.description}
                        </p>
                      )}

                      {profile.services && (
                        <p className="text-xs text-gray-500 mb-4">
                          <strong>Tjänster:</strong> {profile.services}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.lookingForSynergies && (
                          <span className="badge-accent text-xs">Söker synergier</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {profile.website && (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline text-sm"
                          >
                            Hemsida →
                          </a>
                        )}
                        {profile.linkedin && (
                          <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline text-sm"
                          >
                            LinkedIn →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  </StaggerChild>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-container bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Bli en del av DG97-communityt
            </h2>
          </ScrollReveal>

          <FadeIn delay={0.2}>
            <p className="text-xl text-white/90 mb-10">
              Vi letar alltid efter nya företag som vill vara en del av vårt
              växande community. Boka en visning idag och se varför så många
              väljer DG97.
            </p>
          </FadeIn>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kontakt"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Boka visning
            </a>

            <a
              href="/om-oss"
              className="inline-block px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors duration-200"
            >
              Läs mer om oss
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

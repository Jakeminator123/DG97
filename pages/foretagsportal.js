import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import CompanyProfile from '../components/CompanyProfile';
import PageHero from '../components/PageHero';
import { FadeIn, ScrollReveal, StaggerChild, StaggerReveal } from '../components/animations';
import SectionBackground from '../components/SectionBackground';

export default function Foretagsportal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSynergyFinder, setShowSynergyFinder] = useState(false);
  const [potentialSynergies, setPotentialSynergies] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  // Simple authentication (in production, this would be proper auth)
  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation - in production this would check against a database
    if (companyId && password === 'dg97') {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('authenticated_company', companyId);
    } else {
      setError('Fel företags-ID eller lösenord');
    }
  };

  // Check if already authenticated
  useEffect(() => {
    const savedCompany = localStorage.getItem('authenticated_company');
    if (savedCompany) {
      setCompanyId(savedCompany);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCompanyId('');
    setPassword('');
    localStorage.removeItem('authenticated_company');
  };

  const findSynergies = async () => {
    // Get current company data
    let myCompany = {};
    try {
      const raw = localStorage.getItem(`company_${companyId}`) || '{}';
      myCompany = JSON.parse(raw);
    } catch (e) {
      myCompany = {};
    }

    if (!myCompany.lookingForSynergies) {
      setError('Aktivera "Vi söker synergier" i din profil först');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    // Find all other companies
    const allCompanies = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('company_') && !key.includes(companyId)) {
        let data;
        try {
          data = JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
          continue;
        }
        if (data.lookingForSynergies && data.companyName) {
          allCompanies.push({
            ...data,
            id: key.replace('company_', '')
          });
        }
      }
    }

    if (allCompanies.length === 0) {
      setError('Inga andra företag hittades som söker synergier. Kontakta DG97 för att lägga till fler företag.');
      setIsAnalyzing(false);
      return;
    }

    try {
      // Call AI analysis API
      const response = await fetch('/api/synergies/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          myCompany,
          otherCompanies: allCompanies,
        }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte analysera synergier');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        setError('Kunde inte läsa svaret från servern. Försök igen.');
        return;
      }

      if (data.success && data.synergies) {
        setPotentialSynergies(data.synergies);
        setShowSynergyFinder(true);
      } else {
        setError('Kunde inte hitta synergier. Försök igen senare.');
      }
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Synergy analysis error:', error);
      }
      setError('Fel vid analys av synergier. Försök igen senare.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConnect = async (company) => {
    setSelectedCompany(company);
    setConnectionMessage(`Hej ${company.companyName}! Vi skulle gärna utforska synergier med er baserat på vår AI-analys.`);
    setShowConnectionModal(true);
  };

  const sendConnectionRequest = async () => {
    if (!selectedCompany || !connectionMessage.trim()) {
      setError('Meddelande krävs');
      return;
    }

    try {
      const response = await fetch('/api/synergies/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCompanyId: companyId,
          toCompanyId: selectedCompany.id,
          message: connectionMessage,
          synergyType: selectedCompany.synergies?.[0] || 'Generellt samarbete',
        }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte skicka förfrågan');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        setError('Kunde inte läsa svaret från servern. Försök igen.');
        return;
      }

      // Store connection locally
      let connections;
      try {
        connections = JSON.parse(localStorage.getItem('company_connections') || '[]');
      } catch (parseError) {
        connections = [];
      }
      connections.push(data.connection);
      localStorage.setItem('company_connections', JSON.stringify(connections));

      setConnectionSuccess(true);
      setTimeout(() => {
        setShowConnectionModal(false);
        setConnectionSuccess(false);
        setConnectionMessage('');
        setSelectedCompany(null);
      }, 2000);
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Connection error:', error);
      }
      setError('Kunde inte skicka förfrågan. Försök igen.');
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout
        title="Företagsportal | DG97 Kontorshotell"
        description="Logga in för att hantera ditt företags profil"
        path="/foretagsportal"
      >
        <section className="min-h-screen py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50/20 relative">
          <SectionBackground variant="light" intensity="subtle" />

          <div className="max-w-md mx-auto px-4 relative z-10">
            <div className="card-gradient p-8 shadow-xl bg-white">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="heading-2 mb-2">Företagsportal</h1>
                <p className="text-gray-600">Logga in för att hantera din företagsprofil och hitta synergier med AI</p>
              </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6" autoComplete="on">
                  <div>
                    <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                      Företags-ID
                    </label>
                    <input
                      type="text"
                      id="companyId"
                      name="companyId"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      placeholder="T.ex. foretag1"
                      className="input-field"
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Lösenord
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ange lösenord"
                      className="input-field"
                      required
                      autoComplete="current-password"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Tips: Använd "dg97" som lösenord för demo
                    </p>
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Logga in
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Behöver du hjälp? Kontakta{' '}
                    <a href="mailto:hej@dg97.se" className="text-primary-600 hover:underline">
                      hej@dg97.se
                    </a>
                  </p>
                </div>
              </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      title="Företagsportal - AI-Driven Synergy Finder | DG97"
      description="Hantera ditt företags profil och låt vår AI-agent hitta synergier med andra företag på DG97. Anslut, samarbeta och väx tillsammans."
      path="/foretagsportal"
    >
      {/* Hero Section */}
      <PageHero
        title="Företagsportal"
        subtitle="Hantera din företagsprofil och låt AI hitta synergier"
        animationVariant="particles"
        actions={
          <button
            onClick={handleLogout}
            className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Logga ut
          </button>
        }
      />

      {/* Main Content */}
      <section className="section-container bg-white min-h-screen py-12 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <StaggerReveal>
            {/* Quick Actions */}
            <StaggerChild>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <motion.button
                  onClick={() => setShowSynergyFinder(false)}
                  className="card-gradient p-6 text-left hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  aria-label="Visa min profil"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Min Profil</h3>
                  <p className="text-sm text-gray-600">Redigera företagsinformation</p>
                </motion.button>

                <motion.button
                  onClick={findSynergies}
                  disabled={isAnalyzing}
                  className="card-gradient p-6 text-left hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={isAnalyzing ? {} : { scale: 1.02, y: -2 }}
                  aria-label={isAnalyzing ? 'AI analyserar synergier...' : 'Hitta synergier med AI-agent'}
                  aria-busy={isAnalyzing}
                >
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                    {isAnalyzing ? (
                      <svg className="w-6 h-6 text-accent-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">🤖 Hitta Synergier</h3>
                  <p className="text-sm text-gray-600">{isAnalyzing ? 'AI analyserar...' : 'AI-agent hittar matchningar'}</p>
                </motion.button>

                <motion.div
                  className="card-gradient p-6 text-left"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Statistik</h3>
                  <p className="text-sm text-gray-600">Kommer snart...</p>
                </motion.div>
              </div>
            </StaggerChild>

            {/* Profile or Synergy Finder */}
            <StaggerChild>
              {!showSynergyFinder ? (
                <CompanyProfile
                  companyId={companyId}
                  isEditable={true}
                  onSave={() => setError('')}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-gradient p-6 md:p-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="heading-3 mb-2" id="synergies-title">🤖 AI-Analyserade Synergier</h2>
                      <p className="text-sm text-gray-600">Hittade {potentialSynergies.length} potentiella matchningar</p>
                    </div>
                    <button
                      onClick={() => setShowSynergyFinder(false)}
                      className="btn-ghost text-sm"
                      aria-label="Gå tillbaka till profil"
                    >
                      ← Tillbaka
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                      {error}
                    </div>
                  )}

                  {potentialSynergies.length > 0 ? (
                    <div className="space-y-6">
                      {potentialSynergies.map((company, index) => (
                        <motion.div
                          key={company.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card-gradient p-6 border-2 border-transparent hover:border-primary-200 transition-all"
                          role="article"
                          aria-labelledby={`company-${company.id}-name`}
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="heading-4 mb-1" id={`company-${company.id}-name`}>
                                    {company.companyName}
                                  </h3>
                                  {company.industry && (
                                    <span className="badge-primary text-xs">{company.industry}</span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-accent-600 mb-1">
                                    {company.matchScore}%
                                  </div>
                                  <span className="text-xs text-gray-500">AI Match</span>
                                </div>
                              </div>

                              {company.description && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                  {company.description}
                                </p>
                              )}

                              {/* AI Analysis */}
                              {company.aiAnalysis && (
                                <div className="bg-primary-50 rounded-lg p-4 mb-4 border-l-4 border-primary-500">
                                  <div className="flex items-start gap-2 mb-2">
                                    <span className="text-xl">🤖</span>
                                    <p className="text-sm text-gray-700 font-medium">AI-analys:</p>
                                  </div>
                                  <p className="text-sm text-gray-600 italic">{company.aiAnalysis}</p>
                                </div>
                              )}

                              {/* Match Reasons */}
                              {company.reasons && company.reasons.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">Matchningsskäl:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {company.reasons.slice(0, 3).map((reason, idx) => (
                                      <span key={idx} className="badge-primary text-xs">
                                        {reason}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Synergies */}
                              {company.synergies && company.synergies.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">Synergimöjligheter:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {company.synergies.map((synergy, idx) => (
                                      <span key={idx} className="badge-accent text-xs">
                                        {synergy}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Synergy Interests */}
                              {company.synergyInterests && company.synergyInterests.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">Intressen:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {company.synergyInterests.map(interest => (
                                      <span key={interest} className="badge-accent text-xs">
                                        {interest}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleConnect(company)}
                              className="btn-primary text-sm"
                              aria-label={`Knyt an med ${company.companyName} och skicka förfrågan`}
                            >
                              🤝 Knyt an & Skicka förfrågan
                            </button>
                            {company.email && (
                              <a
                                href={`mailto:${company.email}?subject=Synergi-förfrågan från ${companyId}&body=Hej! Vi skulle gärna utforska synergier med er.`}
                                className="btn-secondary text-sm"
                              >
                                📧 Skicka e-post
                              </a>
                            )}
                            {company.linkedin && (
                              <a
                                href={company.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary text-sm"
                              >
                                💼 LinkedIn
                              </a>
                            )}
                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost text-sm"
                              >
                                🌐 Webbplats
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-2">Inga matchande företag hittades</p>
                      <p className="text-sm text-gray-500">
                        Se till att du har aktiverat "Vi söker synergier" i din profil
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </StaggerChild>

            {/* Help Section */}
            <StaggerChild>
              <div className="mt-12 card-gradient p-6">
                <h3 className="heading-4 mb-3">💡 Tips för bästa synergier</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Fyll i så mycket information som möjligt för att AI-agenten ska hitta bättre matchningar
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Aktivera "Visa företagsprofil publikt" för att synas på hemsidan och öka synligheten
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Uppdatera regelbundet vilka synergier ni söker - AI-agenten använder denna information för matchning
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Använd "Knyt an"-funktionen för att skicka personliga förfrågningar baserade på AI-analysen
                  </li>
                </ul>
              </div>
            </StaggerChild>
          </StaggerReveal>
        </div>
      </section>

      {/* Connection Modal */}
      <AnimatePresence>
        {showConnectionModal && selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !connectionSuccess && setShowConnectionModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="connection-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-gradient p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {connectionSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="heading-3 mb-2 text-green-600">Förfrågan skickad!</h3>
                  <p className="text-gray-600">Din anslutningsförfrågan har skickats till {selectedCompany.companyName}.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="heading-3" id="connection-modal-title">Knyt an med {selectedCompany.companyName}</h2>
                    <button
                      onClick={() => setShowConnectionModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Stäng modal"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {selectedCompany.aiAnalysis && (
                    <div className="bg-primary-50 rounded-lg p-4 mb-6 border-l-4 border-primary-500">
                      <p className="text-sm font-semibold text-gray-900 mb-2">🤖 AI-analys:</p>
                      <p className="text-sm text-gray-700">{selectedCompany.aiAnalysis}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="connection-message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Meddelande till {selectedCompany.companyName}:
                      </label>
                      <textarea
                        id="connection-message"
                        name="connection-message"
                        value={connectionMessage}
                        onChange={(e) => setConnectionMessage(e.target.value)}
                        rows={6}
                        className="input-field w-full"
                        placeholder="Skriv ditt meddelande här..."
                        aria-label={`Meddelande till ${selectedCompany.companyName}`}
                        aria-required="true"
                      />
                    </div>

                    {selectedCompany.synergies && selectedCompany.synergies.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Föreslagna synergier:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.synergies.map((synergy, idx) => (
                            <span key={idx} className="badge-accent text-sm">
                              {synergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={sendConnectionRequest}
                        className="btn-primary flex-1"
                        disabled={!connectionMessage.trim()}
                        aria-label="Skicka anslutningsförfrågan"
                      >
                        Skicka förfrågan
                      </button>
                      <button
                        onClick={() => setShowConnectionModal(false)}
                        className="btn-ghost"
                        aria-label="Avbryt och stäng modal"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

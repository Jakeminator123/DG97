import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

function CookiePacman() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span aria-hidden="true" className="text-2xl leading-none">
        🍪
      </span>
    );
  }

  return (
    <div aria-hidden="true" className="relative w-12 h-6">
      <div className="absolute inset-0 flex items-center justify-between px-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className={`cookie-dot cookie-dot-${i}`} />
        ))}
      </div>

      <div className="pac-wrap">
        <div className="pacman" />
      </div>

      <style jsx>{`
        .cookie-dot {
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(75, 91, 156, 0.55);
          transform: translateZ(0);
          will-change: opacity, transform;
          animation: dotEat 2.4s linear infinite;
        }

        .cookie-dot-0 {
          animation-delay: 0.2s;
        }
        .cookie-dot-1 {
          animation-delay: 0.45s;
        }
        .cookie-dot-2 {
          animation-delay: 0.7s;
        }
        .cookie-dot-3 {
          animation-delay: 0.95s;
        }
        .cookie-dot-4 {
          animation-delay: 1.2s;
        }
        .cookie-dot-5 {
          animation-delay: 1.45s;
        }

        .pac-wrap {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate3d(0, -50%, 0);
          will-change: transform;
          animation: pacMove 2.4s linear infinite;
        }

        .pacman {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: conic-gradient(
            from 20deg,
            #fbbf24 0 320deg,
            transparent 320deg 360deg
          );
          transform: translateZ(0);
          position: relative;
        }

        .pacman::after {
          content: "";
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 9999px;
          background: rgba(17, 24, 39, 0.8);
          top: 3px;
          left: 6px;
        }

        @keyframes pacMove {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          100% {
            transform: translate3d(34px, -50%, 0);
          }
        }

        @keyframes dotEat {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          15% {
            opacity: 0;
            transform: scale(0.6);
          }
          100% {
            opacity: 0;
            transform: scale(0.6);
          }
        }
      `}</style>
    </div>
  );
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Alltid aktiverade
    analytics: false,
    marketing: false,
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Kolla om användaren redan har gjort ett val
    const consent = localStorage.getItem("dg97_cookie_consent");
    if (!consent) {
      // Visa banner efter en kort fördröjning
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    if (typeof window === "undefined") return;

    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("dg97_cookie_consent", JSON.stringify(allAccepted));
    setShowBanner(false);
    window.dispatchEvent(new Event("dg97:cookie-consent"));

    // Här kan du aktivera Google Analytics, Facebook Pixel etc.
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Cookies accepted:", allAccepted);
    }
  };

  const acceptNecessary = () => {
    if (typeof window === "undefined") return;

    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("dg97_cookie_consent", JSON.stringify(necessaryOnly));
    setShowBanner(false);
    window.dispatchEvent(new Event("dg97:cookie-consent"));
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Only necessary cookies accepted");
    }
  };

  const savePreferences = () => {
    if (typeof window === "undefined") return;

    localStorage.setItem("dg97_cookie_consent", JSON.stringify(preferences));
    setShowBanner(false);
    window.dispatchEvent(new Event("dg97:cookie-consent"));
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Custom preferences saved:", preferences);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {!showDetails ? (
                // Simple view
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <CookiePacman />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Vi använder cookies 🍪
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Vi använder cookies för att förbättra din upplevelse på
                        vår webbplats. Vissa cookies är nödvändiga för att
                        webbplatsen ska fungera, medan andra hjälper oss att
                        förstå hur du använder sidan.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <button
                        onClick={() => setShowDetails(true)}
                        className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors whitespace-nowrap text-sm"
                      >
                        Anpassa
                      </button>
                      <button
                        onClick={acceptNecessary}
                        className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base"
                      >
                        Endast nödvändiga
                      </button>
                      <button
                        onClick={acceptAll}
                        className="px-5 py-2.5 sm:px-6 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base"
                      >
                        Acceptera alla
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Detailed view
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Anpassa cookies
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Välj vilka typer av cookies du vill tillåta
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Necessary Cookies */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Nödvändiga cookies
                          </h4>
                          <p className="text-sm text-gray-600">
                            Dessa cookies är nödvändiga för att webbplatsen ska
                            fungera och kan inte stängas av.
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded-full">
                            Alltid aktiv
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Analyscookies
                          </h4>
                          <p className="text-sm text-gray-600">
                            Hjälper oss förstå hur besökare använder webbplatsen
                            genom att samla in anonym statistik.
                          </p>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                analytics: !preferences.analytics,
                              })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              preferences.analytics
                                ? "bg-primary-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.analytics
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Marknadsföringscookies
                          </h4>
                          <p className="text-sm text-gray-600">
                            Används för att visa relevant marknadsföring och
                            mäta effektivitet av våra kampanjer.
                          </p>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                marketing: !preferences.marketing,
                              })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              preferences.marketing
                                ? "bg-primary-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.marketing
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Tillbaka
                    </button>
                    <button
                      onClick={savePreferences}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Spara inställningar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

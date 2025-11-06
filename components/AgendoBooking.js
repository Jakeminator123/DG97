import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * AgendoBooking Component
 * Renders Agendo booking widget button wherever placed
 * The actual button is injected by Agendo's script
 */
export default function AgendoBooking({
  variant = "default",
  className = "",
  showLabel = true,
  labelText = "Boka visning online",
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Agendo script is loaded
    const checkAgendoLoaded = () => {
      if (window.Agendo || document.querySelector(".agendo-button")) {
        setIsLoaded(true);
      }
    };

    // Check immediately
    checkAgendoLoaded();

    // Also check after a delay in case script loads later
    const timer = setTimeout(checkAgendoLoaded, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Ensure injected iframe has accessible title/label
  useEffect(() => {
    const setIframeA11y = () => {
      const iframe = document.querySelector(
        "#agendo-iframe, .agendo-button-container iframe, iframe[src*='agendo']"
      );
      if (iframe) {
        if (!iframe.getAttribute("title")) {
          iframe.setAttribute("title", "Agendo booking widget");
        }
        if (!iframe.getAttribute("aria-label")) {
          iframe.setAttribute("aria-label", "Agendo booking widget");
        }
      }
    };

    // Initial attempt
    setIframeA11y();

    // Observe container for dynamically injected iframe
    const container = document.querySelector(".agendo-button-container");
    if (!container) return;
    const observer = new MutationObserver(() => setIframeA11y());
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const getVariantClasses = () => {
    switch (variant) {
      case "hero":
        return "agendo-hero-button scale-110";
      case "inline":
        return "agendo-inline-button";
      case "cta":
        return "agendo-cta-button";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`agendo-wrapper ${className}`}
    >
      {showLabel && (
        <div className="text-center mb-3">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
            {labelText}
          </span>
        </div>
      )}

      {/* Agendo will inject the booking button here */}
      <div className={`agendo-button-container ${getVariantClasses()}`}></div>

      {/* Fallback while loading */}
      {!isLoaded && (
        <div className="text-center py-3">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">Laddar bokningssystem...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

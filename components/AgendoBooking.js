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
      // Try multiple selectors to catch all possible iframe locations
      const selectors = [
        "#agendo-iframe",
        ".agendo-button-container iframe",
        "iframe[src*='agendo']",
        "iframe[src*='booking.agendo.io']",
        ".agendo-widget iframe",
        "iframe[id*='agendo']",
      ];

      let found = false;
      selectors.forEach(selector => {
        try {
          const iframes = document.querySelectorAll(selector);
          iframes.forEach(iframe => {
            if (!iframe.getAttribute("title")) {
              iframe.setAttribute("title", "Agendo booking widget - Boka visning online");
            }
            if (!iframe.getAttribute("aria-label")) {
              iframe.setAttribute("aria-label", "Agendo booking widget - Boka visning online");
            }
            found = true;
          });
        } catch (e) {
          // Ignore selector errors
        }
      });
      return found;
    };

    // Initial attempts with delays
    setIframeA11y();
    const timeout1 = setTimeout(setIframeA11y, 500);
    const timeout2 = setTimeout(setIframeA11y, 1500);
    const timeout3 = setTimeout(setIframeA11y, 3000);

    // Observe entire document for dynamically injected iframes
    const observer = new MutationObserver(() => {
      setIframeA11y();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also observe container specifically
    const container = document.querySelector(".agendo-button-container");
    let containerObserver = null;
    
    if (container) {
      containerObserver = new MutationObserver(() => {
        setIframeA11y();
      });
      containerObserver.observe(container, { childList: true, subtree: true });
    }

    // Always return cleanup function to prevent memory leaks
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      observer.disconnect();
      if (containerObserver) {
        containerObserver.disconnect();
      }
    };
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

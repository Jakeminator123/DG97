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

      {!isLoaded && (
        <p className="text-center py-3 text-gray-700">Du kan boka en visning genom att <a href="mailto:hej@dg97.se" className="underline">mejla oss</a> eller ringa <a href="tel:+46708862279" className="underline">070-886 22 79</a>.</p>
      )}
    </motion.div>
  );
}

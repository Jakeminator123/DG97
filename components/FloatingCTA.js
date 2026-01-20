import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const rafRef = useRef(0);
  const hasShownRef = useRef(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const checkConsent = () => {
      if (typeof window === "undefined") return false;
      return Boolean(localStorage.getItem("dg97_cookie_consent"));
    };

    setHasConsent(checkConsent());

    const handleConsentEvent = () => {
      setHasConsent(checkConsent());
    };

    const showCTA = () => {
      if (!hasShownRef.current) {
        hasShownRef.current = true;
        setIsVisible(true);
      }
    };

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        const scrolled = window.scrollY > 300;
        if (scrolled !== scrolledRef.current) {
          scrolledRef.current = scrolled;
        }

        // Show after scroll once
        if (scrolled) {
          showCTA();
        }
      });
    };

    // Show after 3 seconds even without scroll
    const timer = setTimeout(showCTA, 3000);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("storage", handleConsentEvent);
    window.addEventListener("dg97:cookie-consent", handleConsentEvent);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleConsentEvent);
      window.removeEventListener("dg97:cookie-consent", handleConsentEvent);
      clearTimeout(timer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && hasConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-24 right-6 z-[90] w-auto max-w-[calc(100%-2rem)]"
        >
          <Link href="/kontakt">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 sm:px-6 py-3 rounded-full shadow-2xl hover:bg-primary-700 transition-colors text-base sm:text-lg font-semibold cursor-pointer"
            >
              <span className="text-lg">💬</span>
              <span className="hidden sm:inline">
                Ledigt kontor? Boka visning!
              </span>
              <span className="sm:hidden">Boka visning!</span>
              <span className="animate-pulse">→</span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

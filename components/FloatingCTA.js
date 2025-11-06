import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setHasScrolled(scrolled);

      // Show after 3 seconds OR when scrolled down
      if (scrolled) {
        setIsVisible(true);
      }
    };

    // Show after 3 seconds even without scroll
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-45 md:bottom-20 w-[calc(100%-2rem)] max-w-md md:w-auto"
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

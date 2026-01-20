import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(true); // Start with true to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const getShouldReduceMotion = () => {
      const isMobile = window.innerWidth < 768;
      const connection = navigator.connection;
      const slowConnection = Boolean(
        connection &&
          (connection.saveData ||
            connection.effectiveType === 'slow-2g' ||
            connection.effectiveType === '2g')
      );
      const lowEndDevice = Boolean(
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
          (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
      );

      return mediaQuery.matches || isMobile || slowConnection || lowEndDevice;
    };

    const handleChange = () => {
      setShouldReduceMotion(getShouldReduceMotion());
    };

    handleChange();

    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleChange);
    if (navigator.connection?.addEventListener) {
      navigator.connection.addEventListener('change', handleChange);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleChange);
      if (navigator.connection?.removeEventListener) {
        navigator.connection.removeEventListener('change', handleChange);
      }
    };
  }, []);

  // Return true during SSR and initial client render to prevent hydration mismatch
  return !isClient || shouldReduceMotion;
}

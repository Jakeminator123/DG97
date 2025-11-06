import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(true); // Start with true to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check user preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = mediaQuery.matches;

    // Check connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection;
      // Reduce animations on slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        reducedMotion = true;
      }
    }

    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      reducedMotion = true;
    }

    setShouldReduceMotion(reducedMotion);

    const handleChange = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setShouldReduceMotion(mediaQuery.matches || isMobile);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  // Return true during SSR and initial client render to prevent hydration mismatch
  return !isClient || shouldReduceMotion;
}

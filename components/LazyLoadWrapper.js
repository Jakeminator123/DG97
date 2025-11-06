import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

export function LazyLoadWrapper({ children, threshold = 0.1 }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return (
    <div ref={setRef}>
      {isIntersecting ? children : <div style={{ minHeight: '200px' }} />}
    </div>
  );
}

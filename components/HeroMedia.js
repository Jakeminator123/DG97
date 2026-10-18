import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const connection = navigator.connection;
    const saveData = Boolean(connection?.saveData);
    const slow = Boolean(connection && ['slow-2g', '2g'].includes(connection.effectiveType));
    if (!reduce && !mobile && !saveData && !slow) setPlayVideo(true);
  }, []);

  return (
    <div className="hero-visual absolute inset-0 overflow-hidden" aria-hidden={!playVideo}>
      <Image
        src="/images/hero_reception_ekta_1600x900.jpg"
        alt="Ljus reception på DG97 Kontorshotell, Drottninggatan 97"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {playVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/hero_reception_ekta_1600x900.jpg"
          aria-hidden="true"
        >
          <source src="/videos/dg97-hero.mp4" type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}

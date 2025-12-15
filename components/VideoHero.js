import Image from "next/image";
import { useEffect, useState } from "react";
import { getHeroImageProps } from "../lib/images";
import LogoLoader from "./animations/LogoLoader";
import { MagneticButton } from "./animations/MagneticButton";

export default function VideoHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(true);

  // Fallback image props
  const fallbackImageProps = getHeroImageProps("office_room.jpg");

  useEffect(() => {
    setIsClient(true);

    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = window.innerWidth < 768;
    const isSlowConnection =
      typeof navigator !== 'undefined' &&
      navigator.connection &&
      (navigator.connection.effectiveType === "slow-2g" ||
        navigator.connection.effectiveType === "2g");

    setShouldReduceMotion(mediaQuery.matches || isMobile || isSlowConnection);
  }, []);

  // Always render static version on server and initial client render
  if (!isClient || shouldReduceMotion) {
    // Use static image for mobile/reduced motion
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/office_room.jpg"
            alt={fallbackImageProps.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-5 drop-shadow-lg shimmer-text float-text leading-tight"
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 25px rgba(79, 120, 180, 0.35)",
              background:
                "linear-gradient(135deg, #f5f9ff 0%, #dbeafe 35%, #c7d2fe 60%, #f5f9ff 100%)",
              backgroundSize: "220% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Eget kontorsrum mitt i Stockholm
          </h1>

          <p
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto drop-shadow-md font-light px-2 float-text"
            style={{
              letterSpacing: "0.015em",
              color: "rgba(244, 247, 255, 0.92)",
              textShadow: "0 2px 12px rgba(62, 99, 160, 0.35)",
            }}
          >
            Flexibla kontorsrum för startups från{" "}
            <span
              className="font-semibold"
              style={{
                color: "#e0ecff",
                textShadow:
                  "0 0 18px rgba(147, 197, 253, 0.6), 0 2px 10px rgba(44, 82, 130, 0.35)",
              }}
            >
              4 990 kr/mån
            </span>{" "}
            <span className="font-normal">- allt inkluderat</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <MagneticButton
              href="/kontakt"
              className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-2xl text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 w-full sm:w-auto font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
              style={{
                boxShadow:
                  "0 10px 40px rgba(59, 130, 246, 0.4), 0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              Boka gratis visning idag →
            </MagneticButton>

            <MagneticButton
              href="/om-oss"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white/20 hover:border-white/80 shadow-xl text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 w-full sm:w-auto font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
              style={{
                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2)",
              }}
            >
              Läs mer om oss
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  // Full video version for desktop (only after client hydration)
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Fallback image until video loads */}
      {!videoLoaded && (
        <>
          <div className="absolute inset-0">
            <Image
              src="/images/office_room.jpg"
              alt={fallbackImageProps.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          {/* Show logo loader while video is loading */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <LogoLoader size={120} variant="breathe" speed={3} />
          </div>
        </>
      )}

      {/* Video background - WebM first (smaller), MP4 fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => setVideoLoaded(true)} // Fallback if video fails
        preload="metadata"
        aria-hidden="true"
        role="presentation"
      >
        {/* WebM version - modern browsers, better compression */}
        <source src="/images/DG97-mars.webm" type="video/webm" />
        {/* MP4 fallback - Safari and older browsers */}
        <source src="/images/DG97-mars.mp4" type="video/mp4" />
        {/* Fallback message for browsers without video support */}
        Din webbläsare stöder inte video.
      </video>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content with enhanced animations */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 drop-shadow-lg shimmer-text leading-tight opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]"
          style={{
            fontFamily: "'Poppins', 'Inter', sans-serif",
            fontWeight: "900",
            letterSpacing: "-0.03em",
            textShadow:
              "0 4px 30px rgba(0,0,0,0.4), 0 10px 60px rgba(0,0,0,0.3)",
            background:
              "linear-gradient(135deg, #ffffff 0%, #dbeafe 40%, #bfdbfe 60%, #ffffff 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation:
              "gradientShift 15s ease-in-out infinite, fadeInUp 0.8s ease-out 0.2s forwards",
            opacity: 0,
          }}
        >
          Eget kontorsrum mitt i Stockholm
        </h1>

        <p
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 mb-6 sm:mb-8 max-w-3xl mx-auto drop-shadow-md font-light px-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]"
          style={{
            letterSpacing: "0.02em",
            textShadow: "0 2px 15px rgba(0,0,0,0.4)",
          }}
        >
          Flexibla kontorsrum för startups från{" "}
          <span
            className="font-bold text-primary-200"
            style={{
              textShadow:
                "0 0 20px rgba(147, 197, 253, 0.8), 0 2px 15px rgba(0,0,0,0.4)",
            }}
          >
            4 990 kr/mån
          </span>{" "}
          <span className="font-normal">- allt inkluderat</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
          <MagneticButton
            href="/kontakt"
            className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-2xl text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 w-full sm:w-auto font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
            style={{
              boxShadow:
                "0 10px 40px rgba(59, 130, 246, 0.4), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            Boka gratis visning idag →
          </MagneticButton>

          <MagneticButton
            href="/om-oss"
            className="bg-white/10 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white/20 hover:border-white/80 shadow-xl text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 w-full sm:w-auto font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
            style={{
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2)",
            }}
          >
            Läs mer om oss
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

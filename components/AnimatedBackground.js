import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRouter } from "next/router";

/**
 * Optimized AnimatedBackground Component
 * Lightweight version with CSS animations instead of heavy framer-motion
 * Reduces bundle size significantly while maintaining visual appeal
 */
export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  // Pages where we should NOT show animated background
  const excludedPages = ['/foretagsportal', '/admin'];
  const shouldShowBackground = !excludedPages.includes(router.pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on excluded pages or if motion should be reduced
  if (!mounted || !shouldShowBackground || shouldReduceMotion) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-primary-50/50 to-primary-50/40" />

      {/* Additional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-50/30 to-transparent mix-blend-multiply" />

      {/* Simplified animated orbs using CSS animations */}
      <div className="absolute inset-0">
        {/* Large orb */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(75, 91, 156, 0.08) 0%, rgba(75, 91, 156, 0.03) 50%, transparent 70%)",
            filter: "blur(40px)",
            top: "-20%",
            left: "-10%",
            animation: "float-orb-1 30s ease-in-out infinite",
          }}
        />

        {/* Medium orb */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)",
            filter: "blur(30px)",
            bottom: "-10%",
            right: "-5%",
            animation: "float-orb-2 25s ease-in-out infinite 2s",
          }}
        />

        {/* Small orb */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 50%, transparent 70%)",
            filter: "blur(25px)",
            top: "40%",
            left: "30%",
            animation: "float-orb-3 22s ease-in-out infinite 4s",
          }}
        />
      </div>

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.1) 100%)",
        }}
      />

      {/* Soft edges */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(100px, -50px) scale(1.1); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-60px, 40px) scale(1.05); }
        }
        @keyframes float-orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -25px) scale(1.03); }
          66% { transform: translate(-40px, 25px) scale(0.98); }
        }
      `}</style>
    </div>
  );
}

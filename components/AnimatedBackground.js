import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRouter } from "next/router";

/**
 * AnimatedBackground Component
 * Creates a subtle, harmonious animated background with soft blue gradients
 * that creates smooth transitions between sections
 *
 * Excludes certain pages like foretagsportal to prevent performance issues
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
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ willChange: 'auto' }}>
      {/* Base gradient layer - MUCH MORE VISIBLE blue tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-primary-50/50 to-primary-50/40" />

      {/* Additional gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-50/30 to-transparent mix-blend-multiply" />

      {/* Animated orbs for subtle movement - Reduced intensity */}
      <div className="absolute inset-0" style={{ willChange: 'transform' }}>
        {/* Large slow-moving orb */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(75, 91, 156, 0.08) 0%, rgba(75, 91, 156, 0.03) 50%, transparent 70%)",
            filter: "blur(40px)",
            top: "-20%",
            left: "-10%",
            willChange: "transform",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Medium moving orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)",
            filter: "blur(30px)",
            bottom: "-10%",
            right: "-5%",
            willChange: "transform",
          }}
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Small floating orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 50%, transparent 70%)",
            filter: "blur(25px)",
            top: "40%",
            left: "30%",
            willChange: "transform",
          }}
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -25, 25, 0],
            scale: [1, 1.03, 0.98, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Accent orb for color variation */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 197, 253, 0.08) 0%, rgba(167, 139, 250, 0.03) 50%, transparent 70%)",
            filter: "blur(35px)",
            top: "60%",
            right: "20%",
            willChange: "transform",
          }}
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 30, -15, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Subtle noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      />

      {/* Soft vignette effect for edge smoothing */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.1) 100%)",
        }}
      />

      {/* Soft edges for smooth transitions to white sections */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />

      {/* Moving gradient bands for additional fluidity (safer animation) */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.02) 25%, transparent 50%, rgba(99, 102, 241, 0.02) 75%, transparent 100%)",
            backgroundSize: "100% 200%",
            backgroundPositionY: "0%",
            willChange: "background-position",
          }}
          animate={{
            backgroundPositionY: ["0%", "100%", "0%"],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

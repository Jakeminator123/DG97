import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Animated background pattern component for sections
 * OPTIMIZED: Uses GPU-friendly transforms, pauses when offscreen, respects reduced motion
 * Creates subtle floating elements similar to gallery
 */

export default function SectionBackground({
  variant = "light",
  intensity = "subtle",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "200px" });
  const shouldReduceMotion = useReducedMotion();

  const getColors = () => {
    switch (variant) {
      case "dark":
        return {
          primary: "rgba(255, 255, 255, 0.05)",
          secondary: "rgba(255, 255, 255, 0.03)",
        };
      case "blue":
        return {
          primary: "rgba(59, 130, 246, 0.08)",
          secondary: "rgba(147, 197, 253, 0.06)",
        };
      default: // light
        return {
          primary: "rgba(75, 91, 156, 0.04)",
          secondary: "rgba(59, 130, 246, 0.025)",
        };
    }
  };

  const colors = getColors();
  const elementCount = intensity === "strong" ? 8 : 5;

  // Use deterministic values instead of Math.random() to avoid hydration errors
  const elements = useMemo(() => {
    const positions = [
      { w: 120, h: 140, l: 10, t: 20 },
      { w: 180, h: 160, l: 70, t: 10 },
      { w: 100, h: 100, l: 30, t: 60 },
      { w: 150, h: 130, l: 85, t: 40 },
      { w: 110, h: 140, l: 50, t: 30 },
      { w: 140, h: 120, l: 20, t: 70 },
      { w: 160, h: 180, l: 60, t: 80 },
      { w: 90, h: 110, l: 40, t: 15 },
    ];
    return positions.slice(0, elementCount);
  }, [elementCount]);

  // Don't animate if reduced motion or not in view
  const shouldAnimate = !shouldReduceMotion && isInView;

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none -z-10">
      {/* Floating geometric shapes - OPTIMIZED: Reduced blur, GPU-accelerated transforms */}
      {elements.map((pos, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            width: `${pos.w}px`,
            height: `${pos.h}px`,
            left: `${pos.l}%`,
            top: `${pos.t}%`,
            background: i % 2 === 0 ? colors.primary : colors.secondary,
            borderRadius: i % 3 === 0 ? "50%" : "20%",
            // Reduced blur for better performance (was 40px)
            filter: shouldAnimate ? "blur(20px)" : "blur(20px)",
            willChange: shouldAnimate ? "transform" : "auto",
          }}
          initial={{ opacity: 0.25 }}
          animate={shouldAnimate ? {
            x: [0, 8, -5, 0],
            y: [0, -10, 5, 0],
            scale: [1, 1.02, 1], // Reduced scale change
            opacity: [0.25, 0.28, 0.25], // Reduced opacity change
          } : { opacity: 0.25 }}
          transition={shouldAnimate ? {
            duration: 50 + i * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 5,
          } : {}}
        />
      ))}

      {/* Subtle gradient waves - OPTIMIZED: Only animates when in view */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: `linear-gradient(135deg, transparent, ${colors.primary}, transparent)`,
          willChange: shouldAnimate ? "opacity" : "auto",
        }}
        initial={{ opacity: 0.05 }}
        animate={shouldAnimate ? {
          opacity: [0.05, 0.1, 0.05], // Reduced opacity range
        } : { opacity: 0.05 }}
        transition={shouldAnimate ? {
          duration: 50,
          repeat: Infinity,
          ease: "easeInOut",
        } : {}}
      />

      {/* Rotating light beams - OPTIMIZED: Only when in view and not reduced motion */}
      {intensity === "strong" && shouldAnimate && (
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${colors.secondary}, transparent)`,
            opacity: 0.2, // Reduced opacity
            willChange: "transform",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}

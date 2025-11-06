import { motion } from "framer-motion";

/**
 * Animated background pattern component for sections
 * Creates subtle floating elements similar to gallery
 */
import { useMemo } from "react";

export default function SectionBackground({
  variant = "light",
  intensity = "subtle",
}) {
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

  return (
    <div className="absolute inset-0 pointer-events-none -z-10" style={{ willChange: 'auto' }}>
      {/* Floating geometric shapes */}
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
            filter: "blur(40px)",
            willChange: "transform",
          }}
          initial={{ opacity: 0.25 }}
          animate={{
            x: [0, 8, -5, 0],
            y: [0, -10, 5, 0],
            scale: [1, 1.03, 1],
            opacity: [0.25, 0.3, 0.25],
          }}
          transition={{
            duration: 50 + i * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 5,
          }}
        />
      ))}

      {/* Subtle gradient waves */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: `linear-gradient(135deg, transparent, ${colors.primary}, transparent)`,
          willChange: "opacity",
        }}
        initial={{ opacity: 0.05 }}
        animate={{
          opacity: [0.05, 0.12, 0.05],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Rotating light beams */}
      {intensity === "strong" && (
        <>
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${colors.secondary}, transparent)`,
              opacity: 0.3,
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
        </>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/**
 * AwardBadge - Animated award badge with subtle movements
 *
 * Usage:
 *   <AwardBadge size={250} variant="float" />
 *
 * Variants: 'float' | 'pulse' | 'glow'
 */
export default function AwardBadge({
  size = 200,
  variant = "float",
  className = "",
  showCaption = true,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const badgeVariants = {
    float: {
      y: [0, -6, 0],
      scale: [1, 1.015, 1],
      transition: {
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    glow: {
      filter: [
        "drop-shadow(0 0 10px rgba(147,197,253,0.45))",
        "drop-shadow(0 0 22px rgba(99,102,241,0.55))",
        "drop-shadow(0 0 10px rgba(147,197,253,0.45))",
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const hoverVariant = {
    scale: 1.1,
    rotate: isHovered ? 5 : 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  };

  // Image animation variants
  const imgAnimate = {
    float: {
      y: [0, -5, 0],
      scale: [1, 1.01, 1],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    glow: {
      filter: [
        "drop-shadow(0 0 10px rgba(147,197,253,0.45))",
        "drop-shadow(0 0 22px rgba(99,102,241,0.55))",
        "drop-shadow(0 0 10px rgba(147,197,253,0.45))",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const imgTransition = {
    duration: 0.5,
    ease: "easeInOut",
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        className="relative cursor-pointer"
        style={{ width: size, height: size * 1.1 }}
        animate={variant}
        variants={badgeVariants}
        whileHover={hoverVariant}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Subtle background glow */}
        <motion.div
          className="absolute inset-0 blur-xl opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(147,197,253,0.45) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Award image (optimized) */}
        <motion.div className="relative z-10 w-full h-full" variants={imgAnimate} animate={variant} transition={imgTransition}>
          <div className="relative w-full h-full">
            <Image
              src="/images/coworking_award.png"
              alt="Årets Coworking finalist 2023"
              fill
              sizes="(max-width: 768px) 60vw, 200px"
              priority={false}
              draggable={false}
              style={{ objectFit: "contain", filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.15))" }}
            />
          </div>
        </motion.div>

        {/* Sparkle effect on hover */}
        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${20 + i * 25}%`,
                  left: `${15 + i * 30}%`,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "rgba(191, 219, 254, 0.85)",
                  boxShadow: "0 0 12px rgba(147, 197, 253, 0.7)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Optional caption */}
      {showCaption && (
        <motion.p
          className="mt-4 text-center text-sm font-medium text-gray-700 max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Finalist i Årets Coworking Awards Stockholm 2023
        </motion.p>
      )}
    </div>
  );
}

// Export also as named export for index.js
export { AwardBadge };

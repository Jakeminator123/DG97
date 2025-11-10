import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Animated DG97 Logo with morphing effect
export function AnimatedLogo({ size = 100, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Always provide valid d attributes
  const dPath = "M 20 20 L 20 100 L 50 100 Q 80 100 80 60 Q 80 20 50 20 L 20 20";
  const gPath = "M 140 40 Q 140 20 110 20 Q 90 20 90 40 L 90 80 Q 90 100 110 100 Q 140 100 140 80 L 140 60 L 120 60";

  return (
    <motion.svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 120"
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient animation */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <motion.stop
            offset="0%"
            animate={{
              stopColor: isHovered ? "#5573b9" : "#4B5B9C",
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.stop
            offset="100%"
            animate={{
              stopColor: isHovered ? "#293356" : "#3a4779",
            }}
            transition={{ duration: 0.3 }}
          />
        </linearGradient>
      </defs>

      {/* D letter */}
      <motion.path
        d={dPath}
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isMounted ? {
          pathLength: 1,
          opacity: 1,
          transition: {
            pathLength: { duration: 1.5, ease: "easeInOut" },
            opacity: { duration: 0.3 },
          },
        } : { pathLength: 1, opacity: 1 }}
      />

      {/* G letter */}
      <motion.path
        d={gPath}
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isMounted ? {
          pathLength: 1,
          opacity: 1,
          transition: {
            pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
            opacity: { duration: 0.3, delay: 0.5 },
          },
        } : { pathLength: 1, opacity: 1 }}
      />

      {/* 97 numbers with cool effect */}
      <motion.text
        x="150"
        y="70"
        fill="url(#logoGradient)"
        fontSize="40"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            duration: 0.5,
            delay: 1.5,
            type: "spring",
            stiffness: 200,
          },
        }}
      >
        97
      </motion.text>

      {/* Hover effect particles */}
      {isHovered &&
        [...Array(5)].map((_, i) => {
          // Use deterministic positions based on index to avoid hydration errors
          const angleStep = (Math.PI * 2) / 5;
          const angle = angleStep * i;
          const radius = 50;
          const xPos = 100 + Math.cos(angle) * radius;
          const yPos = 60 + Math.sin(angle) * radius;

          return (
            <motion.circle
              key={i}
              r="2"
              fill="#ff6b6b"
              initial={{
                x: 100,
                y: 60,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: xPos,
                y: yPos,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          );
        })}
    </motion.svg>
  );
}

// Minimal text version with typewriter effect
export function AnimatedLogoText({ className = "" }) {
  const text = "DG97";

  return (
    <motion.div className={`font-bold ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          className="inline-block"
          style={{ color: "#4B5B9C" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Morphing logo that transforms between shapes
export function MorphingLogo({ className = "" }) {
  const [shape, setShape] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shapes = [
    // Square
    "M 20 20 L 180 20 L 180 100 L 20 100 Z",
    // Circle-ish
    "M 100 20 Q 180 20 180 60 Q 180 100 100 100 Q 20 100 20 60 Q 20 20 100 20",
    // Star-ish
    "M 100 20 L 120 60 L 180 60 L 130 90 L 150 100 L 100 80 L 50 100 L 70 90 L 20 60 L 80 60 Z",
  ];

  // Ensure shape is always valid
  const currentShape = shapes[shape] || shapes[0];

  // Ensure currentShape is never undefined
  const safeShape = currentShape || shapes[0];

  return (
    <motion.svg
      width="200"
      height="120"
      viewBox="0 0 200 120"
      className={className}
      onClick={() => setShape((shape + 1) % shapes.length)}
      style={{ cursor: "pointer" }}
    >
      <motion.path
        d={safeShape}
        fill="#4B5B9C"
        initial={{ d: safeShape }}
        animate={isMounted && shape > 0 ? { d: safeShape } : { d: safeShape }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <text
        x="100"
        y="65"
        textAnchor="middle"
        fill="white"
        fontSize="36"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        DG97
      </text>
    </motion.svg>
  );
}

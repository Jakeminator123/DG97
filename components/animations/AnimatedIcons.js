import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Animated Building Icon
export function BuildingIcon({ size = 60, className = "" }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? false : "visible"}
      whileHover={shouldReduceMotion ? false : "hover"}
    >
      {/* Building base */}
      <motion.rect
        x="20"
        y="30"
        width="60"
        height="65"
        fill="#4B5B9C"
        variants={
          shouldReduceMotion
            ? {}
            : {
                hidden: { scaleY: 0, originY: "95px" },
                visible: {
                  scaleY: 1,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }
        }
      />

      {/* Windows that light up */}
      {[...Array(12)].map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <motion.rect
            key={i}
            x={30 + col * 15}
            y={40 + row * 15}
            width="10"
            height="10"
            fill={shouldReduceMotion ? "#FFD700" : "#FFD700"}
            variants={
              shouldReduceMotion
                ? {}
                : {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: [0, 1, 0.3],
                      transition: {
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3,
                      },
                    },
                    hover: {
                      opacity: 1,
                      fill: "#ff6b6b",
                    },
                  }
            }
          />
        );
      })}

      {/* Door */}
      <motion.rect
        x="42"
        y="75"
        width="16"
        height="20"
        fill="#293356"
        variants={
          shouldReduceMotion
            ? {}
            : {
                hover: { scaleX: 1.2, originX: "50px" },
              }
        }
      />
    </motion.svg>
  );
}

// Animated Coffee Cup
export function CoffeeIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      whileHover="hover"
    >
      {/* Cup */}
      <motion.path
        d="M 30 40 L 35 70 L 65 70 L 70 40 Z"
        fill="#4B5B9C"
        stroke="#293356"
        strokeWidth="2"
        variants={{
          hover: { scale: 1.1, originX: "50px", originY: "55px" },
        }}
      />

      {/* Handle */}
      <motion.path
        d="M 70 50 Q 80 50 80 60 Q 80 70 70 70"
        fill="none"
        stroke="#293356"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Steam */}
      {[0, 1, 2].map((i) => {
        // Pre-compute path values to ensure they're always defined
        const x1 = 40 + i * 10;
        const x2 = 42 + i * 10;
        const x3 = 38 + i * 10;
        const y1 = 35;
        const y2 = 30;
        const y3 = 25;
        const y4 = 20;
        const y5 = 15;

        // Ensure path is always valid
        const path = `M ${x1} ${y1} Q ${x2} ${y2} ${x1} ${y3} Q ${x3} ${y4} ${x1} ${y5}`;

        return (
          <motion.path
            key={i}
            d={path}
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="2"
            opacity="0.6"
            initial={{ y: 0 }}
            animate={{
              y: [-5, -10, -5],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </motion.svg>
  );
}

// Animated WiFi Icon
export function WiFiIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* WiFi waves */}
      {[0, 1, 2].map((i) => {
        // Pre-compute path values to ensure they're always defined
        const x1 = 30 - i * 10;
        const y1 = 60 - i * 10;
        const cx = 50;
        const cy = 50 - i * 15;
        const x2 = 70 + i * 10;
        const y2 = 60 - i * 10;

        // Ensure path is always valid
        const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

        return (
          <motion.path
            key={i}
            d={path}
            fill="none"
            stroke="#4B5B9C"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1, 1.2],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* Router dot */}
      <motion.circle
        cx="50"
        cy="75"
        r="5"
        fill="#ff6b6b"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />
    </motion.svg>
  );
}

// Animated Conference Room Icon
export function ConferenceIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      whileHover="hover"
    >
      {/* Table */}
      <motion.rect x="20" y="50" width="60" height="8" fill="#4B5B9C" rx="4" />

      {/* Chairs */}
      {[25, 40, 55, 70].map((x, i) => (
        <motion.g key={i}>
          <motion.rect
            x={x - 5}
            y="45"
            width="10"
            height="15"
            fill="#5573b9"
            rx="2"
            variants={{
              hover: {
                y: -5,
                transition: {
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 300,
                },
              },
            }}
          />
          <motion.rect x={x - 3} y="60" width="6" height="10" fill="#293356" />
        </motion.g>
      ))}

      {/* Presentation screen */}
      <motion.rect
        x="35"
        y="20"
        width="30"
        height="20"
        fill="#293356"
        stroke="#4B5B9C"
        strokeWidth="2"
        variants={{
          hover: {
            fill: "#ff6b6b",
          },
        }}
      />

      {/* Screen content */}
      <motion.path
        d="M 40 25 L 50 35 L 60 28"
        stroke="white"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    </motion.svg>
  );
}

// Animated Phone Booth Icon
export function PhoneBoothIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Booth */}
      <motion.rect
        x="25"
        y="20"
        width="50"
        height="70"
        fill="#4B5B9C"
        stroke="#293356"
        strokeWidth="2"
        rx="5"
      />

      {/* Phone */}
      <motion.path
        d="M 40 45 Q 35 40 35 35 Q 35 30 40 30 L 60 30 Q 65 30 65 35 Q 65 40 60 45 L 55 50 Q 50 55 45 50 Z"
        fill="#ff6b6b"
        animate={{
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ originX: "50px", originY: "40px" }}
      />

      {/* Sound waves */}
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="40"
          r="15"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.5],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 1,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.svg>
  );
}

// Animated Reception Icon
export function ReceptionIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Desk */}
      <rect x="20" y="60" width="60" height="20" fill="#4B5B9C" />

      {/* Person */}
      <motion.g
        animate={{
          x: [0, 2, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Head */}
        <circle cx="50" cy="35" r="8" fill="#5573b9" />
        {/* Body */}
        <path
          d="M 50 43 L 50 60 M 40 50 L 60 50"
          stroke="#5573b9"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Bell */}
      <motion.circle
        cx="70"
        cy="55"
        r="5"
        fill="#ff6b6b"
        whileHover={{
          scale: [1, 1.3, 1],
          transition: { duration: 0.3 },
        }}
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </motion.svg>
  );
}

// Animated Lock Icon
export function LockIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      whileHover="hover"
    >
      {/* Lock body */}
      <motion.rect
        x="30"
        y="45"
        width="40"
        height="35"
        fill="#4B5B9C"
        rx="5"
        variants={{
          hover: { scale: 1.05 },
        }}
      />

      {/* Shackle */}
      <motion.path
        d="M 40 45 V 35 Q 40 25 50 25 Q 60 25 60 35 V 45"
        fill="none"
        stroke="#293356"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ d: "M 40 45 V 35 Q 40 25 50 25 Q 60 25 60 35 V 45" }}
        variants={{
          hover: {
            d: "M 40 45 V 30 Q 40 20 50 20 Q 60 20 60 30 V 45",
          },
        }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Keyhole */}
      <motion.circle
        cx="50"
        cy="60"
        r="4"
        fill="#293356"
        variants={{
          hover: { fill: "#ff6b6b" },
        }}
      />
      <motion.rect
        x="48"
        y="60"
        width="4"
        height="10"
        fill="#293356"
        variants={{
          hover: { fill: "#ff6b6b" },
        }}
      />
    </motion.svg>
  );
}

// Animated Printer Icon
export function PrinterIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Printer body */}
      <rect x="20" y="40" width="60" height="30" fill="#4B5B9C" rx="5" />

      {/* Paper tray */}
      <rect x="25" y="25" width="50" height="20" fill="#e0e0e0" />

      {/* Printing paper */}
      <motion.rect
        x="30"
        y="30"
        width="40"
        height="50"
        fill="white"
        stroke="#293356"
        strokeWidth="1"
        initial={{ y: 30 }}
        animate={{
          y: [30, 50, 50, 30],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          times: [0, 0.3, 0.7, 1],
        }}
      />

      {/* Status light */}
      <motion.circle
        cx="70"
        cy="50"
        r="3"
        fill="#ff6b6b"
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />
    </motion.svg>
  );
}

// Animated Briefcase Icon
export function BriefcaseIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      whileHover="hover"
    >
      {/* Briefcase body */}
      <motion.rect
        x="20"
        y="40"
        width="60"
        height="40"
        fill="#4B5B9C"
        rx="5"
        variants={{
          hover: { scale: 1.05 },
        }}
      />

      {/* Handle */}
      <motion.path
        d="M 40 40 V 30 Q 40 25 45 25 L 55 25 Q 60 25 60 30 V 40"
        fill="none"
        stroke="#293356"
        strokeWidth="3"
        strokeLinecap="round"
        variants={{
          hover: {
            y: -3,
            transition: { type: "spring", stiffness: 300 },
          },
        }}
      />

      {/* Lock/Clasp */}
      <motion.rect
        x="45"
        y="55"
        width="10"
        height="8"
        fill="#ff6b6b"
        rx="2"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />

      {/* Papers flying out */}
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={35 + i * 10}
          y="35"
          width="8"
          height="10"
          fill="white"
          stroke="#293356"
          strokeWidth="1"
          initial={{ y: 35, opacity: 0 }}
          animate={{
            y: [35, 20, 35],
            opacity: [0, 1, 0],
            rotate: [-10 + i * 10, 10 - i * 10, -10 + i * 10],
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </motion.svg>
  );
}

// Animated Handshake Icon
export function HandshakeIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      whileHover="hover"
    >
      {/* Left hand */}
      <motion.path
        d="M 20 50 Q 30 40 40 45 L 50 50"
        fill="#5573b9"
        stroke="#293356"
        strokeWidth="2"
        initial={{ d: "M 20 50 Q 30 40 40 45 L 50 50" }}
        variants={{
          hover: {
            d: "M 20 50 Q 30 35 40 40 L 50 45",
          },
        }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Right hand */}
      <motion.path
        d="M 80 50 Q 70 40 60 45 L 50 50"
        fill="#4B5B9C"
        stroke="#293356"
        strokeWidth="2"
        initial={{ d: "M 80 50 Q 70 40 60 45 L 50 50" }}
        variants={{
          hover: {
            d: "M 80 50 Q 70 35 60 40 L 50 45",
          },
        }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Connection lines */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={50}
          cy={50 - i * 10}
          r="2"
          fill="#ff6b6b"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.svg>
  );
}

// Animated Lightbulb Icon
export function LightbulbIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Bulb */}
      <motion.path
        d="M 50 20 Q 30 20 30 40 Q 30 55 40 60 L 40 70 L 60 70 L 60 60 Q 70 55 70 40 Q 70 20 50 20"
        fill="#FFD700"
        stroke="#293356"
        strokeWidth="2"
        animate={{
          fill: ["#FFD700", "#FFF", "#FFD700"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />

      {/* Base */}
      <rect x="42" y="70" width="16" height="10" fill="#4B5B9C" />

      {/* Light rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
          key={i}
          x1="50"
          y1="40"
          x2={50 + 25 * Math.cos((angle * Math.PI) / 180)}
          y2={40 + 25 * Math.sin((angle * Math.PI) / 180)}
          stroke="#ff6b6b"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{ originX: "50px", originY: "40px" }}
        />
      ))}
    </motion.svg>
  );
}

// Animated Lightning Icon
export function LightningIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Lightning bolt */}
      <motion.path
        d="M 60 10 L 30 50 L 45 50 L 40 90 L 70 40 L 55 40 Z"
        fill="#ff6b6b"
        stroke="#293356"
        strokeWidth="2"
        initial={{ pathLength: 0, fill: "rgba(255, 107, 107, 0)" }}
        animate={{
          pathLength: [0, 1, 1],
          fill: ["rgba(255, 107, 107, 0)", "rgba(255, 107, 107, 0)", "#ff6b6b"],
        }}
        transition={{
          duration: 1,
          times: [0, 0.6, 1],
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />

      {/* Energy particles */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={40 + i * 10}
          cy={50}
          r="3"
          fill="#FFD700"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [-10, 10, -10],
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.svg>
  );
}

// Animated Globe Icon
export function GlobeIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Globe */}
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="#4B5B9C"
        strokeWidth="2"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Meridians */}
      <motion.ellipse
        cx="50"
        cy="50"
        rx="15"
        ry="30"
        fill="none"
        stroke="#5573b9"
        strokeWidth="1"
        animate={{
          scaleX: [1, 0.3, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Parallels */}
      <line x1="20" y1="50" x2="80" y2="50" stroke="#5573b9" strokeWidth="1" />
      <path
        d="M 30 35 Q 50 30 70 35"
        fill="none"
        stroke="#5573b9"
        strokeWidth="1"
      />
      <path
        d="M 30 65 Q 50 70 70 65"
        fill="none"
        stroke="#5573b9"
        strokeWidth="1"
      />

      {/* Connection dots */}
      {[
        { x: 65, y: 35 },
        { x: 35, y: 40 },
        { x: 55, y: 60 },
        { x: 40, y: 65 },
      ].map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r="3"
          fill="#ff6b6b"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.svg>
  );
}

// Animated Document Icon
export function DocumentIcon({ size = 60, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      whileHover="hover"
    >
      {/* Paper */}
      <motion.path
        d="M 25 10 L 25 90 L 75 90 L 75 30 L 55 10 Z"
        fill="#f3f4f6"
        stroke="#4B5B9C"
        strokeWidth="2"
        variants={{
          hover: { scale: 1.05 },
        }}
      />

      {/* Folded corner */}
      <motion.path
        d="M 55 10 L 55 30 L 75 30"
        fill="#e5e7eb"
        stroke="#4B5B9C"
        strokeWidth="2"
        initial={{ d: "M 55 10 L 55 30 L 75 30" }}
        variants={{
          hover: {
            d: "M 55 10 L 55 35 L 75 30",
          },
        }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Text lines */}
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x="35"
          y={40 + i * 12}
          width={i === 3 ? 20 : 30}
          height="3"
          fill="#5573b9"
          rx="1.5"
          initial={{ scaleX: 0, originX: "35px" }}
          animate={{
            scaleX: 1,
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: "easeOut",
          }}
          variants={{
            hover: {
              scaleX: 1.1,
              fill: "#ff6b6b",
            },
          }}
        />
      ))}

      {/* Pen */}
      <motion.g
        animate={{
          x: [0, 5, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <line
          x1="65"
          y1="70"
          x2="70"
          y2="65"
          stroke="#ff6b6b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <polygon points="70,65 72,63 68,59" fill="#ff6b6b" />
      </motion.g>
    </motion.svg>
  );
}

const PlaceholderIcon = ({ size = 60, className = "" }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    className={className}
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <circle
      cx="30"
      cy="30"
      r="28"
      fill="none"
      stroke="#d1d5db"
      strokeWidth="2"
      strokeDasharray="6 6"
    />
    <motion.line
      x1="18"
      y1="18"
      x2="42"
      y2="42"
      stroke="#9ca3af"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1,
      }}
    />
    <motion.line
      x1="42"
      y1="18"
      x2="18"
      y2="42"
      stroke="#9ca3af"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        delay: 0.2,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    />
  </motion.svg>
);

// Export all icons
export const AnimatedIcons = {
  Building: BuildingIcon,
  Coffee: CoffeeIcon,
  WiFi: WiFiIcon,
  Conference: ConferenceIcon,
  PhoneBooth: PhoneBoothIcon,
  Reception: ReceptionIcon,
  Lock: LockIcon,
  Printer: PrinterIcon,
  Briefcase: BriefcaseIcon,
  Handshake: HandshakeIcon,
  Lightbulb: LightbulbIcon,
  Lightning: LightningIcon,
  Globe: GlobeIcon,
  Document: DocumentIcon,
  Placeholder: PlaceholderIcon,
};

export function getAnimatedIcon(name) {
  if (!name) {
    return PlaceholderIcon;
  }

  const IconComponent = AnimatedIcons[name];

  if (!IconComponent) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[AnimatedIcons] Unknown icon "${name}" – using placeholder.`
      );
    }
    return PlaceholderIcon;
  }

  return IconComponent;
}

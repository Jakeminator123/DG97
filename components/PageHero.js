import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { FadeIn } from "./animations";

const DEFAULT_SHAPES = [
  { left: "5%", top: "10%" },
  { left: "85%", top: "20%" },
  { left: "15%", top: "70%" },
  { left: "75%", top: "60%" },
];

// Animation variant configurations
const ANIMATION_VARIANTS = {
  // Default: rotating squares (original)
  default: {
    getAnimation: (i, shouldReduceMotion) => {
      if (shouldReduceMotion) return undefined;
      return {
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      };
    },
    getTransition: (i) => ({
      duration: 20 + i * 5,
      repeat: Infinity,
      ease: "linear",
    }),
  },
  // Orbs: floating circular shapes with gentle movement
  orbs: {
    getAnimation: (i, shouldReduceMotion) => {
      if (shouldReduceMotion) return undefined;
      return {
        x: [0, 15, -10, 0],
        y: [0, -20, 10, 0],
        scale: [1, 1.15, 0.95, 1],
        opacity: [0.1, 0.15, 0.08, 0.1],
      };
    },
    getTransition: (i) => ({
      duration: 15 + i * 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 2,
    }),
    getShapeClass: () => "rounded-full",
  },
  // Waves: horizontal flowing movement
  waves: {
    getAnimation: (i, shouldReduceMotion) => {
      if (shouldReduceMotion) return undefined;
      return {
        x: [0, 30, -20, 0],
        y: [0, 5, -5, 0],
        rotate: [0, 5, -5, 0],
      };
    },
    getTransition: (i) => ({
      duration: 12 + i * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 1.5,
    }),
    getShapeClass: () => "rounded-lg",
  },
  // Particles: small, fast-moving dots
  particles: {
    getAnimation: (i, shouldReduceMotion) => {
      if (shouldReduceMotion) return undefined;
      // Use deterministic values based on index to avoid hydration mismatch
      const seedX = (i * 7) % 40 - 20;
      const seedY = (i * 11) % 40 - 20;
      return {
        x: [0, seedX, 0],
        y: [0, seedY, 0],
        scale: [0.8, 1.2, 0.8],
        opacity: [0.08, 0.18, 0.08],
      };
    },
    getTransition: (i) => ({
      duration: 8 + i * 1.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.5,
    }),
    getShapeClass: () => "rounded-full",
    getShapeSize: () => "w-24 h-24",
  },
  // Pulse: breathing effect
  pulse: {
    getAnimation: (i, shouldReduceMotion) => {
      if (shouldReduceMotion) return undefined;
      return {
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.2, 0.1],
      };
    },
    getTransition: (i) => ({
      duration: 4 + i * 0.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.8,
    }),
    getShapeClass: () => "rounded-lg",
  },
};

const DEFAULT_TITLE_STYLE = {
  letterSpacing: "-0.025em",
  textShadow: "0 4px 28px rgba(36, 60, 115, 0.5)",
  background:
    "linear-gradient(135deg, #f6faff 0%, #e4ecff 45%, #c7d8ff 75%, #f6faff 100%)",
  backgroundSize: "220% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const DEFAULT_SUBTITLE_STYLE = {
  letterSpacing: "0.02em",
  textShadow: "0 2px 16px rgba(40, 58, 105, 0.4)",
};

/**
 * Shared top-of-page hero section (blue gradient + subtle animated shapes).
 * Keep this as the single source of truth for page heading styling.
 */
export default function PageHero({
  title,
  subtitle,
  kicker,
  actions,
  children,
  variant = "br",
  minHeight = true,
  showShapes = true,
  shapes = DEFAULT_SHAPES,
  shapesOpacityClassName = "opacity-10",
  animationVariant = "default", // New prop: "default" | "orbs" | "waves" | "particles" | "pulse"
  backgroundImage = "/images/hero_reception_ekta_1600x900.jpg",
  backgroundImageOpacity = 0.18,
  showBackgroundImage = true,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  const gradientClassName =
    variant === "r"
      ? "bg-gradient-to-r from-primary-500 to-primary-600"
      : "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700";

  // Get animation config for selected variant
  const animConfig = ANIMATION_VARIANTS[animationVariant] || ANIMATION_VARIANTS.default;
  const getShapeClass = animConfig.getShapeClass || (() => "rounded-lg");
  const getShapeSize = animConfig.getShapeSize || (() => "w-32 h-32");

  return (
    <section
      className={[
        "relative",
        gradientClassName,
        "text-white",
        "py-20",
        "overflow-hidden",
        minHeight ? "min-h-[60vh] flex items-center" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showBackgroundImage && backgroundImage ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover hero-bg-animate"
            style={{ opacity: backgroundImageOpacity }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/70 via-primary-700/70 to-primary-800/70" />
        </div>
      ) : null}

      {showShapes && (
        <div
          className="absolute inset-0 z-[5]"
          aria-hidden="true"
        >
          {shapes.map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${getShapeSize()} bg-white ${shapesOpacityClassName} ${getShapeClass()} pointer-events-none`}
              style={{ left: pos.left, top: pos.top }}
              animate={animConfig.getAnimation(i, shouldReduceMotion)}
              transition={
                shouldReduceMotion
                  ? undefined
                  : animConfig.getTransition(i)
              }
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          className={[
            actions
              ? "flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
              : "text-center",
            "max-w-4xl mx-auto",
          ].join(" ")}
        >
          <div className={actions ? "text-left" : ""}>
            {kicker ? <div className="mb-6">{kicker}</div> : null}

            <h1 className="heading-hero text-white mb-5 no-shimmer" style={DEFAULT_TITLE_STYLE}>
              {title}
            </h1>

            {subtitle ? (
              <FadeIn delay={0.2}>
                <p
                  className={[
                    "text-lead",
                    "text-white/90",
                    "font-light",
                    actions ? "" : "max-w-3xl mx-auto",
                  ].join(" ")}
                  style={DEFAULT_SUBTITLE_STYLE}
                >
                  {subtitle}
                </p>
              </FadeIn>
            ) : null}

            {children ? <div className="mt-10">{children}</div> : null}
          </div>

          {actions ? <div className="flex-shrink-0">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}



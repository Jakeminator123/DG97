import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { FadeIn } from "./animations";

const DEFAULT_SHAPES = [
  { left: "5%", top: "10%" },
  { left: "85%", top: "20%" },
  { left: "15%", top: "70%" },
  { left: "75%", top: "60%" },
];

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
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  const gradientClassName =
    variant === "r"
      ? "bg-gradient-to-r from-primary-500 to-primary-600"
      : "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700";

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
      {showShapes && (
        <div
          className="absolute inset-0 z-0"
          aria-hidden="true"
        >
          {shapes.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-white opacity-10 rounded-lg pointer-events-none"
              style={{ left: pos.left, top: pos.top }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 20 + i * 5,
                      repeat: Infinity,
                      ease: "linear",
                    }
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
                    "text-lg sm:text-xl md:text-2xl",
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



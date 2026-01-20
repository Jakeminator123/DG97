import { motion } from 'framer-motion';

/**
 * LogoLoader - Animated DG97 logo for loading states
 *
 * Usage:
 *   <LogoLoader size={200} variant="spin" speed={8} />
 *
 * Variants: 'spin' | 'pendulum' | 'breathe'
 */
export default function LogoLoader({
  size = 180,
  variant = 'breathe',
  speed = 6,
  className = '',
}) {
  const ringThickness = Math.max(4, Math.round(size * 0.08));

  // Different animation variants
  const imgAnimate =
    variant === 'spin'
      ? { rotate: 360 }
      : variant === 'pendulum'
      ? { rotate: [-8, 8, -8] }
      : { scale: [1, 1.05, 1] };

  const imgTransition =
    variant === 'spin'
      ? { repeat: Infinity, duration: speed, ease: 'linear' }
      : { repeat: Infinity, duration: speed, ease: 'easeInOut' };

  return (
    <div
      className={`relative grid place-items-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Rotating gradient ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(75,91,156,0.9) 0deg, rgba(75,91,156,0.3) 100deg, rgba(75,91,156,0.1) 220deg, rgba(75,91,156,0.3) 320deg, rgba(75,91,156,0.9) 360deg)',
          WebkitMask: `radial-gradient(circle, transparent calc(50% - ${ringThickness}px), #000 calc(50% - ${ringThickness}px))`,
          mask: `radial-gradient(circle, transparent calc(50% - ${ringThickness}px), #000 calc(50% - ${ringThickness}px))`,
        }}
        animate={{ rotate: variant === 'breathe' ? 0 : -360 }}
        transition={{
          repeat: Infinity,
          duration: speed * 1.2,
          ease: 'linear'
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(75,91,156,0.4) 0%, rgba(75,91,156,0.1) 55%, transparent 70%)',
        }}
      />

      {/* Logo image */}
      <motion.img
        src="/images/LOGGA2-min.jpg"
        alt="DG97 logga"
        className="relative z-10 object-contain rounded-xl shadow-2xl"
        style={{
          width: size - ringThickness * 2.4,
          height: size - ringThickness * 2.4,
        }}
        animate={imgAnimate}
        transition={imgTransition}
        draggable={false}
      />

    </div>
  );
}

// Export also as named export for index.js
export { LogoLoader };


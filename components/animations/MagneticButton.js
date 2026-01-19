import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function MagneticButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary',
  href,
  ...props 
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Reduced magnetic effect for better performance
  const magneticStrength = shouldReduceMotion ? 0 : 0.1;
  const xSpring = useTransform(x, (value) => value / 4);
  const ySpring = useTransform(y, (value) => value / 4);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || shouldReduceMotion) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * magneticStrength);
    y.set(distanceY * magneticStrength);
  }, [magneticStrength, shouldReduceMotion, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const baseClasses = "relative overflow-hidden cursor-pointer";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    outline: "btn-outline",
    ghost: "btn-ghost"
  };

  const { type, ...restProps } = props;
  const isLink = typeof href === 'string' && href.length > 0;
  const ButtonComponent = isLink ? motion.a : motion.button;
  const resolvedVariant = variantClasses[variant] || variantClasses.primary;
  const componentProps = {
    className: `${baseClasses} ${resolvedVariant} ${className}`,
    ...(isLink
      ? { href, ...restProps }
      : { type: type || 'button', onClick, ...restProps }),
  };

  if (isLink && restProps.target === '_blank' && !restProps.rel) {
    componentProps.rel = 'noopener noreferrer';
  }

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
    >
      {isLink ? (
        <Link href={href} passHref legacyBehavior>
          <ButtonComponent
            {...componentProps}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            style={{ willChange: 'transform' }}
          >
            {/* Background animation - OPTIMIZED: Uses transform instead of x for GPU acceleration */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
                initial={{ transform: 'translateX(-100%)', opacity: 0 }}
                animate={isHovered ? { transform: 'translateX(100%)', opacity: 1 } : { transform: 'translateX(-100%)', opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ willChange: 'transform, opacity' }}
              />
            )}

            {/* Ripple effect on click - OPTIMIZED: Only when not reduced motion */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  willChange: 'transform, opacity',
                }}
              />
            )}

            {/* Button content */}
            <span className="relative z-10">{children}</span>
          </ButtonComponent>
        </Link>
      ) : (
        <ButtonComponent
          {...componentProps}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
          style={{ willChange: 'transform' }}
        >
          {/* Background animation - OPTIMIZED: Uses transform instead of x for GPU acceleration */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
              initial={{ transform: 'translateX(-100%)', opacity: 0 }}
              animate={isHovered ? { transform: 'translateX(100%)', opacity: 1 } : { transform: 'translateX(-100%)', opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ willChange: 'transform, opacity' }}
            />
          )}

          {/* Ripple effect on click - OPTIMIZED: Only when not reduced motion */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                willChange: 'transform, opacity',
              }}
            />
          )}

          {/* Button content */}
          <span className="relative z-10">{children}</span>
        </ButtonComponent>
      )}
    </motion.div>
  );
}

// Variant with glow effect
export function GlowButton({ children, onClick, className = '', variant = 'primary' }) {
  const glowColors = {
    primary: 'radial-gradient(circle at center, #4B5B9C 0%, transparent 70%)',
    secondary: 'radial-gradient(circle at center, #ff6b6b 0%, transparent 70%)',
    accent: 'radial-gradient(circle at center, #f97316 0%, transparent 70%)'
  };

  const buttonColors = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white'
  };

  return (
    <motion.button
      className={`relative px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${buttonColors[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: glowColors[variant],
          filter: 'blur(20px)',
          opacity: 0.5,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

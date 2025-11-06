import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

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
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const xSpring = useTransform(x, (value) => value / 3);
  const ySpring = useTransform(y, (value) => value / 3);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.15);
    y.set(distanceY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const baseClasses = "relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 font-semibold text-sm md:text-base rounded-xl transition-all duration-300 overflow-hidden cursor-pointer";
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/30",
    secondary: "bg-white text-primary-600 border-2 border-primary-200 shadow-md hover:bg-primary-50 hover:border-primary-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-500/30",
    accent: "bg-gradient-to-r from-secondary-500 to-accent-500 text-white shadow-lg hover:from-secondary-600 hover:to-accent-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg focus:outline-none focus:ring-4 focus:ring-secondary-500/30",
    outline: "bg-transparent text-primary-600 border-2 border-primary-300 hover:bg-primary-600 hover:text-white hover:border-primary-600 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-primary-500/30",
    ghost: "text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 focus:outline-none focus:ring-4 focus:ring-primary-500/30"
  };

  const ButtonComponent = href ? 'a' : motion.button;
  const buttonProps = href ? { href } : { onClick, ...props };

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
    >
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        whileTap={{ scale: 0.95 }}
        {...buttonProps}
      >
        {/* Background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
          initial={{ x: '-100%', opacity: 0 }}
          animate={isHovered ? { x: '100%', opacity: 1 } : { x: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Button content */}
        <span className="relative z-10">{children}</span>
      </motion.div>
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

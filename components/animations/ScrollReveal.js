import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function ScrollReveal({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.8,
  y = 50,
  once = true 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade in from different directions
export function FadeIn({ 
  children, 
  direction = 'up', 
  className = '',
  delay = 0,
  duration = 0.8,
  once = true
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const directions = {
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
  };

  const { x, y } = directions[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale reveal
export function ScaleReveal({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.8,
  once = true 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children reveal
export function StaggerReveal({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  once = true 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// For use with StaggerReveal
export function StaggerChild({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Blur reveal
export function BlurReveal({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.8,
  once = true 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={
        isInView 
          ? { opacity: 1, filter: 'blur(0px)' }
          : { opacity: 0, filter: 'blur(20px)' }
      }
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Text reveal line by line
export function TextReveal({ text, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const lines = text.split('\n');

  return (
    <div ref={ref} className={className}>
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.1,
            ease: "easeOut",
          }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveAgent, agentSettings } from '../config/did-agents';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function DIDAvatar({ isOpen, onClose }) {
  const shouldReduceMotion = useReducedMotion();
  const agent = getActiveAgent();
  const { position, variant, sizes, glassmorphism, shadow, rounded } = agentSettings;

  // Auto-close on mobile if not allowed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen && !agentSettings.showOnMobile && window.innerWidth < 768) {
      onClose();
    }
  }, [isOpen, onClose]);

  if (!agent || !agent.url) return null;

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // Base classes
  const baseClasses = `fixed ${positionClasses[position]} z-[100] overflow-hidden`;
  
  // Size classes - removed dynamic Tailwind classes, using inline styles instead
  const sizeClasses = variant === 'fullscreen' ? 'inset-0' : '';
  
  // Style classes
  const styleClasses = [
    glassmorphism && 'bg-white/10 backdrop-blur-md border border-white/20',
    shadow && 'shadow-2xl',
    rounded && (variant === 'bubble' ? 'rounded-full' : 'rounded-2xl'),
  ].filter(Boolean).join(' ');

  // Animation variants
  const animationVariants = {
    hidden: shouldReduceMotion 
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0.8,
          y: variant === 'fullscreen' ? 100 : 20,
        },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: 'easeOut',
      },
    },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0.8,
          y: variant === 'fullscreen' ? 100 : 20,
          transition: {
            duration: 0.3,
            ease: 'easeIn',
          },
        },
  };

  // Build iframe URL with parameters
  const iframeSrc = `${agent.url}&autoplay=1&mute=1${variant === 'bubble' ? '&compact=1' : ''}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for fullscreen mode */}
          {variant === 'fullscreen' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[99]"
              onClick={onClose}
            />
          )}
          
          {/* Avatar Container */}
          <motion.div
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${baseClasses} ${sizeClasses} ${styleClasses}`}
            style={variant !== 'fullscreen' ? {
              width: sizes[variant].width,
              height: sizes[variant].height,
            } : {}}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Stäng videoassistent"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Agent info overlay */}
            <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur rounded-lg px-3 py-1.5">
              <p className="text-white text-sm font-medium">{agent.name}</p>
            </div>

            {/* D-ID iframe */}
            <iframe
              src={iframeSrc}
              allow="autoplay; microphone; camera; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full h-full"
              style={{ border: 0 }}
              title={`${agent.name} (videochatt)`}
              aria-label={`Videochatt med ${agent.name}. ${agent.description || ''}`.trim()}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

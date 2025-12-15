import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveAgent, agentSettings } from '../config/did-agents';

// Lazy load avatar för bättre prestanda
const DIDAvatar = dynamic(() => import('./DIDAvatar'), {
  ssr: false,
  loading: () => null
});

export default function DIDController() {
  const [isOpen, setIsOpen] = useState(false);
  const [showController, setShowController] = useState(true);
  const agent = getActiveAgent();

  // Auto-open efter delay
  useEffect(() => {
    if (agentSettings.autoOpenDelay > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, agentSettings.autoOpenDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Kolla om vi ska visa på denna enhet
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && !agentSettings.showOnMobile) {
        setShowController(false);
      } else if (!isMobile && !agentSettings.showOnDesktop) {
        setShowController(false);
      } else {
        setShowController(true);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!showController || !agent) return null;

  // Floating action button
  const fabPosition = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed ${fabPosition[agentSettings.position]} z-50`}
          >
            {/* Pulse animation för uppmärksamhet */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-75" />

              {/* Main button */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label={`Öppna ${agent.name}`}
              >
                {/* Chat icon */}
                <svg
                  className="w-8 h-8 text-white group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>

                {/* Video icon overlay */}
                <svg
                  className="absolute bottom-0 right-0 w-5 h-5 text-white bg-secondary-500 rounded-full p-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-sm py-1 px-3 rounded-lg whitespace-nowrap">
                  {agent.description || 'Starta videoassistent'}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* D-ID Avatar */}
      <DIDAvatar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const funnyMessages = [
  "Wow, bara {distance} till världens bästa kontorshotell!",
  "Endast {distance} till din nya arbetsplats 🎯",
  "{distance} till morgonkaffet på DG97!",
  "Du är bara {distance} från att bli en del av vårt community",
  "Visste du att det bara är {distance} till DG97?",
  "Packa väskan! Bara {distance} till Drottninggatan 97",
  "{distance} från stadens mysigaste kontorshotell",
  "Hoppa på cykeln - bara {distance} till DG97!",
  "Närmare än du tror - endast {distance} härifrån",
  "{distance} till ditt nya favoritkontor ☕",
];

// DG97 coordinates
const DG97_LAT = 59.3413;
const DG97_LNG = 18.0596;

export default function DistanceToOffice() {
  const [distance, setDistance] = useState(null);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getLocationAndDistance = async () => {
      try {
        // First try browser geolocation (more accurate if user allows)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const dist = calculateDistance(
                position.coords.latitude,
                position.coords.longitude
              );
              showDistance(dist);
            },
            async () => {
              // Fallback to IP geolocation if browser location denied
              await getIPLocation();
            },
            { enableHighAccuracy: false, timeout: 5000 }
          );
        } else {
          // Use IP geolocation if browser doesn't support geolocation
          await getIPLocation();
        }
      } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error getting location:", error);
        }
        // Fallback to IP geolocation
        await getIPLocation();
      }
    };

    const getIPLocation = async () => {
      try {
        // Check if running locally
        const isLocalhost = window.location.hostname === "localhost" ||
                           window.location.hostname === "127.0.0.1";

        if (isLocalhost) {
          // Use Stockholm coordinates for localhost
          const dist = calculateDistance(59.3293, 18.0686); // Stockholm centrum
          showDistance(dist);
        } else {
          // Using ipapi.co free tier (no API key needed for basic usage)
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();

          if (data.latitude && data.longitude) {
            const dist = calculateDistance(data.latitude, data.longitude);
            showDistance(dist);
          }
        }
      } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error getting IP location:", error);
        }
        // Show default message for Stockholm area
        showDistance("några kilometer");
      }
    };

    const calculateDistance = (lat1, lon1) => {
      // Haversine formula for distance calculation
      const R = 6371; // Radius of Earth in kilometers
      const dLat = (DG97_LAT - lat1) * (Math.PI / 180);
      const dLon = (DG97_LNG - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(DG97_LAT * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Format distance
      if (distance < 1) {
        return `${Math.round(distance * 1000)} meter`;
      } else if (distance < 10) {
        return `${distance.toFixed(1)} km`;
      } else {
        return `${Math.round(distance)} km`;
      }
    };

    const showDistance = (dist) => {
      setDistance(dist);
      // Pick random message
      const randomMessage = funnyMessages[
        Math.floor(Math.random() * funnyMessages.length)
      ].replace("{distance}", dist);
      setMessage(randomMessage);

      // Show after a small delay
      setTimeout(() => setIsVisible(true), 1000);
    };

    // Only run on client side and after a delay
    const timer = setTimeout(() => {
      getLocationAndDistance();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!distance || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-6 left-6 z-40 max-w-sm"
      >
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl shadow-2xl p-4 backdrop-blur-md border border-white/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium opacity-90 mb-1">
                📍 Din position
              </p>
              <p className="text-base font-semibold leading-tight">
                {message}
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-3 text-white/60 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 3, ease: "linear" }}
            className="h-0.5 bg-white/30 mt-3 origin-left"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

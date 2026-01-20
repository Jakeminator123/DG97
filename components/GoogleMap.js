import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LogoLoader from "./animations/LogoLoader";

let isGoogleMapsLoaded = false;
let googleMapsPromise = null;

const loadGoogleMaps = () => {
  if (isGoogleMapsLoaded && window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Wait for Google Maps to be available
    const checkGoogleMaps = () => {
      if (window.google?.maps?.Map) {
        isGoogleMapsLoaded = true;
        resolve(window.google);
        return;
      }

      // If not loaded yet, check again in 100ms
      setTimeout(checkGoogleMaps, 100);
    };

    // Start checking
    checkGoogleMaps();

    // Also load the script in case it's not loaded yet
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        reject(
          new Error(
            "Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file"
          )
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=marker`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Script loaded, but we still need to wait for google.maps to be available
        checkGoogleMaps();
      };

      script.onerror = () => {
        reject(
          new Error("Failed to load Google Maps script - check your API key")
        );
      };

      document.head.appendChild(script);
    }
  });

  return googleMapsPromise;
};

export default function GoogleMap() {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    const timeouts = [];
    let mapObserver = null;
    let bodyObserver = null;

    const registerTimeout = (timeoutId) => {
      timeouts.push(timeoutId);
      return timeoutId;
    };

    const clearAllTimeouts = () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.length = 0;
    };

    loadGoogleMaps()
      .then((google) => {
        if (!isActive) return;
        // Ensure google.maps is available
        if (!google?.maps?.Map) {
          throw new Error("Google Maps API not fully loaded");
        }

        if (!mapRef.current) return;

        const dg97Location = { lat: 59.3413, lng: 18.0596 };

        const map = new google.maps.Map(mapRef.current, {
          center: dg97Location,
          zoom: 16,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ weight: "2.00" }],
            },
            {
              featureType: "all",
              elementType: "geometry.stroke",
              stylers: [{ color: "#9c9c9c" }],
            },
            {
              featureType: "all",
              elementType: "labels.text",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f2f2f2" }],
            },
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ saturation: -100 }, { lightness: 45 }],
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#4B5B9C" }, { visibility: "on" }],
            },
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [
                { hue: "#4B5B9C" },
                { saturation: -20 },
                { lightness: 5 },
              ],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ hue: "#4B5B9C" }, { saturation: -40 }],
            },
          ],
        });

        // Use standard Marker with custom icon
        const marker = new google.maps.Marker({
          position: dg97Location,
          map: map,
          title: "DG97 Kontorshotell",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4B5B9C",
            fillOpacity: 1,
            strokeColor: "#293356",
            strokeWeight: 2,
          },
        });

        // Info window using modern approach
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-family: inherit;">
              <h3 style="margin: 0 0 8px 0; color: #4B5B9C;">DG97 Kontorshotell</h3>
              <p style="margin: 0 0 8px 0;">Drottninggatan 97<br>113 60 Stockholm</p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=59.3413,18.0596"
                 target="_blank"
                 rel="noopener noreferrer"
                 style="color: #ff6b6b; text-decoration: none; font-weight: 500;">
                Vägbeskrivning →
              </a>
            </div>
          `,
          headerContent: null,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        // Set title on Google Maps iframe for accessibility
        const setIframeTitle = () => {
          if (!isActive) return false;
          if (!mapRef.current) return false;

          // Try direct query first
          let iframe = mapRef.current.querySelector('iframe');

          // If not found, try querying document
          if (!iframe) {
            const allIframes = document.querySelectorAll('iframe');
            // Find the one that's inside our map container
            allIframes.forEach(f => {
              if (mapRef.current && mapRef.current.contains(f)) {
                iframe = f;
              }
            });
          }

          if (iframe && !iframe.getAttribute('title')) {
            iframe.setAttribute('title', 'Google Maps - DG97 Kontorshotell plats');
            iframe.setAttribute('aria-label', 'Interaktiv karta som visar DG97 Kontorshotell plats');
            return true;
          }
          return false;
        };

        // Try to set title immediately and after delays
        const attempts = [100, 500, 1000, 2000, 3000];
        attempts.forEach((delay) => {
          registerTimeout(setTimeout(setIframeTitle, delay));
        });

        // Observe for iframe creation if not found immediately
        if (!setIframeTitle() && mapRef.current) {
          mapObserver = new MutationObserver(() => {
            if (setIframeTitle()) {
              mapObserver.disconnect();
              if (bodyObserver) {
                bodyObserver.disconnect();
              }
              clearAllTimeouts();
            }
          });
          mapObserver.observe(mapRef.current, { childList: true, subtree: true });

          // Also observe document body in case iframe is added outside container
          bodyObserver = new MutationObserver(() => {
            if (setIframeTitle()) {
              if (mapObserver) {
                mapObserver.disconnect();
              }
              bodyObserver.disconnect();
              clearAllTimeouts();
            }
          });
          bodyObserver.observe(document.body, { childList: true, subtree: true });

          // Disconnect after 10 seconds
          registerTimeout(
            setTimeout(() => {
              if (mapObserver) {
                mapObserver.disconnect();
              }
              if (bodyObserver) {
                bodyObserver.disconnect();
              }
              clearAllTimeouts();
            }, 10000)
          );
        }

        if (isActive) {
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        if (!isActive) return;
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to load Google Maps:", err);
        }
        setError(err.message || 'Kunde inte ladda kartan');
      });

    return () => {
      isActive = false;
      if (mapObserver) {
        mapObserver.disconnect();
      }
      if (bodyObserver) {
        bodyObserver.disconnect();
      }
      clearAllTimeouts();
    };
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Kartan kunde inte laddas
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>

          {error.includes("API key") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <h4 className="font-medium text-yellow-800 mb-2">
                För att aktivera kartfunktionen:
              </h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>
                  1. Gå till{" "}
                  <a
                    href="https://console.cloud.google.com/google/maps-apis"
                    className="text-primary-600 hover:underline"
                    target="_blank"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li>2. Skapa eller välj ett projekt</li>
                <li>3. Aktivera &quot;Maps JavaScript API&quot;</li>
                <li>4. Skapa en API-nyckel</li>
                <li>
                  5. Lägg till nyckeln i{" "}
                  <code className="bg-gray-100 px-1 rounded">.env.local</code>{" "}
                  som{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                  </code>
                </li>
              </ol>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg"
      style={{ minHeight: "400px", height: "100%" }}
    >
      <div ref={mapRef} className="w-full h-full absolute inset-0" />

      {/* Subtle blue overlay shimmer effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(59, 130, 246, 0.04) 60%, transparent 80%)",
          animation: "mapShimmer 10s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />

      {/* Loading placeholder - only show if not loaded */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="text-center">
            <LogoLoader size={64} variant="spin" speed={4} />
            <span className="sr-only">Laddar karta...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes mapShimmer {
          0%,
          100% {
            opacity: 0;
            transform: translateX(-100%) skewX(-10deg);
          }
          50% {
            opacity: 0.6;
            transform: translateX(100%) skewX(-10deg);
          }
        }
      `}</style>
    </motion.div>
  );
}

'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import LogoLoader from './animations/LogoLoader';

// Default values if env vars not set
const DEFAULT_SCALE = 1.9;  // Små men synliga modeller
const DEFAULT_CAMERA_DISTANCE = 1.4;   // Lagom avstånd
const DEFAULT_ROTATION_SPEED = 0.1;  // Mjuk rotation

// Model component
function Model({ modelPath, scale = 1.0, position = [0, 0.8, 0] }) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={scale}
      position={position}
    />
  );
}

// Main component with lazy loading
export default function Founder3DModel({
  modelPath,
  name,
  title,
  delay = 0,
  scale,
  cameraPosition
}) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef();

  // Använd direkt värden från koden
  const finalScale = scale || DEFAULT_SCALE;
  const cameraDistance = DEFAULT_CAMERA_DISTANCE;
  const rotationSpeed = DEFAULT_ROTATION_SPEED;
  // Kamera i mitten eller lite nedåt - ser knän till fötter
  const finalCameraPosition = cameraPosition || [0, 0, cameraDistance];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          // Preload the model only on client side
          if (typeof window !== 'undefined') {
            try {
              useGLTF.preload(modelPath);
            } catch (error) {
              // Silently fail if preload doesn't work
              if (process.env.NODE_ENV === 'development') {
                console.warn('Failed to preload model:', error);
              }
            }
          }
        }
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [isInView, modelPath]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="relative">
        {/* 3D Canvas */}
        <div className="h-80 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-inner mb-4">
          {isInView ? (
            <Canvas
              camera={{ position: finalCameraPosition, fov: 75 }}  // Bred FOV för att se hela figuren
              className="cursor-grab active:cursor-grabbing"
              onCreated={() => setIsLoaded(true)}
            >
              <Suspense
                fallback={
                  <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="gray" />
                  </mesh>
                }
              >
                <Stage
                  preset="rembrandt"
                  intensity={0.5}
                  environment="city"
                >
                  <PresentationControls
                    speed={rotationSpeed}
                    global
                    zoom={0.5}  // Mindre zoom för att se hela figuren
                    polar={[-0.1, Math.PI / 4]}
                  >
                    <Model modelPath={modelPath} scale={finalScale} />
                  </PresentationControls>
                </Stage>
              </Suspense>
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI / 1.5}
              />
            </Canvas>
          ) : (
            <div className="h-full flex items-center justify-center">
              <LogoLoader size={80} variant="spin" speed={4} />
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {isInView && !isLoaded && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <LogoLoader size={60} variant="spin" speed={4} />
              <p className="text-sm text-gray-600 mt-2">Laddar 3D-modell...</p>
            </div>
          </div>
        )}

        {/* Interaction hint */}
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 left-0 right-0 flex justify-center"
          >
            <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              Dra för att rotera
            </div>
          </motion.div>
        )}
      </div>

      {/* Name and title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-primary-600 font-medium">{title}</p>
    </motion.div>
  );
}

// Preload function for optimization
Founder3DModel.preload = (modelPath) => {
  useGLTF.preload(modelPath);
};

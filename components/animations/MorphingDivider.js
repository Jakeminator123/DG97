import { motion } from 'framer-motion';

export function MorphingDivider({ className = '', color = '#4B5B9C' }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <motion.path
          d="M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z"
          fill={color}
          animate={{
            d: [
              "M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z",
              "M0,50 Q300,80 600,50 T1200,50 L1200,100 L0,100 Z",
              "M0,50 Q300,50 600,80 T1200,50 L1200,100 L0,100 Z",
              "M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

// Wave divider with gradient
export function WaveDivider({ className = '', flipped = false }) {
  return (
    <div className={`w-full ${flipped ? 'rotate-180' : ''} ${className}`}>
      <svg
        width="100%"
        height="120"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <motion.stop
              offset="0%"
              animate={{
                stopColor: ['#4B5B9C', '#5573b9', '#4B5B9C'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.stop
              offset="100%"
              animate={{
                stopColor: ['#5573b9', '#4B5B9C', '#5573b9'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z"
          fill="url(#waveGradient)"
          animate={{
            d: [
              "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z",
              "M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z",
              "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

// Geometric divider
export function GeometricDivider({ className = '' }) {
  const triangles = [...Array(8)].map((_, i) => ({
    x: i * 150,
    delay: i * 0.1,
  }));

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="100"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        {triangles.map((triangle, index) => (
          <motion.polygon
            key={index}
            points={`${triangle.x},100 ${triangle.x + 75},0 ${triangle.x + 150},100`}
            fill={index % 2 === 0 ? '#4B5B9C' : '#5573b9'}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.8,
              delay: triangle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Blob divider
export function BlobDivider({ className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <svg
        width="100%"
        height="200"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,100 Q150,50 300,100 T600,100 Q750,150 900,100 T1200,100 L1200,200 L0,200 Z"
          fill="#4B5B9C"
          opacity={0.1}
          animate={{
            d: [
              "M0,100 Q150,50 300,100 T600,100 Q750,150 900,100 T1200,100 L1200,200 L0,200 Z",
              "M0,100 Q150,150 300,100 T600,100 Q750,50 900,100 T1200,100 L1200,200 L0,200 Z",
              "M0,100 Q150,100 300,150 T600,100 Q750,100 900,50 T1200,100 L1200,200 L0,200 Z",
              "M0,100 Q150,50 300,100 T600,100 Q750,150 900,100 T1200,100 L1200,200 L0,200 Z",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,120 Q200,80 400,120 T800,120 Q1000,160 1200,120 L1200,200 L0,200 Z"
          fill="#5573b9"
          opacity={0.2}
          animate={{
            d: [
              "M0,120 Q200,80 400,120 T800,120 Q1000,160 1200,120 L1200,200 L0,200 Z",
              "M0,120 Q200,160 400,120 T800,120 Q1000,80 1200,120 L1200,200 L0,200 Z",
              "M0,120 Q200,120 400,80 T800,120 Q1000,120 1200,160 L1200,200 L0,200 Z",
              "M0,120 Q200,80 400,120 T800,120 Q1000,160 1200,120 L1200,200 L0,200 Z",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </svg>
    </div>
  );
}

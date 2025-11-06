import { motion } from 'framer-motion';

export function Marquee({ 
  items = [], 
  speed = 30,
  className = '',
  reverse = false 
}) {
  const duplicatedItems = [...items, ...items, ...items]; // Triple for smooth loop

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: reverse ? ['0%', '33.33%'] : ['-33.33%', '0%']
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center mx-8 text-4xl md:text-6xl font-bold text-primary-600"
          >
            {item}
            <span className="mx-8 text-accent-500">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Variant with gradient text
export function GradientMarquee({ items = [], speed = 30, className = '' }) {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden py-8 ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: ['-33.33%', '0%']
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <motion.span
            key={index}
            className="inline-flex items-center mx-8 text-4xl md:text-6xl font-bold"
            style={{
              background: 'linear-gradient(45deg, #4B5B9C, #5573b9, #ff6b6b)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              backgroundPosition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

// Vertical marquee variant
export function VerticalMarquee({ items = [], speed = 20, className = '' }) {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden h-96 ${className}`}>
      <motion.div
        className="flex flex-col"
        animate={{
          y: ['-33.33%', '0%']
        }}
        transition={{
          y: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="py-4 px-8 my-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg"
          >
            <p className="text-lg font-medium">{item}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

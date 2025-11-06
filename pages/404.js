import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { MagneticButton } from '../components/animations';
import LogoLoader from '../components/animations/LogoLoader';

export default function Custom404() {
  return (
    <Layout
      title="404 - Sidan hittades inte"
      description="Sidan du letade efter finns inte. Tillbaka till startsidan."
      path="/404"
    >
      <div className="min-h-[80vh] bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <LogoLoader size={150} variant="pendulum" speed={3} />
          </motion.div>

          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hoppsan! Sidan hittades inte
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Det verkar som att sidan du letade efter har flyttat, tagits bort eller aldrig existerat.
              Men oroa dig inte - vi hjälper dig hitta rätt!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/">
              <MagneticButton variant="primary">
                Tillbaka till startsidan
              </MagneticButton>
            </Link>
            <Link href="/kontakt">
              <MagneticButton variant="secondary">
                Kontakta oss
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-4">Kanske letar du efter:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { href: '/om-oss', label: 'Om oss' },
                { href: '/vara-foretag', label: 'Våra företag' },
                { href: '/galleri', label: 'Galleri' },
                { href: '/fragor-och-svar', label: 'Frågor & Svar' },
                { href: '/blogg', label: 'Blog' },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="px-4 py-2 bg-white hover:bg-primary-50 text-primary-600 rounded-lg border border-primary-200 hover:border-primary-300 transition-all duration-200 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fun element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <p className="text-sm text-gray-500 italic">
              "Inte alla som vandrar omkring är vilse" - men den här sidan är verkligen borta 😅
            </p>
          </motion.div>
        </div>
      </div>

      {/* Floating elements decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[
          { top: '10%', left: '5%' },
          { top: '20%', left: '80%' },
          { top: '60%', left: '15%' },
          { top: '75%', left: '65%' },
          { top: '40%', left: '40%' },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-primary-100 rounded-full opacity-20 blur-3xl"
            style={{
              top: pos.top,
              left: pos.left,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </Layout>
  );
}

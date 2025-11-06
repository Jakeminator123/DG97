import { motion } from 'framer-motion';
import { ScrollReveal, FadeIn } from './animations';
import SectionBackground from './SectionBackground';

const trustBadges = [
  {
    id: 1,
    name: 'Årets Coworking Finalist',
    year: '2023',
    icon: '🏆',
    description: 'Nominerad till Årets Coworking Awards Stockholm',
  },
  {
    id: 2,
    name: 'Säker 24/7',
    icon: '🔒',
    description: 'Säker tillgång dygnet runt med egen nyckel',
  },
  {
    id: 3,
    name: 'Miljöcertifierad',
    icon: '🌱',
    description: 'Miljömedveten verksamhet och hållbarhet',
  },
  {
    id: 4,
    name: '30+ Företag',
    icon: '🏢',
    description: 'Över 30 nöjda företag väljer DG97',
  },
  {
    id: 5,
    name: '4.8/5 Betyg',
    icon: '⭐',
    description: 'Genomsnittligt kundbetyg från 47 recensioner',
  },
  {
    id: 6,
    name: 'Etablerat 2018',
    icon: '📅',
    description: 'Sex års erfarenhet av kontorshotell',
  },
];

function TrustBadge({ badge, index }) {
  return (
    <FadeIn delay={index * 0.1}>
      <motion.div
        className="card-gradient p-6 text-center h-full hover-lift"
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="text-4xl mb-3">{badge.icon}</div>
        <h3 className="heading-4 mb-2">{badge.name}</h3>
        {badge.year && (
          <p className="text-sm text-primary-600 font-medium mb-2">{badge.year}</p>
        )}
        <p className="text-sm text-gray-600">{badge.description}</p>
      </motion.div>
    </FadeIn>
  );
}

export default function TrustBadges() {
  return (
    <section className="section-container bg-gradient-to-br from-gray-50 to-white">
      <SectionBackground variant="light" intensity="subtle" />
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              Varför välja DG97?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Vi kombinerar professionell service med ett genuint community
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustBadges.map((badge, index) => (
            <TrustBadge key={badge.id} badge={badge} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}


import { motion } from 'framer-motion';
import { useState } from 'react';
import { ScrollReveal, StaggerReveal, StaggerChild, FadeIn, MagneticButton } from './animations';
import SectionBackground from './SectionBackground';

const pricingPlans = [
  {
    id: 'small',
    name: 'Litet kontorsrum',
    description: 'Perfekt för 1-2 personer',
    price: 4990,
    priceNote: 'kr/mån',
    features: [
      'Fullt möblerat kontorsrum',
      'Fiber internet 1 Gbit/s',
      'Tillgång till konferensrum',
      'Reception och posthantering',
      'Kaffe, te & frukost',
      'Städning ingår',
      '24/7 tillgång',
      'El, värme och internet',
      'Telefonbås',
      'Gemensamma kök',
    ],
    popular: false,
    cta: 'Boka visning',
    capacity: '1-2 personer',
  },
  {
    id: 'medium',
    name: 'Mellanstort kontorsrum',
    description: 'Ideal för 3-4 personer',
    price: 9990,
    priceNote: 'kr/mån',
    features: [
      'Fullt möblerat kontorsrum',
      'Fiber internet 1 Gbit/s',
      'Tillgång till konferensrum',
      'Reception och posthantering',
      'Kaffe, te & frukost',
      'Städning ingår',
      '24/7 tillgång',
      'El, värme och internet',
      'Telefonbås',
      'Gemensamma kök',
      'Extra förvaringsutrymme',
    ],
    popular: true,
    cta: 'Boka visning',
    capacity: '3-4 personer',
  },
  {
    id: 'large',
    name: 'Stort kontorsrum',
    description: 'Perfekt för 5-6 personer',
    price: 14990,
    priceNote: 'kr/mån',
    features: [
      'Fullt möblerat kontorsrum',
      'Fiber internet 1 Gbit/s',
      'Tillgång till konferensrum',
      'Reception och posthantering',
      'Kaffe, te & frukost',
      'Städning ingår',
      '24/7 tillgång',
      'El, värme och internet',
      'Telefonbås',
      'Gemensamma kök',
      'Extra förvaringsutrymme',
      'Prioriterad konferensrumsbokning',
    ],
    popular: false,
    cta: 'Boka visning',
    capacity: '5-6 personer',
  },
];

function PricingCard({ plan, index }) {
  return (
    <StaggerChild>
      <motion.div
        className={`relative card-gradient overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col ${
          plan.popular ? 'ring-4 ring-primary-400 scale-105' : ''
        }`}
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {plan.popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-1 text-sm font-semibold rounded-bl-lg">
            Mest populär
          </div>
        )}

        <div className="p-8 flex-grow flex flex-col">
          <div className="mb-6">
            <h3 className="heading-3 mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-primary-600">{plan.price.toLocaleString('sv-SE')}</span>
              <span className="text-gray-600 ml-2">{plan.priceNote}</span>
            </div>
            <p className="text-sm text-gray-500">{plan.capacity}</p>
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <MagneticButton
            href="/kontakt"
            variant={plan.popular ? 'primary' : 'secondary'}
            className="w-full mt-auto"
          >
            {plan.cta}
          </MagneticButton>
        </div>
      </motion.div>
    </StaggerChild>
  );
}

export default function Pricing({ showTitle = true, limit = null }) {
  const displayPlans = limit ? pricingPlans.slice(0, limit) : pricingPlans;

  return (
    <section className="section-container bg-gradient-to-br from-primary-50/20 via-white to-primary-50/10">
      <SectionBackground variant="light" intensity="subtle" />
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="heading-1 mb-4">
                Transparenta priser - Allt inkluderat
              </h2>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Inga dolda kostnader. Allt från möbler till internet ingår i den fasta månadsavgiften.
              </p>
            </div>
          </ScrollReveal>
        )}

        <StaggerReveal staggerDelay={0.1}>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {displayPlans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        </StaggerReveal>

        {showTitle && (
          <ScrollReveal delay={0.5}>
            <div className="bg-primary-50 rounded-xl p-8 text-center">
              <h3 className="heading-3 mb-4">
                Behöver du en anpassad lösning?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Vi erbjuder även flexibla lösningar för större team eller specialanpassade behov.
                Kontakta oss så hittar vi en lösning som passar just dig.
              </p>
              <MagneticButton href="/kontakt" variant="primary">
                Kontakta oss för offert
              </MagneticButton>
            </div>
          </ScrollReveal>
        )}

        <FadeIn delay={0.6}>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              * Alla priser är exklusive moms. Flexibla avtalsperioder från 3 månader.
              Ingen bindningstid krävs.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}


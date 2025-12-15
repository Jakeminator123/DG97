import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ScrollReveal, FadeIn, MagneticButton } from './animations';
import SectionBackground from './SectionBackground';

const basePrices = {
  1: 4990,
  2: 4990,
  3: 9990,
  4: 9990,
  5: 14990,
  6: 14990,
};

const discounts = {
  3: 0,
  6: 0.05,
  12: 0.10,
  24: 0.15,
};

export default function PriceCalculator() {
  const [people, setPeople] = useState(2);
  const [months, setMonths] = useState(6);
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const calculatePrice = useCallback(() => {
    const basePrice = basePrices[people] || basePrices[6];
    const discountRate = discounts[months] || 0;
    const discount = basePrice * discountRate;
    const finalPrice = basePrice - discount;
    setCalculatedPrice({
      base: basePrice,
      discount,
      final: finalPrice,
      months,
      people,
    });
  }, [people, months]);

  // Auto-calculate when people or months change
  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  return (
    <section className="section-container bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20">
      <SectionBackground variant="light" intensity="subtle" />
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="heading-1 mb-4">
              Räkna ut din månadskostnad
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Anpassa efter ditt teams behov och se vad det kostar per månad
            </p>
          </div>
        </ScrollReveal>

        <div className="card-gradient p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <FadeIn delay={0.1}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4" id="people-label">
                  Antal personer
                </label>
                <div className="flex gap-2 flex-wrap" role="group" aria-labelledby="people-label">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPeople(num)}
                      aria-pressed={people === num}
                      aria-label={`${num} person${num > 1 ? 'er' : ''}`}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/30 ${
                        people === num
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4" id="months-label">
                  Avtalslängd (månader)
                </label>
                <div className="flex gap-2 flex-wrap" role="group" aria-labelledby="months-label">
                  {[3, 6, 12, 24].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMonths(num)}
                      aria-pressed={months === num}
                      aria-label={`${num} månader`}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/30 ${
                        months === num
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num} mån
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mb-6">
              <button
                onClick={calculatePrice}
                className="btn-primary px-8 py-4 text-lg"
                aria-label="Räkna ut månadskostnad baserat på valda alternativ"
              >
                Räkna ut pris
              </button>
            </div>
          </FadeIn>

          {calculatedPrice && (
            <FadeIn>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-8 border-2 border-primary-200"
                role="region"
                aria-live="polite"
                aria-label="Beräknat pris"
              >
                <h3 className="heading-3 mb-6 text-center">
                  Din månadskostnad
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Baspris ({calculatedPrice.people} personer)</span>
                    <span className="text-lg font-semibold">
                      {calculatedPrice.base.toLocaleString('sv-SE')} kr/mån
                    </span>
                  </div>
                  {calculatedPrice.discount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Rabatt ({calculatedPrice.months} månader)</span>
                      <span className="text-lg font-semibold">
                        -{calculatedPrice.discount.toLocaleString('sv-SE')} kr/mån
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Totalt per månad</span>
                      <span className="text-3xl font-bold text-primary-600">
                        {calculatedPrice.final.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-right">
                      Totalt {calculatedPrice.months} månader: {(calculatedPrice.final * calculatedPrice.months).toLocaleString('sv-SE')} kr
                    </p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <MagneticButton href="/kontakt" variant="primary">
                    Boka visning
                  </MagneticButton>
                </div>
              </motion.div>
            </FadeIn>
          )}

          <FadeIn delay={0.4}>
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                * Alla priser är exklusive moms. Priset är en uppskattning och kan variera beroende på
                tillgänglighet och specifika behov. Kontakta oss för en exakt offert.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}


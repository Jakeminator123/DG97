import { motion } from "framer-motion";
import {
  BuildingIcon,
  CoffeeIcon,
  ConferenceIcon,
  LockIcon,
  PhoneBoothIcon,
  PrinterIcon,
  ReceptionIcon,
  WiFiIcon,
} from "./animations/AnimatedIcons";
import {
  ScrollReveal,
  StaggerChild,
  StaggerReveal,
} from "./animations/ScrollReveal";
import SectionBackground from "./SectionBackground";

const defaultFeatures = [
  {
    icon: CoffeeIcon,
    title: "Kaffe & Te",
    description: "Obegränsat med kaffe, te och vatten",
  },
  {
    icon: WiFiIcon,
    title: "Snabbt WiFi",
    description: "Fiber-uppkoppling med hög hastighet",
  },
  {
    icon: PrinterIcon,
    title: "Skrivare & Scanner",
    description: "Kostnadsfri utskrift och kopiering",
  },
  {
    icon: PhoneBoothIcon,
    title: "Telefonbås",
    description: "Privata bås för samtal och möten",
  },
  {
    icon: ConferenceIcon,
    title: "Konferensrum",
    description: "Moderna mötesrum med all utrustning",
  },
  {
    icon: BuildingIcon,
    title: "Frukost & AW",
    description: "Frukost varje dag och regelbunden AW",
  },
  {
    icon: ReceptionIcon,
    title: "Posthantering",
    description: "Vi tar emot och hanterar din post",
  },
  {
    icon: LockIcon,
    title: "Säkert & Tryggt",
    description: "Låsta lokaler med passerkort",
  },
];

export default function FeatureList({ features = defaultFeatures }) {
  return (
    <section className="section-container bg-gradient-to-br from-neutral-50 to-primary-50 relative overflow-hidden">
      <SectionBackground variant="light" intensity="subtle" />
      <ScrollReveal>
        <div className="text-center mb-16 relative z-10">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              background: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 35%, #4b5b9c 70%, #1f3070 100%)",
              backgroundSize: "220% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 15s ease-in-out infinite",
            }}
          >
            Allt detta ingår på Kontorshotellet DG97
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Vi erbjuder en komplett kontorslösning där allt är inkluderat.
            Fokusera på ditt företag - vi tar hand om resten.
          </p>
        </div>
      </ScrollReveal>

      <StaggerReveal staggerDelay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {features.map((feature, index) => (
            <StaggerChild key={index}>
              <motion.div
                className="card-gradient p-8 text-center h-full hover-lift group"
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <div className="mb-6 flex justify-center">
                  <feature.icon
                    size={70}
                    className="text-primary-600 group-hover:text-secondary-500 transition-colors duration-300 animate-float"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                </div>
                <h3 className="heading-4 mb-4 text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </StaggerChild>
          ))}
        </div>
      </StaggerReveal>
    </section>
  );
}

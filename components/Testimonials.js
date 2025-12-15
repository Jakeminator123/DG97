import { motion } from "framer-motion";
import Image from "next/image";
import { ScrollReveal, StaggerReveal, StaggerChild } from "./animations";

const testimonials = [
  {
    id: 1,
    name: "Johan Andersson",
    company: "Tech Startup AB",
    role: "VD",
    rating: 5,
    text: "Fantastiskt kontorshotell med allt man behöver. Centralt läge och trevlig personal. Vi har trivts jättebra här!",
    date: "2024-03-15",
    image: null,
  },
  {
    id: 2,
    name: "Maria Lindqvist",
    company: "Creative Agency",
    role: "Grundare",
    rating: 5,
    text: "Perfekt för vårt lilla team. Flexibelt avtal och alla faciliteter vi behöver ingår. Rekommenderas varmt!",
    date: "2024-02-10",
    image: null,
  },
  {
    id: 3,
    name: "Andreas Nilsson",
    company: "Consulting Group",
    role: "Partner",
    rating: 5,
    text: "Bästa beslutet vi tagit. Professionellt, rent och med ett riktigt community. Kaffet är också toppklass!",
    date: "2024-01-20",
    image: null,
  },
  {
    id: 4,
    name: "Emma Johansson",
    company: "Digital Solutions",
    role: "CTO",
    rating: 5,
    text: "24/7-tillgång är fantastiskt för vårt team som arbetar globalt. Internet är snabbt och stabilt.",
    date: "2023-12-05",
    image: null,
  },
  {
    id: 5,
    name: "David Bergström",
    company: "Marketing Agency",
    role: "Grundare",
    rating: 5,
    text: "Vi flyttade hit förra året och har inte ångrat oss en sekund. Perfekt läge och otroligt bra service.",
    date: "2023-11-18",
    image: null,
  },
  {
    id: 6,
    name: "Sofia Andersson",
    company: "Legal Services",
    role: "Advokat",
    rating: 5,
    text: "Professionellt kontorshotell med allt man behöver. Konferensrummen är perfekta för kundmöten.",
    date: "2023-10-12",
    image: null,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  return (
    <StaggerChild>
      <motion.div
        className="card-gradient p-6 h-full flex flex-col hover-lift"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
        <p className="text-neutral-700 mb-6 flex-grow italic leading-relaxed text-base">
          "{testimonial.text}"
        </p>
        <div className="border-t border-gray-200 pt-4">
          <p className="font-semibold text-neutral-900">{testimonial.name}</p>
          <p className="text-sm text-neutral-600">
            {testimonial.role}, {testimonial.company}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {new Date(testimonial.date).toLocaleDateString("sv-SE", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </motion.div>
    </StaggerChild>
  );
}

export default function Testimonials({ limit = null, showTitle = true }) {
  const displayTestimonials = limit
    ? testimonials.slice(0, limit)
    : testimonials;

  return (
    <section className="section-container bg-gradient-to-br from-primary-50/20 via-white to-primary-50/10 isolate">
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <div className="text-center mb-16">
            {/* Keep image outside ScrollReveal so it never ends up invisible if IO doesn't trigger */}
            <div className="relative w-full max-w-3xl mx-auto mb-8 rounded-xl overflow-hidden shadow-lg h-44 sm:h-56 md:h-64 bg-primary-100/30">
              <Image
                src="/images/working_man.jpg"
                alt="Professionell arbetsmiljö på DG97 Kontorshotell"
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover object-right"
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </div>

            <ScrollReveal y={18}>
              <div>
                <h2 className="heading-1 mb-4">Vad våra kunder säger</h2>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  Över 30 företag litar på DG97 för sin kontorslösning. Här är
                  vad de säger.
                </p>
              </div>
            </ScrollReveal>
          </div>
        )}

        <StaggerReveal staggerDelay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </StaggerReveal>

        {showTitle && (
          <ScrollReveal delay={0.5}>
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.8/5 baserat på 47 recensioner</span>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

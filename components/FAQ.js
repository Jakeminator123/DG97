import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionBackground from "./SectionBackground";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-primary-100 last:border-0">
      <button
        className="w-full py-6 px-8 flex justify-between items-center text-left hover:bg-primary-50 transition-all duration-300 group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
      >
        <h3 className="text-lg font-semibold text-neutral-900 pr-8 group-hover:text-primary-700 transition-colors">
          {question}
        </h3>
        <svg
          className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-all duration-300 ${
            isOpen ? "rotate-180 text-secondary-500" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
            id={`faq-answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <div className="px-8 pb-6 text-neutral-700 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ({ items }) {
  return (
    <>
      <section
        className="section-container section-gradient-primary relative overflow-hidden"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <SectionBackground variant="blue" intensity="strong" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{
                fontFamily: "'Poppins', 'Inter', sans-serif",
                background: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 35%, #4b5b9c 70%, #1f3070 100%)",
                backgroundSize: "220% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 10s ease-in-out infinite",
              }}
            >
              FAQ
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Här hittar du svar på de vanligaste frågorna om våra
              kontorslösningar
            </p>
          </div>

          <div className="card-gradient overflow-hidden">
            {items.map((item, index) => (
              <div
                key={index}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <meta itemProp="name" content={item.question} />
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <meta itemProp="text" content={item.answer} />
                  <FAQItem question={item.question} answer={item.answer} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

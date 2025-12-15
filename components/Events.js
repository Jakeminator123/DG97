import { motion } from 'framer-motion';
import { useState } from 'react';
import { ScrollReveal, StaggerReveal, StaggerChild, FadeIn } from './animations';
import SectionBackground from './SectionBackground';

const upcomingEvents = [
  {
    id: 1,
    title: 'Frukostmöte',
    date: '2024-12-15',
    time: '08:00',
    type: 'Frukost',
    description: 'Varje måndag bjuder vi på frukost för alla medlemmar. Perfekt för att nätverka och träffa nya kontakter.',
    location: 'Reception',
    recurring: 'Varje måndag',
  },
  {
    id: 2,
    title: 'After Work',
    date: '2024-12-20',
    time: '17:00',
    type: 'Socialt',
    description: 'Månadsvis after work där alla medlemmar är välkomna. Dryck och snacks ingår.',
    location: 'Lounge',
    recurring: 'Varje månad',
  },
  {
    id: 3,
    title: 'Workshop: Remote Work',
    date: '2025-01-10',
    time: '14:00',
    type: 'Workshop',
    description: 'Lär dig mer om hur du arbetar effektivt på distans och kombinerar det med kontorsmiljön.',
    location: 'Konferensrum',
    recurring: null,
  },
];

const eventTypes = {
  Frukost: '🥐',
  Socialt: '🍻',
  Workshop: '💡',
  Nätverk: '🤝',
};

function EventCard({ event, index }) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <StaggerChild>
      <motion.div
        className={`card-gradient overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col ${
          isPast ? 'opacity-60' : ''
        }`}
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{eventTypes[event.type] || '📅'}</span>
              <span className="badge-primary text-xs">{event.type}</span>
            </div>
            {isPast && (
              <span className="badge-secondary text-xs">Genomförd</span>
            )}
          </div>

          <h3 className="heading-4 mb-2">{event.title}</h3>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{eventDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 flex-grow">{event.description}</p>

          {event.recurring && (
            <div className="mb-4">
              <span className="text-xs text-primary-600 font-medium">
                Återkommande: {event.recurring}
              </span>
            </div>
          )}

          {!isPast && (
            <button
              className="btn-secondary w-full text-sm mt-auto"
              onClick={() => window.location.href = '/kontakt?event=' + encodeURIComponent(event.title)}
              aria-label={`Anmäl intresse för ${event.title} som äger rum ${eventDate.toLocaleDateString('sv-SE')} kl ${event.time}`}
            >
              Anmäl intresse
            </button>
          )}
        </div>
      </motion.div>
    </StaggerChild>
  );
}

export default function Events({ limit = null, showTitle = true }) {
  const displayEvents = limit ? upcomingEvents.slice(0, limit) : upcomingEvents;

  return (
    <section className="section-container bg-gradient-to-br from-accent-50/20 via-white to-primary-50/10">
      <SectionBackground variant="light" intensity="subtle" />
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="heading-1 mb-4">
                Evenemang & Aktivitet
              </h2>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                På DG97 är vi mer än bara ett kontor. Vi bygger community genom regelbundna evenemang och aktiviteter.
              </p>
            </div>
          </ScrollReveal>
        )}

        <StaggerReveal staggerDelay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </StaggerReveal>

      </div>
    </section>
  );
}


import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSignup({
  title = "Håll dig uppdaterad",
  description = "Prenumerera på vårt nyhetsbrev och få nyheter, tips och information om kommande evenemang.",
  variant = "dark" // "dark" or "light"
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  const isDark = variant === 'dark';

  return (
    <div className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className="text-center mb-8">
        <h3 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-lg ${isDark ? 'text-white/90' : 'text-gray-600'} max-w-xl mx-auto`}>
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <label htmlFor="newsletter-email" className="sr-only">
            E-postadress för nyhetsbrev
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Din e-postadress"
            required
            autoComplete="email"
            disabled={status === 'loading'}
            className={`flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              isDark
                ? 'bg-white text-gray-900 placeholder-gray-500 focus:ring-white'
                : 'bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-primary-500 focus:border-transparent'
            } disabled:opacity-50`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`px-8 py-4 font-semibold rounded-lg transition-all whitespace-nowrap disabled:opacity-50 ${
              isDark
                ? 'bg-white text-primary-600 hover:bg-gray-100'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {status === 'loading' ? 'Skickar...' : status === 'success' ? '✓ Tack!' : 'Prenumerera'}
          </button>
        </div>
      </form>

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mt-4 ${isDark ? 'text-white/90' : 'text-green-600'}`}
        >
          ✓ Tack för din anmälan! Kolla din e-post för att bekräfta.
        </motion.div>
      )}

      <p className={`text-sm mt-6 text-center ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
        Vi respekterar din integritet. Avsluta prenumerationen när som helst.
      </p>
    </div>
  );
}


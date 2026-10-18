import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ASSISTANT_LINKS, MAX_MESSAGE_CHARS, MAX_MESSAGES } from '../lib/office-assistant';

const QUICK_QUESTIONS = ['Vilka rum är lediga?', 'Var ligger DG97?', 'Hur bokar jag en visning?'];
const GREETING = 'Hej och välkommen! Jag hjälper dig att hitta rätt bland DG97:s rum, läge och kontaktvägar. Vad vill du veta?';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('guide');
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const logRef = useRef(null);
  const abortRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const closeOnEscape = event => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', closeOnEscape);
    const controller = new AbortController();
    fetch('/api/office-assistant', { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(result => { if (result) setMode(result.mode === 'ai' ? 'ai' : 'guide'); })
      .catch(() => {});
    return () => { document.removeEventListener('keydown', closeOnEscape); controller.abort(); };
  }, [open]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, busy]);

  async function send(text = question) {
    const content = text.trim();
    if (!content || busy || content.length > MAX_MESSAGE_CHARS) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setQuestion('');
    setError('');
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/api/office-assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ messages: next.slice(-MAX_MESSAGES).map(message => ({
          role: message.role, content: message.content.slice(0, MAX_MESSAGE_CHARS),
        })) }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.text !== 'string' || !result.text.trim()) throw new Error('unavailable');
      setMode(result.mode === 'ai' ? 'ai' : 'guide');
      setNotice(['budget_limit', 'rate_limit', 'unavailable'].includes(result.reason)
        ? 'AI-hjälpen är tillfälligt pausad. Du får svar från guidens offentliga information.' : '');
      setMessages(previous => [...previous, { role: 'assistant', content: result.text.slice(0, 3000) }]);
    } catch (cause) {
      if (cause.name !== 'AbortError') setError('Chatten kunde inte svara just nu. Kontakta DG97 via länken nedan eller försök igen.');
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function close() { setOpen(false); triggerRef.current?.focus(); }

  return (
    <>
      <button
        ref={triggerRef} type="button" onClick={() => setOpen(previous => !previous)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 rounded-full border border-white/20 bg-primary-950 px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:bg-primary-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
        aria-expanded={open} aria-controls="dg97-office-chat" aria-label={open ? 'Stäng' : 'Fråga om DG97'}
      >
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" /></svg>
        <span>{open ? 'Stäng' : 'Fråga om DG97'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.section
            id="dg97-office-chat" role="dialog" aria-labelledby="dg97-chat-title"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="fixed bottom-24 right-4 z-[90] flex max-h-[min(72dvh,640px)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-2xl sm:right-6"
          >
            <header className="flex items-start justify-between gap-3 bg-primary-950 px-5 py-4 text-white">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-200">DG97 Kontorsguiden</p>
                <h2 id="dg97-chat-title" className="text-lg font-semibold">En liten hjälp på vägen</h2>
                <p className="mt-1 text-xs text-primary-100">{mode === 'ai' ? 'AI-assistent · offentliga uppgifter' : 'Guidehjälp · offentliga uppgifter'}</p>
              </div>
              <button type="button" onClick={close} aria-label="Stäng chatten" className="rounded-full p-1.5 text-primary-100 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M6 18 18 6" /></svg>
              </button>
            </header>
            <div ref={logRef} role="log" aria-label="Samtal med DG97-assistenten" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-sm bg-primary-950 text-white' : 'rounded-bl-sm border border-stone-200 bg-white text-neutral-800'}`}>
                    <span className="sr-only">{message.role === 'user' ? 'Du: ' : 'Assistent: '}</span>{message.content}
                  </p>
                </div>
              ))}
              {busy && <p role="status" className="px-1 text-xs text-neutral-600">Tar fram ett svar…</p>}
              {notice && <p className="rounded-xl bg-primary-50 p-3 text-xs leading-relaxed text-primary-900">{notice}</p>}
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            </div>
            <div className="border-t border-stone-200 px-4 pb-4 pt-3">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map(text => <button key={text} type="button" disabled={busy} onClick={() => send(text)} className="rounded-full border border-primary-100 bg-white px-2.5 py-1.5 text-xs text-primary-950 transition hover:bg-primary-50 disabled:opacity-50">{text}</button>)}
              </div>
              <form onSubmit={event => { event.preventDefault(); send(); }} className="flex gap-2">
                <label htmlFor="dg97-chat-question" className="sr-only">Din fråga om DG97</label>
                <input ref={inputRef} id="dg97-chat-question" value={question} onChange={event => setQuestion(event.target.value)} maxLength={MAX_MESSAGE_CHARS} disabled={busy} autoComplete="off" placeholder="Vad undrar du över?" className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" />
                <button type="submit" disabled={busy || !question.trim()} aria-label="Skicka fråga" className="rounded-xl bg-primary-950 px-3 text-white hover:bg-primary-800 disabled:opacity-40">
                  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 14-7-4 14-3-7-7 0Zm7 0 7-7" /></svg>
                </button>
              </form>
              <p className="mt-2 text-[10px] leading-relaxed text-neutral-500">Vid AI-svar skickas din fråga till OpenAI. Skicka inga personuppgifter eller lösenord. DG97 bekräftar alltid bokningar och villkor.</p>
              <nav aria-label="Fortsätt till DG97" className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {ASSISTANT_LINKS.map(link => <a key={link.href} href={link.href} className="text-xs font-semibold text-primary-800 underline decoration-primary-200 underline-offset-4 hover:decoration-primary-800">{link.label}</a>)}
              </nav>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

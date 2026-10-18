import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getMemberSession } from '../lib/member-auth';
import { DG97_CONTACT_URL } from '../config/site';

const ERROR_MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD: 'E-postadressen eller lösenordet stämmer inte. Försök igen.',
  INVALID_PASSWORD: 'E-postadressen eller lösenordet stämmer inte. Försök igen.',
  EMAIL_NOT_VERIFIED: 'Bekräfta din e-postadress innan du loggar in.',
  USER_ALREADY_EXISTS: 'Det finns redan ett konto med den e-postadressen. Logga in eller återställ lösenordet.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Det finns redan ett konto med den e-postadressen. Logga in eller återställ lösenordet.',
  INVALID_OTP: 'Koden stämmer inte. Kontrollera den eller be om en ny kod.',
  OTP_EXPIRED: 'Koden har gått ut. Be om en ny kod och försök igen.',
  TOO_MANY_ATTEMPTS: 'För många försök. Vänta en stund innan du försöker igen.',
  TOO_MANY_REQUESTS: 'För många försök. Vänta en stund innan du försöker igen.',
  INVALID_INPUT: 'Kontrollera fälten. Lösenord behöver minst åtta tecken och koder sex siffror.',
  AUTH_UNAVAILABLE: 'Inloggningen svarar inte just nu. Försök igen om en stund.',
};
const MODE_TITLES = {
  signin: 'Välkommen tillbaka', register: 'Skapa ditt konto', verify: 'Bekräfta din e-post',
  forgot: 'Glömt lösenordet?', reset: 'Välj ett nytt lösenord',
};

async function memberRequest(path, body) {
  const response = await fetch(`/api/auth/${path}`, {
    method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
    ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(ERROR_MESSAGES[result?.error] || 'Det gick inte att slutföra. Försök igen om en stund.');
    error.code = result?.error;
    throw error;
  }
  return result;
}

export default function MedlemmarPage({ configured, initialEmail = '', needsVerification = false }) {
  const router = useRouter();
  const [mode, setMode] = useState(needsVerification ? 'verify' : 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  function switchMode(nextMode) {
    setMode(nextMode); setPassword(''); setOtp(''); setMessage(''); setError('');
  }
  async function finishSignIn() {
    const session = await memberRequest('get-session');
    if (session?.user?.emailVerified) { await router.replace('/foretagsportal'); return true; }
    if (session?.user) { setMode('verify'); setMessage('Bekräfta din e-postadress för att öppna kontosidan.'); }
    return false;
  }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'register') {
        const result = await memberRequest('sign-up/email', { name, email, password });
        setPassword('');
        if (!result?.user?.emailVerified) {
          setMode('verify');
          await memberRequest('email-otp/send-verification-otp', { email });
          setMessage('Vi har skickat en kod till din e-postadress. Kontrollera även skräpposten.');
        }
        else if (!await finishSignIn()) { setMode('signin'); setMessage('Kontot är skapat. Du kan nu logga in.'); }
      } else if (mode === 'signin') {
        await memberRequest('sign-in/email', { email, password });
        if (!await finishSignIn()) setMessage('Bekräfta din e-postadress innan du fortsätter.');
      } else if (mode === 'verify') {
        await memberRequest('email-otp/verify-email', { email, otp }); setOtp('');
        if (!await finishSignIn()) { setMode('signin'); setMessage('Din e-postadress är bekräftad. Logga in med ditt lösenord.'); }
      } else if (mode === 'forgot') {
        await memberRequest('email-otp/request-password-reset', { email }); setMode('reset');
        setMessage('Om adressen har ett konto får du en kod via e-post. Ange den tillsammans med ett nytt lösenord.');
      } else if (mode === 'reset') {
        await memberRequest('email-otp/reset-password', { email, otp, password });
        setMode('signin'); setPassword(''); setOtp(''); setMessage('Lösenordet är uppdaterat. Logga in med ditt nya lösenord.');
      }
    } catch (requestError) {
      if (requestError.code === 'EMAIL_NOT_VERIFIED') setMode('verify');
      setError(requestError.message);
    } finally { setBusy(false); }
  }
  async function resendCode() {
    setBusy(true); setError(''); setMessage('');
    try {
      await memberRequest(mode === 'reset' ? 'email-otp/request-password-reset' : 'email-otp/send-verification-otp', { email });
      setMessage('Om adressen kan ta emot en kod har vi skickat en ny. Kontrollera även skräpposten.');
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }
  const inputClass = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500';
  const needsPassword = ['signin', 'register', 'reset'].includes(mode);
  const needsCode = ['verify', 'reset'].includes(mode);
  return (
    <Layout title="Ditt DG97-konto" description="Logga in eller skapa ett eget konto hos DG97 Kontorshotell." path="/medlemmar" noindex>
      <section className="section-container py-14 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20 items-start max-w-5xl mx-auto">
          <div className="lg:pt-8">
            <p className="text-sm uppercase tracking-widest text-primary-700 font-semibold mb-5">Ditt DG97-konto</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">En egen plats,<br />även här.</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md">Här skapar du ett eget konto för dg97.org och hittar din kontosida och vägar vidare till kontoret.</p>
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white/70 p-6 text-sm text-gray-600 leading-relaxed max-w-md"><p>Kontot är separat från dg97.se. Ett registrerat konto bekräftar din e-postadress och innebär inte att du är hyresgäst eller har en bokning.</p><a href={DG97_CONTACT_URL} className="inline-block mt-4 font-semibold text-primary-700 underline underline-offset-4">Frågor om kontor eller avtal? Kontakta DG97</a></div>
            <Link href="/lediga-rum" className="inline-block mt-6 text-sm font-semibold text-primary-700 hover:underline">Se lediga rum →</Link>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-9 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{MODE_TITLES[mode]}</h2>
            <p className="text-sm text-gray-600 mb-7">{mode === 'signin' ? 'Logga in med e-post och lösenord.' : mode === 'register' ? 'Använd din egen e-postadress. Vi skickar en kod för att bekräfta den.' : mode === 'verify' ? 'Ange den sexsiffriga koden från ditt mejl.' : mode === 'forgot' ? 'Vi skickar en engångskod till kontots e-postadress.' : 'Koden och det nya lösenordet återställer ditt konto.'}</p>
            {!configured ? <p role="status" className="rounded-xl bg-gray-50 p-4 text-gray-700">Inloggningen är inte tillgänglig just nu. För frågor om kontoret kan du <a href={DG97_CONTACT_URL} className="underline">kontakta DG97</a>.</p> : <form onSubmit={submit} className="space-y-5">
              {mode === 'register' && <div><label htmlFor="member-name" className="block text-sm font-medium text-gray-800 mb-2">Ditt namn</label><input id="member-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required disabled={busy} className={inputClass} /></div>}
              <div><label htmlFor="member-email" className="block text-sm font-medium text-gray-800 mb-2">E-postadress</label><input id="member-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required disabled={busy} className={inputClass} /></div>
              {needsCode && <div><label htmlFor="member-code" className="block text-sm font-medium text-gray-800 mb-2">Kod från mejlet</label><input id="member-code" name="otp" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} minLength={6} maxLength={6} required disabled={busy} className={`${inputClass} tracking-widest`} /></div>}
              {needsPassword && <div><label htmlFor="member-password" className="block text-sm font-medium text-gray-800 mb-2">{mode === 'reset' ? 'Nytt lösenord' : 'Lösenord'}</label><input id="member-password" name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={mode === 'signin' ? 1 : 8} maxLength={128} required disabled={busy} aria-describedby={mode === 'signin' ? undefined : 'password-help'} className={inputClass} />{mode !== 'signin' && <p id="password-help" className="text-xs text-gray-500 mt-2">Minst åtta tecken. Välj ett unikt lösenord för ditt konto.</p>}</div>}
              {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
              {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{message}</p>}
              <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary-700 px-5 py-3.5 font-semibold text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-60">{busy ? 'Ett ögonblick…' : mode === 'signin' ? 'Logga in' : mode === 'register' ? 'Skapa konto' : mode === 'verify' ? 'Bekräfta e-post' : mode === 'forgot' ? 'Skicka kod' : 'Uppdatera lösenord'}</button>
              {needsCode && <button type="button" onClick={resendCode} disabled={busy || !email} className="text-sm font-medium text-primary-700 underline underline-offset-4 disabled:opacity-60">Skicka en ny kod</button>}
            </form>}
            {configured && <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-x-5 gap-y-3 text-sm">{mode === 'signin' ? <><button type="button" disabled={busy} onClick={() => switchMode('register')} className="font-semibold text-primary-700 hover:underline">Skapa ett konto</button><button type="button" disabled={busy} onClick={() => switchMode('forgot')} className="text-gray-600 hover:underline">Glömt lösenord?</button></> : <button type="button" disabled={busy} onClick={() => switchMode('signin')} className="font-semibold text-primary-700 hover:underline">Tillbaka till inloggning</button>}</div>}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  const session = await getMemberSession(req, res);
  if (session.user?.emailVerified) return { redirect: { destination: '/foretagsportal', permanent: false } };
  return { props: { configured: session.configured, initialEmail: session.user?.email || '', needsVerification: Boolean(session.user) } };
}

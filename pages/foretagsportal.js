import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getMemberSession } from '../lib/member-auth';
import { DG97_CONTACT_URL, DG97_BUSINESS } from '../config/site';

export default function Foretagsportal({ user }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signOut() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!response.ok) throw new Error('Sign out failed');
      await router.replace('/medlemmar');
    } catch { setError('Det gick inte att logga ut just nu. Försök igen om en stund.'); setBusy(false); }
  }
  return (
    <Layout title="Din kontosida" description="Din kontosida på DG97 Kontorsguiden." path="/foretagsportal" noindex>
      <section className="section-container py-14 md:py-20 max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10"><div><p className="text-sm uppercase tracking-widest text-primary-700 font-semibold mb-3">Din kontosida</p><h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Hej {user.name || 'och välkommen'}!</h1><p className="text-gray-600 mt-3">Du är inloggad på dg97.org.</p></div><button type="button" disabled={busy} onClick={signOut} className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">{busy ? 'Loggar ut…' : 'Logga ut'}</button></div>
        {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-7"><h2 className="text-xl font-semibold mb-5">Ditt konto</h2><dl className="space-y-4"><div><dt className="text-sm text-gray-500">Namn</dt><dd className="font-medium text-gray-900 mt-1">{user.name}</dd></div><div><dt className="text-sm text-gray-500">E-postadress</dt><dd className="font-medium text-gray-900 mt-1 break-all">{user.email}</dd></div></dl><p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 text-sm font-medium px-3 py-1.5 mt-6"><span aria-hidden="true">✓</span> E-postadress bekräftad</p><p className="text-sm text-gray-600 mt-6 leading-relaxed">Ditt konto är separat från dg97.se och innehåller inga hyresavtal eller bokningar.</p></section>
          <section className="rounded-3xl bg-primary-950 p-7 text-white"><p className="text-sm uppercase tracking-widest text-blue-200 mb-4">Drottninggatan 97</p><h2 className="text-2xl font-semibold mb-4">Frågor om din arbetsplats?</h2><p className="text-blue-100 leading-relaxed">Kontakta DG97 för frågor om kontor, avtal och bokning. Personalen hjälper dig vidare med aktuella uppgifter.</p><a href={DG97_CONTACT_URL} className="inline-block rounded-xl bg-white text-primary-900 px-5 py-3 font-semibold mt-6 hover:bg-blue-50">Kontakta DG97 →</a><a href={DG97_BUSINESS.telephoneHref} className="block mt-5 text-sm text-blue-100 underline underline-offset-4">{DG97_BUSINESS.telephoneDisplay}</a></section>
        </div>
        <nav aria-label="Vägar vidare från kontosidan" className="grid sm:grid-cols-3 gap-4 mt-6">{[{ href: '/lediga-rum', title: 'Lediga rum', text: 'Se kontor och planritning.' }, { href: '/blogg', title: 'Kontorsguiden', text: 'Råd för en bra kontorsvardag.' }, { href: '/kontakt', title: 'Hitta hit', text: 'Adress och vägen till DG97.' }].map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-400"><span className="font-semibold text-primary-800">{item.title} →</span><span className="block text-sm text-gray-600 mt-2">{item.text}</span></Link>)}</nav>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  const session = await getMemberSession(req, res);
  if (!session.user?.emailVerified) return { redirect: { destination: '/medlemmar', permanent: false } };
  return { props: { user: session.user } };
}

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadsError, setLeadsError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/auth').then(response => response.json()).then(data => {
      if (active) setAuthenticated(data.authenticated === true);
    }).catch(() => {
      if (active) setError('Kunde inte kontrollera inloggningen. Försök igen.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    fetch('/api/admin/blog').then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kunde inte läsa bloggen.');
      if (active) setPosts(data.posts || []);
    }).catch(error => { if (active) setError(error.message); });
    fetch('/api/admin/leads').then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kunde inte läsa förfrågningar.');
      if (active) setLeads(data.leads || []);
    }).catch(error => { if (active) setLeadsError(error.message); });
    return () => { active = false; };
  }, [authenticated]);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Inloggningen misslyckades.');
      setPassword('');
      setAuthenticated(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/auth', { method: 'DELETE' });
      if (!response.ok) throw new Error('Utloggningen misslyckades.');
      setAuthenticated(false);
      setPosts([]);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout title="Administration" path="/admin">
      <section className="section-container py-16 max-w-3xl mx-auto">
        <h1 className="heading-1 mb-6">Administration</h1>
        <p className="mb-6 text-gray-700">Publicering, schemaläggning, nyhetsbrev och filhantering är pausade. Blogginlägg uppdateras via GitHub.</p>
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        {loading ? <p role="status">Kontrollerar inloggning...</p> : authenticated ? (
          <>
            <button type="button" onClick={logout} disabled={busy} className="btn-secondary mb-6">Logga ut</button>
            <h2 className="heading-3 mb-4">Inkomna förfrågningar</h2>
            {leadsError ? <p className="mb-6 text-neutral-700">{leadsError}</p> : (
              <div className="overflow-x-auto rounded-xl border border-primary-100 bg-white mb-10">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Lead-förfrågningar</caption>
                  <thead className="bg-primary-50 text-primary-950">
                    <tr>
                      <th scope="col" className="p-3">Datum</th>
                      <th scope="col" className="p-3">Namn</th>
                      <th scope="col" className="p-3">Företag</th>
                      <th scope="col" className="p-3">E-post</th>
                      <th scope="col" className="p-3">Telefon</th>
                      <th scope="col" className="p-3">Storlek</th>
                      <th scope="col" className="p-3">Start</th>
                      <th scope="col" className="p-3">Meddelande</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr><td className="p-3 text-neutral-600" colSpan={8}>Inga förfrågningar ännu.</td></tr>
                    ) : leads.map(lead => (
                      <tr key={lead.id} className="border-t border-primary-100 align-top">
                        <td className="p-3 whitespace-nowrap">{lead.created_at ? new Date(lead.created_at).toLocaleString('sv-SE') : ''}</td>
                        <td className="p-3">{lead.name}</td>
                        <td className="p-3">{lead.company}</td>
                        <td className="p-3">{lead.email}</td>
                        <td className="p-3">{lead.phone}</td>
                        <td className="p-3">{lead.size_need}</td>
                        <td className="p-3">{lead.start_date}</td>
                        <td className="p-3 max-w-xs">{lead.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <h2 className="heading-3 mb-4">Publicerade blogginlägg</h2>
            <ul className="space-y-3">
              {posts.map(post => <li key={post.slug}><Link href={`/blogg/${post.slug}`} className="underline">{post.title}</Link></li>)}
            </ul>
          </>
        ) : (
          <form onSubmit={login} className="space-y-4 max-w-md">
            <label className="block">Användarnamn<input name="username" value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required className="input-field block w-full" /></label>
            <label className="block">Lösenord<input name="password" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required className="input-field block w-full" /></label>
            <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Loggar in...' : 'Logga in'}</button>
          </form>
        )}
      </section>
    </Layout>
  );
}

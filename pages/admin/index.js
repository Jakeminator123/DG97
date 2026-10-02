import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
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

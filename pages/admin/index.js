import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../../components/animations';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [generating, setGenerating] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuth = async () => {
    try {
      // Check if we have a token
      const response = await fetch('/api/admin/auth', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({ authenticated: false }));
        setIsAuthenticated(data.authenticated || false);
      } else {
        // Any error means not authenticated
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Only log errors in development, and only if it's not a network error
      if (process.env.NODE_ENV === 'development' && error.name !== 'TypeError') {
        console.error('Auth check failed:', error);
      }
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json().catch(() => ({}));

      if (data.success) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setError(data.error || 'Fel användarnamn eller lösenord');
      }
    } catch (error) {
      setError('Inloggning misslyckades. Försök igen.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      router.push('/admin');
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout error:', error);
      }
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsRes = await fetch('/api/admin/stats', {
        credentials: 'include'
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Load posts if on posts tab
      if (activeTab === 'posts') {
        const postsRes = await fetch('/api/admin/blog', {
          credentials: 'include'
        });
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || []);
        }
      }

      // Load schedules if on scheduler tab
      if (activeTab === 'scheduler') {
        const schedRes = await fetch('/api/admin/scheduler', {
          credentials: 'include'
        });
        if (schedRes.ok) {
          const schedData = await schedRes.json();
          setSchedules(schedData.schedules || []);
        }
      }
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading dashboard data:', error);
      }
    }
  };

  const handleGenerate = async (title, category, autoPublish = false) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, category, autoPublish })
      });

      const data = await response.json().catch(() => ({}));

      if (data.success) {
        await loadDashboardData();
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Generering misslyckades' };
      }
    } catch (error) {
      return { success: false, error: 'Fel vid generering' };
    } finally {
      setGenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout title="Admin - Laddar..." path="/admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <Layout title="Admin Login | DG97" path="/admin">
        <section className="min-h-screen py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50/20">
          <div className="max-w-md mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-gradient p-8 shadow-xl bg-white"
            >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="heading-2 mb-2">Admin Dashboard</h1>
                  <p className="text-gray-600">Logga in för att hantera bloggen</p>
                </div>

                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6" aria-label="Admin login form">
                  <div>
                    <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700 mb-2">
                      Användarnamn
                    </label>
                    <input
                      type="text"
                      id="admin-username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field"
                      required
                      autoComplete="username"
                      aria-label="Användarnamn för admin login"
                      aria-required="true"
                      aria-invalid={error && error.includes('användarnamn') ? 'true' : 'false'}
                    />
                  </div>

                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Lösenord
                    </label>
                    <input
                      type="password"
                      id="admin-password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      required
                      autoComplete="current-password"
                      aria-label="Lösenord för admin login"
                      aria-required="true"
                      aria-invalid={error && error.includes('lösenord') ? 'true' : 'false'}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full" aria-label="Logga in till admin dashboard">
                    Logga in
                  </button>
                </form>
              </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // Dashboard
  return (
    <Layout title="Admin Dashboard | DG97" path="/admin">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="heading-1 text-white mb-2">Admin Dashboard</h1>
              <p className="text-primary-100">Hantera blogg och autoposting</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20"
              aria-label="Logga ut från admin dashboard"
            >
              Logga ut
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'generate', label: 'Generera Inlägg', icon: '✨' },
                { id: 'posts', label: 'Hantera Inlägg', icon: '📝' },
                { id: 'scheduler', label: 'Autoposting', icon: '⏰' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardTab key="dashboard" stats={stats} />
            )}
            {activeTab === 'generate' && (
              <GenerateTab key="generate" onGenerate={handleGenerate} generating={generating} />
            )}
            {activeTab === 'posts' && (
              <PostsTab key="posts" posts={posts} onRefresh={loadDashboardData} />
            )}
            {activeTab === 'scheduler' && (
              <SchedulerTab key="scheduler" schedules={schedules} onRefresh={loadDashboardData} />
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}

// Dashboard Tab Component
function DashboardTab({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Totalt antal inlägg</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.posts?.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Senaste 7 dagarna</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.posts?.recent || 0}</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Aktiva scheman</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.schedules?.active || 0}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-gradient p-6">
        <h3 className="heading-4 mb-4">System Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">OpenAI API</span>
            <span className={`badge-${stats?.system?.hasOpenAI ? 'success' : 'secondary'}`}>
              {stats?.system?.hasOpenAI ? '✓ Konfigurerad' : '✗ Ej konfigurerad'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">GitHub Integration</span>
            <span className={`badge-${stats?.system?.hasGithub ? 'success' : 'secondary'}`}>
              {stats?.system?.hasGithub ? '✓ Konfigurerad' : '✗ Ej konfigurerad'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Generate Tab Component
function GenerateTab({ onGenerate, generating }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('startup');
  const [autoPublish, setAutoPublish] = useState(true);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const categories = {
    startup: ['Varför startups väljer kontorshotell', '5 saker varje startup behöver', 'Budget-tips för startups'],
    produktivitet: ['Vetenskapen bakom produktivitet', '5 produktivitets-hacks', 'Fokuserat arbete'],
    arbetsliv: ['Work-life balance', 'Varför hemarbete inte passar alla', 'Mentala hälsofördelar'],
    ekonomi: ['Den dolda kostnaden av hemmakontor', 'ROI av kontorshotell', 'Skattemässiga fördelar'],
    stockholm: ['Bästa områdena för kontor', 'Vasastans charm', 'Stockholm kontorshotell guide'],
    nätverk: ['Hur man nätverkar naturligt', 'Skapa meningsfulla kontakter', 'Community-driven tillväxt']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    const finalTitle = customTopic || selectedTopic || title;
    if (!finalTitle) {
      setError('Välj eller skriv ett ämne');
      return;
    }

    const res = await onGenerate(finalTitle, category, autoPublish);
    setResult(res);

    if (!res.success) {
      setError(res.error || 'Generering misslyckades');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card-gradient p-8"
    >
      <h2 className="heading-3 mb-6">Generera Nytt Blogginlägg</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="generate-category" className="block text-sm font-semibold text-gray-700 mb-2">
            Kategori
          </label>
          <select
            id="generate-category"
            name="generate-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="generate-topic-select" className="block text-sm font-semibold text-gray-700 mb-2">
            Välj ämne från kategori
          </label>
          <select
            id="generate-topic-select"
            name="generate-topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="input-field"
          >
            <option value="">-- Välj ämne --</option>
            {categories[category]?.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="generate-custom-topic" className="block text-sm font-semibold text-gray-700 mb-2">
            Eller skriv eget ämne
          </label>
          <input
            type="text"
            id="generate-custom-topic"
            name="generate-custom-topic"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="T.ex. Ny funktion på DG97"
            className="input-field"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoPublish"
            name="autoPublish"
            checked={autoPublish}
            onChange={(e) => setAutoPublish(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 mr-2"
          />
          <label htmlFor="autoPublish" className="text-sm text-gray-700">
            Publicera automatiskt när genererat
          </label>
        </div>

        <button
          type="submit"
          disabled={generating}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Genererar...' : '🚀 Generera & Publicera'}
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <>
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <p className="text-green-800 font-semibold mb-1">Inlägg genererat!</p>
                  <p className="text-sm text-green-700">
                    {result.data?.slug ? (
                      <a href={`/blogg/${result.data.slug}`} target="_blank" rel="noopener noreferrer" className="underline">
                        Visa inlägg →
                      </a>
                    ) : 'Inlägget är nu tillgängligt på bloggen.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <p className="text-red-800 font-semibold mb-1">Fel vid generering</p>
                  <p className="text-sm text-red-700">{result.error}</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Posts Tab Component
function PostsTab({ posts, onRefresh }) {
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const handleDelete = async (slug) => {
    if (!confirm('Är du säker på att du vill ta bort detta inlägg?')) {
      return;
    }

    setDeleting(slug);
    setError('');

    try {
      const response = await fetch(`/api/admin/blog?slug=${slug}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await onRefresh();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Kunde inte ta bort inlägg');
      }
    } catch (error) {
      setError('Ett fel uppstod vid borttagning');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {error && (
        <div className="card-gradient p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}
      {posts.length === 0 ? (
        <div className="card-gradient p-12 text-center">
          <p className="text-gray-600">Inga inlägg hittades</p>
        </div>
      ) : (
        posts.map((post, index) => (
          <div key={post.slug} className="card-gradient p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="heading-4 mb-2">{post.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge-primary text-xs">{post.category}</span>
                  <span className="badge-secondary text-xs">{post.date}</span>
                </div>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
              <div className="ml-4 flex gap-2">
                <a
                  href={`/blogg/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  Visa
                </a>
                <button
                  onClick={() => handleDelete(post.slug)}
                  disabled={deleting === post.slug}
                  className="btn-ghost text-sm text-red-600 hover:text-red-700"
                >
                  {deleting === post.slug ? 'Tar bort...' : 'Ta bort'}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}

// Scheduler Tab Component
function SchedulerTab({ schedules, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'startup',
    topic: '',
    frequency: 'weekly'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setShowForm(false);
        setFormData({ category: 'startup', topic: '', frequency: 'weekly' });
        await onRefresh();
      } else {
        setError(data.error || 'Kunde inte skapa schema');
      }
    } catch (error) {
      setError('Ett fel uppstod. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSchedule = async (index, active) => {
    try {
      const response = await fetch('/api/admin/scheduler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: index, active: !active })
      });

      if (response.ok) {
        await onRefresh();
      }
    } catch (error) {
      alert('Kunde inte uppdatera schema');
    }
  };

  const handleDeleteSchedule = async (index) => {
    if (!confirm('Ta bort detta schema?')) return;

    try {
      const response = await fetch(`/api/admin/scheduler?id=${index}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await onRefresh();
      }
    } catch (error) {
      alert('Kunde inte ta bort schema');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
          <div className="flex justify-between items-center">
            <h2 className="heading-3">Schemalägg Autoposting</h2>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/admin/scheduler/run', {
                      method: 'POST',
                      credentials: 'include'
                    });
                    const data = await res.json();

                    if (data.success) {
                      // Show success message without alert
                      alert('Scheduler kördes framgångsrikt!');
                    } else {
                      alert(`Fel: ${data.error}`);
                    }
                  } catch (error) {
                    alert('Fel vid körning av scheduler');
                  }
                }}
                className="btn-secondary"
                aria-label="Kör scheduler nu för att generera schemalagda inlägg"
              >
                ▶️ Kör Scheduler Nu
              </button>
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? 'Avbryt' : '+ Nytt Schema'}
              </button>
            </div>
          </div>

      {showForm && (
        <div className="card-gradient p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleCreateSchedule} className="space-y-4">
            <div>
              <label htmlFor="scheduler-category" className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
              <select
                id="scheduler-category"
                name="scheduler-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="startup">Startup</option>
                <option value="produktivitet">Produktivitet</option>
                <option value="arbetsliv">Arbetsliv</option>
                <option value="ekonomi">Ekonomi</option>
                <option value="stockholm">Stockholm</option>
                <option value="nätverk">Nätverk</option>
              </select>
            </div>

            <div>
              <label htmlFor="scheduler-topic" className="block text-sm font-semibold text-gray-700 mb-2">Ämne</label>
              <input
                type="text"
                id="scheduler-topic"
                name="scheduler-topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="input-field"
                placeholder="T.ex. Varför startups väljer kontorshotell"
                required
              />
            </div>

            <div>
              <label htmlFor="scheduler-frequency" className="block text-sm font-semibold text-gray-700 mb-2">Frekvens</label>
              <select
                id="scheduler-frequency"
                name="scheduler-frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="input-field"
              >
                <option value="daily">Dagligen</option>
                <option value="weekly">Veckovis (måndag)</option>
                <option value="weekly_wed">Veckovis (onsdag)</option>
                <option value="biweekly">Två gånger i veckan</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Skapar...' : 'Skapa Schema'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {schedules.length === 0 ? (
          <div className="card-gradient p-12 text-center">
            <p className="text-gray-600">Inga scheman skapade än</p>
          </div>
        ) : (
          schedules.map((schedule, index) => (
            <div key={index} className="card-gradient p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="heading-4">{schedule.topic}</h3>
                    <span className={`badge-${schedule.active ? 'success' : 'secondary'}`}>
                      {schedule.active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span>Kategori: {schedule.category}</span>
                    <span>•</span>
                    <span>Frekvens: {schedule.frequency}</span>
                    {schedule.last_post && (
                      <>
                        <span>•</span>
                        <span>Senaste: {new Date(schedule.last_post).toLocaleDateString('sv-SE')}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleToggleSchedule(index, schedule.active)}
                    className={`btn-${schedule.active ? 'secondary' : 'primary'} text-sm`}
                  >
                    {schedule.active ? 'Inaktivera' : 'Aktivera'}
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(index)}
                    className="btn-ghost text-sm text-red-600"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}


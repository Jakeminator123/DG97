import Layout from '../../components/Layout';
import BlogCard from '../../components/BlogCard';
import GuideHero from '../../components/GuideHero';
import OfficialCTA from '../../components/OfficialCTA';
import { useState } from 'react';
import { GUIDE_CATEGORIES } from '../../config/editorial';

const searchable = value => value.toLocaleLowerCase('sv').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function BlogIndex({ posts }) {
  const [category, setCategory] = useState('alla');
  const [search, setSearch] = useState('');
  const query = searchable(search.trim());
  const filteredPosts = posts.filter(post => (category === 'alla' || post.category === category)
    && searchable(`${post.title} ${post.excerpt} ${post.categoryLabel}`).includes(query));
  return (
    <Layout title="Guider till kontorsvalet och arbetslivet" description="Läs praktiska guider om kontorshotell, kostnader, arbetsmiljö och vardagen på ett delat kontor." path="/blogg">
      <GuideHero title="Läs på inför ditt nästa kontor"><p>Guider om att välja arbetsplats och få vardagen på kontoret att fungera. Aktuella erbjudanden finns på DG97:s huvudwebbplats.</p></GuideHero>
      <section className="section-container">
        <div className="mb-10 space-y-5">
          <div className="max-w-xl">
            <label htmlFor="guide-search" className="block font-semibold text-primary-950 mb-2">Sök bland guiderna</label>
            <input id="guide-search" type="search" value={search} onChange={event => setSearch(event.target.value)}
              placeholder="Till exempel visning, hybrid eller möten"
              className="w-full rounded-lg border border-primary-200 bg-white p-3 text-primary-950" />
          </div>
          <div role="group" aria-label="Välj ämne" className="flex flex-wrap gap-3">
            {[{ slug: 'alla', label: 'Alla guider' }, ...GUIDE_CATEGORIES].map(item => (
              <button key={item.slug} type="button" aria-pressed={category === item.slug}
                onClick={() => setCategory(item.slug)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === item.slug
                  ? 'bg-primary-950 border-primary-950 text-white' : 'bg-white border-primary-200 text-primary-950 hover:bg-primary-50'}`}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-neutral-600" role="status">Visar {filteredPosts.length} av {posts.length} guider</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map(post => <BlogCard key={post.slug} post={post} />)}
        </div>
        {filteredPosts.length === 0 && <div className="mb-12 rounded-xl border border-primary-100 bg-white p-6">
          <p className="text-neutral-700 mb-4">Ingen guide matchar din sökning. Prova ett annat ord eller visa alla ämnen.</p>
          <button type="button" className="btn-secondary" onClick={() => { setSearch(''); setCategory('alla'); }}>Visa alla guider</button>
        </div>}
        <OfficialCTA />
      </section>
    </Layout>
  );
}
export async function getStaticProps() {
  const { getPosts } = await import('../../lib/posts');
  return { props: { posts: getPosts() } };
}

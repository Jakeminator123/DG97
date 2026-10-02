import Layout from '../../components/Layout';
import BlogCard from '../../components/BlogCard';
import GuideHero from '../../components/GuideHero';
import OfficialCTA from '../../components/OfficialCTA';

export default function BlogIndex({ posts }) {
  return (
    <Layout title="Guider till kontorsvalet och arbetslivet" description="Läs praktiska guider om kontorshotell, kostnader, arbetsmiljö och vardagen på ett delat kontor." path="/blogg">
      <GuideHero title="Läs på inför ditt nästa kontor"><p>Guider om att välja arbetsplats och få vardagen på kontoret att fungera. Aktuella erbjudanden finns på DG97:s huvudwebbplats.</p></GuideHero>
      <section className="section-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map(post => <BlogCard key={post.slug} post={post} />)}
        </div>
        <OfficialCTA />
      </section>
    </Layout>
  );
}
export async function getStaticProps() {
  const { getPosts } = await import('../../lib/posts');
  return { props: { posts: getPosts() } };
}

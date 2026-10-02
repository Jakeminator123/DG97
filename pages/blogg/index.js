import Layout from "../../components/Layout";
import BlogCard from "../../components/BlogCard";
import { motion } from "framer-motion";
import PageHero from "../../components/PageHero";
import {
  ScrollReveal,
  StaggerReveal,
  StaggerChild,
  Marquee,
  MagneticButton,
} from "../../components/animations";
import { DocumentIcon } from "../../components/animations/AnimatedIcons";

export default function BlogIndex({ posts }) {
  return (
    <Layout
      title="Blogg"
      description="Läs våra senaste artiklar om kontorshotell, flexibla arbetsplatser och tips för företagare i Stockholm."
      path="/blogg"
    >
      {/* Hero Section - Same style as Galleri */}
      <PageHero
        title="Blogg"
        subtitle="Senaste nytt om kontorshotell och flexibla arbetslösningar"
        animationVariant="waves"
      />

      {/* Marquee */}
      <div className="bg-white py-4 border-b">
        <Marquee
          items={[
            "Tips & Tricks",
            "Kontorshotell",
            "Stockholm",
            "Arbetsliv",
            "Nätverk",
            "Community",
          ]}
          speed={50}
        />
      </div>

      {/* Blog Posts Grid */}
      <section className="section-container">
        {posts.length > 0 ? (
          <StaggerReveal staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <StaggerChild key={post.slug}>
                  <BlogCard post={post} index={idx} />
                </StaggerChild>
              ))}
            </div>
          </StaggerReveal>
        ) : (
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="mb-4 flex justify-center">
                <DocumentIcon size={80} />
              </div>
              <p className="text-gray-600 text-lg">
                Inga blogginlägg tillgängliga ännu. Kom tillbaka snart!
              </p>
            </div>
          </ScrollReveal>
        )}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { getPosts } = await import('../../lib/posts');
  return { props: { posts: getPosts() } };
}

import Layout from "../../components/Layout";
import BlogCard from "../../components/BlogCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PageHero from "../../components/PageHero";
import {
  ScrollReveal,
  StaggerReveal,
  StaggerChild,
  Marquee,
  MagneticButton,
} from "../../components/animations";
import { DocumentIcon } from "../../components/animations/AnimatedIcons";

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to load posts:", error);
        }
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();

    // In development, auto-refresh posts every 3 seconds for hot-reloading
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(loadPosts, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  if (loading) {
    return (
      <Layout
        title="Blogg - Tips & Nyheter om Kontorshotell | DG97"
        description="Läs våra senaste artiklar om kontorshotell, flexibla arbetsplatser och tips för företagare i Stockholm. Allt om att hyra kontor, driva företag och välja kontorshotell."
        keywords="kontorshotell blogg, hyra kontor stockholm, kontorshotell tips, flexibla arbetsplatser, kontorshotell nyheter, dg97 blogg"
        path="/blogg"
      >
        {/* Hero Section - Same style as main page */}
        <PageHero
          title="Blogg"
          subtitle="Senaste nytt om kontorshotell och flexibla arbetslösningar"
          showShapes={false}
        />
        <div className="section-container text-center py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }
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

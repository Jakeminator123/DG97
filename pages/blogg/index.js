import Layout from "../../components/Layout";
import BlogCard from "../../components/BlogCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  HeroNoiseGradient,
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
        <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 py-20 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h1 className="heading-hero text-white mb-5">Blogg</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light">
              Senaste nytt om kontorshotell och flexibla arbetslösningar
            </p>
          </div>
        </section>
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
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          {[
            { left: "5%", top: "10%" },
            { left: "85%", top: "20%" },
            { left: "15%", top: "70%" },
            { left: "75%", top: "60%" },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-white opacity-5 rounded-lg"
              style={{
                left: pos.left,
                top: pos.top,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1
            className="heading-hero text-white mb-5 no-shimmer"
            style={{
              letterSpacing: "-0.025em",
              textShadow: "0 4px 28px rgba(36, 60, 115, 0.5)",
              background:
                "linear-gradient(135deg, #f6faff 0%, #e4ecff 45%, #c7d8ff 75%, #f6faff 100%)",
              backgroundSize: "220% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Blogg
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto"
            style={{
              letterSpacing: "0.02em",
              textShadow: "0 2px 16px rgba(40, 58, 105, 0.4)",
            }}
          >
            Senaste nytt om kontorshotell och flexibla arbetslösningar
          </motion.p>
        </div>
      </section>

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

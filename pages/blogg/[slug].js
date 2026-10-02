import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { renderMarkdown } from '../../lib/blog-markdown';
import Link from 'next/link';
import { MagneticButton } from '../../components/animations/MagneticButton';

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <Layout title="Inlägg saknas" description="Detta blogginlägg kunde inte hittas" path="/blogg">
        <div className="section-container text-center">
          <h1 className="heading-1 mb-6">Inlägget hittades inte</h1>
          <MagneticButton href="/blogg" variant="secondary">
            Tillbaka till bloggen
          </MagneticButton>
        </div>
      </Layout>
    );
  }

  const breadcrumbs = [
    { name: 'Hem', path: '/' },
    { name: 'Blogg', path: '/blogg' },
    { name: post.title, path: `/blogg/${post.slug}` }
  ];

  return (
    <Layout
      title={post.title}
      description={post.excerpt}
      path={`/blogg/${post.slug}`}
      type="article"
      article={{
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        image: post.image
      }}
      breadcrumbs={breadcrumbs}
    >
      {/* Header */}
      <article className="section-container">
        <div className="max-w-4xl mx-auto">
          <Link href="/blogg" className="text-primary-600 hover:underline mb-6 inline-block">
            ← Tillbaka till bloggen
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-1 mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-gray-600 mb-8">
              {post.author && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{post.author}</span>
                  {post.authorRole && (
                    <span className="text-sm">• {post.authorRole}</span>
                  )}
                </div>
              )}
              <span>•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 hover:prose-a:text-primary-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 bg-primary-50 rounded-lg text-center"
          >
            <h2 className="heading-3 mb-4">Intresserad av DG97?</h2>
            <p className="text-gray-700 mb-6">
              Kontakta oss idag för mer information om våra kontorslösningar och boka en visning.
            </p>
            <MagneticButton href="/kontakt" variant="primary">
              Kontakta oss
            </MagneticButton>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
}

// Blog content is published with each Git deployment.
export async function getStaticProps({ params }) {
  if (typeof params.slug !== 'string' || !/^[a-z0-9-]+$/.test(params.slug)) return { notFound: true };
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  const filePath = path.join(postsDirectory, `${params.slug}.md`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = renderMarkdown(content);

    return {
      props: {
        post: {
          slug: params.slug,
          title: data.title,
          date: data.date instanceof Date ? data.date.toISOString() : (data.date || null),
          author: data.author || null,
          authorRole: data.authorRole || null,
          excerpt: data.excerpt || content.substring(0, 150) + '...',
          content: htmlContent,
        },
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}


export async function getStaticPaths() {
  const { getPosts } = await import('../../lib/posts');
  return { paths: getPosts().map(post => ({ params: { slug: post.slug } })), fallback: false };
}

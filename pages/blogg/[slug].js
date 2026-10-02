import Layout from '../../components/Layout';
import OfficialCTA from '../../components/OfficialCTA';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { renderMarkdown } from '../../lib/blog-markdown';
import Link from 'next/link';
import Image from 'next/image';
import BlogCard from '../../components/BlogCard';

export default function BlogPost({ post, relatedPosts }) {
  const breadcrumbs = [
    { name: 'Start', path: '/' }, { name: 'Guider', path: '/blogg' },
    { name: post.title, path: `/blogg/${post.slug}` },
  ];
  return (
    <Layout title={post.title} description={post.excerpt} path={`/blogg/${post.slug}`}
      image={post.image} type="article" article={post} breadcrumbs={breadcrumbs}>
      <article className="section-container">
        <div className="max-w-4xl mx-auto">
          <Link href="/blogg" className="text-primary-700 underline underline-offset-4 mb-6 inline-block">Alla guider</Link>
          <h1 className="heading-1 mb-5">{post.title}</h1>
          <p className="text-sm text-neutral-600 mb-8">
            DG97 Kontorsguiden · Uppdaterad <time dateTime={post.modifiedDate || post.date}>
              {new Date(post.modifiedDate || post.date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </p>
          {post.image && <figure className="mb-10">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
              <Image src={post.image} alt={post.imageAlt} fill priority
                sizes="(max-width: 1024px) 100vw, 896px" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-sm text-neutral-600">Miljöbild från DG97.</figcaption>
          </figure>}
          <div className="guide-article" dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.sources.length > 0 && <aside className="mt-10 border-t border-primary-100 pt-6" aria-label="Källor och vidare läsning">
            <h2 className="text-xl font-semibold text-primary-950 mb-3">Källor och vidare läsning</h2>
            <ul className="space-y-2 text-primary-700">
              {post.sources.map(source => <li key={source}><a href={source} className="underline underline-offset-4 break-words">{source.replace(/^https:\/\//, '')}</a></li>)}
            </ul>
          </aside>}
          <div className="mt-12"><OfficialCTA title="Vill du undersöka DG97?" /></div>
        </div>
      </article>
      {relatedPosts.length > 0 && <section className="section-container pt-0" aria-labelledby="related-guides">
        <h2 id="related-guides" className="heading-2 mb-8">Läs vidare på samma tema</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedPosts.map(related => <BlogCard key={related.slug} post={related} headingLevel={3} />)}
        </div>
      </section>}
    </Layout>
  );
}

// Blog content is published with each Git deployment.
export async function getStaticProps({ params }) {
  if (typeof params.slug !== 'string' || !/^[a-z0-9-]+$/.test(params.slug)) return { notFound: true };
  const filePath = path.join(process.cwd(), 'content/posts', `${params.slug}.md`);
  try {
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    if (data.draft === true) return { notFound: true };
    return {
      props: { relatedPosts: require('../../lib/posts').getRelatedPosts(params.slug), post: {
        slug: params.slug, title: data.title,
        date: data.date instanceof Date ? data.date.toISOString() : (data.date || null),
        modifiedDate: data.modifiedDate instanceof Date ? data.modifiedDate.toISOString() : (data.modifiedDate || null),
        excerpt: data.excerpt || content.substring(0, 150) + '...',
        image: data.featuredImage || null, imageAlt: data.featuredImageAlt || data.title,
        sources: Array.isArray(data.sources) ? [...new Set(data.sources)].filter(source =>
          typeof source === 'string' && /^https:\/\//.test(source)) : [],
        content: renderMarkdown(content),
      } },
    };
  } catch (error) {
    return { notFound: true };
  }
}
export async function getStaticPaths() {
  const { getPosts } = await import('../../lib/posts');
  return { paths: getPosts().map(post => ({ params: { slug: post.slug } })), fallback: false };
}

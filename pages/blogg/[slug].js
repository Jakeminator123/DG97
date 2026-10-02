import Layout from '../../components/Layout';
import OfficialCTA from '../../components/OfficialCTA';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { renderMarkdown } from '../../lib/blog-markdown';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPost({ post }) {
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
          <div className="mt-12"><OfficialCTA title="Vill du undersöka DG97?" /></div>
        </div>
      </article>
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
      props: { post: {
        slug: params.slug, title: data.title,
        date: data.date instanceof Date ? data.date.toISOString() : (data.date || null),
        modifiedDate: data.modifiedDate instanceof Date ? data.modifiedDate.toISOString() : (data.modifiedDate || null),
        excerpt: data.excerpt || content.substring(0, 150) + '...',
        image: data.featuredImage || null, imageAlt: data.featuredImageAlt || data.title,
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

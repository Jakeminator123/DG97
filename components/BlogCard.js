import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post, headingLevel = 2 }) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return (
    <article className="bg-white border border-primary-100 rounded-xl overflow-hidden h-full">
      <Link href={`/blogg/${post.slug}`} className="block h-full">
        {post.image && <div className="relative h-48 bg-primary-50">
          <Image src={post.image} alt={post.imageAlt || post.title} fill className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        </div>}
        <div className="p-6">
          <p className="text-sm font-semibold text-primary-700 mb-3">{post.categoryLabel}</p>
          <Heading className="text-xl font-semibold text-primary-950 mb-3 hover:underline">{post.title}</Heading>
          <p className="text-neutral-700 leading-relaxed mb-4">{post.excerpt}</p>
          <span className="text-primary-700 font-semibold underline underline-offset-4">Läs guiden</span>
        </div>
      </Link>
    </article>
  );
}

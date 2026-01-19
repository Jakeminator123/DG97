import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BlogCard({ post, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-gradient overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/blogg/${post.slug}`}>
        <div className="relative h-48 bg-gray-200">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="text-sm text-gray-500 mb-2">
            {new Date(post.date).toLocaleDateString("sv-SE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

          <span className="text-primary-600 font-medium hover:underline">
            Läs mer →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { renderMarkdown } from '../../../lib/blog-markdown';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { slug } = req.query;

  // Validate slug format (prevent directory traversal)
  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug format' });
  }

  const postsDirectory = path.join(process.cwd(), 'content/posts');
  const filePath = path.join(postsDirectory, `${slug}.md`);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = renderMarkdown(content);

    res.status(200).json({
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || content.substring(0, 150) + '...',
      content: htmlContent,
      image: data.featuredImage || null,
      imageAlt: data.featuredImageAlt || data.title,
    });
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reading post:', error);
    }
    res.status(500).json({ error: 'Failed to load post' });
  }
}


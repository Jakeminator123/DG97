import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  const postsDirectory = path.join(process.cwd(), 'content/posts');

  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return res.status(200).json([]);
    }

    const filenames = fs.readdirSync(postsDirectory);

    const posts = filenames
      .filter(filename => filename.endsWith('.md'))
      .map(filename => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug: filename.replace('.md', ''),
          title: data.title,
          date: data.date,
          excerpt: data.excerpt || content.substring(0, 150) + '...',
          image: data.featuredImage || null,
          imageAlt: data.featuredImageAlt || data.title,
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(posts);
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reading posts:', error);
    }
    res.status(500).json({ error: 'Failed to load posts' });
  }
}


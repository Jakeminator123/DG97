/**
 * Admin Blog Management API
 *
 * Endpoints for managing blog posts, schedules, and generation
 */

import { verifyAdminToken } from './auth';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get blog posts
  if (req.method === 'GET') {
    try {
      const postsDir = path.join(process.cwd(), 'content', 'posts');

      if (!fs.existsSync(postsDir)) {
        return res.status(200).json({ posts: [] });
      }

      const files = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const filePath = path.join(postsDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const { frontmatter, body } = parseMarkdown(content);

          return {
            slug: file.replace('.md', ''),
            title: frontmatter.title || '',
            date: frontmatter.date || '',
            excerpt: frontmatter.excerpt || '',
            category: frontmatter.category || 'allmänt',
            featuredImage: frontmatter.featuredImage || '',
            ...frontmatter
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.status(200).json({ posts });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching posts:', error);
      }
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  // Delete blog post
  if (req.method === 'DELETE') {
    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: 'Slug required' });
      }

      const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.status(200).json({ success: true, message: 'Post deleted' });
      }

      return res.status(404).json({ error: 'Post not found' });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting post:', error);
      }
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Parse markdown frontmatter
 */
function parseMarkdown(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}


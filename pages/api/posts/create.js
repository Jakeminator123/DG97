/**
 * API endpoint to create new blog posts via GitHub API
 * POST /api/posts/create
 *
 * Requires environment variables:
 * - GITHUB_TOKEN (Personal Access Token with repo permissions)
 * - GITHUB_REPO (format: "username/repo-name")
 * - GITHUB_BRANCH (default: "main")
 *
 * Body: {
 *   title: string,
 *   content: string,
 *   excerpt: string,
 *   category: string,
 *   image: string (optional),
 *   slug: string (optional)
 * }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, content, excerpt, category, image, slug } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Validate field lengths (prevent DOS attacks)
    if (title.length > 200) {
      return res.status(400).json({ error: 'Title is too long (max 200 characters)' });
    }
    if (content.length > 50000) {
      return res.status(400).json({ error: 'Content is too long (max 50000 characters)' });
    }
    if (excerpt && excerpt.length > 500) {
      return res.status(400).json({ error: 'Excerpt is too long (max 500 characters)' });
    }
    if (category && category.length > 50) {
      return res.status(400).json({ error: 'Category is too long (max 50 characters)' });
    }
    if (slug && slug.length > 100) {
      return res.status(400).json({ error: 'Slug is too long (max 100 characters)' });
    }
    if (image && image.length > 500) {
      return res.status(400).json({ error: 'Image URL is too long' });
    }

    // Check for required environment variables
    const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'main' } = process.env;
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return res.status(500).json({
        error: 'Server not configured for remote posting. Set GITHUB_TOKEN and GITHUB_REPO environment variables.'
      });
    }

    // Generate slug
    const postSlug = slug || generateSlug(title);
    const date = new Date().toISOString().split('T')[0];

    // Create markdown content with frontmatter
    const frontmatter = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt || content.substring(0, 150) + '...'}"
featuredImage: "${image || '/images/office_room.jpg'}"
featuredImageAlt: "Illustration för ${title}"
category: "${category || 'allmänt'}"
---

`;
    const fullContent = frontmatter + content;
    const filename = `${postSlug}.md`;
    const filePath = `content/posts/${filename}`;

    // Push to GitHub via API
    const githubUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

    const response = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add blog post: ${title}`,
        content: Buffer.from(fullContent).toString('base64'),
        branch: GITHUB_BRANCH,
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return res.status(500).json({
        error: 'Failed to parse GitHub API response',
        details: process.env.NODE_ENV === 'development' ? parseError.message : undefined
      });
    }

    if (!response.ok) {
      // Check if file already exists
      if (response.status === 422) {
        return res.status(409).json({
          error: 'Post with this slug already exists',
          slug: postSlug
        });
      }
      throw new Error(data.message || 'GitHub API error');
    }

    res.status(201).json({
      success: true,
      message: 'Post created and pushed to GitHub',
      slug: postSlug,
      url: `/blogg/${postSlug}`,
      github_url: data.content?.html_url,
      info: 'Site will redeploy automatically on Render'
    });

  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating post:', error);
    }
    res.status(500).json({
      error: 'Failed to create post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title) {
  let slug = title.toLowerCase();

  // Swedish character replacements
  const replacements = {
    'å': 'a', 'ä': 'a', 'ö': 'o',
    'é': 'e', 'è': 'e', 'ê': 'e',
    'à': 'a', 'â': 'a',
    'ü': 'u', 'û': 'u',
    'î': 'i', 'ï': 'i'
  };

  for (const [old, newChar] of Object.entries(replacements)) {
    slug = slug.replace(new RegExp(old, 'g'), newChar);
  }

  // Remove special characters and replace spaces with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug;
}


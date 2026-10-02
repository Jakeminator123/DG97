const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { GUIDE_CATEGORIES } = require('../config/editorial');

function getPosts() {
  const directory = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(file => file.endsWith('.md')).map(file => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
    const category = GUIDE_CATEGORIES.find(item => item.slug === data.category) || GUIDE_CATEGORIES[1];
    return {
      draft: data.draft === true,
      slug: file.slice(0, -3),
      title: data.title || file.slice(0, -3),
      date: data.date instanceof Date ? data.date.toISOString() : (data.date || null),
      modifiedDate: data.modifiedDate instanceof Date ? data.modifiedDate.toISOString() : (data.modifiedDate || null),
      excerpt: data.excerpt || `${content.slice(0, 150)}...`,
      image: data.featuredImage || null,
      imageAlt: data.featuredImageAlt || data.title || '',
      category: category.slug,
      categoryLabel: category.label,
    };
  }).filter(post => !post.draft).sort((a, b) => new Date(b.date) - new Date(a.date) || a.title.localeCompare(b.title, 'sv'));
}

function getRelatedPosts(slug, limit = 3) {
  const posts = getPosts();
  const current = posts.find(post => post.slug === slug);
  if (!current) return [];
  return posts.filter(post => post.slug !== slug).sort((a, b) =>
    Number(b.category === current.category) - Number(a.category === current.category)
    || new Date(b.date) - new Date(a.date) || a.title.localeCompare(b.title, 'sv')
  ).slice(0, limit);
}

module.exports = { getPosts, getRelatedPosts };

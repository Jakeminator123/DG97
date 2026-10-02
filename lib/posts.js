const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

function getPosts() {
  const directory = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(file => file.endsWith('.md')).map(file => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
    return {
      draft: data.draft === true,
      slug: file.slice(0, -3),
      title: data.title || file.slice(0, -3),
      date: data.date instanceof Date ? data.date.toISOString() : (data.date || null),
      modifiedDate: data.modifiedDate instanceof Date ? data.modifiedDate.toISOString() : (data.modifiedDate || null),
      excerpt: data.excerpt || `${content.slice(0, 150)}...`,
      image: data.featuredImage || null,
      imageAlt: data.featuredImageAlt || data.title || '',
    };
  }).filter(post => !post.draft).sort((a, b) => new Date(b.date) - new Date(a.date));
}

module.exports = { getPosts };

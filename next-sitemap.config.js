/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.dg97.org',
  generateRobotsTxt: true,
  trailingSlash: false,
  additionalPaths: async () => require('./lib/posts').getPosts().map(post => ({ loc: `/blogg/${post.slug}`, lastmod: post.date || undefined })),
  exclude: [
    '/admin',
    '/api/*',
    '/foretagsportal',
    '/404',
    '/500',
    '/loading',
    '/medlemmar', // redirectar till /foretagsportal
    '/sitemap.xml',
    '/sitemap-*.xml',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/foretagsportal'] }],
    // next-sitemap lägger automatiskt in Sitemap-länk baserat på siteUrl
  },
};


/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dg97.se',
  generateRobotsTxt: true,
  trailingSlash: false,
  exclude: [
    '/404',
    '/500',
    '/loading',
    '/medlemmar', // redirectar till /foretagsportal
    '/sitemap.xml',
    '/sitemap-*.xml',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    // next-sitemap lägger automatiskt in Sitemap-länk baserat på siteUrl
  },
};


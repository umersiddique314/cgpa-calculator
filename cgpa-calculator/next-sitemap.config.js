/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://uafcalculator.live',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      }
    ],
    additionalSitemaps: [
      'https://uafcalculator.live/sitemap.xml',
      'https://uafcalculator.live/server-sitemap.xml'
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    }
  }
}

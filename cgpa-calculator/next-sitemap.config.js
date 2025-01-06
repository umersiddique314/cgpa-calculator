/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://uafcalculator.live',
	generateRobotsTxt: true,
	generateIndexSitemap: true,
	sitemapSize: 5000,
	exclude: ['/server-sitemap.xml'],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				allow: '/',
			}
		],
		additionalSitemaps: [
			'https://uafcalculator.live/server-sitemap.xml'
		],
	},
	transform: async (config, path) => {
		return {
			loc: path,
			changefreq: 'daily',
			priority: path === '/' ? 1.0 : 0.7,
			lastmod: new Date().toISOString(),
		}
	}
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://uafcalculator.live',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		additionalSitemaps: [
			'https://uafcalculator.live/server-sitemap.xml',
		],
	},
	exclude: ['/server-sitemap.xml'],
	generateIndexSitemap: false,
	changefreq: 'daily',
	priority: 0.7,
}

import { getServerSideSitemap } from 'next-sitemap'

export async function GET(request: Request) {
	const siteUrl = process.env.SITE_URL || 'https://uafcalculator.live'

	const fields = [
		{
			loc: siteUrl,
			lastmod: new Date().toISOString(),
			changefreq: 'daily',
			priority: 1.0,
		},
	]

	return getServerSideSitemap(fields)
}

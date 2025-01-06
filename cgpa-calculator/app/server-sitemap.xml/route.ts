import { getServerSideSitemap } from 'next-sitemap'
import type { ISitemapField } from 'next-sitemap'

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://uafcalculator.live'

  const fields: ISitemapField[] = [
    {
      loc: siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${siteUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }
  ]

  // Return the response directly
  return getServerSideSitemap(fields)
}
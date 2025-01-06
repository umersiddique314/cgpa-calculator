import { getServerSideSitemap } from 'next-sitemap'
import type { ISitemapField } from 'next-sitemap'

export async function GET(): Promise<Response> {
  const siteUrl = process.env.SITE_URL || 'https://uafcalculator.live'

  const fields: ISitemapField[] = [
    {
      loc: siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily' as const,
      priority: 1.0,
    },
    {
      loc: `${siteUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.8,
    }

  ]

  return getServerSideSitemap(fields)
}

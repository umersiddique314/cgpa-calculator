import { getServerSideSitemap } from 'next-sitemap'
import { MetadataRoute } from 'next'
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
  ]

  return getServerSideSitemap(fields)
}

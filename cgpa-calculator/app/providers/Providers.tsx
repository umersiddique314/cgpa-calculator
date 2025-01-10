'use client'

import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from 'react-hot-toast'

const defaultSEO = {
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://uafcalculator.live',
    siteName: 'UAF CGPA Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UAF CGPA Calculator Preview',
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/icon.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/icon.png',
      sizes: '76x76',
    },
  ],
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DefaultSeo {...defaultSEO} />
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  )
}

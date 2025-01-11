import { Metadata } from 'next';
import { keywords } from '../utils/keywords';

export const metadata: Metadata = {
  title: {
    default: "UAF CGPA Calculator | Calculate Your University GPA Easily",
    template: "%s | UAF CGPA Calculator"
  },
  description: "CGPA Calculator for University of Agriculture Faisalabad students. Calculate semester GPA and CGPA accurately with our easy-to-use tool. Get instant results for all departments.",
  keywords: [...keywords],
  authors: [{ name: "Haseeb Usman" }],
  creator: "Haseeb Usman",
  publisher: "Haseeb Usman",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL('https://uafcalculator.live'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://uafcalculator.live',
    title: 'UAF CGPA Calculator | Calculate Your University GPA Easily',
    description: 'Free UAF CGPA Calculator for University of Agriculture Faisalabad students. Calculate semester GPA and CGPA accurately with our easy-to-use tool.',
    siteName: 'UAF CGPA Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UAF CGPA Calculator Preview'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

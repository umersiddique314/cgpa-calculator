import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "UAF CGPA Calculator | Calculate Your University GPA Easily",
    template: "%s | UAF CGPA Calculator"
  },
  description: "Free UAF CGPA Calculator for University of Agriculture Faisalabad students. Calculate semester GPA and CGPA accurately with our easy-to-use tool. Get instant results for all departments.",
  keywords: [
    "UAF CGPA Calculator",
    "Uaf",
    "CGPA Calculator",
    "GPA Calculator UAF",
    "UAF GPA Calculator",
    "UAF CGPA System",
    "University of Agriculture Faisalabad",
    "GPA Calculator",
    "UAF GPA System",
    "Pakistan University Calculator",
    "Student CGPA Tool",
    "Academic Calculator UAF",
    "Semester GPA Calculator"
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
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
  twitter: {
    card: 'summary_large_image',
    title: 'UAF CGPA Calculator | Calculate Your University GPA Easily',
    description: 'Free UAF CGPA Calculator for University of Agriculture Faisalabad students. Calculate semester GPA and CGPA accurately.',
    images: ['/twitter-image.png']
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
    icon: '/image.png',
    shortcut: '/image.png',
    apple: '/image.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}

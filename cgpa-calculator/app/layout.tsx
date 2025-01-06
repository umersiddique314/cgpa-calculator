import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UAF CGPA Calculator",
    template: "%s | UAF CGPA Calculator"
  },
  description: "Calculate your CGPA for University of Agriculture Faisalabad (UAF) with our easy-to-use calculator. Get accurate results instantly.",
  keywords: ["UAF", "CGPA Calculator", "University of Agriculture Faisalabad", "GPA Calculator", "Academic Calculator"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'UAF CGPA Calculator',
    description: 'Calculate your CGPA for University of Agriculture Faisalabad (UAF) with our easy-to-use calculator.',
    siteName: 'UAF CGPA Calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UAF CGPA Calculator',
    description: 'Calculate your CGPA for University of Agriculture Faisalabad (UAF) with our easy-to-use calculator.',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
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

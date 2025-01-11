import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Providers } from './providers/Providers';
import { metadata } from './metadata';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const generateMetadata = () => metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} min-h-screen antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

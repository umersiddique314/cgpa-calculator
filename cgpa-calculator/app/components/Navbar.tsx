'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { GraduationCap, Mail, Home, Menu, X, Github, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/contact', icon: Mail, label: 'Contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center space-x-2">
            <motion.div
              className="rounded-full bg-primary/10 p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GraduationCap className="h-6 w-6 text-primary" />
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-primary/5 hover:text-primary'
                  }`}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            <a
              href="https://github.com/haseebusman0305/uaf-result-scraper"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link flex items-center space-x-2 px-3 py-2 rounded-md transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-1.5">

                <Star className="h-4 w-4" />
                <span>on </span>
                <Github className="h-5 w-5" />
              </div>
            </a>
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-900 shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-primary/5 hover:text-primary'
                    }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <a
                href="https://github.com/haseebusman0305/uaf-result-scraper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-1.5">
                  <Github className="h-5 w-5" />
                  <Star className="h-4 w-4" />
                  <span>Star on GitHub</span>
                  <svg
                    className="h-4 w-4 ml-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { GraduationCap, Mail, Home } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="animate-float">
              <GraduationCap className="h-8 w-8 text-primary transition-colors" />
            </div>
            <span className="gradient-text font-bold text-xl hidden sm:inline-block 
              transition-transform duration-300 group-hover:scale-105">
              UAF CGPA Calculator
            </span>
            <span className="gradient-text font-bold text-xl sm:hidden">
              CGPA
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="nav-link hidden sm:flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/contact" className="nav-link hidden sm:flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact</span>
            </Link>
            <div className="transition-transform hover:scale-110 active:scale-95">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

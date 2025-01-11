'use client'

import { GraduationCap } from 'lucide-react'

export default function Header() {
  return (
    <div className="text-center mb-16 space-y-4 animate-fadeIn">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-blue-600 dark:bg-blue-400 rounded-full opacity-20 blur-2xl animate-pulse" />
        </div>
        <div className="hover:scale-110 hover:rotate-3 transition-transform duration-300 ease-in-out active:scale-90">
          <GraduationCap className="w-20 h-20 mx-auto text-blue-600 dark:text-blue-400 mb-6" />
        </div>
      </div>
      <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight animate-fadeInUp">
        UAF CGPA Calculator
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
        Calculate your CGPA with precision and ease
      </p>
    </div>
  )
}


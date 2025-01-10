'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { Header } from './components/Header'
import { SearchForm } from './components/SearchForm'
import { SemesterCard } from './components/SemesterCard'
import { ResultData, CourseRow } from './types'
import { calculateCGPA, groupBySemester, calculateSemesterCGPA, caclilateOverallCGPA, resetOverallCGPA } from './utils/calculations'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function Home() {
  const [regNumber, setRegNumber] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [includedCourses, setIncludedCourses] = useState<CourseRow[]>([])
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>([])
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
    if (!regNumberPattern.test(regNumber)) {
      toast.error('Please enter a valid registration number (e.g., 2022-ag-7693)');
      return;
    }

    setLoading(true)
    setError('')
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 300)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.uafcalculator.live/api";
      const response = await fetch(`${apiUrl}/result?reg_number=${regNumber}`)
      const data = await response.json()

      if (data.status === 'success') {
        setResult(data.data)
        setExpandedSemesters([])
        toast.success('Results loaded successfully!')
      } else {
        toast.error('No results found')
        setError('No results found')
      }
    } catch (err) {
      toast.error('Failed to fetch results')
      setError('Failed to fetch results')
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    if (result) {
      resetOverallCGPA()
      setIncludedCourses(result.result_table.rows)
    }
  }, [result])

  const handleRemoveCourse = (courseCode: string) => {
    setIncludedCourses(prevCourses =>
      prevCourses.filter(course => course["Course Code"] !== courseCode)
    )
  }

  const toggleSemesterExpansion = (semester: string) => {
    if (windowWidth < 1024) {
      setExpandedSemesters(prev =>
        prev.includes(semester)
          ? prev.filter(s => s !== semester)
          : [...prev, semester]
      )
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UAF CGPA Calculator',
    description: 'Calculate your CGPA for University of Agriculture Faisalabad (UAF) with our easy-to-use calculator.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'UAF CGPA Calculator',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Header />
        <SearchForm
          regNumber={regNumber}
          loading={loading}
          onSubmit={handleSubmit}
          onRegNumberChange={setRegNumber}
        />

        {loading && (
          <div className="max-w-xl mx-auto mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center 
                         gap-3 text-red-700 dark:text-red-400 mb-8 border border-red-100 dark:border-red-800 
                         shadow-lg shadow-red-100/50 dark:shadow-red-900/50"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {result.student_info["Student Full Name"]}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.student_info["Registration #"]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total CGPA</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {caclilateOverallCGPA(includedCourses).toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(groupBySemester(includedCourses)).map(
                  ([semester, courses]) => (
                    <SemesterCard
                      key={semester}
                      semester={semester}
                      courses={courses}
                      semesterCGPA={calculateSemesterCGPA(courses)}
                      onRemoveCourse={handleRemoveCourse}
                      isExpanded={expandedSemesters.includes(semester)}
                      onToggleExpand={() => toggleSemesterExpansion(semester)}
                      isMobile={windowWidth < 1024}
                    />
                  )
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

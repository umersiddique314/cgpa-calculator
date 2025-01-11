'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, BookOpen, ChevronDown, ChevronUp, Calculator, Search, Database, Shield, CheckCircle2, GraduationCap, School, Award } from 'lucide-react'
import { Header } from './components/Header'
import { SearchForm } from './components/SearchForm'
import { SemesterCard } from './components/SemesterCard'
import { ResultData, CourseRow } from './types'
import { calculateCGPA, groupBySemester, calculateSemesterCGPA, caclilateOverallCGPA, resetOverallCGPA } from './utils/calculations'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Footer } from './components/Footer'

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
    setIncludedCourses(prevCourses => {
      const newCourses = prevCourses.filter(course => course["Course Code"] !== courseCode);
      resetOverallCGPA();
      const groupedSemesters = groupBySemester(newCourses);
      Object.values(groupedSemesters).forEach(semesterCourses => {
        calculateSemesterCGPA(semesterCourses);
      });
      return newCourses;
    });
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
    <>
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

        <section className="mb-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <GraduationCap className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                How to Use UAF Grade Calculator
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Calculate your University of Agriculture Faisalabad (UAF) CGPA instantly with our Calculator.
                Designed specifically for UAF students following the university's grading criteria.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Search,
                  title: "Enter Registration",
                  description: "Input your UAF registration number (e.g., 2022-ag-7693) to access your academic records"
                },
                {
                  icon: Calculator,
                  title: "Calculate CGPA",
                  description: "Click calculate to instantly process your semester grades and credit hours"
                },
                {
                  icon: School,
                  title: "View Results",
                  description: "See detailed semester-wise GPA breakdown and overall CGPA calculation"
                },
                {
                  icon: CheckCircle2,
                  title: "Customize Results",
                  description: "Optionally exclude specific courses to analyze different CGPA scenarios"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mb-16 px-4 bg-gray-50 dark:bg-gray-800/50 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Award className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                UAF CGPA Calculation System
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Built according to University of Agriculture Faisalabad's official grading criteria and credit hour system.
                Trusted by UAF students across all departments.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Features & Benefits</h3>
                <ul className="space-y-4">
                  {[
                    "Instant CGPA calculation based on UAF's grading system",
                    "Accurate credit hour weightage calculation",
                    "Semester-wise GPA breakdown with detailed analytics",
                    "Support for all UAF departments and programs",
                    "Real-time grade point average updates",
                    "Privacy-focused with no data storage"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Technical Process</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: Database,
                      title: "Data Retrieval",
                      description: "Securely fetches your academic records using registration number"
                    },
                    {
                      icon: Calculator,
                      title: "Grade Processing",
                      description: "Processes grades according to UAF's official grading criteria"
                    },
                    {
                      icon: Shield,
                      title: "Privacy Protection",
                      description: "Ensures data security with no storage of personal information"
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-16 px-4 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-900/50 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <School className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl" />
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block text-transparent bg-clip-text">
                UAF - University of Agriculture Faisalabad
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-4">
                Established in 1906, UAF (University of Agriculture Faisalabad) is Pakistan's premier agricultural institution.
                Our UAF CGPA Calculator follows the official University of Agriculture Faisalabad grading system to ensure accurate results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 dark:border-blue-900/50 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    UAF Grading System Overview
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "UAF CGPA calculation system implementation",
                    "Complete UAF faculty and department grade support",
                    "UAF semester system grade calculation",
                    "UAF credit hour policy compliance",
                    "Latest UAF academic criteria integration",
                    "UAF grade point average computation",
                    "UAF marks to GPA conversion system",
                    "UAF result calculation standards"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 dark:border-blue-900/50 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    UAF Academic Programs
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      title: "UAF Undergraduate",
                      programs: "BS/BSc Engineering, Agriculture, Food Sciences",
                      desc: "Calculate UAF BSc CGPA instantly",
                      icon: School
                    },
                    {
                      title: "UAF Graduate",
                      programs: "MSc/MPhil Programs across all departments",
                      desc: "UAF graduate GPA calculation system",
                      icon: Award
                    },
                    {
                      title: "UAF Doctorate",
                      programs: "PhD Programs in all disciplines",
                      desc: "UAF PhD GPA computation",
                      icon: BookOpen
                    },
                    {
                      title: "UAF Associate",
                      programs: "Associate Degree Programs",
                      desc: "UAF associate degree CGPA calculator",
                      icon: GraduationCap
                    }
                  ].map((program, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <program.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{program.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">{program.programs}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 ml-8">{program.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                UAF CGPA Calculator • Supporting all UAF Academic Sessions (2022-2025) • Updated with latest UAF grading policies
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}

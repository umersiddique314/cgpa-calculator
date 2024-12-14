'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, BookOpen } from 'lucide-react'
import { Header } from './components/Header'
import { SearchForm } from './components/SearchForm'
import { SemesterCard } from './components/SemesterCard'
import { ResultData } from './types'
import { calculateCGPA, groupBySemester, calculateSemesterCGPA } from './utils/calculations'

export default function Home() {
  const [regNumber, setRegNumber] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [includedCourses, setIncludedCourses] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 300)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/result?reg_number=${regNumber}`)
      const data = await response.json()

      if (data.status === 'success') {
        setResult(data.data)
      } else {
        setError('No results found')
      }
    } catch (err) {
      setError('Failed to fetch results')
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    if (result) {
      setIncludedCourses(result.result_table.rows)
    }
  }, [result])

  const handleRemoveCourse = (courseCode: string) => {
    setIncludedCourses(prevCourses =>
      prevCourses.filter(course => course["Course Code"] !== courseCode)
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        <SearchForm
          regNumber={regNumber}
          loading={loading}
          onSubmit={handleSubmit}
          onRegNumberChange={setRegNumber}
        />

        {loading && (
          <div className="max-w-xl mx-auto mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 
                         shadow-lg shadow-blue-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto p-6 bg-red-50 rounded-2xl flex items-center 
                       gap-4 text-red-700 animate-fade-in border border-red-100 
                       shadow-lg shadow-red-100/50">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-lg">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {result.student_info["Student Full Name"]}
                  </h2>
                  <p className="text-sm text-gray-600">{result.student_info["Registration #"]}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupBySemester(includedCourses)).map(
                ([semester, courses]) => (
                  <SemesterCard
                    key={semester}
                    semester={semester}
                    courses={courses}
                    semesterCGPA={calculateSemesterCGPA(courses)}
                    onRemoveCourse={handleRemoveCourse}
                  />
                )
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg 
                         shadow p-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Overall CGPA</h2>
                <p className="text-3xl font-bold">{calculateCGPA(includedCourses).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

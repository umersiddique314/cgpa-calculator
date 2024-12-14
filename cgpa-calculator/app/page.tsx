'use client'

import { useState, useEffect } from 'react'
// Removed 'framer-motion' import
import { Search, GraduationCap, BookOpen, AlertCircle } from 'lucide-react'
// Removed '@radix-ui/react-tabs' import

interface ResultData {
  student_info: {
    "Registration #": string;
    "Student Full Name": string;
  };
  result_table: {
    headers: string[];
    rows: Array<{
      Assignment: string;
      "Course Code": string;
      "Credit Hours": string;
      Final: string;
      Grade: string;
      Mid: string;
      Practical: string;
      Semester: string;
      Sr: string;
      Total: string;
    }>;
  };
}

const getGradeColor = (grade: string) => {
  const colors: { [key: string]: string } = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-blue-100 text-blue-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800',
    'P': 'bg-purple-100 text-purple-800',
  }
  return colors[grade] || 'bg-gray-100 text-gray-800'
}

// Replace the getGradePoint function with calculateGradePoints function
const calculateGradePoints = (course: any) => {
  const totalMarks = parseFloat(course.Total)
  const creditHours = parseCreditHours(course["Credit Hours"])
  if (!creditHours || isNaN(totalMarks)) return 0

  let maxGradePoints = 0
  let minGradePoints = 0
  let marksForMaxGP = 0
  let marksForMinGP = 0

  // Define grading system based on credit hours
  if (creditHours === 3) {
    maxGradePoints = 12
    minGradePoints = 3
    marksForMaxGP = 48
    marksForMinGP = 24
  } else if (creditHours === 2) {
    maxGradePoints = 8
    minGradePoints = 2
    marksForMaxGP = 32
    marksForMinGP = 16
  } else if (creditHours === 1) {
    maxGradePoints = 4
    minGradePoints = 1
    marksForMaxGP = 16
    marksForMinGP = 8
  } else {
    return 0
  }

  if (totalMarks >= marksForMaxGP) {
    return maxGradePoints
  } else if (totalMarks >= marksForMinGP) {
    const marksRange = marksForMaxGP - marksForMinGP
    const gpRange = maxGradePoints - minGradePoints
    const marksAboveMin = totalMarks - marksForMinGP
    const gradePoints = minGradePoints + (marksAboveMin * gpRange) / marksRange
    return gradePoints
  } else {
    return minGradePoints
  }
}

// Add the missing parseCreditHours function
const parseCreditHours = (creditHoursStr: string) => {
  const match = creditHoursStr.match(/^(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

// Update the calculateCGPA function
const calculateCGPA = (courses: any[]) => {
  let totalGradePoints = 0
  let totalCreditHours = 0

  courses.forEach(course => {
    const creditHours = parseCreditHours(course["Credit Hours"])
    const gradePoints = calculateGradePoints(course)
    if (creditHours !== null) {
      totalGradePoints += gradePoints
      totalCreditHours += creditHours
    }
  })
  if (totalCreditHours === 0) return 0
  return (totalGradePoints / totalCreditHours) 
}

// Add SemesterCard component
const SemesterCard = ({
  semester,
  courses,
  onRemoveCourse,
  semesterCGPA,
}: {
  semester: string
  courses: any[]
  onRemoveCourse: (courseCode: string) => void
  semesterCGPA: number
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold mb-4">{semester}</h2>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="py-2">Course Code</th>
          <th className="py-2">Credit Hours</th>
          <th className="py-2">Grade</th>
          <th className="py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, index) => (
          <tr key={index}>
            <td className="py-1">{course["Course Code"]}</td>
            <td className="py-1">{course["Credit Hours"]}</td>
            <td className="py-1">{course.Grade}</td>
            <td className="py-1">
              <button
                onClick={() => onRemoveCourse(course["Course Code"])}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-4">
      <p className="font-semibold">Semester CGPA: {semesterCGPA.toFixed(2)}</p>
    </div>
  </div>
)

const CourseCard = ({ course, onRemove }: { course: any, onRemove: (courseCode: string) => void }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-lg">{course["Course Code"]}</h3>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.Grade)}`}>
        {course.Grade}
      </span>
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <p>Credit Hours: {course["Credit Hours"]}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>Mid: {course.Mid}</div>
        <div>Assignment: {course.Assignment}</div>
        <div>Final: {course.Final}</div>
        <div>Total: {course.Total}</div>
      </div>
      {course.Practical !== "0" && (
        <div className="mt-2">Practical: {course.Practical}</div>
      )}
    </div>
    <button
      onClick={() => onRemove(course["Course Code"])}
      className="text-red-500 hover:text-red-700 mt-2"
    >
      Remove
    </button>
  </div>
)

export default function Home() {
  const [regNumber, setRegNumber] = useState('')
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [activeSemester, setActiveSemester] = useState('')
  const [includedCourses, setIncludedCourses] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 300)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/result?reg_number=${regNumber}`)
      const data = await response.json()

      if (data.status === 'success') {
        setResult(data.data)
        setActiveSemester(Object.keys(groupBySemester(data.data.result_table.rows))[0])
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

  const groupBySemester = (rows: any[]) => {
    return rows?.reduce((acc: any, course) => {
      const sem = course.Semester
      if (!acc[sem]) acc[sem] = []
      acc[sem].push(course)
      return acc
    }, {})
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

  const calculateSemesterCGPA = (courses: any[]) => {
    return calculateCGPA(courses)
  }

  const cgpa = calculateCGPA(includedCourses)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section - More Compact */}
        <div className="text-center mb-10 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-20">
              <div className="w-32 h-32 bg-blue-600 rounded-full"></div>
            </div>
            <GraduationCap className="w-14 h-14 mx-auto text-blue-600 mb-4" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            UAF CGPA Calculator
          </h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Calculate your CGPA with precision and ease
          </p>
        </div>

        {/* Search Form - More Compact */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
          <div className="relative group">
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="Enter Registration Number (e.g., 2022-ag-7693)"
              className="w-full px-4 py-3 pl-12 pr-16 rounded-lg border border-gray-200 
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none 
                       transition-all duration-300 text-sm bg-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 
                       bg-blue-600 text-white rounded-md text-sm font-medium
                       hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Loading Bar */}
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

        {/* Error Message */}
        {error && (
          <div className="max-w-xl mx-auto p-6 bg-red-50 rounded-2xl flex items-center 
                       gap-4 text-red-700 animate-fade-in border border-red-100 
                       shadow-lg shadow-red-100/50">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-lg">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Student Info Card - More Compact */}
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
            {/* Semester Cards - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupBySemester(includedCourses)).map(
                ([semester, courses]: [string, any[]]) => {
                  const semesterCGPA = calculateSemesterCGPA(courses)
                  return (
                    <div key={semester} className="bg-white rounded-lg shadow p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          {semester}
                        </h2>
                        <span className="text-sm font-medium text-blue-600">
                          CGPA: {semesterCGPA.toFixed(2)}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Course</th>
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Hours</th>
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Grade</th>
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {courses.map((course, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 whitespace-nowrap">{course["Course Code"]}</td>
                                <td className="px-2 py-2">{course["Credit Hours"]}</td>
                                <td className="px-2 py-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                               ${getGradeColor(course.Grade)}`}>
                                    {course.Grade}
                                  </span>
                                </td>
                                <td className="px-2 py-2">
                                  <button
                                    onClick={() => handleRemoveCourse(course["Course Code"])}
                                    className="text-xs text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                }
              )}
            </div>

            {/* Overall CGPA - More Compact */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg 
                         shadow p-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Overall CGPA</h2>
                <p className="text-3xl font-bold">{cgpa.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

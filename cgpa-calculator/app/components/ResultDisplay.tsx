import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { SemesterCard } from './SemesterCard'
import { CourseRow, ResultData } from '../types'
import { groupBySemester, calculateSemesterCGPA, caclilateOverallCGPA } from '../utils/calculations'

interface ResultDisplayProps {
  result: ResultData
  includedCourses: CourseRow[]
  expandedSemesters: string[]
  windowWidth: number
  onRemoveCourse: (courseCode: string) => void
  onAddCourse: (course: CourseRow) => void
  toggleSemesterExpansion: (semester: string) => void
}

export const ResultDisplay = ({
  result,
  includedCourses,
  expandedSemesters,
  windowWidth,
  onRemoveCourse,
  onAddCourse,
  toggleSemesterExpansion
}: ResultDisplayProps) => {
  return (
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
        {Object.entries(groupBySemester(includedCourses)).map(([semester, courses]) => (
          <SemesterCard
            key={semester}
            semester={semester}
            courses={courses}
            semesterCGPA={calculateSemesterCGPA(courses)}
            onRemoveCourse={onRemoveCourse}
            onAddCourse={onAddCourse}
            isExpanded={expandedSemesters.includes(semester)}
            onToggleExpand={() => toggleSemesterExpansion(semester)}
            isMobile={windowWidth < 1024}
          />
        ))}
      </div>
    </motion.div>
  )
}

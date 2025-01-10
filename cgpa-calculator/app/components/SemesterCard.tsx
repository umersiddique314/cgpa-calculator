import { useState } from 'react'
import { BookOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getGradeColor } from '../utils/gradeUtils'
import { CourseRow } from '../types'
import { calculateGradePoints } from '../utils/calculations'

export interface SemesterCardProps {
  semester: string;
  courses: CourseRow[];
  semesterCGPA: number;
  onRemoveCourse: (courseCode: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMobile: boolean;
}

export const SemesterCard = ({
  semester,
  courses,
  semesterCGPA,
  onRemoveCourse,
  isExpanded,
  onToggleExpand,
  isMobile
}: SemesterCardProps) => {
  const tableContent = (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 dark:bg-gray-700/50">
        <tr>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Course</th>
          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Hours</th>
          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Marks</th>
          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Grade</th>
          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">GP</th>
          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {courses.map((course, index) => (
          <tr
            key={course["Course Code"]}
            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td className="px-3 py-2 whitespace-nowrap">{course["Course Code"]}</td>
            <td className="px-2 py-2">{course["Credit Hours"]}</td>
            <td className="px-2 py-2">{course["Total"]}</td>
            <td className="px-2 py-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(course.Grade)}`}>
                {course.Grade}
              </span>
            </td>
            <td className="px-2 py-2 text-blue-600 font-medium">
              {calculateGradePoints(course).toFixed(2)}
            </td>
            <td className="px-2 py-2">
              <button
                onClick={() => onRemoveCourse(course["Course Code"])}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <div
          className={`flex items-center justify-between mb-4 ${isMobile ? 'cursor-pointer' : ''}`}
          onClick={isMobile ? onToggleExpand : undefined}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {semester}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              CGPA: {semesterCGPA.toFixed(4)}
            </span>
            {isMobile && (
              isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )
            )}
          </div>
        </div>

        {isMobile ? (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="overflow-x-auto">
                  {tableContent}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="overflow-x-auto">
            {tableContent}
          </div>
        )}
      </div>
    </div>
  )
}

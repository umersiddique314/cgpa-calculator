import { BookOpen } from 'lucide-react'
import { getGradeColor } from '../utils/gradeUtils'
import { CourseRow } from '../types'

export interface SemesterCardProps {
  semester: string;
  courses: CourseRow[];
  semesterCGPA: number;
  onRemoveCourse: (courseCode: string) => void;
}

export const SemesterCard = ({ semester, courses, semesterCGPA, onRemoveCourse }: SemesterCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
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
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Marks Obtained</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Grade</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((course, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">{course["Course Code"]}</td>
                <td className="px-2 py-2">{course["Credit Hours"]}</td>
                <td className="px-2 py-2">{course["Total"]}</td>
                <td className="px-2 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(course.Grade)}`}>
                    {course.Grade}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => onRemoveCourse(course["Course Code"])}
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

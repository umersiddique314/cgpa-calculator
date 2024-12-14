import { CourseRow } from '../types'

export const calculateGradePoints = (course: CourseRow) => {
  const totalMarks = parseFloat(course.Total)
  const creditHours = parseCreditHours(course["Credit Hours"])
  if (!creditHours || isNaN(totalMarks)) return 0

  let maxGradePoints = 0
  let minGradePoints = 0
  let marksForMaxGP = 0
  let marksForMinGP = 0

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

export const parseCreditHours = (creditHoursStr: string) => {
  const match = creditHoursStr.match(/^(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

export const calculateCGPA = (courses: CourseRow[]) => {
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

export const calculateSemesterCGPA = (courses: CourseRow[]) => {
  return calculateCGPA(courses)
}

export function groupBySemester(courses: CourseRow[]): Record<string, CourseRow[]> {
  return courses.reduce((acc, course) => {
    const semester = course.Semester;
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(course);
    return acc;
  }, {} as Record<string, CourseRow[]>);
}

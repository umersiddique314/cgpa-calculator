import { CourseRow } from '../types'
let overallCGPA = 0;
let totalSemesters = 0;
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
    const totalGap = marksForMaxGP - totalMarks
    let totalDeduction = 0

    for (let i = 0; i < totalGap; i++) {
      const position = i % 3;
      if (position === 0) totalDeduction += 0.33;
      else if (position === 1) totalDeduction += 0.34;
      else totalDeduction += 0.33;
    }

    const gradePoints = maxGradePoints - totalDeduction
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
  const res = calculateCGPA(courses)
  overallCGPA += res
  totalSemesters++
  return res
}
export const caclilateOverallCGPA = (courses: CourseRow[]) => {
  return (overallCGPA / totalSemesters)
}

function getSemesterType(semester: string): 'Spring' | 'Winter' {
  return semester.toLowerCase().includes('spring') ? 'Spring' : 'Winter';
}

function getSemesterYear(semester: string): number {
  const match = semester.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

function isValidImprovement(original: CourseRow, improvement: CourseRow): boolean {
  const originalType = getSemesterType(original.Semester);
  const improvementType = getSemesterType(improvement.Semester);

  const originalYear = getSemesterYear(original.Semester);
  const improvementYear = getSemesterYear(improvement.Semester);

  return originalType === improvementType && improvementYear > originalYear;
}

interface CourseImprovement {
  originalSemester: string;
  improvedGrade: CourseRow;
}

function needsImprovement(grade: string): boolean {
  return grade === 'D' || grade === 'F';
}

function compareSemesters(sem1: string, sem2: string): number {
  // Extract year range (e.g., "2023-2024" from "Spring Semester 2023-2024")
  const getYearRange = (sem: string) => {
    const match = sem.match(/(\d{4})-(\d{4})/);
    return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0];
  };

  const [year1Start, year1End] = getYearRange(sem1);
  const [year2Start, year2End] = getYearRange(sem2);

  if (year1Start !== year2Start) {
    return year1Start - year2Start;
  }
  if (year1End !== year2End) {
    return year1End - year2End;
  }

  // If years are same, check semester type (Spring comes after Winter)
  const type1 = getSemesterType(sem1);
  const type2 = getSemesterType(sem2);
  return type1 === type2 ? 0 : (type1 === 'Spring' ? 1 : -1);
}

export function groupBySemester(courses: CourseRow[]): Record<string, CourseRow[]> {
  // Sort courses by semester chronologically
  const sortedCourses = [...courses].sort((a, b) =>
    compareSemesters(a.Semester, b.Semester)
  );

  // Track the latest version of each course
  const courseVersions = new Map<string, {
    originalSemester: string;
    latestGrade: CourseRow;
  }>();

  // First pass: identify all courses and their improvements
  sortedCourses.forEach(course => {
    const courseCode = course["Course Code"];
    const existing = courseVersions.get(courseCode);

    if (!existing) {
      courseVersions.set(courseCode, {
        originalSemester: course.Semester,
        latestGrade: course
      });
    } else if (needsImprovement(existing.latestGrade.Grade)) {
      // Only update if previous grade needed improvement
      if (compareSemesters(course.Semester, existing.latestGrade.Semester) > 0) {
        courseVersions.set(courseCode, {
          originalSemester: existing.originalSemester,
          latestGrade: course
        });
      }
    }
  });

  // Group courses by semester
  const semesterGroups: Record<string, CourseRow[]> = {};

  // Process each original course
  sortedCourses.forEach(course => {
    const courseCode = course["Course Code"];
    const versionInfo = courseVersions.get(courseCode);

    if (!versionInfo) return;

    // Only process if this is the original semester or it's the improved grade
    if (course.Semester === versionInfo.originalSemester) {
      if (!semesterGroups[course.Semester]) {
        semesterGroups[course.Semester] = [];
      }
      // Use the latest grade in the original semester
      semesterGroups[course.Semester].push(versionInfo.latestGrade);
    }
  });

  // Sort semesters chronologically
  return Object.keys(semesterGroups)
    .sort(compareSemesters)
    .reduce((acc, semester) => {
      acc[semester] = semesterGroups[semester];
      return acc;
    }, {} as Record<string, CourseRow[]>);
}

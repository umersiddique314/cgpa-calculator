import { CourseRow } from '../types'
let overallCGPA = 0;
let totalSemesters = 0;
export const calculateGradePoints = (course: CourseRow) => {
  const totalMarks = parseFloat(course.total)
  const creditHours = parseCreditHours(course.credit_hours)
  if (!creditHours || isNaN(totalMarks)) return 0

  // Return 0 grade points for F grade
  if (course.grade === 'F') return 0

  let maxGradePoints = 0
  let minGradePoints = 0
  let marksForMaxGP = 0
  let marksForMinGP = 0


  if (creditHours === 5) {
    maxGradePoints = 20
    minGradePoints = 5
    marksForMaxGP = 80
    marksForMinGP = 40
  } else if (creditHours === 4) {
    maxGradePoints = 16
    minGradePoints = 4
    marksForMaxGP = 60
    marksForMinGP = 32
  } else if (creditHours === 3) {
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
    let dGradeMarks = marksForMinGP + creditHours * 2
    let totalDeduction = 0
    if (totalMarks <= dGradeMarks) {
      const gap = totalMarks - marksForMinGP;
      const grades = minGradePoints + (gap * 0.5);
      return grades
    } else {
      for (let i = 0; i < totalGap; i++) {
        const position = i % 3;
        if (position === 0) totalDeduction += 0.33;
        else if (position === 1) totalDeduction += 0.34;
        else totalDeduction += 0.33;
      }
      const gradePoints = maxGradePoints - totalDeduction
      return gradePoints
    }

  } else {
    return minGradePoints
  }
}

export const parseCreditHours = (creditHoursStr: string) => {
  const match = creditHoursStr?.match(/^(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

const getMaxGradePoints = (creditHours: number): number => {
  switch (creditHours) {
    case 5: return 20;
    case 4: return 16;
    case 3: return 12;
    case 2: return 8;
    case 1: return 4;
    default: return 0;
  }
}

export const calculateCGPA = (courses: CourseRow[]) => {
  let totalObtainedGradePoints = 0
  let totalMaximumGradePoints = 0

  courses.forEach(course => {
    const creditHours = parseCreditHours(course.credit_hours)
    if (creditHours !== null) {
      const obtainedGradePoints = calculateGradePoints(course)
      const maximumGradePoints = getMaxGradePoints(creditHours)
      
      totalObtainedGradePoints += obtainedGradePoints
      totalMaximumGradePoints += maximumGradePoints
    }
  })

  if (totalMaximumGradePoints === 0) return 0
  
  // Calculate CGPA by dividing obtained grade points by maximum possible grade points and multiplying by 4
  const cgpa = (totalObtainedGradePoints / totalMaximumGradePoints) * 4
  
  // Round to 4 decimal places
  return Math.round(cgpa * 10000) / 10000
}

export const calculateSemesterCGPA = (courses: CourseRow[]) => {
  const cgpa = calculateCGPA(courses)
  return cgpa
}

export const calculateOverallCGPA = (courses: CourseRow[]) => {
  let totalObtainedGradePoints = 0
  let totalCreditHours = 0

  // Create a map to track the highest grade for each course code
  const courseGrades = new Map<string, {
    gradePoints: number;
    creditHours: number;
  }>();

  courses.forEach(course => {
    const creditHours = parseCreditHours(course.credit_hours)
    if (creditHours !== null) {
      const obtainedGradePoints = calculateGradePoints(course)
      const courseCode = course.course_code

      // Check if we've seen this course before
      const existing = courseGrades.get(courseCode)
      if (!existing || obtainedGradePoints > existing.gradePoints) {
        // Store the higher grade points
        courseGrades.set(courseCode, {
          gradePoints: obtainedGradePoints,
          creditHours: creditHours
        })
      }
    }
  })

  // Sum up the highest grades for each unique course
  courseGrades.forEach(({ gradePoints, creditHours }) => {
    totalObtainedGradePoints += gradePoints
    totalCreditHours += creditHours * 4 
  })

  if (totalCreditHours === 0) return 0
  
  // Calculate overall CGPA by dividing total obtained grade points by total possible credit hours and multiplying by 4
  const cgpa = (totalObtainedGradePoints / totalCreditHours) * 4
  
  // Round to 4 decimal places
  return Math.round(cgpa * 10000) / 10000
}

export const resetOverallCGPA = () => {
  overallCGPA = 0;
  totalSemesters = 0;
}

function getSemesterType(semester: string): 'Spring' | 'Winter' {
  return semester?.toLowerCase().includes('spring') ? 'Spring' : 'Winter';
}

function getSemesterYear(semester: string): number {
  const match = semester.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

function isValidImprovement(original: CourseRow, improvement: CourseRow): boolean {
  const originalType = getSemesterType(original.semester);
  const improvementType = getSemesterType(improvement.semester);

  const originalYear = getSemesterYear(original.semester);
  const improvementYear = getSemesterYear(improvement.semester);

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
    const match = sem?.match(/(\d{4})-(\d{4})/);
    return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0];
  };

  const [year1Start, year1End] = getYearRange(sem1);
  const [year2Start, year2End] = getYearRange(sem2);

  // Compare academic years first
  if (year1Start !== year2Start) {
    return year1Start - year2Start;
  }
  if (year1End !== year2End) {
    return year1End - year2End;
  }

  return 0; // If years are same, consider them equal for sorting purposes
}

export function groupBySemester(courses: CourseRow[]): Record<string, CourseRow[]> {
  // Sort courses by semester chronologically
  const sortedCourses = [...courses].sort((a, b) =>
    compareSemesters(a.semester, b.semester)
  );

  // Track first appearance and best grade for each course
  const courseInfo = new Map<string, {
    firstSemester: string;
    bestGrade: CourseRow;
    bestGradePoints: number;
  }>();

  // First pass: record first appearance and track best grades
  sortedCourses.forEach(course => {
    const courseCode = course.course_code;
    const currentGradePoints = calculateGradePoints(course);
    const existing = courseInfo.get(courseCode);

    if (!existing) {
      // First time seeing this course
      courseInfo.set(courseCode, {
        firstSemester: course.semester,
        bestGrade: course,
        bestGradePoints: currentGradePoints
      });
    } else if (currentGradePoints > existing.bestGradePoints) {
      // Found a better grade
      courseInfo.set(courseCode, {
        firstSemester: existing.firstSemester, // Keep original semester
        bestGrade: {
          ...course,
          semester: existing.firstSemester, // Use original semester
          teacher_name: `${course.teacher_name} (Improved)` // Mark as improved
        },
        bestGradePoints: currentGradePoints
      });
    }
  });

  // Group courses by semester
  const semesterGroups: Record<string, CourseRow[]> = {};

  // Add each course to its first semester with its best grade
  courseInfo.forEach(({ firstSemester, bestGrade }) => {
    if (!semesterGroups[firstSemester]) {
      semesterGroups[firstSemester] = [];
    }
    semesterGroups[firstSemester].push(bestGrade);
  });

  // Sort semesters chronologically
  return Object.keys(semesterGroups)
    .sort(compareSemesters)
    .reduce((acc, semester) => {
      acc[semester] = semesterGroups[semester];
      return acc;
    }, {} as Record<string, CourseRow[]>);
}

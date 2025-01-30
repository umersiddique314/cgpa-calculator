
export interface ApiResponse {
  status: 'success' | 'error';
  data: ResultData;
}

export interface ResultData {
  title: string;
  header_image: string;
  student_info: StudentInfo;
  result_table: ResultTable;
}

export interface StudentInfo {
  registration_: string;
  student_full_name: string;
}

export interface ResultTable {
  headers: string[];
  rows: CourseRow[];
}

export interface CourseRow {
  sr: string;
  semester: string;
  teacher_name: string;
  course_code: string;
  course_title: string;
  credit_hours: string;
  mid: string;
  assignment: string;
  final: string;
  practical: string;
  total: string;
  grade: string;
}

// Helper functions to ensure consistent access
export const getStudentInfo = (info: StudentInfo) => ({
  registration: info.registration_,
  fullName: info.student_full_name
});

export const getCourseField = (course: CourseRow, field: keyof CourseRow) => {
  return course[field] || "";
};
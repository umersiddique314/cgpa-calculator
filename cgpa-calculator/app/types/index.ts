import { CourseRow, ResultData } from '../types';

export * from '../types';

export interface ApiResponse {
  status: 'success' | 'error';
  data: ResultData;
}

// Helper functions can stay
export const getStudentInfo = (info: ResultData['student_info']) => ({
  registration: info.registration_,
  fullName: info.student_full_name
});

export const getCourseField = (course: CourseRow, field: keyof CourseRow) => {
  return course[field] || "";
};
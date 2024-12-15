export interface ResultData {
  student_info: {
    "Registration #": string;
    "Student Full Name": string;
  };
  result_table: {
    headers: string[];
    rows: CourseRow[];
  };
}
   
export interface CourseRow {
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
}

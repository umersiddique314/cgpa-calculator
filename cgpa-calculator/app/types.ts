export interface CourseRow {
  "Course Code": string;
  "Course Title": string;
  "Credit Hours": string;
  Grade: string;
  Semester: string;
  Total: string;
  Assignment?: string;
  Final?: string;
  Mid?: string;
  Practical?: string;
  Srts?: string;
  Sr?: string;
  [key: string]: string | undefined;
}

export interface ResultTable {
  rows: CourseRow[];
  headers: string[];
}

export interface ResultData {
  student_info: {
    "Student Full Name": string;
    "Registration #": string;
    [key: string]: string;
  };
  result_table: ResultTable;
}

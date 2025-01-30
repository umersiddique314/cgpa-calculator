import * as cheerio from 'cheerio';

export interface ResultData {
  status: string;
  response_time: string;
  data: {
    title: string;
    header_image: string;
    student_info: {
      "Registration #": string;
      "Student Full Name": string;
    };
    result_table: {
      headers: string[];
      rows: Array<{
        "Sr": string;
        "Semester": string;
        "Teacher Name": string;
        "Course Code": string;
        "Course Title": string;
        "Credit Hours": string;
        "Mid": string;
        "Assignment": string;
        "Final": string;
        "Practical": string;
        "Total": string;
        "Grade": string;
      }>;
    };
  };
}

export class ResultParser {
  static parse(html: string): ResultData {
    const startTime = Date.now();
    const $ = cheerio.load(html);

    // Get result table headers with proper casing
    const headers = [
      'Sr',
      'Semester',
      'Teacher Name',
      'Course Code',
      'Course Title',
      'Credit Hours',
      'Mid',
      'Assignment',
      'Final',
      'Practical',
      'Total',
      'Grade'
    ];

    // Get result rows
    const rows: any[] = [];
    $('table.table.tab-content').last().find('tr:gt(0)').each((_, row) => {
      const rowData: Record<string, string> = {};
      const cols = $(row).find('td');
      
      if (cols.length === headers.length) {
        cols.each((i, col) => {
          rowData[headers[i]] = $(col).text().trim();
        });
        if (Object.keys(rowData).length > 0) {
          rows.push(rowData);
        }
      }
    });

    // Get student info with exact key names
    const studentInfo: Record<string, string> = {};
    $('table.table.tab-content').first().find('tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length === 2) {
        const key = $(cols[0]).text().trim();
        const value = $(cols[1]).text().trim();
        if (key.includes('Registration') || key.includes('Student Full Name')) {
          studentInfo[key.replace(/:/g, '').trim()] = value;
        }
      }
    });

    // Calculate response time
    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);

    return {
      status: 'success',
      response_time: `${responseTime}s`,
      data: {
        title: $('h3[align="center"]').first().text().trim() || 'Result Award List',
        header_image: 'lms-head.png',
        student_info: {
          "Registration #": studentInfo["Registration #"] || '',
          "Student Full Name": studentInfo["Student Full Name"] || ''
        },
        result_table: {
          headers,
          rows
        }
      }
    };
  }
}

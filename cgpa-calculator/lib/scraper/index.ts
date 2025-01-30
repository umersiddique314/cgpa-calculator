import axios from 'axios';
import * as cheerio from 'cheerio';
import { CONFIG } from './config';
import type { ResultData } from './parser';

export class UAFScraper {
  private async submitFormAndGetResult(regNumber: string): Promise<string> {
    try {
      // Step 1: First fetch the login page to get the token
      const loginPageResponse = await axios.get(CONFIG.LOGIN_URL, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Step 2: Create a new session with cookies
      const cookies = loginPageResponse.headers['set-cookie'];
      const cookieHeader = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';

      // Extract token with improved regex
      const tokenMatch = loginPageResponse.data.match(/document\.getElementById\(['"]token['"]\)\.value\s*=\s*['"]([^'"]+)['"]/);
      const token = tokenMatch ? tokenMatch[1] : '';
      
      if (!token) {
        throw new Error('Failed to extract authentication token');
      }

      // Step 3: Submit form with proper headers and cookies
      const formData = new URLSearchParams();
      formData.append('Register', regNumber);
      formData.append('token', token);

      const resultResponse = await axios.post(CONFIG.RESULT_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Origin': 'http://lms.uaf.edu.pk',
          'Referer': CONFIG.LOGIN_URL,
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        maxRedirects: 5,
        validateStatus: null, // Accept all status codes to handle them manually
        timeout: CONFIG.AXIOS_TIMEOUT,
        withCredentials: true
      });

      if (resultResponse.status !== 200) {
        throw new Error(`Server responded with status code ${resultResponse.status}`);
      }

      const html = resultResponse.data;

      // Basic HTML validation
      if (typeof html !== 'string' || html.length < 100) {
        throw new Error('Invalid HTML response received');
      }

      // Check for essential elements
      if (!html.includes('table class="table tab-content"')) {
        throw new Error('Response missing result table');
      }

      return html;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        throw new Error(`Network error (${statusCode}): ${responseData || error.message}`);
      }
      throw error;
    }
  }

  async getResult(regNumber: string): Promise<ResultData> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < CONFIG.MAX_RETRIES) {
      try {
        // Get the result page HTML
        const html = await this.submitFormAndGetResult(regNumber);
        
        // Parse the HTML and return structured data
        const $ = cheerio.load(html);

        // Extract student info from first table
        const studentInfo = this.extractStudentInfo($);
        if (!studentInfo.registration_) {
          throw new Error('Could not find student information');
        }

        // Extract result data from second table
        const resultData = this.extractResultData($);
        if (resultData.results.length === 0) {
          throw new Error('No result data found');
        }

        return {
          metadata: {
            title: $('h3[align="center"]').first().text().trim() || 'Result Award List',
            header_image: 'lms-head.png'
          },
          student_info: studentInfo,
          headers: resultData.headers,
          results: resultData.results
        };

      } catch (error) {
        lastError = error as Error;
        retries++;
        if (retries < CONFIG.MAX_RETRIES) {
          await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY));
        }
      }
    }

    throw lastError || new Error('Failed to fetch results after maximum retries');
  }

  private extractStudentInfo($: cheerio.CheerioAPI): Record<string, string> {
    const info: Record<string, string> = {};
    $('table.table.tab-content').first().find('tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length === 2) {
        const key = $(cols[0]).text().trim().toLowerCase().replace(/[\s#:]+/g, '_');
        const value = $(cols[1]).text().trim();
        if (key && value) {
          info[key] = value;
        }
      }
    });
    return info;
  }

  private extractResultData($: cheerio.CheerioAPI) {
    const headers: string[] = [];
    const results: Record<string, string>[] = [];

    const resultTable = $('table.table.tab-content').last();
    
    // Extract headers
    resultTable.find('tr:first-child th').each((_, th) => {
      headers.push($(th).text().trim().toLowerCase().replace(/\s+/g, '_'));
    });

    // Extract rows
    resultTable.find('tr:gt(0)').each((_, row) => {
      const rowData: Record<string, string> = {};
      $(row).find('td').each((i, col) => {
        if (i < headers.length) {
          rowData[headers[i]] = $(col).text().trim();
        }
      });
      if (Object.keys(rowData).length === headers.length) {
        results.push(rowData);
      }
    });

    return { headers, results };
  }
}

export const scraper = new UAFScraper();

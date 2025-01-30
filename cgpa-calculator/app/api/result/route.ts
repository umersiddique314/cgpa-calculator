
import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper';
import { ResultParser } from '@/lib/scraper/parser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const regNumber = searchParams.get('reg_number');

    if (!regNumber) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Registration number is required' 
      }, { status: 400 });
    }

    // Add reg number validation
    const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
    if (!regNumberPattern.test(regNumber)) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid registration number format'
      }, { status: 400 });
    }

    const result = await scraper.getResult(regNumber);
    
    return NextResponse.json({
      status: 'success',
      data: {
        metadata: result.metadata,
        student_info: result.student_info,
        result_table: result.result_table
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

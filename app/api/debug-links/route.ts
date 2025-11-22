// app/api/debug-links/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
  try {
    const pool = await getDb();
    
    try {
      const result = await pool.query('SELECT * FROM links');
      console.log('All links in database:', result.rows);
      
      return NextResponse.json({
        success: true,
        links: result.rows,
        count: result.rows.length
      });
    } finally {
      await pool.end();
    }
  } catch (error) {
    console.error('Error debugging links:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
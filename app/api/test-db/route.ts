// app/api/test-db/route.ts
import { getDb } from '../../../lib/db';

export async function GET() {
  try {
    const pool = await getDb();
    const result = await pool.query('SELECT NOW() as current_time');
    await pool.end();
    
    return Response.json({ 
      success: true, 
      currentTime: result.rows[0].current_time 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
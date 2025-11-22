// app/api/links/[code]/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

// Define the parameter type
type Params = {
  code: string;
};

// GET /api/links/[code] - Get stats for a specific code
export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const params = await context.params;
    const { code } = params;
    
    console.log('Fetching link with code:', code);
    
    const pool = await getDb();

    try {
      const result = await pool.query(
        `SELECT id, code, original_url, clicks, last_clicked, created_at 
         FROM links WHERE code = $1`,
        [code]
      );

      if (result.rows.length === 0) {
        console.log('Link not found for code:', code);
        return NextResponse.json(
          { success: false, error: 'Link not found' },
          { status: 404 }
        );
      }

      const link = result.rows[0];
      console.log('Found link:', link);
      
      return NextResponse.json({
        success: true,
        link: {
          id: link.id,
          code: link.code,
          original_url: link.original_url,
          clicks: link.clicks,
          last_clicked: link.last_clicked,
          created_at: link.created_at
        }
      });

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/[code] - Delete a link
export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const params = await context.params;
    const { code } = params;
    
    console.log('Deleting link with code:', code);
    
    const pool = await getDb();

    try {
      const result = await pool.query(
        'DELETE FROM links WHERE code = $1 RETURNING id',
        [code]
      );

      if (result.rows.length === 0) {
        console.log('Link not found for deletion:', code);
        return NextResponse.json(
          { success: false, error: 'Link not found' },
          { status: 404 }
        );
      }

      console.log('Successfully deleted link with code:', code);
      return NextResponse.json({ 
        success: true, 
        message: 'Link deleted successfully' 
      });

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
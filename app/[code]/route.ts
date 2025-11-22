// app/[code]/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../lib/db';

type Params = {
  code: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const params = await context.params;
    const { code } = params;
    
    console.log('Redirect request for code:', code);
    
    const pool = await getDb();

    try {
      // Find the link by code
      const result = await pool.query(
        `SELECT id, original_url, clicks 
         FROM links WHERE code = $1`,
        [code]
      );

      if (result.rows.length === 0) {
        console.log('Link not found for code:', code);
        return NextResponse.json(
          { error: 'Link not found' },
          { status: 404 }
        );
      }

      const link = result.rows[0];
      const originalUrl = link.original_url;

      // Update click count and last_clicked time
      await pool.query(
        `UPDATE links 
         SET clicks = clicks + 1, last_clicked = $1 
         WHERE id = $2`,
        [new Date(), link.id]
      );

      console.log(`Redirecting ${code} to ${originalUrl}`);
      console.log(`Click count updated: ${link.clicks + 1}`);

      // Perform HTTP 302 redirect
      return NextResponse.redirect(originalUrl, 302);

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error during redirect:', error);
    
    // Return 404 for any errors to match specification
    return NextResponse.json(
      { error: 'Link not found' },
      { status: 404 }
    );
  }
}
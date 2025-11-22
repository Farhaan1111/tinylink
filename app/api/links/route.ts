// app/api/links/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { generateShortCode, isValidUrl, isValidCustomCode } from '../../../lib/utils';

export async function POST(request: Request) {
  try {
    const { url, customCode }: { url: string; customCode?: string } = await request.json();

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Validate custom code if provided
    let finalCode: string;
    if (customCode) {
      if (!isValidCustomCode(customCode)) {
        return NextResponse.json(
          { success: false, error: 'Custom code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
      finalCode = customCode;
    } else {
      finalCode = generateShortCode();
    }

    const pool = await getDb();

    try {
      // Check if code already exists
      const existingLink = await pool.query(
        'SELECT id FROM links WHERE code = $1',
        [finalCode]
      );

      if (existingLink.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Custom code already exists' },
          { status: 409 }
        );
      }

      // Insert new link
      const result = await pool.query(
        `INSERT INTO links (code, original_url, clicks, last_clicked, created_at) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, code, original_url, clicks, last_clicked, created_at`,
        [finalCode, url, 0, null, new Date()]
      );

      const newLink = result.rows[0];

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const shortUrl = `${baseUrl}/${finalCode}`;

        return NextResponse.json({
    success: true,
    link: {
        id: newLink.id,
        code: newLink.code,
        original_url: newLink.original_url,
        short_url: shortUrl, // Add this field
        clicks: newLink.clicks,
        last_clicked: newLink.last_clicked,
        created_at: newLink.created_at
    }
    }, { status: 201 });

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add to app/api/links/route.ts (same file)
export async function GET() {
  try {
    const pool = await getDb();

    try {
      const result = await pool.query(`
        SELECT id, code, original_url, clicks, last_clicked, created_at 
        FROM links 
        ORDER BY created_at DESC
      `);

      const links = result.rows.map(row => ({
        id: row.id,
        code: row.code,
        original_url: row.original_url,
        clicks: row.clicks,
        last_clicked: row.last_clicked,
        created_at: row.created_at
      }));

      return NextResponse.json({ success: true, links });

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
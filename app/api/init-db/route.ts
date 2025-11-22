// app/api/init-db/route.ts
import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export async function GET() {
  try {
    console.log('Initializing database...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'DATABASE_URL environment variable is not set' 
        },
        { status: 500 }
      );
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    try {
      // Create the links table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS links (
          id SERIAL PRIMARY KEY,
          code VARCHAR(8) UNIQUE NOT NULL,
          original_url TEXT NOT NULL,
          clicks INTEGER DEFAULT 0,
          last_clicked TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_code ON links(code);
        CREATE INDEX IF NOT EXISTS idx_created_at ON links(created_at);
      `);
      
      await pool.end();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database initialized successfully' 
      });
      
    } catch (dbError) {
      await pool.end();
      throw dbError;
    }
    
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
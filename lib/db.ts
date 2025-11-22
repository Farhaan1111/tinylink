// lib/db.ts
import { Pool } from '@neondatabase/serverless';

export async function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}
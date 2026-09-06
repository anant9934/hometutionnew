import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Provide a dummy fallback so Vercel's static build doesn't crash if env vars are missing
const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@dummy.neon.tech/dummy";

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "test") {
  console.warn("⚠️ DATABASE_URL is not set. Next.js build might pass, but runtime will fail.");
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

import { neon } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';

// Load .env variables just like Next.js does
loadEnvConfig(process.cwd());

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  
  await sql`DROP TABLE IF EXISTS "audit_logs" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "webhook_events" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "payouts" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "commissions" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "payments" CASCADE;`;
  
  console.log("Tables dropped.");
}

main().catch(console.error);

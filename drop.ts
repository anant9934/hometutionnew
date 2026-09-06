import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Dropping phase 4 stubs...");
  await sql`DROP TABLE IF EXISTS quizzes, quiz_questions, quiz_attempts, leaderboards, study_materials, certificates CASCADE;`;
  console.log("Dropped phase 4 stubs successfully.");
}

main().catch(console.error);

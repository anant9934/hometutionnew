const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" }); // or .env depending on nextjs setup

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  console.log("Dropping old quiz_results table...");
  try {
    await sql`DROP TABLE IF EXISTS quiz_results CASCADE;`;
    console.log("quiz_results dropped successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}
main();

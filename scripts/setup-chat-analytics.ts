/**
 * Setup script for chat analytics table in Vercel Postgres.
 *
 * Run once to create the table:
 *   npx tsx scripts/setup-chat-analytics.ts
 *
 * Requires POSTGRES_URL environment variable.
 */

import { sql } from "@vercel/postgres";

async function setup() {
  console.log("Creating chat_queries table...");

  await sql`
    CREATE TABLE IF NOT EXISTS chat_queries (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      intent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      session_id TEXT,
      response_length INTEGER
    )
  `;

  // Index for category aggregation queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_queries_category
    ON chat_queries (category)
  `;

  // Index for time-based queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_queries_created_at
    ON chat_queries (created_at)
  `;

  console.log("Done. Table chat_queries is ready.");
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});

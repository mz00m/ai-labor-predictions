/**
 * Logs classified chat queries to Vercel Postgres.
 * Fails silently if POSTGRES_URL is not set (e.g., local dev).
 */

import { sql } from "@vercel/postgres";

interface LogEntry {
  query: string;
  category: string;
  subcategory: string | null;
  intent: string;
  sessionId?: string;
  responseLength?: number;
}

export async function logChatQuery(entry: LogEntry): Promise<void> {
  if (!process.env.POSTGRES_URL) return;

  await sql`
    INSERT INTO chat_queries (query, category, subcategory, intent, session_id, response_length)
    VALUES (${entry.query}, ${entry.category}, ${entry.subcategory}, ${entry.intent}, ${entry.sessionId ?? null}, ${entry.responseLength ?? null})
  `;
}

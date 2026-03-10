import { neon } from "@neondatabase/serverless";

type SqlClient = ReturnType<typeof neon> & Record<string, unknown>;

/**
 * Returns the Neon SQL client, or null if DATABASE_URL is not set.
 * This allows preview deployments without a Neon branch to still function —
 * analytics and submissions degrade gracefully.
 */
export function getDb(): SqlClient | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url) as SqlClient;
}

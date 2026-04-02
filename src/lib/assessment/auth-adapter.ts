// Minimal NextAuth database adapter using Neon PostgreSQL
// Stores users, sessions, and verification tokens for magic link auth

import { getDb } from "@/lib/db";

type Row = Record<string, any>; // DB rows

/**
 * Initialize auth tables
 */
export async function initAuthTables(): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      email_verified TIMESTAMP,
      name TEXT,
      image TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      session_token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
      expires TIMESTAMP NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires TIMESTAMP NOT NULL,
      PRIMARY KEY (identifier, token)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      UNIQUE(provider, provider_account_id)
    )
  `;
}

function generateId(): string {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Create a NextAuth-compatible adapter for Neon PostgreSQL
 */
export function NeonAdapter() {
  return {
    async createUser(user: { email: string; emailVerified?: Date | null; name?: string; image?: string }) {
      const sql = getDb();
      if (!sql) throw new Error("Database not available");
      await initAuthTables();

      const id = generateId();
      await sql`
        INSERT INTO auth_users (id, email, email_verified, name, image)
        VALUES (${id}, ${user.email}, ${user.emailVerified?.toISOString() || null}, ${user.name || null}, ${user.image || null})
      `;

      // Also create/update in assessment_users table for linking
      const { getOrCreateUser } = await import("./db");
      await getOrCreateUser(user.email);

      return { id, ...user, emailVerified: user.emailVerified || null };
    },

    async getUser(id: string) {
      const sql = getDb();
      if (!sql) return null;
      const rows = await sql`SELECT * FROM auth_users WHERE id = ${id}` as Row[];
      if (rows.length === 0) return null;
      return formatUser(rows[0]);
    },

    async getUserByEmail(email: string) {
      const sql = getDb();
      if (!sql) return null;
      await initAuthTables();
      const rows = await sql`SELECT * FROM auth_users WHERE email = ${email}` as Row[];
      if (rows.length === 0) return null;
      return formatUser(rows[0]);
    },

    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      const sql = getDb();
      if (!sql) return null;
      const rows = await sql`
        SELECT u.* FROM auth_users u
        JOIN auth_accounts a ON u.id = a.user_id
        WHERE a.provider = ${provider} AND a.provider_account_id = ${providerAccountId}
      ` as Row[];
      if (rows.length === 0) return null;
      return formatUser(rows[0]);
    },

    async updateUser(user: { id: string; email?: string; emailVerified?: Date | null; name?: string }) {
      const sql = getDb();
      if (!sql) return user;
      if (user.email) {
        await sql`UPDATE auth_users SET email = ${user.email}, email_verified = ${user.emailVerified?.toISOString() || null} WHERE id = ${user.id}`;
      }
      return user;
    },

    async deleteUser(userId: string) {
      const sql = getDb();
      if (!sql) return;
      await sql`DELETE FROM auth_users WHERE id = ${userId}`;
    },

    async linkAccount(account: any) {
      const sql = getDb();
      if (!sql) return;
      const id = generateId();
      await sql`
        INSERT INTO auth_accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
        VALUES (${id}, ${account.userId}, ${account.type}, ${account.provider}, ${account.providerAccountId}, ${account.refresh_token || null}, ${account.access_token || null}, ${account.expires_at || null}, ${account.token_type || null}, ${account.scope || null}, ${account.id_token || null}, ${account.session_state || null})
      `;
    },

    async createSession(session: { sessionToken: string; userId: string; expires: Date }) {
      const sql = getDb();
      if (!sql) throw new Error("Database not available");
      const id = generateId();
      await sql`
        INSERT INTO auth_sessions (id, session_token, user_id, expires)
        VALUES (${id}, ${session.sessionToken}, ${session.userId}, ${session.expires.toISOString()})
      `;
      return session;
    },

    async getSessionAndUser(sessionToken: string) {
      const sql = getDb();
      if (!sql) return null;
      const rows = await sql`
        SELECT s.*, u.id as u_id, u.email, u.email_verified, u.name, u.image
        FROM auth_sessions s
        JOIN auth_users u ON s.user_id = u.id
        WHERE s.session_token = ${sessionToken} AND s.expires > NOW()
      ` as Row[];
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        session: {
          sessionToken: row.session_token,
          userId: row.user_id,
          expires: new Date(row.expires),
        },
        user: formatUser(row),
      };
    },

    async updateSession(session: { sessionToken: string; expires?: Date }) {
      const sql = getDb();
      if (!sql) return session;
      if (session.expires) {
        await sql`UPDATE auth_sessions SET expires = ${session.expires.toISOString()} WHERE session_token = ${session.sessionToken}`;
      }
      return session;
    },

    async deleteSession(sessionToken: string) {
      const sql = getDb();
      if (!sql) return;
      await sql`DELETE FROM auth_sessions WHERE session_token = ${sessionToken}`;
    },

    async createVerificationToken(token: { identifier: string; token: string; expires: Date }) {
      const sql = getDb();
      if (!sql) throw new Error("Database not available");
      await initAuthTables();
      await sql`
        INSERT INTO auth_verification_tokens (identifier, token, expires)
        VALUES (${token.identifier}, ${token.token}, ${token.expires.toISOString()})
      `;
      return token;
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      const sql = getDb();
      if (!sql) return null;
      const rows = await sql`
        DELETE FROM auth_verification_tokens
        WHERE identifier = ${identifier} AND token = ${token}
        RETURNING *
      ` as Row[];
      if (rows.length === 0) return null;
      return { identifier: rows[0].identifier, token: rows[0].token, expires: new Date(rows[0].expires) };
    },
  };
}

function formatUser(row: Row) {
  return {
    id: row.id || row.u_id,
    email: row.email,
    emailVerified: row.email_verified ? new Date(row.email_verified) : null,
    name: row.name || null,
    image: row.image || null,
  };
}

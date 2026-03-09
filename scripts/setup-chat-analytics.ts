import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

// Load .env.local manually
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=["']?(.+?)["']?$/);
  if (match) process.env[match[1]] = match[2];
}

async function setup() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log("Creating chat_conversations table...");
  await sql`
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL,
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ended_at TIMESTAMPTZ,
      message_count INTEGER NOT NULL DEFAULT 0,
      user_agent TEXT,
      referrer TEXT
    )
  `;

  console.log("Creating chat_messages table...");
  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      tokens_used INTEGER,
      latency_ms INTEGER
    )
  `;

  console.log("Creating chat_feedback table...");
  await sql`
    CREATE TABLE IF NOT EXISTS chat_feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
      rating SMALLINT CHECK (rating IN (-1, 1)),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("Creating indexes...");
  await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_chat_conversations_started ON chat_conversations(started_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_chat_feedback_message ON chat_feedback(message_id)`;

  console.log("Chat analytics tables created successfully.");
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});

// Assessment database operations using Neon PostgreSQL
// Only stores sanitized report output and user metadata — never raw uploaded content

import { getDb } from "@/lib/db";
import { Assessment, AssessmentIntake, AssessmentReport } from "./types";

type Row = Record<string, any>; // DB rows have dynamic columns

/**
 * Initialize assessment tables if they don't exist
 */
export async function initAssessmentTables(): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS assessment_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      stripe_customer_id TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES assessment_users(id),
      status TEXT NOT NULL DEFAULT 'intake',
      intake_json JSONB,
      report_json JSONB,
      add_on_policy BOOLEAN DEFAULT FALSE,
      stripe_payment_id TEXT,
      paid BOOLEAN DEFAULT FALSE,
      preview_generated BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP
    )
  `;
}

/**
 * Create or get a user by email
 */
export async function getOrCreateUser(email: string): Promise<{ id: string; email: string } | null> {
  const sql = getDb();
  if (!sql) return null;

  await initAssessmentTables();

  const id = generateId();
  const existing = await sql`
    SELECT id, email FROM assessment_users WHERE email = ${email}
  ` as Row[];

  if (existing.length > 0) {
    return { id: existing[0].id as string, email: existing[0].email as string };
  }

  await sql`
    INSERT INTO assessment_users (id, email) VALUES (${id}, ${email})
  `;

  return { id, email };
}

/**
 * Create a new assessment
 */
export async function createAssessment(userId: string, intake: AssessmentIntake): Promise<string | null> {
  const sql = getDb();
  if (!sql) return null;

  const id = generateId();
  // Strip uploaded file content from intake before storing — only store metadata
  const sanitizedIntake = {
    ...intake,
    uploadedFiles: intake.uploadedFiles.map(({ name, type, size, category, uploadedAt }) => ({
      name,
      type,
      size,
      category,
      uploadedAt,
    })),
  };

  await sql`
    INSERT INTO assessments (id, user_id, status, intake_json, created_at)
    VALUES (${id}, ${userId}, 'intake', ${JSON.stringify(sanitizedIntake)}, NOW())
  `;

  return id;
}

/**
 * Update assessment with report
 */
export async function saveAssessmentReport(assessmentId: string, report: AssessmentReport): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments
    SET report_json = ${JSON.stringify(report)},
        status = 'complete',
        completed_at = NOW()
    WHERE id = ${assessmentId}
  `;
}

/**
 * Mark assessment as paid
 */
export async function markAssessmentPaid(assessmentId: string, stripePaymentId: string): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments
    SET paid = TRUE, stripe_payment_id = ${stripePaymentId}
    WHERE id = ${assessmentId}
  `;
}

/**
 * Mark policy add-on purchased
 */
export async function markPolicyAddon(assessmentId: string): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments SET add_on_policy = TRUE WHERE id = ${assessmentId}
  `;
}

/**
 * Get assessment by ID
 */
export async function getAssessment(assessmentId: string): Promise<Assessment | null> {
  const sql = getDb();
  if (!sql) return null;

  const rows = await sql`
    SELECT * FROM assessments WHERE id = ${assessmentId}
  ` as Row[];

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id as string,
    userId: row.user_id as string,
    status: row.status as Assessment["status"],
    createdAt: (row.created_at as Date).toISOString(),
    completedAt: row.completed_at ? (row.completed_at as Date).toISOString() : undefined,
    intake: row.intake_json as AssessmentIntake,
    report: row.report_json as AssessmentReport | undefined,
    addOns: {
      policyAndPrompts: row.add_on_policy as boolean,
    },
    stripePaymentId: row.stripe_payment_id as string | undefined,
    paid: row.paid as boolean,
    previewGenerated: row.preview_generated as boolean,
  };
}

/**
 * Get all assessments for a user
 */
export async function getUserAssessments(userId: string): Promise<Assessment[]> {
  const sql = getDb();
  if (!sql) return [];

  const rows = await sql`
    SELECT * FROM assessments WHERE user_id = ${userId} ORDER BY created_at DESC
  ` as Row[];

  return rows.map((row: Row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    status: row.status as Assessment["status"],
    createdAt: (row.created_at as Date).toISOString(),
    completedAt: row.completed_at ? (row.completed_at as Date).toISOString() : undefined,
    intake: row.intake_json as AssessmentIntake,
    report: row.report_json as AssessmentReport | undefined,
    addOns: {
      policyAndPrompts: row.add_on_policy as boolean,
    },
    stripePaymentId: row.stripe_payment_id as string | undefined,
    paid: row.paid as boolean,
    previewGenerated: row.preview_generated as boolean,
  }));
}

/**
 * Save user feedback for an assessment
 */
export async function saveFeedback(assessmentId: string, rating: number, comment?: string): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS assessment_feedback (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL REFERENCES assessments(id),
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const id = generateId();
  await sql`
    INSERT INTO assessment_feedback (id, assessment_id, rating, comment)
    VALUES (${id}, ${assessmentId}, ${rating}, ${comment || null})
  `;
}

/**
 * Update assessment status
 */
export async function updateAssessmentStatus(assessmentId: string, status: Assessment["status"]): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments SET status = ${status} WHERE id = ${assessmentId}
  `;
}

function generateId(): string {
  return `asmt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

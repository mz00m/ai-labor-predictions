// Assessment database operations using Neon PostgreSQL
// Only stores sanitized report output and user metadata — never raw uploaded content

import { getDb } from "@/lib/db";
import { Assessment, AssessmentIntake, AssessmentReport, AssessmentStep, StepContext, StepFeedback } from "./types";

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
      current_step TEXT,
      step_context JSONB,
      step_feedback JSONB DEFAULT '[]'::jsonb,
      add_on_policy BOOLEAN DEFAULT FALSE,
      stripe_payment_id TEXT,
      paid BOOLEAN DEFAULT FALSE,
      preview_generated BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS assessment_feedback (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL REFERENCES assessments(id),
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS email_verification_codes (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      attempts INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Add columns for existing tables (safe to run multiple times)
  await sql`
    DO $$ BEGIN
      ALTER TABLE assessments ADD COLUMN IF NOT EXISTS current_step TEXT;
      ALTER TABLE assessments ADD COLUMN IF NOT EXISTS step_context JSONB;
      ALTER TABLE assessments ADD COLUMN IF NOT EXISTS step_feedback JSONB DEFAULT '[]'::jsonb;
    EXCEPTION WHEN others THEN NULL;
    END $$;
  `;

  // Unified activity view — joins users, assessments, and feedback into one queryable table
  await sql`
    CREATE OR REPLACE VIEW assessment_activity AS
    SELECT
      u.email,
      a.id AS assessment_id,
      a.status,
      a.paid,
      a.add_on_policy,
      a.intake_json->>'organizationName' AS organization,
      a.intake_json->>'industry' AS industry,
      a.intake_json->>'companySize' AS company_size,
      a.intake_json->>'jobTitle' AS job_title,
      a.intake_json->>'assessmentScope' AS scope,
      a.intake_json->>'currentAiUsage' AS ai_maturity,
      a.current_step,
      a.preview_generated,
      a.created_at AS started_at,
      a.completed_at,
      EXTRACT(EPOCH FROM (a.completed_at - a.created_at)) / 60 AS duration_minutes,
      f.rating AS feedback_rating,
      f.comment AS feedback_comment,
      f.created_at AS feedback_at
    FROM assessments a
    JOIN assessment_users u ON u.id = a.user_id
    LEFT JOIN assessment_feedback f ON f.assessment_id = a.id
    ORDER BY a.created_at DESC
  `;

  // Summary stats view — throughput at a glance
  await sql`
    CREATE OR REPLACE VIEW assessment_stats AS
    SELECT
      COUNT(*) AS total_assessments,
      COUNT(*) FILTER (WHERE status = 'complete') AS completed,
      COUNT(*) FILTER (WHERE status = 'intake') AS in_intake,
      COUNT(*) FILTER (WHERE status = 'analyzing') AS in_progress,
      COUNT(*) FILTER (WHERE status = 'error') AS errored,
      COUNT(*) FILTER (WHERE paid = TRUE) AS paid,
      COUNT(DISTINCT user_id) AS unique_users,
      ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60)::numeric, 1) AS avg_duration_min,
      (SELECT ROUND(AVG(rating)::numeric, 1) FROM assessment_feedback) AS avg_rating,
      (SELECT COUNT(*) FROM assessment_feedback) AS total_feedback,
      MIN(created_at) AS first_assessment,
      MAX(created_at) AS latest_assessment
    FROM assessments
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
    currentStep: row.current_step as AssessmentStep | undefined,
    stepContext: row.step_context as StepContext | undefined,
    stepFeedback: row.step_feedback as StepFeedback[] | undefined,
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
    currentStep: row.current_step as AssessmentStep | undefined,
    stepContext: row.step_context as StepContext | undefined,
    stepFeedback: row.step_feedback as StepFeedback[] | undefined,
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

/**
 * Update the current step for an assessment
 */
export async function updateCurrentStep(assessmentId: string, step: AssessmentStep): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments SET current_step = ${step} WHERE id = ${assessmentId}
  `;
}

/**
 * Save step context (extracted from files/website in step 1, carried to later steps)
 */
export async function saveStepContext(assessmentId: string, context: StepContext): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments SET step_context = ${JSON.stringify(context)} WHERE id = ${assessmentId}
  `;
}

/**
 * Save user feedback for a step (appends to the feedback array)
 */
export async function saveStepFeedback(assessmentId: string, feedback: StepFeedback): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments
    SET step_feedback = COALESCE(step_feedback, '[]'::jsonb) || ${JSON.stringify(feedback)}::jsonb
    WHERE id = ${assessmentId}
  `;
}

/**
 * Merge partial report data into existing report_json.
 * Uses PostgreSQL jsonb_concat to atomically merge without read-modify-write race.
 */
export async function mergePartialReport(assessmentId: string, partial: Partial<AssessmentReport>): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    UPDATE assessments
    SET report_json = COALESCE(report_json, '{}'::jsonb) || ${JSON.stringify(partial)}::jsonb
    WHERE id = ${assessmentId}
  `;
}

/**
 * Create a verification code for an email. Invalidates prior unused codes.
 */
export async function createVerificationCode(email: string, code: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  await initAssessmentTables();

  // Invalidate prior unused codes for this email
  await sql`
    UPDATE email_verification_codes SET used = TRUE
    WHERE email = ${email} AND used = FALSE
  `;

  // Rate limit: max 3 codes per email per hour
  type CountRow = { count: string };
  const rateLimitRows = await sql`
    SELECT COUNT(*) as count FROM email_verification_codes
    WHERE email = ${email} AND created_at > NOW() - INTERVAL '1 hour'
  ` as CountRow[];
  if (parseInt(rateLimitRows[0]?.count || "0") >= 3) return false;

  const id = generateId();
  await sql`
    INSERT INTO email_verification_codes (id, email, code, expires_at)
    VALUES (${id}, ${email}, ${code}, NOW() + INTERVAL '10 minutes')
  `;
  return true;
}

/**
 * Validate a verification code. Returns true if valid, false otherwise.
 */
export async function validateVerificationCode(email: string, code: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  type Row = Record<string, any>;
  const rows = await sql`
    SELECT id, code, attempts FROM email_verification_codes
    WHERE email = ${email} AND used = FALSE AND expires_at > NOW()
    ORDER BY created_at DESC LIMIT 1
  ` as Row[];

  if (rows.length === 0) return false;

  const row = rows[0];

  // Too many attempts
  if ((row.attempts as number) >= 5) return false;

  // Increment attempts
  await sql`
    UPDATE email_verification_codes SET attempts = attempts + 1 WHERE id = ${row.id}
  `;

  if (row.code !== code) return false;

  // Mark as used
  await sql`
    UPDATE email_verification_codes SET used = TRUE WHERE id = ${row.id}
  `;
  return true;
}

/**
 * Get user ID for an email (without creating one)
 */
export async function getUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
  const sql = getDb();
  if (!sql) return null;

  type Row = Record<string, any>;
  const rows = await sql`
    SELECT id, email FROM assessment_users WHERE email = ${email}
  ` as Row[];

  if (rows.length === 0) return null;
  return { id: rows[0].id as string, email: rows[0].email as string };
}

function generateId(): string {
  return `asmt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

#!/usr/bin/env tsx
// Seed a test assessment into the DB so you can view it at /assessment/report?id=...
// Usage: bun run scripts/seed-test-report.ts

import { getDb } from "../src/lib/db";
import { MATT_PROFILE } from "./fixtures/assessment-profiles";
import * as fs from "fs";

const REPORT_JSON_PATH = "/tmp/assessment-tests/matt-gitlab-foundation.json";

async function main() {
  const sql = getDb();
  if (!sql) {
    console.error("No DATABASE_URL — cannot connect");
    process.exit(1);
  }

  // Load cached report JSON
  if (!fs.existsSync(REPORT_JSON_PATH)) {
    console.error(`No cached report at ${REPORT_JSON_PATH}`);
    console.error("Run: bun run test-assessments -- --matt");
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(REPORT_JSON_PATH, "utf-8"));
  const intake = MATT_PROFILE.intake;
  const id = "test_dev_preview";
  const userId = "test_dev_user";

  // Ensure user exists
  await sql`
    INSERT INTO assessment_users (id, email)
    VALUES (${userId}, 'dev@test.local')
    ON CONFLICT (email) DO UPDATE SET id = ${userId}
  `;

  // Upsert assessment
  const existing = await sql`SELECT id FROM assessments WHERE id = ${id}`;
  if (existing.length > 0) {
    await sql`
      UPDATE assessments
      SET intake_json = ${JSON.stringify(intake)},
          report_json = ${JSON.stringify(report)},
          status = 'complete',
          completed_at = NOW()
      WHERE id = ${id}
    `;
    console.log(`Updated existing assessment: ${id}`);
  } else {
    await sql`
      INSERT INTO assessments (id, user_id, status, intake_json, report_json, paid, completed_at)
      VALUES (${id}, ${userId}, 'complete', ${JSON.stringify(intake)}, ${JSON.stringify(report)}, true, NOW())
    `;
    console.log(`Created assessment: ${id}`);
  }

  console.log(`\nView at: http://localhost:3000/assessment/report?id=${id}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

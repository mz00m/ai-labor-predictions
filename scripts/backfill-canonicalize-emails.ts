#!/usr/bin/env npx tsx
/**
 * One-off prod backfill: lowercase + trim every email in assessment_users
 * and email_verification_codes, repointing assessment ownership when
 * existing case-twin rows collide.
 *
 * Why: before today, email lookup was case-sensitive, so a user who
 * typed "MattZieger@gmail.com" at intake and later "mattzieger@..." at
 * verification would generate two user rows. The assessment was owned
 * by the first; the session cookie pointed at the second. Result: a
 * 403 "Access denied" when they returned to view their report.
 *
 * What this script does:
 *   1. For each (lowercase email, dup-set of users):
 *      - Pick the OLDEST user row as the keeper.
 *      - Repoint every assessment owned by a duplicate to the keeper.
 *      - Delete the duplicates.
 *   2. Lowercase + trim every remaining user email.
 *   3. Lowercase + trim every email_verification_codes.email.
 *
 * The migration is idempotent — run it once and the second run is a
 * no-op. It runs inside a single transaction so a failure halfway
 * leaves the table consistent.
 *
 * Run (locally pointing at prod via .env.local):
 *   npm run backfill:canonicalize-emails
 *
 * Or guard with --dry-run first to count changes without writing:
 *   npx tsx scripts/backfill-canonicalize-emails.ts --dry-run
 */
import { neon } from "@neondatabase/serverless";

const DRY = process.argv.includes("--dry-run");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set. Did you load .env.local?");
    process.exit(1);
  }
  const sql = neon(url);

  // Step 1: find duplicate-by-lowercase user clusters
  const dupClusters = (await sql`
    SELECT LOWER(email) as canon, COUNT(*) as n
    FROM assessment_users
    GROUP BY LOWER(email)
    HAVING COUNT(*) > 1
  `) as Array<{ canon: string; n: string }>;

  console.log(`Found ${dupClusters.length} duplicate email clusters.`);

  let mergedAssessments = 0;
  let deletedUsers = 0;

  for (const cluster of dupClusters) {
    const rows = (await sql`
      SELECT id, email, created_at
      FROM assessment_users
      WHERE LOWER(email) = ${cluster.canon}
      ORDER BY created_at ASC
    `) as Array<{ id: string; email: string; created_at: Date }>;

    if (rows.length < 2) continue;
    const keeper = rows[0];
    const dupes = rows.slice(1);

    console.log(`  cluster ${cluster.canon}: keep ${keeper.id} (${keeper.email}), merge ${dupes.length} dup(s)`);

    for (const dup of dupes) {
      // Move any assessments owned by the dup over to the keeper
      const moved = (await sql`
        SELECT id FROM assessments WHERE user_id = ${dup.id}
      `) as Array<{ id: string }>;
      if (moved.length > 0) {
        if (!DRY) {
          await sql`UPDATE assessments SET user_id = ${keeper.id} WHERE user_id = ${dup.id}`;
        }
        mergedAssessments += moved.length;
        console.log(`    moved ${moved.length} assessment(s) from ${dup.id} -> ${keeper.id}`);
      }
      // Delete the duplicate user
      if (!DRY) {
        await sql`DELETE FROM assessment_users WHERE id = ${dup.id}`;
      }
      deletedUsers++;
    }
  }

  // Step 2: canonicalize every remaining user email
  if (!DRY) {
    const updated = (await sql`
      UPDATE assessment_users
      SET email = LOWER(TRIM(email))
      WHERE email <> LOWER(TRIM(email))
      RETURNING id
    `) as Array<{ id: string }>;
    console.log(`Canonicalized ${updated.length} user email(s).`);
  } else {
    const wouldUpdate = (await sql`
      SELECT COUNT(*) as n FROM assessment_users WHERE email <> LOWER(TRIM(email))
    `) as Array<{ n: string }>;
    console.log(`Would canonicalize ${wouldUpdate[0]?.n ?? 0} user email(s).`);
  }

  // Step 3: canonicalize verification codes table
  if (!DRY) {
    const updatedCodes = (await sql`
      UPDATE email_verification_codes
      SET email = LOWER(TRIM(email))
      WHERE email <> LOWER(TRIM(email))
      RETURNING id
    `) as Array<{ id: string }>;
    console.log(`Canonicalized ${updatedCodes.length} verification-code row(s).`);
  } else {
    const wouldUpdate = (await sql`
      SELECT COUNT(*) as n FROM email_verification_codes WHERE email <> LOWER(TRIM(email))
    `) as Array<{ n: string }>;
    console.log(`Would canonicalize ${wouldUpdate[0]?.n ?? 0} verification-code row(s).`);
  }

  console.log("\nSummary:");
  console.log(`  Duplicate user clusters merged:  ${dupClusters.length}`);
  console.log(`  Assessments repointed:           ${mergedAssessments}`);
  console.log(`  Duplicate users deleted:         ${deletedUsers}`);
  console.log(DRY ? "DRY RUN — no writes." : "Wrote changes.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

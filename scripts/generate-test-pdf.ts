#!/usr/bin/env tsx
// Generate a PDF from a test assessment JSON output
// Usage: bun run tsx scripts/generate-test-pdf.ts [profile-name]

import { generatePdf } from "../src/lib/assessment/pdf-generator";
import { TEST_PROFILES } from "./fixtures/assessment-profiles";
import * as fs from "fs";

const profileName = process.argv[2] || "community-foundation";
const jsonPath = `/tmp/assessment-tests/${profileName}.json`;
const pdfPath = `/tmp/assessment-tests/${profileName}.pdf`;

// Load the report JSON
if (!fs.existsSync(jsonPath)) {
  console.error(`No report JSON found at ${jsonPath}`);
  console.error(`Run: bun run test-assessments -- --only ${profileName}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// Find the matching intake fixture
const profile = TEST_PROFILES.find((p) => p.name === profileName);
if (!profile) {
  console.error(`No fixture profile found for "${profileName}"`);
  process.exit(1);
}

console.log(`Generating PDF for "${profile.intake.organizationName}"...`);

const buffer = generatePdf(profile.intake, report, true);
fs.writeFileSync(pdfPath, Buffer.from(buffer));

console.log(`PDF saved to: ${pdfPath}`);
console.log(`Open with: open ${pdfPath}`);

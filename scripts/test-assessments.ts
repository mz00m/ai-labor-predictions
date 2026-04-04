#!/usr/bin/env tsx
// Run test assessment profiles through the analysis pipeline
// Outputs readable markdown files for human review
//
// Usage:
//   bun run test-assessments              # Run all profiles
//   bun run test-assessments -- --only community-foundation
//   bun run test-assessments -- --only community-foundation,dental-practice
//   bun run test-assessments -- --preview  # Run in preview mode instead of full

import {
  generateStep1Profile,
  generateStep2Tasks,
  generateStep3Tools,
  generateStep4Risks,
} from "../src/lib/assessment/analyze";
import { TEST_PROFILES, type TestProfile } from "./fixtures/assessment-profiles";
import type { AssessmentReport } from "../src/lib/assessment/types";
import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = "/tmp/assessment-tests";

// Parse CLI args
const args = process.argv.slice(2);
const onlyFlag = args.find((a) => a.startsWith("--only"));
const onlyNames = onlyFlag
  ? args[args.indexOf(onlyFlag) + 1]?.split(",").map((s) => s.trim())
  : null;
const previewMode = args.includes("--preview");
const mode = previewMode ? "preview" : "full";

function formatReport(profile: TestProfile, report: AssessmentReport): string {
  const lines: string[] = [];

  lines.push(`# Assessment Report: ${profile.intake.organizationName}`);
  lines.push(`> Profile: \`${profile.name}\` — ${profile.description}`);
  lines.push(`> Mode: ${mode} | Industry: ${profile.intake.industry} | Size: ${profile.intake.companySize} | AI Maturity: ${profile.intake.currentAiUsage}`);
  lines.push(`> Generated: ${new Date().toISOString()}`);
  lines.push("");

  // Executive Summary
  lines.push("## Executive Summary");
  lines.push(report.executiveSummary);
  lines.push("");

  // Organization Profile
  lines.push("## Organization Profile");
  lines.push(`**AI Readiness Score:** ${report.organizationProfile.aiReadinessScore}/10`);
  lines.push("");
  lines.push(report.organizationProfile.summary);
  lines.push("");
  lines.push("**Industry Context:**");
  lines.push(report.organizationProfile.industryContext);
  lines.push("");
  if (report.organizationProfile.keyStrengths.length > 0) {
    lines.push("**Key Strengths:**");
    for (const s of report.organizationProfile.keyStrengths) {
      lines.push(`- ${s}`);
    }
    lines.push("");
  }
  if (report.organizationProfile.keyGaps.length > 0) {
    lines.push("**Key Gaps:**");
    for (const g of report.organizationProfile.keyGaps) {
      lines.push(`- ${g}`);
    }
    lines.push("");
  }

  // Task Analysis
  if (report.taskAnalysis.length > 0) {
    lines.push("## Task Analysis");
    lines.push("");
    for (const task of report.taskAnalysis) {
      lines.push(`### ${task.taskName}`);
      lines.push(`- **Department:** ${task.department}`);
      lines.push(`- **AI Opportunity:** ${task.aiOpportunity} | **Complexity:** ${task.complexity}`);
      lines.push(`- **Current Process:** ${task.currentProcess}`);
      lines.push(`- **AI Approach:** ${task.aiApproach}`);
      lines.push(`- **Expected Impact:** ${task.expectedImpact}`);
      if (task.onetAlignment) {
        lines.push(`- **O*NET Alignment:** ${task.onetAlignment}`);
      }
      lines.push("");
    }
  }

  // Tool Recommendations
  if (report.toolRecommendations.length > 0) {
    lines.push("## Tool Recommendations");
    lines.push("");
    lines.push("| Category | Purpose | Value | Effort | Priority | Est. Cost |");
    lines.push("|----------|---------|-------|--------|----------|-----------|");
    for (const tool of report.toolRecommendations) {
      lines.push(
        `| ${tool.category} | ${tool.purpose} | ${tool.expectedValue} | ${tool.implementationEffort} | ${tool.priorityTier} | ${tool.estimatedMonthlyCost || "—"} |`
      );
    }
    lines.push("");
  }

  // Risk Assessment
  lines.push("## Risk Assessment");
  lines.push(`**Overall Risk Level:** ${report.riskAssessment.overallRiskLevel}`);
  lines.push("");
  lines.push(`**Displacement Risk:** ${report.riskAssessment.displacementRisk}`);
  lines.push("");
  if (report.riskAssessment.skillGaps.length > 0) {
    lines.push("**Skill Gaps:**");
    for (const gap of report.riskAssessment.skillGaps) {
      lines.push(`- ${gap}`);
    }
    lines.push("");
  }
  lines.push(`**Change Management:** ${report.riskAssessment.changeManagementNotes}`);
  lines.push("");
  lines.push(`**Data Privacy:** ${report.riskAssessment.dataPrivacyConsiderations}`);
  lines.push("");

  // Implementation Roadmap
  lines.push("## Implementation Roadmap");
  lines.push("");
  for (const [phaseKey, phase] of Object.entries(report.implementationRoadmap)) {
    const phaseData = phase as AssessmentReport["implementationRoadmap"]["immediate"];
    lines.push(`### ${phaseData.timeframe}`);
    if (phaseData.estimatedInvestment) {
      lines.push(`**Estimated Investment:** ${phaseData.estimatedInvestment}`);
    }
    lines.push("");
    if (phaseData.objectives.length > 0) {
      lines.push("**Objectives:**");
      for (const obj of phaseData.objectives) {
        lines.push(`- ${obj}`);
      }
      lines.push("");
    }
    if (phaseData.actions.length > 0) {
      lines.push("**Actions:**");
      for (const action of phaseData.actions) {
        lines.push(`- **${action.title}** (${action.priority}) — ${action.description}`);
        lines.push(`  Owner: ${action.owner}`);
      }
      lines.push("");
    }
    if (phaseData.expectedOutcomes.length > 0) {
      lines.push("**Expected Outcomes:**");
      for (const outcome of phaseData.expectedOutcomes) {
        lines.push(`- ${outcome}`);
      }
      lines.push("");
    }
  }

  // ROI Projections
  if (report.roiProjections.length > 0) {
    lines.push("## ROI Projections");
    lines.push("");
    for (const roi of report.roiProjections) {
      lines.push(`### ${roi.area}`);
      lines.push(`- **Current Cost:** ${roi.currentCost}`);
      lines.push(`- **Projected Savings:** ${roi.projectedSavings}`);
      lines.push(`- **Time to Value:** ${roi.timeToValue}`);
      lines.push(`- **Confidence:** ${roi.confidence}`);
      lines.push(`- **Basis:** ${roi.basis}`);
      lines.push("");
    }
  }

  // Further Evaluation
  if (report.furtherEvaluation.length > 0) {
    lines.push("## Further Evaluation");
    lines.push("");
    for (const item of report.furtherEvaluation) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function runProfile(profile: TestProfile): Promise<void> {
  const startTime = Date.now();
  console.log(`\n  Running: ${profile.name} (${profile.intake.industry}, ${profile.intake.companySize})...`);

  try {
    // Run the 4-step sequential pipeline
    console.log(`    Step 1/4: Profile...`);
    const { report: step1, stepContext } = await generateStep1Profile(
      profile.intake,
      profile.fileContents || [],
      profile.websiteContent || null
    );

    console.log(`    Step 2/4: Tasks...`);
    const step2 = await generateStep2Tasks(profile.intake, step1 as any, stepContext);

    console.log(`    Step 3/4: Tools...`);
    const step3 = await generateStep3Tools(profile.intake, { ...step1, ...step2 } as any, stepContext);

    console.log(`    Step 4/4: Risks...`);
    const step4 = await generateStep4Risks(profile.intake, { ...step1, ...step2, ...step3 } as any, stepContext);

    const report = { ...step1, ...step2, ...step3, ...step4 } as AssessmentReport;

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  Done in ${elapsed}s — readiness score: ${report.organizationProfile?.aiReadinessScore ?? "N/A"}/10, ${report.taskAnalysis?.length ?? 0} tasks, ${report.toolRecommendations?.length ?? 0} tools`);

    // Write readable markdown
    const mdContent = formatReport(profile, report);
    const mdPath = path.join(OUTPUT_DIR, `${profile.name}.md`);
    fs.writeFileSync(mdPath, mdContent);

    // Also write raw JSON for debugging
    const jsonPath = path.join(OUTPUT_DIR, `${profile.name}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    console.log(`  Output: ${mdPath}`);
  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`  FAILED after ${elapsed}s:`, err instanceof Error ? err.message : err);

    // Write error log
    const errorPath = path.join(OUTPUT_DIR, `${profile.name}.error.txt`);
    fs.writeFileSync(errorPath, `Profile: ${profile.name}\nError: ${err instanceof Error ? err.stack : String(err)}\n`);
  }
}

async function main() {
  // Ensure output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Filter profiles
  let profiles = TEST_PROFILES;
  if (onlyNames) {
    profiles = TEST_PROFILES.filter((p) => onlyNames.includes(p.name));
    if (profiles.length === 0) {
      console.error(`No profiles matched: ${onlyNames.join(", ")}`);
      console.error(`Available: ${TEST_PROFILES.map((p) => p.name).join(", ")}`);
      process.exit(1);
    }
  }

  console.log(`Assessment Test Runner`);
  console.log(`Mode: ${mode} | Profiles: ${profiles.length} | Output: ${OUTPUT_DIR}`);
  console.log(`─────────────────────────────────────────`);

  const startTime = Date.now();

  for (const profile of profiles) {
    await runProfile(profile);
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n─────────────────────────────────────────`);
  console.log(`Completed ${profiles.length} profiles in ${totalElapsed}s`);
  console.log(`Reports saved to: ${OUTPUT_DIR}/`);
  console.log(`\nTo read reports: ls ${OUTPUT_DIR}/*.md`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

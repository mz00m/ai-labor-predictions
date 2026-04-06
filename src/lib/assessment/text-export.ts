// Plain text export for assessment reports
// Generates a readable text document with all report sections

import { AssessmentReport, AssessmentIntake } from "./types";
import { INDUSTRY_LABELS, COMPANY_SIZE_LABELS, AI_MATURITY_LABELS } from "./types";

export function generateTextExport(
  intake: AssessmentIntake,
  report: AssessmentReport
): string {
  const lines: string[] = [];
  const hr = "═".repeat(60);
  const subhr = "─".repeat(40);

  // Header
  lines.push(hr);
  lines.push("AI ACTION PLAN");
  lines.push(intake.organizationName);
  lines.push(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
  lines.push(`Industry: ${INDUSTRY_LABELS[intake.industry] || intake.industry}`);
  lines.push(`Size: ${COMPANY_SIZE_LABELS[intake.companySize] || intake.companySize}`);
  lines.push(hr);
  lines.push("");

  // Executive Summary
  lines.push("1. EXECUTIVE SUMMARY");
  lines.push(subhr);
  lines.push(report.executiveSummary);
  lines.push("");

  if (report.organizationProfile.industryContext) {
    lines.push("Industry Context:");
    lines.push(report.organizationProfile.industryContext);
    lines.push("");
  }

  // AI Readiness
  lines.push("2. AI READINESS ASSESSMENT");
  lines.push(subhr);
  lines.push(`Score: ${report.organizationProfile.aiReadinessScore}/10`);
  lines.push(report.organizationProfile.summary);
  lines.push("");

  if (report.organizationProfile.aiReadinessRationale) {
    lines.push(report.organizationProfile.aiReadinessRationale);
    lines.push("");
  }

  if (report.organizationProfile.keyStrengths.length > 0) {
    lines.push("Strengths:");
    report.organizationProfile.keyStrengths.forEach((s) => lines.push(`  + ${s}`));
    lines.push("");
  }

  if (report.organizationProfile.keyGaps.length > 0) {
    lines.push("Opportunities:");
    report.organizationProfile.keyGaps.forEach((g) => lines.push(`  > ${g}`));
    lines.push("");
  }

  // Task Analysis
  if (report.taskAnalysis.length > 0) {
    lines.push("3. TASK-BY-TASK ANALYSIS");
    lines.push(subhr);
    report.taskAnalysis.forEach((task, i) => {
      lines.push(`${i + 1}. ${task.taskName} [${task.aiOpportunity.toUpperCase()}]`);
      lines.push(`   Department: ${task.department} | Complexity: ${task.complexity}`);
      if (task.currentProcess) lines.push(`   Current: ${task.currentProcess}`);
      lines.push(`   AI Approach: ${task.aiApproach}`);
      if (task.expectedImpact) lines.push(`   Impact: ${task.expectedImpact}`);
      if (task.estimatedTimeSaved) lines.push(`   Time Saved: ${task.estimatedTimeSaved}`);
      if (task.gettingStarted) lines.push(`   Quick Start: ${task.gettingStarted}`);
      if (task.starterPrompt) {
        lines.push(`   Starter Prompt: ${task.starterPrompt}`);
      }
      if (task.exampleTools && task.exampleTools.length > 0) {
        lines.push(`   Tools: ${task.exampleTools.map((t) => t.name).join(", ")}`);
      }
      lines.push("");
    });
  }

  // Tool Recommendations
  if (report.toolRecommendations.length > 0) {
    lines.push("4. RECOMMENDED TOOLS & SERVICES");
    lines.push(subhr);
    report.toolRecommendations.forEach((tool, i) => {
      const name = tool.toolName || tool.category;
      lines.push(`${i + 1}. ${name} [${tool.priorityTier}]`);
      lines.push(`   ${tool.purpose}`);
      lines.push(`   Expected Value: ${tool.expectedValue}`);
      if (tool.estimatedMonthlyCost) lines.push(`   Cost: ${tool.estimatedMonthlyCost}`);
      if (tool.whatItReplaces) lines.push(`   Replaces: ${tool.whatItReplaces}`);
      if (tool.firstTask) lines.push(`   Try First: ${tool.firstTask}`);
      if (tool.specificProducts && tool.specificProducts.length > 0) {
        lines.push(`   Products: ${tool.specificProducts.map((p) => `${p.name}${p.pricing ? ` (${p.pricing})` : ""}`).join(", ")}`);
      }
      if (tool.gettingStarted && tool.gettingStarted.length > 0) {
        lines.push("   Getting Started:");
        tool.gettingStarted.forEach((step, j) => lines.push(`     ${j + 1}. ${step}`));
      }
      if (tool.successKpis && tool.successKpis.length > 0) {
        lines.push(`   Measure Success: ${tool.successKpis.join("; ")}`);
      }
      lines.push("");
    });
  }

  // Implementation Roadmap
  lines.push("5. IMPLEMENTATION ROADMAP");
  lines.push(subhr);
  const phases = [
    { key: "immediate" as const, label: "Phase 1: Quick Wins (0-3 months)" },
    { key: "mediumTerm" as const, label: "Phase 2: Build Momentum (3-6 months)" },
    { key: "longTerm" as const, label: "Phase 3: Level Up (6-12+ months)" },
  ];
  for (const phase of phases) {
    const data = report.implementationRoadmap[phase.key];
    lines.push(`\n${phase.label}`);
    if (data.objectives.length > 0) {
      lines.push("  Objectives:");
      data.objectives.forEach((obj) => lines.push(`    - ${obj}`));
    }
    if (data.actions.length > 0) {
      lines.push("  Actions:");
      data.actions.forEach((action) => {
        lines.push(`    [${action.priority}] ${action.title}: ${action.description}`);
        if (action.howTo) lines.push(`      How: ${action.howTo}`);
      });
    }
    if (data.expectedOutcomes && data.expectedOutcomes.length > 0) {
      lines.push(`  Outcomes: ${data.expectedOutcomes.join(". ")}`);
    }
    if (data.estimatedInvestment) {
      lines.push(`  Investment: ${data.estimatedInvestment}`);
    }
  }
  lines.push("");

  // Risk Assessment
  lines.push("6. RISK ASSESSMENT");
  lines.push(subhr);
  if (report.riskAssessment.riskContextNote) {
    lines.push(report.riskAssessment.riskContextNote);
  }
  lines.push(`Overall Risk Level: ${report.riskAssessment.overallRiskLevel.toUpperCase()}`);
  lines.push("");

  if (report.riskAssessment.displacementRisk) {
    lines.push("Role Evolution:");
    lines.push(report.riskAssessment.displacementRisk);
    lines.push("");
  }

  if (report.riskAssessment.skillGaps.length > 0) {
    lines.push("Skills to Build:");
    report.riskAssessment.skillGaps.forEach((gap, i) => lines.push(`  ${i + 1}. ${gap}`));
    lines.push("");
  }

  if (report.riskAssessment.dataPrivacyConsiderations) {
    lines.push("Data Privacy:");
    lines.push(report.riskAssessment.dataPrivacyConsiderations);
    lines.push("");
  }

  if (report.riskAssessment.changeManagementNotes) {
    lines.push("Change Management:");
    lines.push(report.riskAssessment.changeManagementNotes);
    lines.push("");
  }

  if (report.riskAssessment.commonPitfalls && report.riskAssessment.commonPitfalls.length > 0) {
    lines.push("Common Pitfalls:");
    report.riskAssessment.commonPitfalls.forEach((p) => lines.push(`  ! ${p}`));
    lines.push("");
  }

  // ROI Projections
  if (report.roiProjections.length > 0) {
    lines.push("7. ROI PROJECTIONS");
    lines.push(subhr);
    report.roiProjections.forEach((roi) => {
      lines.push(`${roi.area}`);
      lines.push(`  Current Cost: ${roi.currentCost}`);
      lines.push(`  Projected Savings: ${roi.projectedSavings}`);
      lines.push(`  Time to Value: ${roi.timeToValue}`);
      lines.push(`  Confidence: ${roi.confidence}`);
      if (roi.basis) lines.push(`  Basis: ${roi.basis}`);
      lines.push("");
    });
  }

  // Human Capabilities
  if (report.humanCapabilities && report.humanCapabilities.length > 0) {
    lines.push("8. SKILLS THAT GROW WITH AI");
    lines.push(subhr);
    lines.push("These capabilities become more valuable — not less — as AI handles routine work.");
    lines.push("");
    report.humanCapabilities.forEach((cap) => {
      lines.push(`${cap.name} (${cap.appreciationScore}/10)`);
      lines.push(`  Why it matters: ${cap.whyItMatters}`);
      lines.push(`  How to develop: ${cap.howToDevelop}`);
      lines.push("");
    });
  }

  // Next Steps
  if (report.furtherEvaluation.length > 0) {
    lines.push("9. NEXT STEPS");
    lines.push(subhr);
    report.furtherEvaluation.forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
    lines.push("");
  }

  // Your Inputs
  lines.push("10. YOUR INPUTS");
  lines.push(subhr);
  lines.push(`Organization: ${intake.organizationName}`);
  lines.push(`Industry: ${INDUSTRY_LABELS[intake.industry] || intake.industry}`);
  lines.push(`Size: ${COMPANY_SIZE_LABELS[intake.companySize] || intake.companySize}`);
  lines.push(`Scope: ${intake.assessmentScope.replace(/-/g, " ")}`);
  if (intake.jobTitle) lines.push(`Role: ${intake.jobTitle}`);
  if (intake.departmentName) lines.push(`Department: ${intake.departmentName}`);
  lines.push(`AI Experience: ${AI_MATURITY_LABELS[intake.currentAiUsage] || intake.currentAiUsage}`);
  if (intake.primaryFunctions.length > 0) lines.push(`Key Functions: ${intake.primaryFunctions.join(", ")}`);
  if (intake.keyRoles.length > 0) lines.push(`Key Roles: ${intake.keyRoles.join(", ")}`);
  if (intake.currentTools.length > 0) lines.push(`Current Tools: ${intake.currentTools.join(", ")}`);
  if (intake.biggestChallenges.length > 0) lines.push(`Challenges: ${intake.biggestChallenges.join("; ")}`);
  if (intake.goals.length > 0) lines.push(`Goals: ${intake.goals.join("; ")}`);
  if (intake.teamDescription) {
    lines.push("");
    lines.push("Day-to-day description:");
    lines.push(intake.teamDescription);
  }
  if (intake.specificProblem) {
    lines.push("");
    lines.push("Specific problem to solve:");
    lines.push(intake.specificProblem);
  }
  if (intake.additionalContext) {
    lines.push("");
    lines.push("Additional context:");
    lines.push(intake.additionalContext);
  }
  lines.push("");

  // Disclaimer
  lines.push(hr);
  lines.push("This plan was built by jobsdata.ai based on your work profile.");
  lines.push("All uploaded content was processed in-memory and discarded after analysis.");
  lines.push(hr);

  return lines.join("\n");
}

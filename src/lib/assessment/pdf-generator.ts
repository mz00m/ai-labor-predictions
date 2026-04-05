// PDF report generation using jsPDF
// Clean white layout, professional typography

import { jsPDF } from "jspdf";
import { AssessmentReport, AssessmentIntake } from "./types";
import { INDUSTRY_LABELS, COMPANY_SIZE_LABELS, AI_MATURITY_LABELS } from "./types";

type RGB = [number, number, number];

const C = {
  black: [20, 20, 20] as RGB,
  heading: [30, 30, 30] as RGB,
  body: [55, 65, 75] as RGB,
  muted: [120, 130, 140] as RGB,
  light: [160, 170, 180] as RGB,
  accent: [79, 70, 229] as RGB, // indigo-600
  accentLight: [238, 242, 255] as RGB, // indigo-50
  green: [22, 163, 74] as RGB,
  amber: [180, 130, 10] as RGB,
  gray100: [243, 244, 246] as RGB,
  gray200: [229, 231, 235] as RGB,
  gray300: [209, 213, 219] as RGB,
  white: [255, 255, 255] as RGB,
};

export function generatePdf(
  intake: AssessmentIntake,
  report: AssessmentReport,
  isPaid: boolean
): ArrayBuffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 22; // margin
  const cw = pw - m * 2; // content width
  let y = 0;
  let pageNum = 0;

  const newPage = () => {
    if (pageNum > 0) doc.addPage();
    pageNum++;
    y = 28;
    footer(doc, pw, ph, pageNum);
  };

  /**
   * Check if h mm fits on the current page; if not, start a new page.
   * When called from helpers (bodyText/bullet), pass the local y so
   * the check uses the real cursor position instead of the (stale) outer y.
   * Returns the y to continue rendering at.
   */
  const need = (h: number, callerY?: number): number => {
    const testY = callerY !== undefined ? callerY : y;
    if (testY + h > ph - 20) {
      newPage();
      return y; // 28 after page break
    }
    return testY; // unchanged
  };

  // ===== COVER =====
  pageNum++;

  // Thin accent strip at top
  doc.setFillColor(...C.accent);
  doc.rect(0, 0, pw, 3, "F");

  y = 55;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...C.accent);
  doc.text("jobsdata.ai", m, y);

  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...C.black);
  const titleLines = doc.splitTextToSize("AI Action Plan", cw);
  doc.text(titleLines, m, y);
  y += titleLines.length * 12;

  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(...C.body);
  doc.text(intake.organizationName, m, y);

  y += 16;
  doc.setDrawColor(...C.gray200);
  doc.setLineWidth(0.3);
  doc.line(m, y, m + cw, y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(...C.muted);
  const meta = [
    `Industry: ${INDUSTRY_LABELS[intake.industry] || intake.industry}`,
    `Size: ${COMPANY_SIZE_LABELS[intake.companySize] || intake.companySize}`,
    `Scope: ${intake.assessmentScope.replace("-", " ")}`,
    `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
  ];
  for (const line of meta) {
    doc.text(line, m, y);
    y += 6;
  }

  // What's inside
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.heading);
  doc.text("What's Inside", m, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const tocItems = [
    `${report.taskAnalysis.length} tasks analyzed for AI opportunity`,
    `${report.toolRecommendations.length} tool recommendations with pricing`,
    "3-phase implementation roadmap",
    "Risk assessment and skill gap analysis",
    `${report.roiProjections.length} ROI projections with time-to-value estimates`,
  ];
  for (const item of tocItems) {
    doc.setTextColor(...C.accent);
    doc.text("\u2022", m + 2, y);
    doc.setTextColor(...C.body);
    doc.text(item, m + 7, y);
    y += 5.5;
  }

  // Disclaimer
  y += 16;
  doc.setDrawColor(...C.gray200);
  doc.line(m, y, m + cw, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(...C.light);
  const disclaimer = isPaid
    ? "This plan was built by jobsdata.ai based on your work profile. All uploaded content was processed in-memory and discarded after analysis."
    : "FREE PREVIEW — This is a limited preview. Get your full plan for a complete task-by-task analysis, tool recommendations, and action plan.";
  const dLines = doc.splitTextToSize(disclaimer, cw);
  doc.text(dLines, m, y);

  footer(doc, pw, ph, pageNum);

  // ===== ONE-PAGE SUMMARY =====
  newPage();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.black);
  doc.text("At a Glance", m, y);
  y += 3;
  doc.setDrawColor(...C.accent);
  doc.setLineWidth(0.6);
  doc.line(m, y, m + 24, y);
  y += 10;

  // AI Readiness Score — large display
  if (report.organizationProfile.aiReadinessScore) {
    // Calculate box height based on rationale length
    let ratLines: string[] = [];
    const ratWidth = cw - 50;
    if (report.organizationProfile.aiReadinessRationale) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      ratLines = doc.splitTextToSize(report.organizationProfile.aiReadinessRationale, ratWidth);
    }
    const ratLineH = 2.8;
    const boxPadding = 8; // top + bottom padding
    const minBoxH = 14;
    const boxH = Math.max(minBoxH, boxPadding + ratLines.length * ratLineH + 2);

    doc.setFillColor(...C.accentLight);
    doc.roundedRect(m, y, cw, boxH, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.heading);
    doc.text("AI Readiness", m + 6, y + 6);
    doc.setFontSize(20);
    doc.setTextColor(...C.accent);
    doc.text(`${report.organizationProfile.aiReadinessScore}/10`, m + 6, y + 12);

    // Rationale on the right side — show all lines
    if (ratLines.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.body);
      doc.text(ratLines, m + 42, y + 5);
    }
    y += boxH + 4;
  }

  // Top 3 Actions from immediate roadmap
  const immediateActions = report.implementationRoadmap?.immediate?.actions || [];
  if (immediateActions.length > 0) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.heading);
    doc.text("Start Here", m, y);
    y += 5;
    const topActions = immediateActions.slice(0, 3);
    for (let i = 0; i < topActions.length; i++) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...C.accent);
      doc.text(`${i + 1}.`, m + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.body);
      const actionText = topActions[i].title;
      const actionLines = doc.splitTextToSize(actionText, cw - 12);
      doc.text(actionLines[0], m + 8, y);
      y += 4;
      if (topActions[i].description) {
        doc.setFontSize(7);
        doc.setTextColor(...C.muted);
        const descLines = doc.splitTextToSize(topActions[i].description, cw - 12);
        doc.text(descLines.slice(0, 2), m + 8, y);
        y += descLines.slice(0, 2).length * 3 + 1;
      }
    }
  }

  // ROI highlights
  if (report.roiProjections.length > 0) {
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.heading);
    doc.text("Projected Impact", m, y);
    y += 6;

    // Summary bar
    doc.setFillColor(...C.gray100);
    const roiBarH = Math.min(report.roiProjections.length * 5 + 6, 30);
    doc.roundedRect(m, y, cw, roiBarH, 2, 2, "F");
    let roiY = y + 4;
    for (const roi of report.roiProjections.slice(0, 4)) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.body);
      doc.text(roi.area, m + 5, roiY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...C.accent);
      const savingsText = roi.projectedSavings || "";
      doc.text(savingsText, m + cw - 5, roiY, { align: "right" });
      roiY += 5;
    }
    y += roiBarH + 4;
  }

  // Key risk
  if (report.riskAssessment?.displacementRisk) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.heading);
    doc.text("Key Risk to Watch", m, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.body);
    const riskLines = doc.splitTextToSize(report.riskAssessment.displacementRisk, cw);
    doc.text(riskLines.slice(0, 3), m, y);
    y += riskLines.slice(0, 3).length * 3 + 2;
  }

  // Start-here tool
  const startHereTools = report.toolRecommendations.filter(t => t.recommendationTier === "start-here");
  if (startHereTools.length > 0) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.heading);
    doc.text("First Tool to Try", m, y);
    y += 5;
    const tool = startHereTools[0];
    const toolName = tool.toolName || tool.category;

    // Measure content to size box dynamically
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const purposeLines = doc.splitTextToSize(tool.purpose, cw - 12);
    const toolBoxH = 14 + Math.min(purposeLines.length, 2) * 3;

    doc.setFillColor(...C.gray100);
    doc.roundedRect(m, y, cw, toolBoxH, 2, 2, "F");

    // Tool name (left, constrained width so it doesn't overlap cost)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.heading);
    const nameMaxW = tool.estimatedMonthlyCost ? cw - 60 : cw - 12;
    const nameLines = doc.splitTextToSize(toolName, nameMaxW);
    doc.text(nameLines[0], m + 5, y + 5);

    // Cost (right-aligned, on its own)
    if (tool.estimatedMonthlyCost) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      const costText = tool.estimatedMonthlyCost.split("—")[0]?.trim() || "";
      doc.text(costText, m + cw - 5, y + 5, { align: "right" });
    }

    // Purpose below name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.body);
    doc.text(purposeLines.slice(0, 2), m + 5, y + 10);
    y += toolBoxH + 4;
  }

  // Stats bar at bottom
  y += 6;
  doc.setDrawColor(...C.gray200);
  doc.setLineWidth(0.3);
  doc.line(m, y, m + cw, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  const statsItems = [
    `${report.taskAnalysis.length} tasks analyzed`,
    `${report.toolRecommendations.length} tools recommended`,
    `${report.roiProjections.length} ROI projections`,
    `3-phase roadmap`,
  ];
  doc.text(statsItems.join("  |  "), m, y);

  // ===== EXECUTIVE SUMMARY (detailed) =====
  newPage();
  y = sectionTitle(doc, "AI Opportunity Summary", m, y);

  y = bodyText(doc, report.executiveSummary, m, y, cw, need);

  // AI Readiness Score
  if (report.organizationProfile.aiReadinessScore) {
    y += 8;
    need(22);
    doc.setFillColor(...C.accentLight);
    doc.roundedRect(m, y, cw, 16, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.heading);
    doc.text("AI Readiness Score", m + 6, y + 7);
    doc.setFontSize(18);
    doc.setTextColor(...C.accent);
    doc.text(`${report.organizationProfile.aiReadinessScore}/10`, m + cw - 28, y + 10);
    y += 22;

    // Readiness rationale
    if (report.organizationProfile.aiReadinessRationale) {
      y = bodyText(doc, report.organizationProfile.aiReadinessRationale, m, y, cw, need);
      y += 2;
    }

    // Next steps to improve score
    if (report.organizationProfile.aiReadinessNextSteps && report.organizationProfile.aiReadinessNextSteps.length > 0) {
      need(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...C.accent);
      doc.text("To improve your score:", m, y);
      y += 4;
      for (const step of report.organizationProfile.aiReadinessNextSteps) {
        y = bullet(doc, step, m, y, cw, need);
      }
    }
  }

  if (report.organizationProfile.industryContext) {
    y += 4;
    need(20);
    y = subHead(doc, "Industry Context", m, y);
    y = bodyText(doc, report.organizationProfile.industryContext, m, y, cw, need);
  }

  if (report.organizationProfile.keyStrengths.length > 0) {
    y += 6;
    need(16);
    y = subHead(doc, "Key Strengths", m, y);
    for (const item of report.organizationProfile.keyStrengths) {
      need(8);
      y = bullet(doc, item, m, y, cw, need);
    }
  }

  if (report.organizationProfile.keyGaps.length > 0) {
    y += 6;
    need(16);
    y = subHead(doc, "Opportunities", m, y);
    for (const item of report.organizationProfile.keyGaps) {
      y = bullet(doc, item, m, y, cw, need);
    }
  }

  // ===== TASK ANALYSIS =====
  if (report.taskAnalysis.length > 0) {
    y += 10;
    need(30);
    y = sectionTitle(doc, "Where AI Can Help Most", m, y);

    for (const task of report.taskAnalysis) {
      doc.setFontSize(8);
      const approachLines = doc.splitTextToSize(task.aiApproach, cw - 10);
      const shown = approachLines.slice(0, 3);
      const ch = 18 + shown.length * 3.2;

      need(ch + 3);

      doc.setFillColor(...C.gray100);
      doc.roundedRect(m, y, cw, ch, 2, 2, "F");

      // Task name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.heading);
      const nameLines = doc.splitTextToSize(task.taskName, cw - 36);
      doc.text(nameLines[0], m + 5, y + 6);

      // Opportunity badge
      const badgeColors: Record<string, { bg: RGB; fg: RGB }> = {
        high: { bg: [220, 252, 231] as RGB, fg: C.green },
        medium: { bg: [254, 249, 195] as RGB, fg: C.amber },
        low: { bg: C.gray200, fg: C.muted },
      };
      const badge = badgeColors[task.aiOpportunity] || badgeColors.low;
      doc.setFillColor(...badge.bg);
      doc.roundedRect(m + cw - 26, y + 2, 22, 6, 2, 2, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...badge.fg);
      doc.text(task.aiOpportunity.toUpperCase(), m + cw - 24, y + 6.5);

      // Department + complexity
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      doc.text(`${task.department}  |  Complexity: ${task.complexity}`, m + 5, y + 11);

      // AI approach
      doc.setFontSize(8);
      doc.setTextColor(...C.body);
      doc.text(shown, m + 5, y + 15.5);

      y += ch + 3;
    }
  }

  // ===== TOOL RECOMMENDATIONS (3-tier system) =====
  if (report.toolRecommendations.length > 0) {
    y += 10;
    need(30);
    y = sectionTitle(doc, "Your Tool Stack", m, y);

    // Group tools by recommendation tier
    const tierGroups: { tier: string; label: string; subtitle: string; color: RGB; tools: typeof report.toolRecommendations }[] = [
      {
        tier: "start-here",
        label: "Start Here",
        subtitle: "Free or cheap, immediate value, low learning curve",
        color: C.green,
        tools: report.toolRecommendations.filter(t => t.recommendationTier === "start-here"),
      },
      {
        tier: "add-next",
        label: "Add Next",
        subtitle: "After the first tools are working, these compound the gains",
        color: C.accent,
        tools: report.toolRecommendations.filter(t => t.recommendationTier === "add-next"),
      },
      {
        tier: "consider-later",
        label: "Consider Later",
        subtitle: "Higher investment, higher payoff, requires foundation",
        color: C.amber,
        tools: report.toolRecommendations.filter(t => t.recommendationTier === "consider-later"),
      },
    ];

    // Fallback: if no tools have recommendationTier set, show all under a flat list
    const hasAnyTier = tierGroups.some(g => g.tools.length > 0);
    if (!hasAnyTier) {
      tierGroups.length = 0;
      tierGroups.push({
        tier: "all",
        label: "Recommended Tools",
        subtitle: "Prioritized by impact and ease of adoption",
        color: C.accent,
        tools: report.toolRecommendations,
      });
    }

    for (const group of tierGroups) {
      if (group.tools.length === 0) continue;

      // Tier header
      need(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...group.color);
      doc.text(group.label.toUpperCase(), m, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      doc.text(group.subtitle, m, y + 8.5);
      y += 12;

      for (const tool of group.tools) {
        // Compute card content
        doc.setFontSize(8);
        const purposeLines = doc.splitTextToSize(tool.purpose, cw - 10);
        const shownPurpose = purposeLines.slice(0, 2);
        const hasCost = !!tool.estimatedMonthlyCost;
        const hasReplaces = !!tool.whatItReplaces;
        const hasFirstTask = !!tool.firstTask;
        let ch = 16 + shownPurpose.length * 3.2;
        if (hasCost) ch += 4;
        if (hasReplaces) ch += 4;
        if (hasFirstTask) ch += 4;

        need(ch + 3);

        doc.setFillColor(...C.gray100);
        doc.roundedRect(m, y, cw, ch, 2, 2, "F");

        // Tool name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.heading);
        const displayName = tool.toolName
          ? tool.toolName.replace(/\s*\(.*?\)\s*$/, "")
          : tool.category;
        doc.text(displayName, m + 5, y + 6);

        // Category on separate line
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...C.muted);
        doc.text(tool.category, m + 5, y + 10.5);

        // Effort badge on right
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...C.muted);
        doc.text(`Effort: ${tool.implementationEffort || "low"}`, m + cw - 5, y + 6, { align: "right" });

        // Purpose
        let contentY = y + 15;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...C.body);
        doc.text(shownPurpose, m + 5, contentY);
        contentY += shownPurpose.length * 3.2;

        // What it replaces
        if (hasReplaces) {
          doc.setFontSize(7);
          doc.setTextColor(...C.muted);
          const replacesText = `Replaces: ${tool.whatItReplaces}`;
          const replacesLines = doc.splitTextToSize(replacesText, cw - 12);
          doc.text(replacesLines[0], m + 5, contentY);
          contentY += 4;
        }

        // Cost
        if (hasCost) {
          doc.setFontSize(7);
          doc.setTextColor(...C.muted);
          const costLines = doc.splitTextToSize(tool.estimatedMonthlyCost!, cw - 12);
          doc.text(costLines[0], m + 5, contentY);
          contentY += 4;
        }

        // First task to try
        if (hasFirstTask) {
          doc.setFontSize(7);
          doc.setTextColor(...C.muted);
          const tryText = `Try first: ${tool.firstTask}`;
          const tryLines = doc.splitTextToSize(tryText, cw - 12);
          doc.text(tryLines[0], m + 5, contentY);
        }

        y += ch + 3;
      }
      y += 3; // gap between tier groups
    }
  }

  // ===== IMPLEMENTATION ROADMAP =====
  y += 10;
  need(24);
  y = sectionTitle(doc, "Implementation Roadmap", m, y);

  const phases = Object.entries(report.implementationRoadmap) as [string, typeof report.implementationRoadmap.immediate][];
  for (const [phase, data] of phases) {
    y += 2;
    need(18);

    const phaseLabel = phase === "immediate"
      ? "Start This Week (0\u20133 months)"
      : phase === "mediumTerm"
      ? "Build On It (3\u20136 months)"
      : "Level Up (6\u201312+ months)";

    // Phase header bar
    doc.setFillColor(...C.accent);
    doc.roundedRect(m, y, cw, 7, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.white);
    doc.text(phaseLabel, m + 5, y + 5);
    y += 10;

    if (data.objectives.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.heading);
      doc.text("Objectives", m, y);
      y += 5;
      for (const obj of data.objectives) {
        y = bullet(doc, obj, m, y, cw, need);
      }
    }

    if (data.actions.length > 0) {
      y += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.heading);
      doc.text("Actions", m, y);
      y += 5;
      for (const action of data.actions) {
        y = bullet(doc, `${action.title}: ${action.description}`, m, y, cw, need);
      }
    }

    if (data.estimatedInvestment) {
      y += 3;
      need(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.muted);
      doc.text(`Estimated investment: ${data.estimatedInvestment}`, m, y);
      y += 6;
    }
  }

  // ===== RISK ASSESSMENT =====
  y += 8;
  need(24);
  y = sectionTitle(doc, "Risk Assessment", m, y);

  if (report.riskAssessment.displacementRisk) {
    y = subHead(doc, "Displacement Risk", m, y);
    y = bodyText(doc, report.riskAssessment.displacementRisk, m, y, cw, need);
    y += 4;
  }

  if (report.riskAssessment.skillGaps.length > 0) {
    need(16);
    y = subHead(doc, "Skill Gaps to Address", m, y);
    for (const gap of report.riskAssessment.skillGaps) {
      y = bullet(doc, gap, m, y, cw, need);
    }
    y += 4;
  }

  if (report.riskAssessment.changeManagementNotes) {
    need(16);
    y = subHead(doc, "Change Management", m, y);
    y = bodyText(doc, report.riskAssessment.changeManagementNotes, m, y, cw, need);
    y += 4;
  }

  if (report.riskAssessment.dataPrivacyConsiderations && report.riskAssessment.dataPrivacyConsiderations.length > 0) {
    need(16);
    y = subHead(doc, "Data Privacy", m, y);
    if (Array.isArray(report.riskAssessment.dataPrivacyConsiderations)) {
      for (const item of report.riskAssessment.dataPrivacyConsiderations) {
        need(8);
        y = bullet(doc, item, m, y, cw, need);
      }
    } else {
      y = bodyText(doc, report.riskAssessment.dataPrivacyConsiderations, m, y, cw, need);
    }
    y += 4;
  }

  if (report.riskAssessment.commonPitfalls && report.riskAssessment.commonPitfalls.length > 0) {
    need(16);
    y = subHead(doc, "Common Pitfalls to Avoid", m, y);
    for (const pitfall of report.riskAssessment.commonPitfalls) {
      y = bullet(doc, pitfall, m, y, cw, need);
    }
    y += 4;
  }

  if (report.riskAssessment.resistanceSources && report.riskAssessment.resistanceSources.length > 0) {
    need(16);
    y = subHead(doc, "Where to Expect Pushback", m, y);
    for (const source of report.riskAssessment.resistanceSources) {
      y = bullet(doc, source, m, y, cw, need);
    }
    y += 4;
  }

  if (report.riskAssessment.dataReadinessNote) {
    need(16);
    y = subHead(doc, "Your Data Readiness", m, y);
    y = bodyText(doc, report.riskAssessment.dataReadinessNote, m, y, cw, need);
    y += 4;
  }

  // ===== 5-DIMENSIONAL RISK SCORES =====
  if (report.riskAssessment.dimensionScores) {
    y += 6;
    need(55);
    y = subHead(doc, "5-Dimension Risk Profile", m, y);

    const dims = [
      { key: "technicalExposure" as const, label: "Can AI do your tasks?", type: "pressure" },
      { key: "adoptionSpeed" as const, label: "How fast is your industry adopting?", type: "pressure" },
      { key: "adaptability" as const, label: "How transferable are your skills?", type: "absorption" },
      { key: "demandElasticity" as const, label: "Does efficiency create more demand?", type: "absorption" },
      { key: "complementarity" as const, label: "Does AI enhance your work?", type: "absorption" },
    ];

    for (const dim of dims) {
      need(10);
      const score = report.riskAssessment.dimensionScores[dim.key];
      const isPressure = dim.type === "pressure";

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...C.body);
      doc.text(dim.label, m, y + 3);

      // Score
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text(`${score}/10`, m + cw - 2, y + 3, { align: "right" });

      // Bar background
      const barX = m;
      const barW = cw - 20;
      const barY = y + 5;
      doc.setFillColor(...C.gray200);
      doc.roundedRect(barX, barY, barW, 2.5, 1, 1, "F");

      // Bar fill
      doc.setFillColor(...(isPressure ? [251, 191, 36] as RGB : [74, 222, 128] as RGB));
      doc.roundedRect(barX, barY, barW * (score / 10), 2.5, 1, 1, "F");

      // Type badge
      doc.setFontSize(5.5);
      doc.setTextColor(...(isPressure ? C.amber : C.green));
      doc.text(isPressure ? "PRESSURE" : "ABSORPTION", m + cw - 18, y + 3);

      y += 10;
    }
    y += 2;
  }

  // ===== HUMAN CAPABILITIES =====
  if (report.humanCapabilities && report.humanCapabilities.length > 0) {
    y += 10;
    need(40);
    y = sectionTitle(doc, "Skills That Appreciate With AI", m, y);

    for (const cap of report.humanCapabilities) {
      const whyLines = doc.splitTextToSize(cap.whyAppreciating, cw - 10);
      const howLines = doc.splitTextToSize(cap.howToDevelop, cw - 10);
      const ch = 18 + (whyLines.length + howLines.length) * 3.2;
      need(ch + 4);

      doc.setFillColor(...C.gray100);
      doc.roundedRect(m, y, cw, ch, 2, 2, "F");

      // Name + score
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.heading);
      doc.text(cap.name, m + 5, y + 6);

      doc.setFontSize(7);
      doc.setTextColor(...C.accent);
      doc.text(`${cap.appreciationScore}/10`, m + cw - 5, y + 6, { align: "right" });

      // Why appreciating
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...C.body);
      doc.text(whyLines.slice(0, 3), m + 5, y + 11);

      // How to develop
      const howY = y + 11 + Math.min(whyLines.length, 3) * 3.2 + 2;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      doc.text("How to develop:", m + 5, howY);
      doc.setFont("helvetica", "normal");
      doc.text(howLines.slice(0, 2), m + 5, howY + 3.5);

      y += ch + 3;
    }
  }

  // ===== ROI PROJECTIONS =====
  if (report.roiProjections.length > 0) {
    y += 10;
    need(24);
    y = sectionTitle(doc, "Projected Time & Cost Savings", m, y);

    for (const roi of report.roiProjections) {
      doc.setFontSize(8);
      const basisLines = doc.splitTextToSize(roi.basis, cw - 10);
      const shownBasis = basisLines.slice(0, 2);
      const savingsPreview = `Savings: ${roi.projectedSavings}  |  Time to value: ${roi.timeToValue}`;
      const savingsPreviewLines = doc.splitTextToSize(savingsPreview, cw - 12);
      const extraSavingsH = savingsPreviewLines.length > 1 ? 3.5 : 0;
      const ch = 20 + extraSavingsH + shownBasis.length * 3.2;

      need(ch + 3);

      doc.setFillColor(...C.gray100);
      doc.roundedRect(m, y, cw, ch, 2, 2, "F");

      // Area name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.heading);
      doc.text(roi.area, m + 5, y + 6);

      // Confidence badge
      const confColor = roi.confidence === "high" ? C.green : roi.confidence === "moderate" ? C.amber : C.muted;
      doc.setFontSize(7);
      doc.setTextColor(...confColor);
      doc.text(roi.confidence.toUpperCase(), m + cw - 5, y + 6, { align: "right" });

      // Savings + time to value on one line (width-constrained)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.body);
      const savingsLine = `Savings: ${roi.projectedSavings}  |  Time to value: ${roi.timeToValue}`;
      const savingsLines = doc.splitTextToSize(savingsLine, cw - 12);
      doc.text(savingsLines[0], m + 5, y + 11.5);
      if (savingsLines.length > 1) {
        doc.text(savingsLines[1], m + 5, y + 14.5);
      }

      // Basis
      doc.setFontSize(7);
      doc.setTextColor(...C.light);
      doc.text(shownBasis, m + 5, y + 16 + extraSavingsH);

      y += ch + 3;
    }
  }

  // ===== HUMAN CAPABILITIES =====
  if (report.humanCapabilities && report.humanCapabilities.length > 0) {
    y += 10;
    need(24);
    y = sectionTitle(doc, "Skills That Grow With AI", m, y);

    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text("These capabilities become more valuable — not less — as AI handles routine work.", m, y);
    y += 6;

    for (const cap of report.humanCapabilities) {
      doc.setFontSize(8);
      const whyLines = doc.splitTextToSize(cap.whyItMatters, cw - 10);
      const shownWhy = whyLines.slice(0, 3);
      const devLines = doc.splitTextToSize(`How to develop: ${cap.howToDevelop}`, cw - 10);
      const shownDev = devLines.slice(0, 2);
      const ch = 14 + shownWhy.length * 3.2 + shownDev.length * 3.2;

      need(ch + 3);

      doc.setFillColor(...C.gray100);
      doc.roundedRect(m, y, cw, ch, 2, 2, "F");

      // Capability name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.heading);
      doc.text(cap.name, m + 5, y + 6);

      // Score badge
      doc.setFontSize(7);
      doc.setTextColor(...C.accent);
      doc.text(`${cap.appreciationScore}/10`, m + cw - 5, y + 6, { align: "right" });

      // Why it matters
      let capY = y + 11;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.body);
      doc.text(shownWhy, m + 5, capY);
      capY += shownWhy.length * 3.2 + 1;

      // How to develop
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      doc.text(shownDev, m + 5, capY);

      y += ch + 3;
    }
  }

  // ===== FURTHER EVALUATION =====
  if (report.furtherEvaluation.length > 0) {
    y += 8;
    need(20);
    y = sectionTitle(doc, "Next Steps", m, y);
    for (const item of report.furtherEvaluation) {
      y = bullet(doc, item, m, y, cw, need);
    }
  }

  // ===== YOUR INPUTS =====
  y += 10;
  need(24);
  y = sectionTitle(doc, "Your Inputs", m, y);

  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("What you told us — for reference. The more detail you provide, the more tailored your report.", m, y);
  y += 6;

  const inputRows: [string, string][] = [
    ["Organization", intake.organizationName],
    ["Industry", INDUSTRY_LABELS[intake.industry] || intake.industry],
    ["Size", COMPANY_SIZE_LABELS[intake.companySize] || intake.companySize],
    ["Scope", intake.assessmentScope.replace(/-/g, " ")],
  ];
  if (intake.departmentName) inputRows.push(["Department", intake.departmentName]);
  if (intake.jobTitle) inputRows.push(["Your Role", intake.jobTitle]);
  inputRows.push(["AI Experience", AI_MATURITY_LABELS[intake.currentAiUsage] || intake.currentAiUsage]);
  if (intake.primaryFunctions.length > 0) inputRows.push(["Key Functions", intake.primaryFunctions.join(", ")]);
  if (intake.keyRoles.length > 0) inputRows.push(["Key Roles", intake.keyRoles.join(", ")]);
  if (intake.currentTools.length > 0) inputRows.push(["Current Tools", intake.currentTools.join(", ")]);
  if (intake.biggestChallenges.length > 0) inputRows.push(["Challenges", intake.biggestChallenges.join("; ")]);
  if (intake.goals.length > 0) inputRows.push(["Goals", intake.goals.join("; ")]);

  for (const [label, value] of inputRows) {
    need(6, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...C.heading);
    doc.text(label, m, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.body);
    const valLines = doc.splitTextToSize(value, cw - 35);
    doc.text(valLines.slice(0, 2), m + 32, y);
    y += Math.max(valLines.slice(0, 2).length * 3, 4.5);
  }

  // ===== AI POLICY =====
  if (report.aiPolicy && report.aiPolicy.sections.length > 0) {
    y += 10;
    need(24);
    y = sectionTitle(doc, "AI Usage Guidelines", m, y);
    for (const section of report.aiPolicy.sections) {
      need(16);
      y = subHead(doc, section.title, m, y);
      y = bodyText(doc, section.content, m, y, cw, need);
      y += 6;
    }
  }

  // ===== PROMPT LIBRARY =====
  if (report.promptLibrary && report.promptLibrary.length > 0) {
    y += 10;
    need(24);
    y = sectionTitle(doc, "Prompt Library", m, y);

    for (const prompt of report.promptLibrary) {
      doc.setFontSize(8);
      const promptLines = doc.splitTextToSize(prompt.prompt, cw - 12);
      const shownPrompt = promptLines.slice(0, 8);
      const ch = 18 + shownPrompt.length * 3.5 + prompt.tips.length * 4 + 4;

      need(ch + 5);

      // Header bar
      doc.setFillColor(...C.accentLight);
      doc.roundedRect(m, y, cw, 8, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.accent);
      doc.text(`${prompt.title}`, m + 5, y + 5.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.muted);
      doc.text(prompt.department, m + cw - 5, y + 5.5, { align: "right" });
      y += 12;

      // Use case
      doc.setFontSize(8);
      doc.setTextColor(...C.muted);
      doc.text(`Use case: ${prompt.useCase}`, m, y);
      y += 5;

      // Prompt text
      doc.setTextColor(...C.body);
      doc.text(shownPrompt, m, y);
      y += shownPrompt.length * 3.5 + 3;

      // Tips
      if (prompt.tips.length > 0) {
        doc.setFontSize(7);
        doc.setTextColor(...C.muted);
        for (const tip of prompt.tips) {
          need(5);
          doc.text(`Tip: ${tip}`, m + 4, y);
          y += 4;
        }
      }

      y += 6;
    }
  }

  // ===== PAYWALL (free preview) =====
  if (!isPaid) {
    newPage();
    y = 80;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...C.heading);
    doc.text("Unlock Your Full Plan", pw / 2, y, { align: "center" });

    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...C.body);
    const ctaLines = doc.splitTextToSize(
      "This preview shows a glimpse of what your full plan covers. The complete version includes a detailed task-by-task analysis, specific tool recommendations, a step-by-step action plan, time savings estimates, and skills to build.",
      cw - 20
    );
    doc.text(ctaLines, pw / 2, y, { align: "center" });

    y += ctaLines.length * 4.5 + 16;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...C.accent);
    doc.text("jobsdata.ai/assessment", pw / 2, y, { align: "center" });
  }

  return doc.output("arraybuffer");
}

// ===== Helpers =====

function footer(doc: jsPDF, pw: number, ph: number, page: number) {
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 170, 180);
  doc.text("jobsdata.ai", 22, ph - 10);
  doc.text(`${page}`, pw - 22, ph - 10, { align: "right" });
  // Thin line above footer
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.2);
  doc.line(22, ph - 14, pw - 22, ph - 14);
}

function sectionTitle(doc: jsPDF, title: string, x: number, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text(title, x, y);
  y += 4;
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.6);
  doc.line(x, y, x + 30, y);
  return y + 8;
}

function subHead(doc: jsPDF, title: string, x: number, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text(title, x, y);
  return y + 5;
}

function bodyText(
  doc: jsPDF, text: string, x: number, y: number, width: number,
  needFn?: (h: number, callerY?: number) => number
): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setCharSpace(0);
  doc.setTextColor(55, 65, 75);
  const clean = text.replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ");
  const lines: string[] = doc.splitTextToSize(clean, width);
  for (const line of lines) {
    if (needFn) y = needFn(4, y);
    doc.text(line, x, y);
    y += 3.4;
  }
  return y;
}

function bullet(
  doc: jsPDF, text: string, x: number, y: number, width: number,
  needFn?: (h: number, callerY?: number) => number
): number {
  // Reset font state fully to prevent letter-spacing bleed from prior calls
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setCharSpace(0);
  // Sanitize text: replace non-breaking spaces and other invisible chars
  const clean = text.replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ");
  const lines: string[] = doc.splitTextToSize(clean, width - 8);
  // Reserve space for first line + bullet
  if (needFn) y = needFn(4, y);
  doc.setTextColor(79, 70, 229);
  doc.text("\u2022", x + 2, y);
  doc.setTextColor(55, 65, 75);
  doc.text(lines[0], x + 7, y);
  y += 3.2;
  // Render remaining lines with page-break awareness
  for (let i = 1; i < lines.length; i++) {
    if (needFn) y = needFn(4, y);
    doc.text(lines[i], x + 7, y);
    y += 3.2;
  }
  return y + 1;
}

import { NextRequest, NextResponse } from "next/server";
import { getAssessment, saveAssessmentReport } from "@/lib/assessment/db";
import { generatePolicyAndPrompts } from "@/lib/assessment/analyze";

/**
 * Generate the policy + prompt library add-on content for a paid assessment.
 * Called after the add-on purchase is confirmed.
 */
export async function POST(req: NextRequest) {
  try {
    const { assessmentId } = await req.json();

    if (!assessmentId) {
      return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
    }

    const assessment = await getAssessment(assessmentId);

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (!assessment.addOns.policyAndPrompts) {
      return NextResponse.json({ error: "Add-on not purchased" }, { status: 403 });
    }

    if (!assessment.report) {
      return NextResponse.json({ error: "Base report not yet generated" }, { status: 400 });
    }

    // Check if already generated
    if (assessment.report.aiPolicy && assessment.report.promptLibrary) {
      return NextResponse.json({ success: true, alreadyGenerated: true });
    }

    // Generate the add-on content
    const { aiPolicy, promptLibrary } = await generatePolicyAndPrompts(
      assessment.intake,
      assessment.report
    );

    // Save updated report with add-on content
    const updatedReport = {
      ...assessment.report,
      aiPolicy,
      promptLibrary,
    };

    await saveAssessmentReport(assessmentId, updatedReport);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add-on generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate add-on content" },
      { status: 500 }
    );
  }
}

import type { Assessment, AssessmentStep } from "@/lib/assessment/types";

// Client-side timeout for each step's POST to /api/assessment/analyze.
// Must sit below the server's maxDuration (300s) with headroom for response
// serialization and network, but above the realistic p95 latency of a
// Sonnet 4.6 Claude call for a single step (~60-200s).
export const STEP_TIMEOUT_MS = 270_000;

// Post-abort recovery: if the client aborts or gets a 5xx, the server may
// still have finished the Claude call and written the result to the DB
// (route.ts calls mergePartialReport/updateCurrentStep before returning).
// Poll the assessment endpoint for up to ~30s to detect that and recover.
export const POST_ABORT_POLL_MS = 2_000;
export const POST_ABORT_POLL_TRIES = 15;

/**
 * Check whether the server-side output for a given step is present in the
 * latest assessment record. Mirrors the completion detection used on page
 * load in the progress page's `useEffect`.
 */
export function hasStepOutput(assessment: Assessment | null, step: AssessmentStep): boolean {
  if (!assessment) return false;
  const report = assessment.report;
  switch (step) {
    case "profile":
      return Boolean(report?.organizationProfile);
    case "tasks":
      return Boolean(report?.taskAnalysis && report.taskAnalysis.length > 0);
    case "tools":
      return Boolean(report?.toolRecommendations && report.toolRecommendations.length > 0);
    case "risks":
      // Step 4 is the last step — server sets status to "complete" after
      // the risk report lands (route.ts:206).
      return assessment.status === "complete" || Boolean(report?.riskAssessment);
    default:
      return false;
  }
}

/**
 * After the client fetch aborts or returns 5xx, poll the report endpoint
 * to see if the server actually completed the step. Returns the fresh
 * assessment if the step's output is present, or null if recovery failed.
 */
export async function tryRecoverStepFromDb(
  assessmentId: string,
  step: AssessmentStep,
): Promise<Assessment | null> {
  for (let attempt = 0; attempt < POST_ABORT_POLL_TRIES; attempt++) {
    await new Promise((r) => setTimeout(r, POST_ABORT_POLL_MS));
    try {
      const res = await fetch(`/api/assessment/report?id=${assessmentId}`);
      if (!res.ok) continue;
      const data = await res.json();
      const fresh = data.assessment as Assessment | undefined;
      if (fresh && hasStepOutput(fresh, step)) {
        return fresh;
      }
    } catch {
      // swallow — we'll retry on the next tick
    }
  }
  return null;
}

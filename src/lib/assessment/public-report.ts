/**
 * Projection of an assessment into the shape that is safe to serve publicly.
 *
 * Anyone holding a share token can read this without authenticating, so the
 * intake is reduced by an explicit allowlist rather than by deleting known-bad
 * fields — a denylist would silently start leaking the next time a field is
 * added to AssessmentIntake. Free text that survives the projection is run
 * through stripPii as defense in depth, since report prose is generated from
 * user-supplied documents and can echo them.
 */

import { stripPii } from "./pii-strip";
import type { Assessment, AssessmentIntake, AssessmentReport } from "./types";

export interface PublicSharedReport {
  organizationName: string;
  industry: AssessmentIntake["industry"];
  companySize: AssessmentIntake["companySize"];
  assessmentScope: AssessmentIntake["assessmentScope"];
  jobTitle?: string;
  currentAiUsage: AssessmentIntake["currentAiUsage"];
  createdAt: string;
  report: AssessmentReport;
}

/** Recursively strip PII from every string in a JSON-ish value. */
function scrub<T>(value: T): T {
  if (typeof value === "string") {
    return stripPii(value).cleanedText as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map(scrub) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = scrub(v);
    return out as T;
  }
  return value;
}

export function toPublicReport(assessment: Assessment): PublicSharedReport | null {
  if (!assessment.report || !assessment.intake) return null;

  const i = assessment.intake;
  return {
    organizationName: i.organizationName,
    industry: i.industry,
    companySize: i.companySize,
    assessmentScope: i.assessmentScope,
    jobTitle: i.jobTitle || undefined,
    currentAiUsage: i.currentAiUsage,
    createdAt: assessment.createdAt,
    report: scrub(assessment.report),
  };
}

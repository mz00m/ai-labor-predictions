/**
 * Typed wrapper around Vercel Analytics custom events.
 *
 * Every funnel event on the site goes through here so that names stay
 * consistent and the full event vocabulary is readable in one place —
 * `track("assessment_step")` scattered across ten files is how you end up
 * with `assessment_step` and `assessmentStep` in the same dashboard.
 *
 * `track()` is a no-op in development and whenever the Analytics script
 * hasn't loaded, so call sites don't need to guard.
 */

import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  /* Assessment funnel */
  | { name: "assessment_step"; props: { step: string; index: number } }
  | { name: "assessment_submit"; props: { scope: string; industry: string; hasFiles: boolean } }
  | { name: "assessment_generated"; props: { seconds: number } }
  | { name: "assessment_failed"; props: { reason: string } }
  | { name: "assessment_report_view"; props: { shared: boolean } }
  | { name: "assessment_share"; props: { method: string } }
  | { name: "assessment_export"; props: { format: string } }
  | { name: "assessment_addon"; props: { section: string } }
  /* Scorecard */
  | { name: "scorecard_view"; props: { slug: string; score: number } }
  | { name: "scorecard_cta"; props: { slug: string; target: string } };

type EventName = AnalyticsEvent["name"];
type PropsFor<N extends EventName> = Extract<AnalyticsEvent, { name: N }>["props"];

export function trackEvent<N extends EventName>(name: N, props: PropsFor<N>): void {
  try {
    track(name, props as Record<string, string | number | boolean | null>);
  } catch {
    // Analytics must never break a user flow.
  }
}

"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActionItem {
  title: string;
  description: string;
  timeline: string;
  toolName?: string;
  toolUrl?: string;
}

interface QuickPlanResult {
  summary: string;
  actions: ActionItem[];
  weeklyTimeSaved: string;
  firstWeekFocus: string;
}

interface QuickPlanProps {
  slug: string;
  title: string;
  score: number;
  band: string;
  bandLabel: string;
  taskBreakdown: {
    aiCanDoNow: number;
    aiCanAssist: number;
    humanDomain: number;
  };
  accentColor: string;
  accentBg: string;
}

// ---------------------------------------------------------------------------
// Industry options
// ---------------------------------------------------------------------------

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "accounting-finance", label: "Accounting & Finance" },
  { value: "legal", label: "Legal" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "professional-services", label: "Professional Services" },
  { value: "media-marketing", label: "Media & Marketing" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "government", label: "Government" },
  { value: "restaurant-hospitality", label: "Restaurant & Hospitality" },
  { value: "real-estate", label: "Real Estate" },
  { value: "construction", label: "Construction" },
  { value: "logistics-transportation", label: "Logistics & Transportation" },
  { value: "agriculture", label: "Agriculture" },
  { value: "other", label: "Other" },
];

const TEAM_SIZES = [
  { value: "just-me", label: "Just me" },
  { value: "2-5", label: "2-5 people" },
  { value: "6-20", label: "6-20 people" },
  { value: "21-50", label: "21-50 people" },
  { value: "50+", label: "50+ people" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QuickPlan({
  slug,
  title,
  score,
  band,
  bandLabel,
  taskBreakdown,
  accentColor,
  accentBg,
}: QuickPlanProps) {
  const [showForm, setShowForm] = useState(false);
  const [teamSize, setTeamSize] = useState("");
  const [industry, setIndustry] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<QuickPlanResult | null>(null);
  const [, setSource] = useState<"haiku" | "fallback" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = teamSize && industry && goal.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assessment/quick-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          score,
          band,
          bandLabel,
          taskBreakdown,
          teamSize,
          industry,
          goal: goal.trim(),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setPlan(data.plan);
      setSource(data.source);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // CTA state — matches "3 ways to level up" card pattern
  // ---------------------------------------------------------------------------

  if (!showForm && !plan) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
          Personalized plan
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          Answer 3 quick questions and get a tailored action plan with specific
          tools, timelines, and next steps for your role.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          Get your plan
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Plan result — single card with subsections
  // ---------------------------------------------------------------------------

  if (plan) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">
          Your personalized plan
        </h2>

        {/* Summary */}
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          {plan.summary}
        </p>

        {/* First week focus — uses accent bg like score band pill */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: accentBg }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Start here
          </span>
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
            {plan.firstWeekFocus}
          </p>
        </div>

        {/* Action items — matches "3 ways to level up" inner cards */}
        <div className="space-y-3 mb-6">
          {plan.actions.map((action, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {action.title}
                    </h3>
                    <span
                      className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: accentBg,
                        color: accentColor,
                      }}
                    >
                      {action.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">
                    {action.description}
                  </p>
                  {action.toolName && (
                    <div className="mt-2">
                      {action.toolUrl ? (
                        <a
                          href={action.toolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium no-underline hover:underline"
                          style={{ color: accentColor }}
                        >
                          {action.toolName}
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">
                          Tool: {action.toolName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Time savings — matches "Estimated time savings" section */}
        <div className="border-t border-gray-100 pt-5 mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-2">
            Estimated savings
          </h3>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-black tabular-nums"
              style={{ color: accentColor }}
            >
              {plan.weeklyTimeSaved}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            With full implementation of this plan.
          </p>
        </div>

        {/* Deep dive CTA — quiet secondary action */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-500 mb-3">
            Want a deeper analysis with file uploads and a multi-step
            assessment?
          </p>
          <a
            href={`/assessment/start?occupation=${encodeURIComponent(slug)}&industry=${encodeURIComponent(industry)}&teamSize=${encodeURIComponent(teamSize)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors no-underline"
          >
            Full deep dive
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Form state — single card, matching section header pattern
  // ---------------------------------------------------------------------------

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">
        Get your personalized plan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team size */}
        <div>
          <label
            htmlFor="qp-team"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Team size
          </label>
          <select
            id="qp-team"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50"
            style={
              {
                "--tw-ring-color": accentColor,
              } as React.CSSProperties
            }
          >
            <option value="">Select team size</option>
            {TEAM_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div>
          <label
            htmlFor="qp-industry"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Industry
          </label>
          <select
            id="qp-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50"
            style={
              {
                "--tw-ring-color": accentColor,
              } as React.CSSProperties
            }
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind.value} value={ind.value}>
                {ind.label}
              </option>
            ))}
          </select>
        </div>

        {/* Goal */}
        <div>
          <label
            htmlFor="qp-goal"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            What&apos;s your main goal with AI?
          </label>
          <textarea
            id="qp-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={loading}
            placeholder="e.g., I spend too much time on weekly reports and want to automate the data gathering..."
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none disabled:opacity-50"
            style={
              {
                "--tw-ring-color": accentColor,
              } as React.CSSProperties
            }
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ backgroundColor: accentColor }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              Generate plan
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        <p className="text-xs text-gray-400">
          Free, no account required.
        </p>
      </form>
    </div>
  );
}

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
  const [source, setSource] = useState<"haiku" | "fallback" | null>(null);
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

  // Not started yet: show CTA button
  if (!showForm && !plan) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Want a personalized action plan?
          </h2>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Answer 3 quick questions and get a tailored plan with specific tools,
            timelines, and actions for your role. Free, takes 30 seconds.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: accentColor }}
          >
            Get your personalized plan
            <svg
              width="16"
              height="16"
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
      </div>
    );
  }

  // Show the plan result
  if (plan) {
    return (
      <div className="space-y-6 mb-6">
        {/* Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
              Your personalized plan
            </h2>
            {source === "haiku" && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
                AI-generated
              </span>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed">{plan.summary}</p>

          {/* First week focus callout */}
          <div
            className="mt-4 rounded-lg p-4"
            style={{ backgroundColor: accentBg }}
          >
            <div className="flex items-start gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 mt-0.5"
              >
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  Start here
                </span>
                <p className="text-sm text-gray-700 mt-0.5">
                  {plan.firstWeekFocus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action items */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">
            Your action items
          </h2>
          <div className="space-y-4">
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
                      <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
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
        </div>

        {/* Time savings + deep dive CTA */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="text-2xl font-black tabular-nums"
              style={{ color: accentColor }}
            >
              {plan.weeklyTimeSaved}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-5">
            Estimated savings with full implementation of this plan.
          </p>
          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm text-gray-600 mb-3">
              Want a deeper analysis with file uploads, website review, and a
              multi-step AI assessment?
            </p>
            <a
              href={`/assessment/start?occupation=${encodeURIComponent(slug)}&industry=${encodeURIComponent(industry)}&teamSize=${encodeURIComponent(teamSize)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors no-underline"
            >
              Get the full deep dive
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
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show the form (loading or input state)
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
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Team size
          </label>
          <select
            id="qp-team"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C61F6] focus:border-transparent disabled:opacity-50"
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
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Industry
          </label>
          <select
            id="qp-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C61F6] focus:border-transparent disabled:opacity-50"
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
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C61F6] focus:border-transparent resize-none disabled:opacity-50"
          />
          <div className="text-right">
            <span className="text-xs text-gray-400">
              {goal.length}/500
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-opacity disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
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
              Generating your plan...
            </>
          ) : (
            <>
              Generate my plan
              <svg
                width="16"
                height="16"
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

        <p className="text-xs text-gray-400 text-center">
          Uses AI to generate a personalized plan. Free, no account required.
        </p>
      </form>
    </div>
  );
}

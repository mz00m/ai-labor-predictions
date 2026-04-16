"use client";

import { useState } from "react";
import type { ScorecardResult, GoalPreference } from "@/lib/assessment/scorecard";
import QuickPlan from "./QuickPlan";

interface ScorecardViewProps {
  scorecard: ScorecardResult;
}

// ---------------------------------------------------------------------------
// Score ring colors by band
// ---------------------------------------------------------------------------

const BAND_COLORS: Record<string, { ring: string; bg: string; text: string }> = {
  "getting-started": { ring: "#94a3b8", bg: "rgba(148, 163, 184, 0.08)", text: "#475569" },
  "building-momentum": { ring: "#5C61F6", bg: "rgba(92, 97, 246, 0.08)", text: "#5C61F6" },
  "ai-powered": { ring: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)", text: "#7c3aed" },
  "ai-native": { ring: "#06b6d4", bg: "rgba(6, 182, 212, 0.08)", text: "#0891b2" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

function formatSalary(pay: number) {
  if (pay >= 1000) return `$${Math.round(pay / 1000)}k`;
  return `$${pay.toLocaleString()}`;
}

function formatJobs(jobs: number) {
  if (jobs >= 1_000_000) return `${(jobs / 1_000_000).toFixed(1)}M`;
  if (jobs >= 1_000) return `${Math.round(jobs / 1_000)}k`;
  return jobs.toLocaleString();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScorecardView({ scorecard }: ScorecardViewProps) {
  const [goal, setGoal] = useState<GoalPreference>("both");
  const [copied, setCopied] = useState(false);

  const colors = BAND_COLORS[scorecard.band] ?? BAND_COLORS["building-momentum"];

  // Recompute actions client-side based on goal selection
  // (we get all actions from the server, client just reorders display)
  const sortedActions = [...scorecard.actions].sort((a, b) => {
    if (goal === "both") return 0;
    const aMatch = a.tag === goal ? 0 : a.tag === "both" ? 1 : 2;
    const bMatch = b.tag === goal ? 0 : b.tag === "both" ? 1 : 2;
    return aMatch - bMatch;
  });

  async function copyLink() {
    const url = `https://jobsdata.ai/scorecard/${scorecard.slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors no-underline"
          >
            jobsdata.ai
          </a>
          <a
            href="/scorecard"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline"
          >
            Search occupations
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Title + meta */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {scorecard.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>{formatSalary(scorecard.pay)} median pay</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{formatJobs(scorecard.jobs)} US jobs</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{scorecard.education}</span>
          </div>
        </div>

        {/* Score card */}
        <div
          className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6"
          style={{ borderTopColor: colors.ring, borderTopWidth: 3 }}
        >
          <div className="flex items-start gap-6 sm:gap-8">
            {/* Big score number */}
            <div className="text-center shrink-0">
              <div
                className="text-6xl sm:text-7xl font-black leading-none tabular-nums"
                style={{ color: colors.text }}
              >
                {scorecard.score}
              </div>
              <div className="text-xs font-medium text-gray-400 mt-1">
                out of 10
              </div>
            </div>

            {/* Band + explanation */}
            <div className="min-w-0">
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {scorecard.bandLabel}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {scorecard.exposure_rationale}
              </p>
            </div>
          </div>
        </div>

        {/* Task breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">
            Task breakdown
          </h2>
          <div className="space-y-3">
            <TaskBar
              label="AI can do now"
              value={scorecard.taskBreakdown.aiCanDoNow}
              color="#5C61F6"
            />
            <TaskBar
              label="AI can assist"
              value={scorecard.taskBreakdown.aiCanAssist}
              color="#a78bfa"
            />
            <TaskBar
              label="Human domain"
              value={scorecard.taskBreakdown.humanDomain}
              color="#cbd5e1"
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Based on {scorecard.taskCount} O*NET work activities for this
            occupation
          </p>
        </div>

        {/* Goal selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
            I want to...
          </h2>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "productivity" as GoalPreference, label: "Be more productive" },
                { key: "time" as GoalPreference, label: "Free up more time" },
                { key: "both" as GoalPreference, label: "Both" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setGoal(opt.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  goal === opt.key
                    ? "bg-[#5C61F6] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 tools */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">
            Top tools for your role
          </h2>
          <div className="space-y-4">
            {scorecard.tools.map((tool, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ backgroundColor: colors.ring }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">
                      {tool.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tool.pricingDetails}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {tool.description}
                  </p>
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#5C61F6] hover:underline mt-0.5 inline-block"
                    >
                      Learn more
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level-up actions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">
            3 ways to level up
          </h2>
          <div className="space-y-4">
            {sortedActions.slice(0, 3).map((action, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold text-gray-300 tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {action.description}
                    </p>
                    <span
                      className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      {action.scoreImpact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time savings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-2">
            Estimated time savings
          </h2>
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl font-black tabular-nums"
              style={{ color: colors.text }}
            >
              {scorecard.timeSavingsHoursPerWeek}
            </span>
            <span className="text-gray-500 text-sm">hours per week</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Conservative estimate based on AI exposure score and a 40-hour work
            week. Assumes 30% of exposed tasks produce real time savings today.
          </p>
        </div>

        {/* Layer 2: Personalized Quick Plan */}
        <QuickPlan
          slug={scorecard.slug}
          title={scorecard.title}
          score={scorecard.score}
          band={scorecard.band}
          bandLabel={scorecard.bandLabel}
          taskBreakdown={scorecard.taskBreakdown}
          accentColor={colors.text}
          accentBg={colors.bg}
        />

        {/* Share */}
        <div className="flex justify-center mb-12">
          <button
            onClick={copyLink}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
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
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? "Copied" : "Share scorecard"}
          </button>
        </div>

        {/* Footer note */}
        <div className="border-t border-gray-200 pt-6 pb-8">
          <p className="text-xs text-gray-400 leading-relaxed">
            AI Score measures how much AI opportunity your role has. Higher
            scores mean more potential for AI-assisted productivity gains.
            Scores are derived from O*NET task data across 342 occupations.
            This is a starting point, not a verdict. Tool recommendations are
            based on industry fit and are not endorsements.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            <a
              href="/about"
              className="text-[#5C61F6] hover:underline no-underline"
            >
              Methodology
            </a>
            {" · "}
            <a
              href="/"
              className="text-[#5C61F6] hover:underline no-underline"
            >
              jobsdata.ai
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Task breakdown bar
// ---------------------------------------------------------------------------

function TaskBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900 tabular-nums">
          {pct(value)}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: pct(value),
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OccupationHit {
  slug: string;
  title: string;
  category: string;
  exposure: number;
  taskBreakdown: {
    aiCanDoNow: number;
    aiCanAssist: number;
    humanDomain: number;
  };
  timeSavingsHoursPerWeek: number;
}

interface AiScorePreviewProps {
  jobTitle: string;
  /** Called when user selects a matching occupation */
  onMatchSelected?: (hit: OccupationHit) => void;
}

// ---------------------------------------------------------------------------
// Score band helpers (mirrors scorecard.ts)
// ---------------------------------------------------------------------------

type ScoreBand = "getting-started" | "building-momentum" | "ai-powered" | "ai-native";

function getScoreBand(score: number): ScoreBand {
  if (score <= 3) return "getting-started";
  if (score <= 6) return "building-momentum";
  if (score <= 8) return "ai-powered";
  return "ai-native";
}

const BAND_LABELS: Record<ScoreBand, string> = {
  "getting-started": "Getting Started",
  "building-momentum": "Building Momentum",
  "ai-powered": "AI-Powered",
  "ai-native": "AI-Native",
};

const BAND_COLORS: Record<ScoreBand, { text: string; bg: string }> = {
  "getting-started": { text: "#475569", bg: "rgba(148, 163, 184, 0.08)" },
  "building-momentum": { text: "#5C61F6", bg: "rgba(92, 97, 246, 0.08)" },
  "ai-powered": { text: "#7c3aed", bg: "rgba(139, 92, 246, 0.08)" },
  "ai-native": { text: "#0891b2", bg: "rgba(6, 182, 212, 0.08)" },
};

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AiScorePreview({
  jobTitle,
  onMatchSelected,
}: AiScorePreviewProps) {
  const [results, setResults] = useState<OccupationHit[]>([]);
  const [selected, setSelected] = useState<OccupationHit | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/assessment/occupation-match?q=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );
      const data = await res.json();
      setResults(data.results ?? []);
      // Auto-select if there's a strong match (top result, exact or near-exact)
      if (data.results?.length === 1) {
        const hit = data.results[0];
        setSelected(hit);
        onMatchSelected?.(hit);
      } else {
        setSelected(null);
      }
    } catch {
      // Abort or network error — ignore
    } finally {
      setLoading(false);
    }
  }, [onMatchSelected]);

  useEffect(() => {
    const trimmed = jobTitle.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setSelected(null);
      setDismissed(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(trimmed), 400);

    return () => clearTimeout(debounceRef.current);
  }, [jobTitle, search]);

  function selectHit(hit: OccupationHit) {
    setSelected(hit);
    setResults([]);
    onMatchSelected?.(hit);
  }

  // Nothing to show
  if (dismissed || (!loading && results.length === 0 && !selected)) {
    return null;
  }

  // Show loading skeleton
  if (loading && !selected) {
    return (
      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-2 bg-gray-200 rounded w-32" />
      </div>
    );
  }

  // Show disambiguation list
  if (!selected && results.length > 1) {
    return (
      <div className="mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500">
            We found matching occupations. Select yours for an instant AI score:
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {results.map((hit) => {
            const band = getScoreBand(hit.exposure);
            const colors = BAND_COLORS[band];
            return (
              <button
                key={hit.slug}
                onClick={() => selectHit(hit)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {hit.title}
                  </div>
                </div>
                <div className="shrink-0 ml-3 flex items-center gap-1.5">
                  <span
                    className="text-lg font-bold tabular-nums"
                    style={{ color: colors.text }}
                  >
                    {hit.exposure}
                  </span>
                  <span className="text-xs text-gray-400">/10</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Show the score preview card for the selected occupation
  if (selected) {
    const band = getScoreBand(selected.exposure);
    const colors = BAND_COLORS[band];

    return (
      <div
        className="mt-4 rounded-xl border border-gray-200 bg-white p-5 relative"
        style={{ borderTopColor: colors.text, borderTopWidth: 3 }}
      >
        {/* Dismiss */}
        <button
          onClick={() => {
            setDismissed(true);
            setSelected(null);
          }}
          className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-5">
          {/* Score number */}
          <div className="text-center shrink-0">
            <div
              className="text-4xl font-black leading-none tabular-nums"
              style={{ color: colors.text }}
            >
              {selected.exposure}
            </div>
            <div className="text-[10px] font-medium text-gray-400 mt-0.5">
              out of 10
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {selected.title}
              </span>
              <span
                className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {BAND_LABELS[band]}
              </span>
            </div>

            {/* Task breakdown bars */}
            <div className="space-y-1.5">
              <MiniBar
                label="AI can do now"
                value={selected.taskBreakdown.aiCanDoNow}
                color="#5C61F6"
              />
              <MiniBar
                label="AI can assist"
                value={selected.taskBreakdown.aiCanAssist}
                color="#a78bfa"
              />
              <MiniBar
                label="Human domain"
                value={selected.taskBreakdown.humanDomain}
                color="#cbd5e1"
              />
            </div>

            {/* Time savings teaser */}
            <div className="flex items-baseline gap-1.5 mt-2.5">
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: colors.text }}
              >
                ~{selected.timeSavingsHoursPerWeek} hrs/week
              </span>
              <span className="text-[11px] text-gray-400">
                potential time savings
              </span>
            </div>
          </div>
        </div>

        {/* Motivation line */}
        <div className="mt-3.5 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Complete the assessment for a personalized action plan with specific tools and next steps for your role.
          </p>
        </div>

        {/* Change selection */}
        {results.length > 1 && (
          <button
            onClick={() => setSelected(null)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Not your role? Choose another
          </button>
        )}
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Mini task breakdown bar
// ---------------------------------------------------------------------------

function MiniBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: pct(value), backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] font-medium text-gray-500 tabular-nums w-8 text-right">
        {pct(value)}
      </span>
    </div>
  );
}

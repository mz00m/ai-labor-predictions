"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCountUp, DelightStyles } from "./delights";

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
  /** Industry the user picked on the prior step — biases occupation matching */
  industry?: string;
  /** Called when user selects a matching occupation */
  onMatchSelected?: (hit: OccupationHit) => void;
  /** Called when user clicks the continue CTA */
  onContinue?: () => void;
}

// ---------------------------------------------------------------------------
// Score band helpers
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
  industry,
  onMatchSelected,
  onContinue,
}: AiScorePreviewProps) {
  const [results, setResults] = useState<OccupationHit[]>([]);
  const [selected, setSelected] = useState<OccupationHit | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const animatedScore = useCountUp(selected?.exposure ?? 0, 600);

  const search = useCallback(async (q: string, sector: string | undefined) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params = new URLSearchParams({ q });
      if (sector) params.set("sector", sector);
      const res = await fetch(
        `/api/assessment/occupation-match?${params.toString()}`,
        { signal: controller.signal }
      );
      const data = await res.json();
      setResults(data.results ?? []);
      if (data.results?.length === 1) {
        const hit = data.results[0];
        setSelected(hit);
        onMatchSelected?.(hit);
      } else {
        setSelected(null);
      }
    } catch {
      // Abort or network error
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
    debounceRef.current = setTimeout(() => search(trimmed, industry), 400);

    return () => clearTimeout(debounceRef.current);
  }, [jobTitle, industry, search]);

  function selectHit(hit: OccupationHit) {
    setSelected(hit);
    setResults([]);
    onMatchSelected?.(hit);
  }

  // Nothing to show
  if (dismissed || (!loading && results.length === 0 && !selected)) {
    return null;
  }

  // Loading — subtle inline indicator
  if (loading && !selected) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 animate-pulse">
        <div className="w-3 h-3 rounded-full bg-gray-200" />
        Matching your role...
      </div>
    );
  }

  // Disambiguation — inline dropdown style
  if (!selected && results.length > 1) {
    return (
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-1.5">
          Select your closest match:
        </p>
        <div className="space-y-1">
          {results.map((hit) => {
            const band = getScoreBand(hit.exposure);
            const colors = BAND_COLORS[band];
            return (
              <button
                key={hit.slug}
                onClick={() => selectHit(hit)}
                className="w-full px-3 py-2 flex items-center justify-between text-left rounded-lg border border-gray-150 hover:border-accent/30 hover:bg-accent/[0.02] transition-colors"
              >
                <span className="text-sm text-gray-700 truncate">
                  {hit.title}
                </span>
                <span
                  className="shrink-0 ml-3 text-xs font-semibold tabular-nums"
                  style={{ color: colors.text }}
                >
                  {hit.exposure}/10
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Selected — inline confirmation with teaser + continue CTA
  if (selected) {
    const band = getScoreBand(selected.exposure);
    const colors = BAND_COLORS[band];
    const aiPct = Math.round(
      (selected.taskBreakdown.aiCanDoNow + selected.taskBreakdown.aiCanAssist) * 100
    );

    return (
      <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
        <DelightStyles />
        {/* Header row: matched title + score + dismiss */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white shrink-0"
              style={{
                backgroundColor: colors.text,
                animation: "score-glow 1s ease-out",
              }}
            >
              {animatedScore}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {selected.title}
              </div>
              <div className="text-xs text-gray-400">
                AI Exposure Score: {selected.exposure}/10
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setDismissed(true);
              setSelected(null);
            }}
            className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Compact task breakdown */}
        <div
          className="flex gap-1 h-2 rounded-full overflow-hidden mb-3"
          style={{
            transformOrigin: "left",
            animation: "bar-grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            className="rounded-l-full transition-all duration-500"
            style={{
              width: pct(selected.taskBreakdown.aiCanDoNow),
              backgroundColor: "#5C61F6",
            }}
            title={`AI can do now: ${pct(selected.taskBreakdown.aiCanDoNow)}`}
          />
          <div
            className="transition-all duration-500"
            style={{
              width: pct(selected.taskBreakdown.aiCanAssist),
              backgroundColor: "#a78bfa",
            }}
            title={`AI can assist: ${pct(selected.taskBreakdown.aiCanAssist)}`}
          />
          <div
            className="rounded-r-full transition-all duration-500"
            style={{
              width: pct(selected.taskBreakdown.humanDomain),
              backgroundColor: "#e2e8f0",
            }}
            title={`Human domain: ${pct(selected.taskBreakdown.humanDomain)}`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#5C61F6]" />
            AI can do now
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#a78bfa]" />
            AI can assist
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" />
            Human domain
          </span>
        </div>

        {/* Teaser stat */}
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-semibold" style={{ color: colors.text }}>
            {aiPct}% of tasks
          </span>
          {" "}in this role can be performed or assisted by AI, saving an estimated{" "}
          <span className="font-semibold" style={{ color: colors.text }}>
            ~{selected.timeSavingsHoursPerWeek} hrs/week
          </span>.
          Complete the assessment for your personalized action plan.
        </p>

        {/* Continue CTA */}
        {onContinue && (
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Continue to next step
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}

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

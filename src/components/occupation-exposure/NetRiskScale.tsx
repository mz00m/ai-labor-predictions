"use client";

import Link from "next/link";

const ZONES = [
  {
    range: "1 - 3",
    label: "Lower risk",
    color: "#16A34A",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.2)",
    description:
      "Strong buffers outweigh pressure. These occupations have some combination of elastic demand, high complementarity with AI, and adaptable workers. AI is more likely to reshape these roles than eliminate them.",
  },
  {
    range: "4 - 6",
    label: "Moderate risk",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    description:
      "Pressure and buffers roughly balance. Outcomes depend on how fast firms adopt, whether demand expands, and how quickly workers adapt. Most occupations fall here — the picture is genuinely uncertain.",
  },
  {
    range: "7 - 10",
    label: "Higher risk",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.2)",
    description:
      "Pressure factors dominate. High technical exposure, fast adoption, and limited buffers. These roles face real displacement pressure — though even here, timing is uncertain and new tasks often emerge.",
  },
];

export default function NetRiskScale() {
  return (
    <div className="max-w-[740px] mx-auto mb-8">
      <h3 className="text-[13px] font-bold text-[var(--foreground)] mb-1">
        Reading the net risk score
      </h3>
      <p className="text-[12px] text-[var(--muted)] leading-snug mb-4">
        The score weighs two pressure factors (exposure, adoption speed) against
        three buffers (adaptability, demand elasticity, complementarity). A high
        score doesn&rsquo;t mean jobs disappear — it means the balance of
        evidence tilts toward disruption.
      </p>

      {/* Gradient bar */}
      <div className="mb-4">
        <div
          className="h-2.5 rounded-full w-full"
          style={{
            background:
              "linear-gradient(to right, #16A34A 0%, #F59E0B 45%, #DC2626 100%)",
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--muted)]">1</span>
          <span className="text-[10px] text-[var(--muted)]">5</span>
          <span className="text-[10px] text-[var(--muted)]">10</span>
        </div>
      </div>

      {/* Zone explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {ZONES.map((zone) => (
          <div
            key={zone.range}
            className="rounded-lg px-3 py-2.5"
            style={{
              background: zone.bg,
              border: `1px solid ${zone.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[18px] font-bold leading-none"
                style={{ color: zone.color }}
              >
                {zone.range}
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: zone.color }}
              >
                {zone.label}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] leading-[1.6]">
              {zone.description}
            </p>
          </div>
        ))}
      </div>

      {/* Task visualizer CTA */}
      <div className="mt-4 rounded-lg border border-black/[0.06] bg-[var(--accent-light)] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-[12px] text-[var(--muted)] leading-snug">
          Want to see how AI affects the specific tasks in your job, not just the
          occupation group?
        </p>
        <Link
          href="/task-visualizer"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--accent)] hover:underline whitespace-nowrap flex-shrink-0"
        >
          Explore by job title
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 3L9.5 7L5 11" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

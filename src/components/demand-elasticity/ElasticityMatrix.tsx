"use client";

const CELLS = [
  {
    row: "high-exposure",
    col: "low-elasticity",
    label: "Displacement",
    color: "#ef4444",
    examples: "Back-office data entry, toll processing, basic bookkeeping",
    description:
      "AI handles many tasks, but demand doesn't grow when it gets cheaper. Net effect: fewer workers.",
  },
  {
    row: "high-exposure",
    col: "high-elasticity",
    label: "Expansion",
    color: "#22c55e",
    examples: "Software engineering, creative services, legal aid, data analysis",
    description:
      "AI handles many tasks AND lower costs unlock new demand. Net effect: more workers, often at higher wages.",
  },
  {
    row: "low-exposure",
    col: "low-elasticity",
    label: "Minimal impact",
    color: "#94a3b8",
    examples: "Plumbing, electrical work, childcare",
    description:
      "Few tasks automatable, demand doesn't change much. AI has limited effect on this work.",
  },
  {
    row: "low-exposure",
    col: "high-elasticity",
    label: "Modest growth",
    color: "#5C61F6",
    examples: "Healthcare (with AI diagnostics), skilled trades (with AI estimation)",
    description:
      "Few tasks directly automatable, but AI tools at the margins unlock some new demand.",
  },
];

export default function ElasticityMatrix() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white">
      {/* Column headers */}
      <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr]">
        <div className="bg-black/[0.02] p-3" />
        <div className="bg-black/[0.02] p-3 text-center border-l border-black/[0.06]">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Low demand elasticity
          </p>
          <p className="text-2xs text-[var(--muted)] mt-0.5">
            Cheaper doesn&rsquo;t mean more demand
          </p>
        </div>
        <div className="bg-black/[0.02] p-3 text-center border-l border-black/[0.06]">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            High demand elasticity
          </p>
          <p className="text-2xs text-[var(--muted)] mt-0.5">
            Cheaper unlocks much more demand
          </p>
        </div>
      </div>

      {/* High exposure row */}
      <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-t border-black/[0.06]">
        <div className="bg-black/[0.02] p-3 flex items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              High AI exposure
            </p>
            <p className="text-2xs text-[var(--muted)] mt-0.5">
              Many tasks automatable
            </p>
          </div>
        </div>
        {CELLS.filter((c) => c.row === "high-exposure").map((cell) => (
          <div
            key={cell.col}
            className="p-4 border-l border-black/[0.06]"
            style={{ backgroundColor: cell.color + "08" }}
          >
            <p
              className="text-base font-bold mb-1"
              style={{ color: cell.color }}
            >
              {cell.label}
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
              {cell.description}
            </p>
            <p className="text-xs text-[var(--muted)] opacity-70 italic">
              {cell.examples}
            </p>
          </div>
        ))}
      </div>

      {/* Low exposure row */}
      <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-t border-black/[0.06]">
        <div className="bg-black/[0.02] p-3 flex items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Low AI exposure
            </p>
            <p className="text-2xs text-[var(--muted)] mt-0.5">
              Few tasks automatable
            </p>
          </div>
        </div>
        {CELLS.filter((c) => c.row === "low-exposure").map((cell) => (
          <div
            key={cell.col}
            className="p-4 border-l border-black/[0.06]"
            style={{ backgroundColor: cell.color + "08" }}
          >
            <p
              className="text-base font-bold mb-1"
              style={{ color: cell.color }}
            >
              {cell.label}
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
              {cell.description}
            </p>
            <p className="text-xs text-[var(--muted)] opacity-70 italic">
              {cell.examples}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

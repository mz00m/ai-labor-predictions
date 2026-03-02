"use client";

const ROWS = [
  {
    label: "Access",
    preElec: "Near a water wheel or steam engine",
    postElec: "Any electrical outlet",
    preAI: "Expensive credentialed experts",
    postAI: "Any smartphone",
  },
  {
    label: "Cost",
    preElec: "High capital, fixed infrastructure",
    postElec: "Per unit of use",
    preAI: "$200\u2013$700/hour",
    postAI: "Near zero marginal cost",
  },
  {
    label: "Geography",
    preElec: "Mill towns, factory districts",
    postElec: "Anywhere on the grid",
    preAI: "Major metros with legal/medical/finance clusters",
    postAI: "Anywhere with internet",
  },
  {
    label: "Competitive advantage",
    preElec: "Owning the power infrastructure",
    postElec: "Using power intelligently",
    preAI: "Accessing expert talent",
    postAI: "Using AI intelligently",
  },
];

export default function ComparisonMatrix() {
  return (
    <div>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-3 pr-4 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] w-[140px]" />
              <th
                colSpan={2}
                className="pb-1 text-center text-[12px] font-bold uppercase tracking-wider"
                style={{ color: "#2563eb" }}
              >
                Physical Power
              </th>
              <th
                colSpan={2}
                className="pb-1 text-center text-[12px] font-bold uppercase tracking-wider"
                style={{ color: "#7c3aed" }}
              >
                Cognitive Capability
              </th>
            </tr>
            <tr className="border-b border-black/[0.06]">
              <th className="pb-3 pr-4" />
              <th className="pb-3 px-3 text-[11px] font-semibold text-[var(--muted)] text-center">
                Pre-Electricity
              </th>
              <th
                className="pb-3 px-3 text-[11px] font-semibold text-center"
                style={{ color: "#2563eb" }}
              >
                Post-Electricity
              </th>
              <th className="pb-3 px-3 text-[11px] font-semibold text-[var(--muted)] text-center">
                Pre-AI
              </th>
              <th
                className="pb-3 px-3 text-[11px] font-semibold text-center"
                style={{ color: "#7c3aed" }}
              >
                Post-AI
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.label}
                className="border-b border-black/[0.04]"
              >
                <td className="py-3 pr-4 text-[12px] font-semibold text-[var(--foreground)]">
                  {row.label}
                </td>
                <td className="py-3 px-3 text-[12px] text-[var(--muted)]">
                  {row.preElec}
                </td>
                <td
                  className="py-3 px-3 text-[12px] font-medium rounded-sm"
                  style={{
                    backgroundColor: "#2563eb08",
                    color: "#1e40af",
                  }}
                >
                  {row.postElec}
                </td>
                <td className="py-3 px-3 text-[12px] text-[var(--muted)]">
                  {row.preAI}
                </td>
                <td
                  className="py-3 px-3 text-[12px] font-medium rounded-sm"
                  style={{
                    backgroundColor: "#7c3aed08",
                    color: "#5b21b6",
                  }}
                >
                  {row.postAI}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="lg:hidden space-y-4">
        {/* Electricity pair */}
        <div className="border border-black/[0.06] rounded-lg overflow-hidden">
          <div
            className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#dbeafe", color: "#2563eb" }}
          >
            Physical Power
          </div>
          {ROWS.map((row) => (
            <div
              key={`elec-${row.label}`}
              className="px-4 py-3 border-b border-black/[0.04]"
            >
              <div className="text-[11px] font-semibold text-[var(--foreground)] mb-1.5">
                {row.label}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-medium text-[var(--muted)] mb-0.5">
                    Before
                  </div>
                  <div className="text-[12px] text-[var(--muted)]">
                    {row.preElec}
                  </div>
                </div>
                <div
                  className="rounded px-2 py-1"
                  style={{ backgroundColor: "#2563eb08" }}
                >
                  <div
                    className="text-[10px] font-medium mb-0.5"
                    style={{ color: "#2563eb" }}
                  >
                    After
                  </div>
                  <div
                    className="text-[12px] font-medium"
                    style={{ color: "#1e40af" }}
                  >
                    {row.postElec}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI pair */}
        <div className="border border-black/[0.06] rounded-lg overflow-hidden">
          <div
            className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#ede9fe", color: "#7c3aed" }}
          >
            Cognitive Capability
          </div>
          {ROWS.map((row) => (
            <div
              key={`ai-${row.label}`}
              className="px-4 py-3 border-b border-black/[0.04]"
            >
              <div className="text-[11px] font-semibold text-[var(--foreground)] mb-1.5">
                {row.label}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-medium text-[var(--muted)] mb-0.5">
                    Before
                  </div>
                  <div className="text-[12px] text-[var(--muted)]">
                    {row.preAI}
                  </div>
                </div>
                <div
                  className="rounded px-2 py-1"
                  style={{ backgroundColor: "#7c3aed08" }}
                >
                  <div
                    className="text-[10px] font-medium mb-0.5"
                    style={{ color: "#7c3aed" }}
                  >
                    After
                  </div>
                  <div
                    className="text-[12px] font-medium"
                    style={{ color: "#5b21b6" }}
                  >
                    {row.postAI}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

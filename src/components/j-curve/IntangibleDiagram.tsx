"use client";

/**
 * Visual diagram showing why intangible investment creates the J-curve:
 * the accounting gap between what firms actually produce and what statistics measure.
 */

interface BarItem {
  text: string;
  color: string;
  width: string;
  dashed?: boolean;
  strikethrough?: boolean;
}

export default function IntangibleDiagram() {
  const rows: { label: string; items: BarItem[]; annotation: string }[] = [
    {
      label: "What firms produce",
      items: [
        { text: "Measured output (GDP)", color: "#22c55e", width: "55%" },
        {
          text: "Intangible capital",
          color: "#ef4444",
          width: "45%",
          dashed: true,
        },
      ],
      annotation: "True output",
    },
    {
      label: "What statistics count",
      items: [
        { text: "Measured output (GDP)", color: "#22c55e", width: "55%" },
        {
          text: "Treated as expense",
          color: "#d1d5db",
          width: "45%",
          strikethrough: true,
        },
      ],
      annotation: "Measured output",
    },
  ];

  return (
    <div className="space-y-5">
      {rows.map((row, i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              {row.label}
            </span>
            <span className="text-[10px] text-[var(--muted)] opacity-60">
              = {row.annotation}
            </span>
          </div>
          <div className="flex gap-0.5 h-10 rounded-md overflow-hidden">
            {row.items.map((item, j) => (
              <div
                key={j}
                className="flex items-center justify-center px-2 text-[11px] font-semibold text-white"
                style={{
                  width: item.width,
                  backgroundColor: item.color,
                  opacity: item.strikethrough ? 0.3 : 1,
                  border: item.dashed
                    ? `2px dashed ${item.color}`
                    : "none",
                  ...(item.dashed
                    ? {
                        backgroundColor: item.color + "20",
                        color: item.color,
                      }
                    : {}),
                }}
              >
                <span
                  style={{
                    textDecoration: item.strikethrough
                      ? "line-through"
                      : "none",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Arrow pointing to the gap */}
      <div className="flex items-start gap-3 px-3 py-2.5 bg-red-50 rounded-md border border-red-100">
        <span className="text-red-500 text-lg leading-none mt-0.5">&#x2193;</span>
        <div>
          <p className="text-[12px] font-bold text-red-600 mb-0.5">The Measurement Gap</p>
          <p className="text-[12px] text-red-900/70 leading-relaxed">
            When firms invest in reorganization, training, and new workflows,
            national accounts treat these as <strong>current expenses</strong> that
            reduce measured GDP &mdash; not as <strong>investments</strong> that
            build future capacity. The economy looks like it&apos;s stagnating
            when it&apos;s actually building up an enormous stock of unmeasured
            intangible capital.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { parseISO } from "date-fns";
import SignalStrip, { type SignalOverlay, type SignalSource } from "@/components/SignalStrip";

interface HistoryPoint {
  date: string;
  value: number;
}

export default function SignalStripClient({
  overlays,
  sources,
  history,
}: {
  overlays: SignalOverlay[];
  sources: SignalSource[];
  history: HistoryPoint[];
}) {
  const [jumped, setJumped] = useState<string | null>(null);

  const { minTs, maxTs } = useMemo(() => {
    const allTs = [
      ...overlays.map((o) => parseISO(o.date).getTime()),
      ...history.map((h) => parseISO(h.date).getTime()),
    ];
    return { minTs: Math.min(...allTs), maxTs: Math.max(...allTs) };
  }, [overlays, history]);

  const ups = overlays.filter((o) => o.direction === "up").length;
  const downs = overlays.filter((o) => o.direction === "down").length;
  const neutrals = overlays.filter((o) => o.direction === "neutral").length;

  return (
    <div className="space-y-10">
      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <div style={{ display: "flex", gap: 2 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ width: 8, height: 8, background: "#16a34a", borderRadius: 2, opacity: 0.8 }}
              />
            ))}
          </div>
          Net positive (↑ more than ↓)
        </div>
        <div className="flex items-center gap-2">
          <div style={{ display: "flex", gap: 2 }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{ width: 8, height: 8, background: "#dc2626", borderRadius: 2, opacity: 0.8 }}
              />
            ))}
          </div>
          Net negative (↓ more than ↑)
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, background: "#94a3b8", borderRadius: 2, opacity: 0.8 }} />
          Balanced / neutral
        </div>
      </div>

      {/* Strip A: full date range (all overlays) */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Full range — {overlays.length} signals ({ups}↑ {downs}↓ {neutrals}↔)
        </p>
        <div className="border border-[rgba(0,0,0,0.06)] rounded-xl px-4 py-4">
          <SignalStrip
            overlays={overlays}
            sources={sources}
            minTs={minTs}
            maxTs={maxTs}
            onGroupClick={(ids) => setJumped(ids[0])}
          />
        </div>
      </div>

      {/* Strip B: zoomed in to history range only (2023–2026) */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Zoomed to data range (matches chart x-axis)
        </p>
        {(() => {
          const hTs = history.map((h) => parseISO(h.date).getTime());
          const hMin = Math.min(...hTs);
          const hMax = Math.max(...hTs);
          const visible = overlays.filter((o) => {
            const ts = parseISO(o.date).getTime();
            return ts >= hMin - 90 * 86400000 && ts <= hMax + 90 * 86400000;
          });
          return (
            <div className="border border-[rgba(0,0,0,0.06)] rounded-xl px-4 py-4">
              <SignalStrip
                overlays={visible}
                sources={sources}
                minTs={hMin}
                maxTs={hMax}
                onGroupClick={(ids) => setJumped(ids[0])}
              />
              <p className="text-xs text-[var(--muted)] mt-2 opacity-60">
                {visible.length} signals visible in this range
              </p>
            </div>
          );
        })()}
      </div>

      {/* Density experiment: cluster nearby months */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Notes on what to tweak
        </p>
        <div className="text-sm text-[var(--muted)] space-y-1.5 max-w-2xl">
          <p>• Block size is 8×8px with 2px gap. Adjust <code className="text-xs bg-black/[0.05] px-1 rounded">BLOCK</code> and <code className="text-xs bg-black/[0.05] px-1 rounded">GAP</code> in SignalStrip.tsx.</p>
          <p>• Cancellation: 2↑ + 3↓ → 1 red block. 3↑ + 1↓ → 2 green blocks. Equal = grey.</p>
          <p>• Max 5 blocks per column; overflow shows +N above the stack.</p>
          <p>• Hover any column to see all studies. Click to scroll to sources.</p>
          <p>• The strip can sit below the Recharts chart sharing the same x-axis domain.</p>
        </div>
      </div>

      {jumped && (
        <p className="text-xs text-[var(--muted)]">
          Would scroll to source: <code className="bg-black/[0.04] px-1 rounded">{jumped}</code>
        </p>
      )}
    </div>
  );
}

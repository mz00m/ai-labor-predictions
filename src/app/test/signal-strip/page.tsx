import { readFileSync } from "fs";
import path from "path";
import SignalStripClient from "./SignalStripClient";

export default function SignalStripTestPage() {
  const raw = readFileSync(
    path.join(process.cwd(), "src/data/predictions/displacement/overall.json"),
    "utf8"
  );
  const data = JSON.parse(raw);

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 space-y-10">
      {/* Header */}
      <div className="space-y-2 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Local prototype · not in nav
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Signal Strip
        </h1>
        <p className="text-md text-[var(--muted)] leading-relaxed">
          Replacement for overlay bars on prediction charts. Each column is one calendar month.
          Blocks are pixel-sized and stack up to 5 — green for net-positive signals, red for
          net-negative, grey for balanced or neutral. Cancellation is exact: 2↑ + 3↓ = 1 red block.
          Hover any column to see the individual studies.
        </p>
        <p className="text-sm text-[var(--muted)] opacity-60">
          Data source: Overall US Displacement — {data.overlays?.length} overlay signals
        </p>
      </div>

      <SignalStripClient
        overlays={data.overlays ?? []}
        sources={data.sources ?? []}
        history={data.history ?? []}
      />
    </div>
  );
}

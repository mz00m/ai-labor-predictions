import type { Metadata } from "next";
import { Suspense } from "react";
import EconomyVisualizerClient from "./EconomyVisualizerClient";

export const metadata: Metadata = {
  title: "AI and the US Economy | Automation impact by occupation and income",
  description:
    "How will AI automation roll through the US economy? Explore 160M+ jobs across 22 occupation groups by income tier, task composition, and projected automation timeline.",
};

export default function EconomyPage() {
  return (
    <div>
      <header className="mb-10">
        <p className="text-sm font-medium text-[var(--accent)] mb-2">
          <a href="/task-visualizer" className="hover:underline">Task Visualizer</a>
          {" / "}
          <span className="text-[var(--muted)]">US Economy</span>
        </p>
        <h1 className="text-4xl sm:text-[34px] font-bold text-[var(--foreground)] tracking-tight leading-tight">
          How AI automation rolls through the US economy
        </h1>
        <p className="text-lg text-[var(--muted)] mt-2 max-w-2xl leading-relaxed">
          160 million workers across 22 major occupation groups. Here is what the US workforce
          looks like today, and how declining compute costs create automation pressure across
          income levels over the next decade.
        </p>
      </header>

      <Suspense fallback={<div className="py-20 text-center text-[var(--muted)]">Loading...</div>}>
        <EconomyVisualizerClient />
      </Suspense>
    </div>
  );
}

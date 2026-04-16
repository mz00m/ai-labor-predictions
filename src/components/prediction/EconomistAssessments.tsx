"use client";

import { ECONOMIST_VIEWS } from "@/data/forecast";

const STANCE_STYLES: Record<string, { bg: string; text: string }> = {
  optimistic: { bg: "bg-emerald-50", text: "text-emerald-700" },
  cautious: { bg: "bg-amber-50", text: "text-amber-700" },
  skeptical: { bg: "bg-red-50", text: "text-red-700" },
};

export default function EconomistAssessments() {
  return (
    <section className="mb-12">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
        Peer Review
      </p>
      <h2 className="text-[24px] sm:text-[30px] font-extrabold tracking-tight text-[#2E3650] mb-1">
        What Six Labor Economists Would Say
      </h2>
      <p className="text-[14px] text-[var(--muted)] mb-6 max-w-xl leading-relaxed">
        These economists agree on more than public discourse suggests. They
        disagree on emphasis, not direction. None predict mass unemployment.
        All insist the research base is too thin for high confidence.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ECONOMIST_VIEWS.map((e) => {
          const style = STANCE_STYLES[e.stance] ?? STANCE_STYLES.cautious;
          return (
            <div
              key={e.name}
              className="rounded-xl border border-black/[0.06] p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-[#2E3650]">
                    {e.name}
                  </h3>
                  <p className="text-[11px] text-[var(--muted)]">
                    {e.affiliation}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${style.bg} ${style.text}`}
                >
                  {e.stanceLabel}
                </span>
              </div>

              <p className="text-[12px] text-[var(--muted)] leading-relaxed flex-1 mb-3">
                {e.summary}
              </p>

              <blockquote className="border-l-2 border-[var(--accent)]/30 pl-3 mt-auto">
                <p className="text-[11px] italic text-[var(--muted)] leading-relaxed">
                  &ldquo;{e.keyQuote}&rdquo;
                </p>
              </blockquote>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-black/[0.06] p-5 bg-black/[0.01]">
        <h3 className="text-[14px] font-bold text-[#2E3650] mb-2">
          Where All Six Converge
        </h3>
        <ul className="space-y-1.5 text-[12px] text-[var(--muted)] leading-relaxed">
          <li>
            <span className="font-medium text-[#2E3650]">Exposure is not displacement.</span>{" "}
            That a task can be automated does not mean the job disappears.
          </li>
          <li>
            <span className="font-medium text-[#2E3650]">No mass unemployment by 2030.</span>{" "}
            Historical precedent and current data both point to adjustment, not apocalypse.
          </li>
          <li>
            <span className="font-medium text-[#2E3650]">Distributional effects are dramatic.</span>{" "}
            Age, skill, geography, and gender create enormous variation beneath modest aggregates.
          </li>
          <li>
            <span className="font-medium text-[#2E3650]">The research base is insufficient</span>{" "}
            for confident predictions. Intellectual humility is warranted.
          </li>
          <li>
            <span className="font-medium text-[#2E3650]">Direction is a choice.</span>{" "}
            Automation vs. augmentation is a design decision, not technological inevitability.
          </li>
        </ul>
      </div>
    </section>
  );
}

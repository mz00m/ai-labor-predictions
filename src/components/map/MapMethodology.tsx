import Link from "next/link";

const DIMENSIONS = [
  {
    label: "Technical Exposure",
    role: "Pressure",
    roleColor: "#DC2626",
    description:
      "How many of this occupation's tasks can AI actually perform today? Anchored to the Karpathy/GPT exposure score, carried through at the occupation level.",
  },
  {
    label: "Adoption Speed",
    role: "Pressure",
    roleColor: "#DC2626",
    description:
      "How fast will firms in this sector actually deploy AI? Mapped from task-composition-weighted category adoption lag. Regulated industries lag tech by years.",
  },
  {
    label: "Worker Adaptability",
    role: "Buffer",
    roleColor: "#16A34A",
    description:
      "Can displaced workers retrain and transition? Built from pay percentile and education tier, equal-weighted across the 342-occupation set.",
  },
  {
    label: "Demand Elasticity",
    role: "Buffer",
    roleColor: "#16A34A",
    description:
      "When AI makes output cheaper, does demand expand enough to offset job losses? Rule-based defaults by BLS major category at present.",
  },
  {
    label: "AI Complementarity",
    role: "Buffer",
    roleColor: "#16A34A",
    description:
      "Does AI replace workers or make them more productive? Estimated from task composition and adjusted by job dimensionality — the number of distinct task clusters.",
  },
];

export default function MapMethodology() {
  return (
    <section id="methodology" className="mb-12 scroll-mt-8">
      <div className="border-t border-strong pt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] opacity-60 mb-2">
          04 &middot; Methodology
        </p>
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight">
                How risk is scored
              </h2>
              <span className="text-base text-[var(--muted)] group-open:hidden">
                Show details &darr;
              </span>
              <span className="text-base text-[var(--muted)] hidden group-open:inline">
                Hide details &uarr;
              </span>
            </div>
            <p className="text-md text-[var(--muted)] leading-relaxed mt-3 max-w-2xl">
              Five research-backed variables &mdash; two pressure forces and three
              buffers &mdash; combined into a bounded 0&ndash;10 net risk per
              occupation, then employment-weighted into sectors.
            </p>
          </summary>

          <div className="mt-6 space-y-6 max-w-2xl">
            <div className="border border-strong rounded-lg divide-y divide-black/[0.06]">
              {DIMENSIONS.map((d) => (
                <div key={d.label} className="px-4 py-3">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-2xs font-bold uppercase tracking-widest w-[60px]"
                      style={{ color: d.roleColor }}
                    >
                      {d.role}
                    </span>
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {d.label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed pl-[72px]">
                    {d.description}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">
                Roll-up
              </h3>
              <ol className="list-decimal list-outside pl-5 space-y-1.5 text-sm text-[var(--muted)] leading-relaxed">
                <li>
                  Each task gets a 0&ndash;100 risk score from technical exposure,
                  adoption pace, demand outlook, and O*NET importance.
                </li>
                <li>
                  Task scores are bucketed (low &lt; 33, medium 33&ndash;66, high &gt; 66) and
                  time-weighted by O*NET importance to yield per-occupation time-share.
                </li>
                <li>
                  Occupations are scored on the 5-variable framework, combined into
                  a net risk on 0&ndash;10 (and also displayed on 0&ndash;100).
                </li>
                <li>
                  Sector risk is the employment-weighted average of occupation net
                  risk across that BLS major group.
                </li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link
                href="/occupation-exposure"
                className="font-medium text-[var(--accent-text)] hover:underline"
              >
                Full 5-variables essay &rarr;
              </Link>
              <span className="text-black/[0.15]">|</span>
              <Link
                href="/task-visualizer"
                className="font-medium text-[var(--accent-text)] hover:underline"
              >
                Task visualizer
              </Link>
              <span className="text-black/[0.15]">|</span>
              <Link
                href="/demand-elasticity"
                className="font-medium text-[var(--accent-text)] hover:underline"
              >
                Demand elasticity explainer
              </Link>
              <span className="text-black/[0.15]">|</span>
              <Link
                href="/predictions"
                className="font-medium text-[var(--accent-text)] hover:underline"
              >
                All predictions
              </Link>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

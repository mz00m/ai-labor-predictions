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

            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">
                On the OpenAI Jobs Transition Framework
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                The four archetypes on this page (Automation Risk, Reorganize,
                Grow, Less Change) and the decision-tree structure come from
                Richmond&rsquo;s{" "}
                <a
                  href="https://cdn.openai.com/pdf/the-ai-jobs-transition-framework_report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-text)] hover:underline"
                >
                  AI Jobs Transition Framework
                </a>{" "}
                (OpenAI, April 2026). We apply the framework using <em>our</em>{" "}
                5-variable scores rather than the paper&rsquo;s per-occupation
                outputs, which haven&rsquo;t been published as a downloadable
                table yet. National splits from our classifier (auto-risk
                ~34% / reorganize ~7% / grow ~9% / less-change ~50%) differ
                from the paper&rsquo;s (18% / 24% / 12% / 46%), mostly because
                our human-necessity proxy is task-share-based rather than the
                paper&rsquo;s GPT-5.4-scored regulatory/relational/physical
                taxonomy. Qualitative groupings agree: lawyers and physicians
                land in <em>reorganize</em>, software developers in{" "}
                <em>grow</em>, customer-service reps and general clerks in{" "}
                <em>automation-risk</em>. We expect to refine the classifier
                once the paper&rsquo;s technical appendix is released.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">
                Counterpoint from the paper (Table 1)
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
                The paper validates archetypes against CPS unemployment data
                and finds a counterintuitive result: it is{" "}
                <em>less-change</em> jobs that have seen the largest
                unemployment increase since 2024 Q1, not auto-risk jobs.
              </p>
              <div className="border border-strong rounded-md text-xs">
                <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.5fr] gap-3 px-3 py-2 font-bold uppercase tracking-widest text-2xs text-[var(--muted)] opacity-70 border-b border-strong">
                  <div>Archetype</div>
                  <div className="text-right">2024 Q1</div>
                  <div className="text-right">2026 Q1</div>
                  <div className="text-right">&Delta;</div>
                </div>
                <div className="divide-y divide-black/[0.04]">
                  <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.5fr] gap-3 px-3 py-1.5">
                    <div>Auto-risk</div>
                    <div className="text-right font-mono">3.1%</div>
                    <div className="text-right font-mono">3.3%</div>
                    <div className="text-right font-mono">+0.2pp</div>
                  </div>
                  <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.5fr] gap-3 px-3 py-1.5">
                    <div>Reorganize</div>
                    <div className="text-right font-mono">2.9%</div>
                    <div className="text-right font-mono">3.2%</div>
                    <div className="text-right font-mono">+0.3pp</div>
                  </div>
                  <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.5fr] gap-3 px-3 py-1.5">
                    <div>Grow with AI</div>
                    <div className="text-right font-mono">2.9%</div>
                    <div className="text-right font-mono">3.4%</div>
                    <div className="text-right font-mono">+0.5pp</div>
                  </div>
                  <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.5fr] gap-3 px-3 py-1.5 bg-amber-50/40">
                    <div className="font-semibold">Less change</div>
                    <div className="text-right font-mono">4.8%</div>
                    <div className="text-right font-mono">5.4%</div>
                    <div className="text-right font-mono font-semibold">+0.6pp</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed mt-2 italic">
                Source: OpenAI Jobs Transition Framework Table 1 (CPS Basic
                Monthly, occupation bridged to SOC/O*NET). The paper&rsquo;s
                own conclusion: &ldquo;it remains difficult to clearly link
                AI and the aggregate labor market.&rdquo;
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">
                Capability overhang (Fig. 5)
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Even where the framework flags an occupation as high-automation-risk,
                actual ChatGPT usage in those jobs runs ~23% of theoretical
                capability. Realized exposure: 24.6% (grow), 22.8% (auto-risk),
                18.4% (reorganize), 3.6% (less-change). The gap between
                theoretical and realized is what the paper calls the
                &ldquo;capability overhang&rdquo; — AI&rsquo;s reach is
                technically possible everywhere but operationally lagging.
              </p>
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

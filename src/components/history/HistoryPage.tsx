"use client";

import GPTTimeline from "./GPTTimeline";
import RevolutionCards from "./RevolutionCards";
import ComparisonMatrix from "./ComparisonMatrix";
import ForecastColumns from "./ForecastColumns";
import VulnerabilityTable from "./VulnerabilityTable";

export default function HistoryPage() {
  return (
    <article className="max-w-[740px] mx-auto">
      {/* ───── Section 1: Hero / Thesis Statement ───── */}
      <header className="mb-16">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          Historical Context
        </p>
        <h1
          className="text-[36px] sm:text-[44px] font-extrabold text-[var(--foreground)] leading-[1.1] tracking-tight mb-4"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          On Tap Intelligence
        </h1>
        <p
          className="text-[18px] sm:text-[20px] text-[var(--muted)] leading-relaxed mb-8"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          Every great technology has transformed work. Here&rsquo;s what
          history tells us about what comes next.
        </p>

        {/* Thesis card */}
        <div className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg px-5 py-4">
          <p
            className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-relaxed font-medium"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            AI is doing for cognitive capabilities what electricity did for
            physical power &mdash; turning a scarce, expensive resource
            into an on-demand utility available to anyone.
          </p>
        </div>

        {/* Read time */}
        <div className="mt-4 flex items-center gap-2">
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            8 min read
          </span>
        </div>
      </header>

      {/* ───── Section 2: The Pattern ───── */}
      <section className="mb-16">
        <div className="border-t border-black/[0.06] pt-10">
          <SectionLabel number="01" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Every GPT Follows the Same Arc
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-8">
            Every major general-purpose technology follows a predictable
            five-phase arc. The names change, but the shape is the same.
            Steam, electricity, computers &mdash; each transformed the
            labor market through the same sequence of emergence, diffusion,
            displacement, reorganization, and new equilibrium.
          </p>
          <GPTTimeline />

          {/* 10x Acceleration callout */}
          <div className="mt-8 border border-[var(--accent)]/20 bg-[var(--accent-light)] rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[var(--accent)] px-2.5 py-1 rounded-full shrink-0">
                10x faster
              </span>
              <div>
                <p className="text-[13px] text-[var(--foreground)] leading-relaxed font-semibold mb-2">
                  AI is diffusing at roughly 10x the speed of prior
                  general-purpose technologies.
                </p>
                <p className="text-[12px] text-[var(--muted)] leading-relaxed mb-3">
                  ChatGPT reached 100 million users in 2 months &mdash; the
                  internet took 7 years, the PC took over a decade. By 2025,
                  54.6% of US working-age adults had used generative AI (St.
                  Louis Fed), a penetration the internet didn&rsquo;t reach
                  for 5+ years and the PC didn&rsquo;t reach for 15. Enterprise
                  adoption surged from 33% to 88% of organizations in roughly
                  two years (McKinsey, 2023&ndash;2025). Microsoft&rsquo;s AI
                  Diffusion Report calls it{" "}
                  <strong>&ldquo;twice the pace of smartphones, five times
                  faster than the internet&rdquo;</strong> &mdash; and those
                  technologies were themselves orders of magnitude faster than
                  steam or electricity.{" "}
                  <a
                    href="/predictions/genai-work-adoption"
                    className="text-[var(--accent)] underline underline-offset-2 font-medium"
                  >
                    See live adoption data &rarr;
                  </a>
                </p>
                <p className="text-[12px] text-[var(--muted)] leading-relaxed mb-3">
                  The compounding is staggering: electricity took{" "}
                  <strong>40 years</strong> from dynamo to productivity gains.
                  The PC took <strong>30+ years</strong> from mainframe to the
                  Solow Paradox resolving. AI went from GPT-3 to 88%
                  enterprise adoption in <strong>5 years</strong>. This is not
                  incremental acceleration &mdash; it is an order-of-magnitude
                  compression of the diffusion phase. One reason: AI is built
                  on top of two prior GPTs (computers and the internet) that
                  already saturated the economy. Every smartphone is already an
                  AI terminal.{" "}
                  <a
                    href="/predictions/ai-adoption-rate"
                    className="text-[var(--accent)] underline underline-offset-2 font-medium"
                  >
                    See enterprise adoption data &rarr;
                  </a>
                </p>
                <p className="text-[12px] text-[var(--foreground)]/70 leading-relaxed italic">
                  The forecasts on this page extrapolate from this 10x
                  adoption speed. If the diffusion phase that historically
                  took 10&ndash;25 years is happening in 1&ndash;3, the
                  displacement and reorganization phases will compress
                  proportionally. The constraint: organizational
                  restructuring, education systems, and policy still operate
                  at human speed &mdash; but even these are being accelerated
                  by AI itself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Section 3: The Four Revolutions ───── */}
      <section className="mb-16">
        <div className="border-t border-black/[0.06] pt-10">
          <SectionLabel number="02" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            The Four Revolutions
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-8">
            Four technologies. Four massive disruptions. All eventually
            created more jobs than they destroyed &mdash; but the path was
            never smooth or quick.
          </p>
          <RevolutionCards />
        </div>
      </section>

      {/* ───── Section 4: The Central Insight ───── */}
      <section className="mb-16">
        <div className="border-t border-black/[0.06] pt-10">
          <SectionLabel number="03" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            The On-Tap Intelligence Shift
          </h2>

          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.8] mb-10">
            <p>
              Prior automation technologies had a consistent structure: they
              automated <em>physical</em> capabilities (steam, combustion,
              electricity) or <em>rule-based cognitive</em> tasks
              (computers). Each wave created a new protected domain &mdash;
              work the technology structurally couldn&rsquo;t do &mdash;
              that workers could move toward. The task model of labor
              (Autor, Levy &amp; Murnane, 2003) categorized this as the
              difference between <em>routine</em> tasks (codifiable,
              automatable) and <em>non-routine</em> tasks (requiring
              judgment, context, creativity).
            </p>
            <p>
              AI breaks this pattern. Large language models and multimodal
              AI systems perform tasks that are simultaneously cognitive and
              ostensibly non-routine: legal analysis, medical reasoning,
              strategic synthesis, creative writing, code generation. This
              doesn&rsquo;t mean AI equals human intelligence &mdash; it
              doesn&rsquo;t &mdash; but it means the protected domain of
              prior automation waves is now being encroached on.
            </p>
            <p>
              The most useful analogy is electrification. Before
              electricity, accessing significant mechanical power required
              physical proximity to a power source &mdash; a river, a steam
              boiler. Power was scarce, locationally fixed, and expensive.
              Electrification transformed power into a{" "}
              <strong>utility</strong>: standardized, reliable, available on
              demand anywhere on the grid, priced per unit of use.{" "}
              <em>On-tap power.</em>
            </p>
            <p>
              AI performs this same transformation for cognitive
              capabilities. Legal analysis was previously accessible only to
              those who could pay $400/hour for a lawyer in a major city.
              Medical reasoning lived in academic medical centers. Strategic
              insight required expensive consulting firms. AI threatens to
              make these capabilities available to anyone with internet
              access, at marginal cost approaching zero.{" "}
              <strong>On-tap intelligence.</strong>
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="mb-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[var(--muted)] mb-4">
              From Scarce to On-Tap
            </p>
            <ComparisonMatrix />
          </div>
        </div>
      </section>

      {/* ───── Section 5: The Honest Forecast ───── */}
      <section className="mb-16">
        <div className="border-t border-black/[0.06] pt-10">
          <SectionLabel number="04" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            What the Pattern Predicts
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-8">
            History doesn&rsquo;t tell us the outcome &mdash; it tells us
            the shape. Here is what the pattern predicts, offered not as
            certainties but as the most historically-grounded expectations.
          </p>
          <ForecastColumns />
        </div>
      </section>

      {/* ───── Section 6: Vulnerability Snapshot ───── */}
      <section className="mb-16">
        <div className="border-t border-black/[0.06] pt-10">
          <SectionLabel number="05" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Occupational Vulnerability Snapshot
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-8">
            Five vulnerability categories, grounded in the historical
            pattern of how general-purpose technologies reshape
            occupational structures.
          </p>
          <VulnerabilityTable />
        </div>
      </section>

      {/* ───── Section 7: The Policy Question ───── */}
      <section className="mb-8">
        <div className="border-t border-black/[0.06] pt-10">
          <SectionLabel number="06" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-6">
            What History Actually Proves
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-8 italic">
            The technology doesn&rsquo;t decide. We do.
          </p>

          {/* Lesson 1 */}
          <div className="mb-8">
            <h3 className="text-[16px] font-bold text-[var(--foreground)] mb-2">
              Lesson 1: Invest in Complements, Not Preservation
            </h3>
            <p className="text-[14px] text-[var(--muted)] leading-[1.8]">
              Every successful institutional response to a GPT transition
              invested in workers&rsquo; capacity to participate in the new
              economy, not in protecting the old one. The Morrill Acts
              (public universities, 1862) equipped workers for the
              industrial era. The GI Bill (1944) prepared workers for the
              postwar economy. The community college system extended
              computing-era skills broadly. The equivalent for AI: radical
              investment in AI literacy, domain-expert + AI collaboration
              skills, and accessible retraining pathways.
            </p>
          </div>

          {/* Lesson 2 */}
          <div className="mb-8">
            <h3 className="text-[16px] font-bold text-[var(--foreground)] mb-2">
              Lesson 2: The Distribution Problem is Institutional, Not
              Technological
            </h3>
            <p className="text-[14px] text-[var(--muted)] leading-[1.8]">
              The computer era&rsquo;s inequality &mdash; 40 years of wage
              stagnation for workers without degrees &mdash; was not
              technologically inevitable. It reflected specific choices:
              declining union density, wage policy, trade liberalization,
              corporate governance norms. The AI era&rsquo;s distributional
              outcome will similarly reflect choices. Ford&rsquo;s Five
              Dollar Day (1914) is the counterexample: he doubled wages
              deliberately because mass production requires mass consumers.
              If AI dramatically increases productivity, the economic
              stability of the outcome depends on how those gains are
              distributed.
            </p>
          </div>

          {/* Lesson 3 */}
          <div className="mb-10">
            <h3 className="text-[16px] font-bold text-[var(--foreground)] mb-2">
              Lesson 3: The Gains Are Real. The Timeline is Not What You
              Think.
            </h3>
            <p className="text-[14px] text-[var(--muted)] leading-[1.8]">
              Every GPT ultimately created more jobs than it destroyed and
              raised average wages. This is true and important. It is also
              true that the prior pattern&rsquo;s timeline &mdash; 40 to 70
              years &mdash; is politically and humanly unacceptable as a
              response to workers experiencing disruption today.
              &ldquo;Eventually&rdquo; is not a policy.
            </p>
          </div>

          {/* Closing pull-quote */}
          <blockquote className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg px-5 py-5">
            <p
              className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-[1.75] font-medium"
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
              }}
            >
              If on-tap intelligence enables the democratization of
              expertise &mdash; putting the equivalent of world-class
              legal, medical, educational, and financial guidance within
              reach of everyone rather than only the affluent &mdash; it
              could be among the most equalizing forces in human history.
              If it primarily displaces workers while concentrating gains
              among capital owners and a small elite of knowledge workers,
              it could be among the most destabilizing. The technology
              does not decide. We do.
            </p>
          </blockquote>
        </div>
      </section>
    </article>
  );
}

function SectionLabel({ number }: { number: string }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-3 block">
      {number}
    </span>
  );
}

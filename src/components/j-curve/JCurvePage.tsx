"use client";

import JCurveChart from "./JCurveChart";
import HistoricalExamples from "./HistoricalExamples";
import IntangibleDiagram from "./IntangibleDiagram";

export default function JCurvePage() {
  return (
    <article className="max-w-[740px] mx-auto">
      {/* ───── Header ───── */}
      <header className="mb-10">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          Explainer
        </p>
        <h1
          className="text-[36px] sm:text-[44px] font-extrabold text-[var(--foreground)] leading-[1.1] tracking-tight mb-4"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          The Productivity J-Curve
        </h1>
        <p
          className="text-[18px] sm:text-[20px] text-[var(--muted)] leading-relaxed mb-5"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          Why transformative technologies make productivity look{" "}
          <em>worse</em> before making it better &mdash; and what this
          means for AI.
        </p>

        {/* Thesis card */}
        <div className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg px-5 py-4">
          <p
            className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-relaxed font-medium"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            When a major new technology arrives, measured productivity often
            stagnates or declines for years &mdash; not because the
            technology doesn&rsquo;t work, but because the massive
            complementary investments it requires are invisible to official
            statistics.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            8 min read
          </span>
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            Brynjolfsson, Rock &amp; Syverson (2021)
          </span>
        </div>
      </header>

      {/* ───── Section 1: The Paradox ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="01" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            The Productivity Paradox
          </h2>
          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              In 1987, economist Robert Solow made a famous observation about
              computers: you could see them everywhere except in the
              productivity statistics. Billions were being spent on IT, yet
              measured productivity growth remained stubbornly flat.
            </p>
            <p>
              This wasn&rsquo;t a new pattern. When electric motors first
              appeared in factories in the 1880s, it took roughly 40 years
              before electricity showed up in manufacturing productivity
              data. The same phenomenon is now playing out with artificial
              intelligence: massive investment, widespread adoption, but
              little apparent impact on aggregate productivity.
            </p>
            <p>
              Erik Brynjolfsson, Daniel Rock, and Chad Syverson argue this
              isn&rsquo;t a mystery. It&rsquo;s the predictable result of
              how we measure productivity &mdash; and how general-purpose
              technologies actually transform economies.
            </p>
          </div>

          {/* Stat callout */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard
              value="~40 yrs"
              label="Electricity"
              sublabel="Introduction to productivity surge"
              color="#f59e0b"
            />
            <StatCard
              value="~25 yrs"
              label="Computers"
              sublabel="Adoption to productivity boom"
              color="#5C61F6"
            />
            <StatCard
              value="?"
              label="AI's lag"
              sublabel="2020s to ???"
              color="#ef4444"
              emphasis
            />
          </div>
        </div>
      </section>

      {/* ───── Section 2: The J-Curve ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="02" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            The J-Curve Explained
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            The J-Curve describes the systematic error in how we measure
            productivity when a{" "}
            <Tooltip
              label="general-purpose technology"
              tip="A transformative technology that reshapes entire economies — steam, electricity, computers, AI. Economists abbreviate this &quot;GPT&quot; (not to be confused with the AI model &quot;Generative Pre-trained Transformer&quot;)."
            />{" "}
            is adopted. Measured productivity initially
            drops below true productivity &mdash; then later overshoots it. The
            result is a J-shaped curve in the measurement error over time.
          </p>

          <JCurveChart />
        </div>
      </section>

      {/* ───── Section 3: Why It Happens ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="03" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Why It Happens: The Intangible Investment Gap
          </h2>
          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              General-purpose technologies don&rsquo;t just plug in and
              produce value. They require enormous{" "}
              <strong>complementary intangible investments</strong>:
              reorganized workflows, retrained workers, redesigned processes,
              new management practices, and co-invented business models.
            </p>
            <p>
              Here&rsquo;s the accounting problem: national statistics treat
              these intangible investments as{" "}
              <strong>current expenses</strong> rather than{" "}
              <strong>capital investments</strong>. When a firm spends
              $10 million redesigning its operations around AI, that
              spending <em>reduces</em> measured GDP instead of being counted
              as an addition to the capital stock.
            </p>
            <p>
              The result is a two-sided measurement error that creates the
              J-curve shape:
            </p>
          </div>

          <IntangibleDiagram />

          {/* Pull-quote */}
          <blockquote className="my-8 border-l-3 border-[var(--accent)] pl-5 py-1">
            <p
              className="text-[16px] text-[var(--foreground)] leading-[1.7] font-medium"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              The economy looks like it&rsquo;s stagnating when it&rsquo;s
              actually building up an enormous stock of unmeasured intangible
              capital.
            </p>
          </blockquote>

          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.75]">
            <p>
              <strong className="text-[var(--foreground)]">Early on</strong>,
              measured productivity is <em>understated</em> because firms
              are diverting resources from producing measurable output to
              building unmeasured intangible capital. The economy is
              building future capacity, but the statistics say it&rsquo;s
              stagnating.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Later</strong>,
              measured productivity is <em>overstated</em> because the
              accumulated intangible capital stock is producing measurable
              output, but isn&rsquo;t counted as an input. The gains appear
              to come from nowhere.
            </p>
          </div>
        </div>
      </section>

      {/* ───── Aside: The Math (Simplified) ───── */}
      <aside className="mb-12 rounded-lg border border-black/[0.08] bg-[var(--accent-light)] px-5 py-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)]">
            The accounting identity
          </span>
          <span className="text-[10px] text-[var(--muted)] opacity-60">
            &mdash; optional detail
          </span>
        </div>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-4">
          Standard productivity measurement uses only measured inputs.
          When firms adopt a general-purpose technology, they also build
          unmeasured intangible capital &mdash; creating a systematic gap:
        </p>

        {/* Equation cards */}
        <div className="space-y-2.5 mb-4">
          <EquationCard
            label="True output"
            equation="Y* = GDP + Investment in intangibles"
            note="What the economy actually produces"
            color="#22c55e"
          />
          <EquationCard
            label="Measured output"
            equation="Y = GDP"
            note="Intangible investment is subtracted as expense"
            color="#ef4444"
          />
          <EquationCard
            label="The gap"
            equation="Y* - Y = Unmeasured intangible investment"
            note="This gap follows the J-curve shape over time"
            color="#f59e0b"
          />
        </div>

        <p className="text-[13px] text-[var(--muted)] leading-[1.75]">
          Three factors deepen the J-curve: large adjustment costs
          (reorganization is expensive), correlated investments (many
          types happen at once), and high investment shares during
          adoption.
        </p>
      </aside>

      {/* ───── Section 5: Historical Evidence ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="04" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Three Waves, One Pattern
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            The J-curve has played out at least twice before. Each time,
            observers declared the technology overhyped during the
            investment phase &mdash; only to see a productivity surge once
            complementary investments matured.
          </p>

          <HistoricalExamples />
        </div>
      </section>

      {/* ───── Section 6: What This Means for AI ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="05" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            What This Means for AI Today
          </h2>
          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              If the J-curve framework is correct, the current period of
              apparently disappointing AI productivity gains is not evidence
              that AI doesn&rsquo;t work. It&rsquo;s evidence that we are
              in the investment phase of a new general-purpose technology
              cycle &mdash; and the complementary intangible investments
              haven&rsquo;t yet matured.
            </p>
            <p>
              There are reasons to think AI&rsquo;s J-curve may be{" "}
              <strong>compressed</strong> compared to prior GPTs.
              Software-based reorganization can propagate faster than
              physical factory redesign. AI models improve continuously
              (unlike static machines), and digital workflows can be
              replicated at near-zero marginal cost.
            </p>
            <p>
              But there are also reasons it could be{" "}
              <strong>extended</strong>. AI touches more job categories
              simultaneously than any prior GPT, requiring more widespread
              organizational change. Trust and regulatory frameworks are
              still forming. And the intangible investments required &mdash;
              in data quality, workflow redesign, and human-AI collaboration
              skills &mdash; may be deeper than anticipated.
            </p>
          </div>

          {/* Implications grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ImplicationCard
              icon="&#x2191;"
              title="For patience"
              body="Apparent lack of productivity impact is predicted by the model, not evidence against it. The investment phase is necessary groundwork."
              color="#22c55e"
            />
            <ImplicationCard
              icon="&#x26A0;"
              title="For caution"
              body="The J-curve doesn't guarantee a happy ending. The electricity analogy took 40 years. Workers displaced during the trough can't wait decades."
              color="#f59e0b"
            />
            <ImplicationCard
              icon="&#x1F4CA;"
              title="For measurement"
              body="Current productivity statistics may systematically understate AI's actual contribution. The authors' IT calibration estimated a gap of 11-16%."
              color="#5C61F6"
            />
            <ImplicationCard
              icon="&#x1F3ED;"
              title="For firms"
              body="The factory-level lesson is clear: superficial adoption (swapping tools without redesigning workflows) captures almost none of the value."
              color="#ef4444"
            />
          </div>
        </div>
      </section>

      {/* ───── Closing ───── */}
      <section className="mb-8">
        <div className="border-t border-black/[0.06] pt-8">
          <blockquote className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg px-5 py-5 mb-6">
            <p
              className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-[1.75] font-medium"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              The productivity J-curve resolves an apparent paradox: how can
              a technology be transformative yet invisible in the data? The
              answer is that transformation requires investment, and our
              statistics are blind to the most important kind.
            </p>
          </blockquote>

          {/* Source citation */}
          <div className="border border-black/[0.06] rounded-lg px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
              Source
            </p>
            <p className="text-[13px] text-[var(--foreground)] leading-relaxed mb-1">
              <strong>Brynjolfsson, E., Rock, D., &amp; Syverson, C.</strong>{" "}
              (2021). The Productivity J-Curve: How Intangibles Complement
              General Purpose Technologies.{" "}
              <em>American Economic Journal: Macroeconomics</em>, 13(1),
              333&ndash;372.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <a
                href="https://www.nber.org/papers/w25148"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[var(--accent)] hover:underline"
              >
                NBER Working Paper w25148 &rarr;
              </a>
              <a
                href="https://www.aeaweb.org/articles?id=10.1257/mac.20180386"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[var(--accent)] hover:underline"
              >
                Published Version (AEJ:Macro) &rarr;
              </a>
              <a
                href="https://ide.mit.edu/sites/default/files/publications/2019-04JCurvebrief.final2_.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[var(--accent)] hover:underline"
              >
                MIT IDE Policy Brief &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

/* ── Utility components ── */

function Tooltip({ label, tip }: { label: string; tip: string }) {
  return (
    <span className="relative inline-block group">
      <span className="underline decoration-dotted decoration-[var(--accent)]/50 underline-offset-2 cursor-help">
        {label}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[320px] rounded-lg bg-[var(--foreground)] text-white text-[11px] leading-[1.6] px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg">
        {tip}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--foreground)]" />
      </span>
    </span>
  );
}

function SectionLabel({ number }: { number: string }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] mb-3 block">
      {number}
    </span>
  );
}

function StatCard({
  value,
  label,
  sublabel,
  color,
  emphasis,
}: {
  value: string;
  label: string;
  sublabel: string;
  color: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`text-center rounded-lg px-3 border${emphasis ? " py-4 relative" : " py-3"}`}
      style={{
        borderColor: emphasis ? color + "50" : color + "30",
        backgroundColor: emphasis ? color + "12" : color + "08",
        ...(emphasis ? { boxShadow: `0 0 16px ${color}15` } : {}),
      }}
    >
      {emphasis && (
        <span
          className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: color + "20", color }}
        >
          Now
        </span>
      )}
      <p
        className={emphasis ? "text-[30px] font-black" : "text-[24px] font-black"}
        style={{ color }}
      >
        {value}
      </p>
      <p className="text-[11px] font-bold text-[var(--foreground)] mt-0.5">
        {label}
      </p>
      <p className="text-[10px] text-[var(--muted)]">{sublabel}</p>
    </div>
  );
}

function EquationCard({
  label,
  equation,
  note,
  color,
}: {
  label: string;
  equation: string;
  note: string;
  color: string;
}) {
  return (
    <div
      className="rounded-md px-4 py-3 border-l-3"
      style={{
        borderLeftColor: color,
        borderLeftWidth: 3,
        backgroundColor: color + "08",
      }}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color }}>
        {label}
      </p>
      <p
        className="text-[14px] font-mono font-bold text-[var(--foreground)]"
      >
        {equation}
      </p>
      <p className="text-[11px] text-[var(--muted)] mt-0.5">{note}</p>
    </div>
  );
}

function ImplicationCard({
  icon,
  title,
  body,
  color,
}: {
  icon: string;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg px-4 py-3 border"
      style={{ borderColor: color + "25" }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[16px]" style={{ color }}>
          {icon}
        </span>
        <h4 className="text-[13px] font-bold text-[var(--foreground)]">
          {title}
        </h4>
      </div>
      <p className="text-[12px] text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

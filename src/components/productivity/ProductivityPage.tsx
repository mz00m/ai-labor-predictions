"use client";

import Link from "next/link";
import ResearchEvidence from "@/components/ResearchEvidence";
import ProductivityPredictions from "@/components/ProductivityPredictions";
import ProductivityPaths from "@/components/signals/ProductivityPaths";

export default function ProductivityPage() {
  return (
    <div className="space-y-0">
      {/* ───── Header ───── */}
      <header className="relative overflow-hidden -mx-6 sm:-mx-10 px-6 sm:px-10 pt-1 pb-8 sm:pt-2 sm:pb-10">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#5C61F6]/[0.04] blur-3xl" />
          <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full bg-[#22c55e]/[0.03] blur-3xl" />
        </div>

        <div className="relative max-w-3xl">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
            Explainer
          </p>
          <h1 className="text-[36px] sm:text-[50px] font-black tracking-tight text-[var(--foreground)] leading-[1.08] mb-5">
            The Productivity Question
          </h1>
          <p className="text-[17px] sm:text-[19px] text-[var(--muted)] leading-relaxed mb-6">
            AI tools are making individual workers dramatically more productive.
            But that productivity isn&rsquo;t showing up in the macro data yet, and
            it hasn&rsquo;t translated into job losses. Understanding this gap is
            central to every prediction on this site.
          </p>

          {/* Thesis card */}
          <div className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg px-5 py-4">
            <p
              className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-relaxed font-medium"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              The story so far: 14&ndash;56% individual productivity gains in
              controlled studies, early signs of macro impact in BLS data,
              near-zero measured job loss, and economists split on what comes next.
              This page connects the dots.
            </p>
          </div>
        </div>
      </header>

      {/* ───── The Core Tension ───── */}
      <section className="mt-12">
        <div className="max-w-3xl">
          <SectionLabel number="01" title="The core tension" />
          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.75]">
            <p>
              Three facts coexist uncomfortably. First: at the task level, AI
              tools are producing some of the largest productivity gains ever
              measured in economics experiments. Second: at the economy level,
              aggregate productivity is only slightly above trend. Third: despite
              widespread predictions of AI-driven job loss, macro employment
              data shows essentially none.
            </p>
            <p>
              These three facts aren&rsquo;t contradictory. They&rsquo;re
              the predictable signature of a technology still in its adoption
              phase. The research below helps explain why.
            </p>
          </div>
        </div>

        {/* Stat triad */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatHighlight
            value="~21%"
            label="Median task-level gain"
            detail="Median of 18 micro studies"
            color="#22c55e"
          />
          <StatHighlight
            value="+2.2%"
            label="Macro productivity vs. trend"
            detail="BLS data, Q4 2025 vs. CBO forecast"
            color="#5C61F6"
          />
          <StatHighlight
            value="~0%"
            label="Measured job loss"
            detail="Yale, Goldman, Dallas Fed"
            color="#f59e0b"
          />
        </div>
      </section>

      {/* ───── Section 2: Research Evidence ───── */}
      <section className="mt-20">
        <div className="max-w-3xl mb-2">
          <SectionLabel number="02" title="What the research shows" />
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-4">
            The gap between micro and macro is the central puzzle. Individual
            workers are clearly more productive with AI, but the economy-wide
            numbers are just starting to move. Here are the studies, sorted by
            effect size.
          </p>
        </div>
        <ResearchEvidence />
      </section>

      {/* ───── Bridge: Micro vs Macro ───── */}
      <section className="mt-16">
        <div className="max-w-3xl">
          <div className="border border-black/[0.06] rounded-xl bg-white p-5 sm:p-6">
            <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
              Why the micro-macro gap?
            </h3>
            <div className="space-y-3 text-[13px] text-[var(--muted)] leading-relaxed">
              <ReasonRow
                number="1"
                title="Adoption is still early"
                text="Census BTOS data shows only ~7% of US firms actively use AI in production. Even if individual gains are large, the aggregate effect is diluted by the 93% not yet using it."
              />
              <ReasonRow
                number="2"
                title="Complementary investment takes time"
                text="Firms need to reorganize workflows, retrain workers, and redesign processes before AI tools deliver their full value. This is the J-Curve effect."
              />
              <ReasonRow
                number="3"
                title="Measurement lags reality"
                text="National statistics treat intangible investments (workflow redesign, training) as expenses, not capital. So measured productivity actually looks worse during the investment phase."
              />
              <ReasonRow
                number="4"
                title="Task gains don't sum linearly"
                text="A worker who is 50% faster at writing code may not be 50% more productive overall. Bottlenecks shift to meetings, reviews, and coordination."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Section 3: What Economists Expect ───── */}
      <section className="mt-20">
        <div className="max-w-3xl mb-2">
          <SectionLabel number="03" title="What economists expect" />
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-4">
            If the micro gains are real, how much will they eventually move the
            macro needle? This question determines everything downstream:
            displacement forecasts, wage projections, policy responses.
          </p>
        </div>
        <ProductivityPredictions />
      </section>

      {/* ───── Section 4: From Productivity to Jobs ───── */}
      <section className="mt-20">
        <div className="max-w-3xl mb-2">
          <SectionLabel number="04" title="From productivity to jobs" />
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-4">
            Higher productivity doesn&rsquo;t map one-to-one to job loss.
            History shows three distinct paths that firms take, often
            simultaneously. The ratio between them determines whether AI creates
            a net employment boom or a contraction.
          </p>
        </div>
        <ProductivityPaths />
      </section>

      {/* ───── Section 5: The Measurement Problem ───── */}
      <section className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel number="05" title="The measurement problem" />
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            There&rsquo;s a deeper issue: even when AI does boost productivity,
            our statistics may systematically undercount it. This isn&rsquo;t
            speculation &mdash; it&rsquo;s a pattern that has played out with
            every major technology adoption.
          </p>
        </div>

        {/* J-Curve teaser card */}
        <div className="border border-black/[0.06] rounded-xl bg-white overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              {/* Mini J-Curve visual */}
              <div className="shrink-0 mt-1">
                <svg
                  width="56"
                  height="40"
                  viewBox="0 0 56 40"
                  fill="none"
                  className="text-[var(--accent)]"
                >
                  {/* Dashed "true" line */}
                  <path
                    d="M4 12 C12 14, 20 16, 28 15 C36 14, 44 10, 52 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.4"
                  />
                  {/* Solid "measured" J-curve */}
                  <path
                    d="M4 12 C12 18, 20 28, 28 30 C36 32, 44 22, 52 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Zero line */}
                  <line
                    x1="2"
                    y1="20"
                    x2="54"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.15"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-2">
                  The Productivity J-Curve
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
                  When a major new technology arrives, measured productivity
                  often stagnates or declines for years &mdash; not because the
                  technology doesn&rsquo;t work, but because the massive
                  complementary investments it requires are invisible to official
                  statistics. Electricity took ~40 years. Computers took ~25.
                  AI&rsquo;s timeline is the open question.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/j-curve"
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--accent)] hover:underline"
                  >
                    Read the full J-Curve explainer
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 3L9.5 7L5 11" />
                    </svg>
                  </Link>
                  <span className="text-[11px] text-[var(--muted)]">
                    Brynjolfsson, Rock &amp; Syverson (2021)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline strip */}
          <div className="border-t border-black/[0.06] bg-[var(--accent-light)] px-5 sm:px-6 py-3">
            <div className="flex items-center gap-6 text-[11px]">
              <span className="font-bold text-[var(--accent)]">
                Historical pattern
              </span>
              <span className="flex items-center gap-1.5 text-[var(--muted)]">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#f59e0b" }}
                />
                Electricity: ~40 yrs
              </span>
              <span className="flex items-center gap-1.5 text-[var(--muted)]">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#5C61F6" }}
                />
                Computers: ~25 yrs
              </span>
              <span className="flex items-center gap-1.5 text-[var(--muted)]">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#ef4444" }}
                />
                AI: ???
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Section 6: So What? ───── */}
      <section className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel number="06" title="What this means" />
          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.75] mb-8">
            <p>
              The productivity story is the engine behind every other prediction
              on this site. If AI productivity gains stay confined to narrow
              tasks and early adopters, displacement will be modest and gradual.
              If they compound economy-wide &mdash; which is what most
              economists expect within the next decade &mdash; the effects on
              jobs, wages, and industry structure will be much larger.
            </p>
            <p>
              The current evidence suggests we are still in the early innings.
              Micro gains are real and large. Macro gains are just beginning to
              appear. Displacement is near zero. The question is not whether AI
              improves productivity, but how fast that improvement diffuses, and
              whether firms use it to reduce headcount, amplify output, or
              expand into new work.
            </p>
          </div>

          {/* Implication cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <ImplicationCard
              title="For workers"
              body="Task-level productivity gains are reshaping job descriptions faster than they're eliminating jobs. Adaptability matters more than any specific skill."
              color="#5C61F6"
            />
            <ImplicationCard
              title="For firms"
              body="Simply deploying AI tools without redesigning workflows captures almost none of the value. The complementary investment is where the real returns come from."
              color="#22c55e"
            />
            <ImplicationCard
              title="For policymakers"
              body="The J-Curve means the window for proactive policy is now, during the investment phase, before the productivity surge makes labor market transitions sudden."
              color="#f59e0b"
            />
            <ImplicationCard
              title="For forecasters"
              body="Anyone predicting mass displacement from current productivity data is premature. Anyone dismissing AI's labor impact because displacement hasn't happened yet is equally wrong."
              color="#ef4444"
            />
          </div>

          {/* Closing quote */}
          <blockquote className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg px-5 py-5">
            <p
              className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-[1.75] font-medium"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Productivity is the bridge between AI capabilities and labor
              market outcomes. Until we understand how that bridge works &mdash;
              how gains diffuse, how firms respond, how measurement catches up
              &mdash; every displacement forecast is incomplete.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ───── Footer nav ───── */}
      <section className="mt-16 mb-8">
        <div className="border-t border-black/[0.06] pt-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
            Continue exploring
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <NavCard
              href="/"
              label="Dashboard"
              description="All 16 predictions with evidence tiers"
            />
            <NavCard
              href="/j-curve"
              label="The J-Curve"
              description="Why measured productivity lags real impact"
            />
            <NavCard
              href="/signals"
              label="Signals"
              description="Leading indicators and firm responses"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Utility Components ── */

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4">
      <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] block mb-1">
        {number}
      </span>
      <h2 className="text-[24px] sm:text-[30px] font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
        {title}
      </h2>
    </div>
  );
}

function StatHighlight({
  value,
  label,
  detail,
  color,
}: {
  value: string;
  label: string;
  detail: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border px-5 py-5 text-center"
      style={{
        borderColor: `${color}30`,
        backgroundColor: `${color}08`,
      }}
    >
      <p className="text-[32px] sm:text-[38px] font-black" style={{ color }}>
        {value}
      </p>
      <p className="text-[13px] font-bold text-[var(--foreground)] mt-1">
        {label}
      </p>
      <p className="text-[11px] text-[var(--muted)] mt-0.5">{detail}</p>
    </div>
  );
}

function ReasonRow({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-[12px] font-bold text-[var(--accent)] mt-0.5 shrink-0 w-4 text-right">
        {number}
      </span>
      <div>
        <span className="text-[13px] font-bold text-[var(--foreground)]">
          {title}
        </span>
        <span className="text-[13px] text-[var(--muted)]"> &mdash; {text}</span>
      </div>
    </div>
  );
}

function ImplicationCard({
  title,
  body,
  color,
}: {
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg px-4 py-3 border"
      style={{ borderColor: `${color}25` }}
    >
      <h4
        className="text-[13px] font-bold mb-1"
        style={{ color }}
      >
        {title}
      </h4>
      <p className="text-[12px] text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function NavCard({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-black/[0.06] bg-white px-4 py-3 hover:border-black/[0.12] hover:shadow-sm transition-all no-underline"
    >
      <p className="text-[13px] font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
        {label}
      </p>
      <p className="text-[11px] text-[var(--muted)] mt-0.5">{description}</p>
    </Link>
  );
}

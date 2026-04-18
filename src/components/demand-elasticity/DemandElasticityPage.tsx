"use client";

import Link from "next/link";
import ElasticityMatrix from "./ElasticityMatrix";
import DemandSliderViz from "./DemandSliderViz";
import ElasticityToggleViz from "./ElasticityToggleViz";
import ShareSectionBar from "@/components/ShareSectionBar";

export default function DemandElasticityPage() {
  return (
    <article className="max-w-[740px] mx-auto">
      {/* ───── Header ───── */}
      <header className="mt-10">
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          Explainer
        </p>
        <h1
          className="text-5xl sm:text-6xl font-extrabold text-[var(--foreground)] leading-[1.1] tracking-tight mb-4 font-serif"
        >
          The Demand Elasticity Effect
        </h1>
        <p
          className="text-2xl sm:text-heading-sm text-[var(--muted)] leading-relaxed mb-5 font-serif"
        >
          Why making work cheaper can create more jobs, not fewer &mdash;
          and where this does and doesn&rsquo;t apply.
        </p>

        {/* Thesis card */}
        <div className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg p-4 sm:p-5">
          <p
            className="text-lg sm:text-xl text-[var(--foreground)] leading-relaxed font-medium font-serif"
          >
            When AI makes work cheaper, the question isn&rsquo;t just how many
            jobs disappear &mdash; it&rsquo;s how many new ones become worth
            doing. The answer depends on two things: how much demand grows when
            costs fall, and how many tasks in a job AI can actually improve.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            7 min read
          </span>
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            Jevons Paradox &middot; Labor Economics
          </span>
        </div>
      </header>

      {/* ───── Section 1: Jevons Paradox ───── */}
      <section className="mt-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="01" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            Jevons Paradox, Applied to Labor
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              In 1865, economist William Stanley Jevons observed something
              counterintuitive: as steam engines became more fuel-efficient,
              total coal consumption <em>increased</em> rather than decreased.
              More efficient engines made steam power economical for uses that
              were previously too expensive, and the resulting explosion in
              demand for steam-powered machinery more than offset the
              per-engine fuel savings.
            </p>
            <p>
              The same dynamic applies to labor markets. When AI dramatically
              reduces the cost of producing something, two things happen
              simultaneously: each worker produces more output (fewer workers
              needed per unit), <em>and</em> the total market for that output
              may grow (more units demanded at lower prices). The net effect on
              employment depends on which force is larger.
            </p>
            <p>
              This is not a theoretical curiosity. It has played out repeatedly
              across technologies. And early evidence suggests it is already
              playing out with AI in sectors where demand is elastic.
            </p>
          </div>

          {/* Historical stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              value="Coal"
              label="1865"
              sublabel="Efficient engines = more total coal consumed"
              color="#f59e0b"
            />
            <StatCard
              value="ATMs"
              label="1970s"
              sublabel="Cheaper branches = more tellers employed"
              color="#5C61F6"
            />
            <StatCard
              value="Excel"
              label="1980s"
              sublabel="Automated calculation = more accountants hired"
              color="#22c55e"
            />
            <StatCard
              value="Desktop Publishing"
              label="1990s"
              sublabel="Cheaper publishing = more designers needed"
              color="#ef4444"
            />
          </div>
        </div>
      </section>

      {/* ───── Section 2: Interactive Toggle ───── */}
      <section className="mt-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="02" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            See the Effect Across Industries
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Most displacement projections assume a fixed demand for output:
              AI automates tasks, fewer workers are needed, end of story. But
              that ignores the demand side. In some industries, lower costs
              unlock entirely new markets. In others, they don&rsquo;t.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Why does low
              elasticity mean more displacement?</strong> When demand is
              inelastic, the total amount of work people want done barely
              changes even when it gets cheaper. Nobody needs <em>more</em>{" "}
              payroll processing, toll collection, or compliance paperwork
              just because AI can do it for less. So when AI makes each
              worker 3x more productive, you simply need a third of the
              workers. The efficiency gain translates almost entirely into
              job cuts, not growth.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Why does high
              elasticity mean expansion?</strong> When demand is elastic,
              cheaper output creates proportionally more buyers. Custom
              software at $500K serves Fortune 500 companies. At $50K, it
              serves every mid-sized business. The total market grows faster
              than per-worker productivity, so <em>more</em> workers are
              needed, not fewer. Toggle below to see the difference.
            </p>
          </div>

          <ElasticityToggleViz />
        </div>
      </section>

      {/* ───── Section 3: The Two Conditions ───── */}
      <section className="mt-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="03" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            The Two Conditions
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Not every job that AI touches will see demand expansion. It
              requires two conditions to hold simultaneously:
            </p>
          </div>

          {/* Condition cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              className="rounded-xl border p-4 sm:p-5"
              style={{ borderColor: "color-mix(in srgb, #5C61F6 15%, transparent)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-black text-white"
                  style={{ backgroundColor: "#5C61F6" }}
                >
                  A
                </span>
                <h3 className="text-md font-bold text-[var(--foreground)]">
                  Demand elasticity
                </h3>
              </div>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Does cheaper output create proportionally more demand? When
                custom software drops from $500K to $100K, many more companies
                will build it. When toll processing drops in cost, nobody drives
                more to generate extra tolls.
              </p>
            </div>
            <div
              className="rounded-xl border p-4 sm:p-5"
              style={{ borderColor: "color-mix(in srgb, #22c55e 15%, transparent)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-black text-white"
                  style={{ backgroundColor: "#22c55e" }}
                >
                  B
                </span>
                <h3 className="text-md font-bold text-[var(--foreground)]">
                  High task exposure
                </h3>
              </div>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                Are enough tasks in the job AI-augmentable to meaningfully
                change the cost equation? A 5% efficiency gain won&rsquo;t move
                the needle. A 5x productivity multiplier changes which projects
                are viable.
              </p>
            </div>
          </div>

          <p className="text-md text-[var(--muted)] leading-[1.75] mb-6">
            When both conditions hold, the Jevons effect dominates: AI exposure
            leads to <em>more</em> hiring, not less. The matrix below maps
            this framework across job categories:
          </p>

          <ElasticityMatrix />
        </div>
      </section>

      {/* ───── Section 4: The Agentic Coding Example ───── */}
      <section className="mt-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="04" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            The Agentic Coding Example
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Take a simplistic but instructive example. A mid-sized company has
              a project they want to build software for. Before AI, it takes 50
              engineers to fully resource the effort, but the project
              doesn&rsquo;t provide the ROI to justify 50 engineers compared to
              other initiatives. Or the company knows its expertise
              isn&rsquo;t in building software, so it&rsquo;s not even worth
              starting. The company hires 0 engineers and doesn&rsquo;t start
              the project.
            </p>
            <p>
              Now, AI agents make it possible for this to be a 10-engineer
              problem. The ROI calculus immediately changes. So instead of
              hiring 0 engineers, the company hires 10 with AI agents. Net
              effect: <strong>+10 engineers</strong>, not -40.
            </p>
            <p>
              This has compounding implications. Coding can now have impact for
              internal workflow automation, systems integration, data analysis,
              and customer-facing product innovation. By bringing down the cost
              of writing code, we can just begin to use it for far more.
            </p>
          </div>

          {/* Pull-quote */}
          <blockquote className="my-8 border-l-3 border-[var(--accent)] pl-5 py-1">
            <p
              className="text-xl text-[var(--foreground)] leading-[1.7] font-medium font-serif"
            >
              By making engineering cheaper, AI doesn&rsquo;t just accelerate
              existing projects. It makes entirely new categories of projects
              viable. The demand for software is nowhere near saturated.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ───── Section 5: Interactive Calculator ───── */}
      <section className="mt-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="05" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            See It Yourself
          </h2>
          <p className="text-md text-[var(--muted)] leading-[1.75] mb-6">
            Adjust the productivity multiplier and demand elasticity to see how
            workforce size changes across different sectors. Try the presets to
            see why the same AI gains produce opposite employment effects in
            different industries.
          </p>

          <DemandSliderViz />
        </div>
      </section>

      {/* ───── Section 6: Where It Applies ───── */}
      <section className="mt-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="06" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            Where Expansion vs. Contraction Is Likely
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Not every sector will follow the same path. The elasticity of
              demand varies enormously, and so does the magnitude of AI-driven
              productivity gains.
            </p>
          </div>

          {/* Sector analysis */}
          <div className="space-y-3">
            <SectorRow
              sector="Software & Engineering"
              elasticity="High"
              outlook="Expansion likely"
              color="#22c55e"
              detail="Vast unmet demand for automation, custom tooling, integration, and data analysis. Companies that couldn't afford software projects now can. The long tail of software needs is enormous."
            />
            <SectorRow
              sector="Creative Services"
              elasticity="High"
              outlook="Expansion likely"
              color="#22c55e"
              detail="Bespoke creative work (custom video, illustration, copywriting) was unaffordable for most SMBs. Lower production costs expand the addressable market for creative services."
            />
            <SectorRow
              sector="Legal Services"
              elasticity="Moderate"
              outlook="Mixed"
              color="#f59e0b"
              detail="Large latent demand for affordable legal services, but regulatory friction, licensing requirements, and liability concerns slow expansion. Contract review and compliance could expand; litigation less so."
            />
            <SectorRow
              sector="Customer Service"
              elasticity="Low-Moderate"
              outlook="Displacement leaning"
              color="#ef4444"
              detail="Consumers don't want more support interactions at lower prices. Some expansion in proactive service, but automation of existing volume dominates."
            />
            <SectorRow
              sector="Data Entry & Back-Office"
              elasticity="Low"
              outlook="Displacement dominant"
              color="#ef4444"
              detail="Nobody wants more data entry. When AI automates it, the work simply goes away. This is the textbook case where efficiency reduces total labor."
            />
            <SectorRow
              sector="Healthcare"
              elasticity="High (supply-constrained)"
              outlook="Expansion if barriers fall"
              color="#5C61F6"
              detail="Enormous unmet demand for healthcare, but constrained by regulation, licensing, and institutional inertia. AI diagnostics could unlock demand if regulatory frameworks adapt."
            />
          </div>
        </div>
      </section>

      {/* ───── Section 7: The Reallocation Caveat ───── */}
      <section className="mt-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="07" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            The Reallocation Caveat
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Even where demand elasticity predicts net job growth, the
              transition will not be smooth. Expansion happens at the sector or
              economy level, but displacement happens at the firm and individual
              level. The worker displaced at Company A is not automatically
              hired at Company B.
            </p>
          </div>

          {/* Warning card */}
          <div
            className="rounded-xl border p-4 sm:p-5 mb-6"
            style={{ borderColor: "color-mix(in srgb, #f59e0b 19%, transparent)", backgroundColor: "color-mix(in srgb, #f59e0b 3%, transparent)" }}
          >
            <p className="text-base font-bold text-signal-warning mb-2">
              Real frictions in the transition
            </p>
            <ul className="space-y-2 text-base text-[var(--muted)] leading-relaxed">
              <li className="flex gap-2">
                <span className="text-signal-warning font-bold shrink-0">&bull;</span>
                <span>
                  <strong className="text-[var(--foreground)]">Skill mismatch</strong>
                  {" "}&mdash; 10 AI-augmented engineers require different skills than 50
                  traditional engineers. The displaced 50 can&rsquo;t all become
                  the 10 new hires without retraining.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-signal-warning font-bold shrink-0">&bull;</span>
                <span>
                  <strong className="text-[var(--foreground)]">Geographic mismatch</strong>
                  {" "}&mdash; New demand may emerge in different cities, regions, or
                  countries than where displacement occurs.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-signal-warning font-bold shrink-0">&bull;</span>
                <span>
                  <strong className="text-[var(--foreground)]">Timing asymmetry</strong>
                  {" "}&mdash; Displacement is fast (firms can cut costs this quarter).
                  New demand creation is slow (new projects need planning, hiring,
                  onboarding). The gap between destruction and creation can be
                  painful.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-signal-warning font-bold shrink-0">&bull;</span>
                <span>
                  <strong className="text-[var(--foreground)]">Wage adjustment</strong>
                  {" "}&mdash; Even when more jobs exist in aggregate, some workers
                  transition to lower-paying roles during the reallocation period.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75]">
            <p>
              These frictions are real, and policy matters. But the core
              dynamic holds: in sectors with elastic demand, AI-driven cost
              reductions will create more total work than they eliminate. The
              historical record on this is remarkably consistent. The challenge
              is managing the transition, not preventing it.
            </p>
          </div>
        </div>
      </section>

      {/* ───── Closing ───── */}
      <section className="mt-8">
        <div className="border-t border-card pt-8">
          <blockquote className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg p-4 sm:p-5 mb-6">
            <p
              className="text-lg sm:text-xl text-[var(--foreground)] leading-[1.75] font-medium font-serif"
            >
              The default assumption &mdash; that automation always means fewer
              jobs &mdash; is wrong in any market where demand is elastic. The
              question for each sector is not &ldquo;how many tasks can AI
              do?&rdquo; but &ldquo;how much more of this work would the world
              buy at a fraction of the current price?&rdquo;
            </p>
          </blockquote>

          <ShareSectionBar
            url="https://jobsdata.ai/demand-elasticity"
            title="The Demand Elasticity Effect"
            description="Why making work cheaper can create more jobs, not fewer"
          />

          {/* Continue exploring */}
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4 mt-8">
            Continue exploring
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <NavCard
              href="/productivity"
              label="Productivity"
              description="How micro gains translate to macro outcomes"
            />
            <NavCard
              href="/signals#productivity-paths"
              label="Productivity Paths"
              description="Reduce, amplify, or expand. How firms respond"
            />
            <NavCard
              href="/j-curve"
              label="The J-Curve"
              description="Why measured productivity lags real impact"
            />
          </div>
        </div>
      </section>
    </article>
  );
}

/* ── Utility components ── */

function SectionLabel({ number }: { number: string }) {
  return (
    <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3 block">
      {number}
    </span>
  );
}

function StatCard({
  value,
  label,
  sublabel,
  color,
}: {
  value: string;
  label: string;
  sublabel: string;
  color: string;
}) {
  return (
    <div
      className="text-center rounded-lg px-3 py-3 border"
      style={{
        borderColor: `color-mix(in srgb, ${color} 19%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 3%, transparent)`,
      }}
    >
      <p className="text-heading-sm font-black" style={{ color }}>
        {value}
      </p>
      <p className="text-xs font-bold text-[var(--foreground)] mt-0.5">
        {label}
      </p>
      <p className="text-2xs text-[var(--muted)] leading-snug mt-0.5">
        {sublabel}
      </p>
    </div>
  );
}

function SectorRow({
  sector,
  elasticity,
  outlook,
  color,
  detail,
}: {
  sector: string;
  elasticity: string;
  outlook: string;
  color: string;
  detail: string;
}) {
  return (
    <div
      className="rounded-lg border px-4 py-3"
      style={{ borderColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h4 className="text-base font-bold text-[var(--foreground)]">
          {sector}
        </h4>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xs text-[var(--muted)]">
            Elasticity: {elasticity}
          </span>
          <span
            className="text-2xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 9%, transparent)`, color }}
          >
            {outlook}
          </span>
        </div>
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">
        {detail}
      </p>
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
      className="group block rounded-lg border border-card bg-white px-4 py-3 hover:border-black/[0.12] hover:shadow-sm transition-all no-underline"
    >
      <p className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
        {label}
      </p>
      <p className="text-xs text-[var(--muted)] mt-0.5">{description}</p>
    </Link>
  );
}

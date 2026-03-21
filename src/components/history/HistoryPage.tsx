"use client";

import Link from "next/link";
import GPTTimeline from "./GPTTimeline";
import CompressionComparison from "./CompressionComparison";
import RevolutionCards from "./RevolutionCards";
import ComparisonMatrix from "./ComparisonMatrix";
import ForecastColumns from "./ForecastColumns";
import VulnerabilityTable from "./VulnerabilityTable";
import DiffusionComparison from "./DiffusionComparison";
import ShareSectionBar from "@/components/ShareSectionBar";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import CursorSpotlight from "@/components/delights/CursorSpotlight";

export default function HistoryPage() {
  return (
    <article className="max-w-[960px] mx-auto">
      <ReadingProgressBar />
      {/* ───── Header ───── */}
      <header className="mb-10">
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
          className="text-[18px] sm:text-[20px] text-[var(--muted)] leading-relaxed mb-5"
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
            physical power: turning a scarce, expensive resource
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
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="01" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Every GPT Follows the Same Arc
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            Every major{" "}
            <a
              href="https://en.wikipedia.org/wiki/General-purpose_technology"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
            >general-purpose technology</a>{" "}
            (GPT, not to be confused with{" "}
            <a
              href="https://en.wikipedia.org/wiki/Generative_pre-trained_transformer"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
            >Generative Pre-trained Transformer</a>)
            follows a predictable{" "}
            <Tooltip
              label="five-phase arc"
              tip="This framework synthesizes several academic models of how general-purpose technologies reshape economies. The closest single source is Carlota Perez (2002), Technological Revolutions and Financial Capital, which models technology waves in recurring phases. The definitive academic treatment of GPT theory is Lipsey, Carlaw &amp; Bekar (2005), Economic Transformations: General Purpose Technologies and Long-Term Economic Growth. The specific five phases here (emergence, diffusion, displacement, reorganization, new equilibrium) are an editorial synthesis, not a direct citation from any single paper."
            />. The names change, but the shape is the same.
            Steam, electricity, computers: each transformed the
            labor market through the same sequence of emergence, diffusion,
            displacement, reorganization, and new equilibrium.
          </p>
          <CursorSpotlight>
            <GPTTimeline />
          </CursorSpotlight>

          {/* Speed compression visualization */}
          <CompressionComparison />

          {/* "This time might be different" counterpoint */}
          <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 sm:p-5">
            <p className="text-[13px] font-bold text-[var(--foreground)] mb-1.5">
              But what if this time is different?
            </p>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed">
              Previous technologies automated tasks, sometimes many
              tasks, but none could emulate the full range of human
              cognition. If AI progresses toward general intelligence, the
              historical pattern may break down. The relevant question shifts
              from <em className="text-[var(--foreground)]">which tasks get
              automated</em> to <em className="text-[var(--foreground)]">where
              humans retain comparative advantage</em>: efficiency gaps,
              roles where the human element <em>is</em> the value, and
              complementarities between cognitive and physical work. Just
              because AI <em>can</em> do something doesn&rsquo;t mean human
              labor involving it disappears, but it will probably
              look very different.
            </p>
            <p className="text-[11px] text-[var(--muted)] mt-2">
              Adapted from{" "}
              <a
                href="https://x.com/alexolegimas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Alex Imas
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ───── Section 3: The Four Revolutions ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="02" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            The Four Revolutions
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            Four technologies. Four massive disruptions. All eventually
            created more jobs than they destroyed, but the path was
            never smooth or quick.
          </p>
          <RevolutionCards />
        </div>
      </section>

      {/* ───── Section 4: The Central Insight ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="03" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            The On-Tap Intelligence Shift
          </h2>

          <div className="space-y-4 text-[14px] text-[var(--muted)] leading-[1.8] mb-10">
            <p>
              Prior automation technologies had a consistent structure: they
              automated <em>physical</em> capabilities (steam, combustion,
              electricity) or <em>rule-based cognitive</em> tasks
              (computers). Each wave created a new protected domain,
              work the technology structurally couldn&rsquo;t do,
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
              doesn&rsquo;t mean AI equals human intelligence (it
              doesn&rsquo;t), but it means the protected domain of
              prior automation waves is now being encroached on.
            </p>
            <p>
              The most useful analogy is electrification. Before
              electricity, accessing significant mechanical power required
              physical proximity to a power source (a river, a steam
              boiler). Power was scarce, locationally fixed, and expensive.
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
            <p>
              Crucially, when electricity made factory power cheap and
              ubiquitous, the result wasn&rsquo;t fewer factories &mdash; it
              was dramatically more. Once factories adopted &ldquo;unit
              drive&rdquo; (individual electric motors per machine, replacing
              centralized shaft-and-belt systems), they could be single-story,
              lighter, and modular. Electrification accounted for half of all
              manufacturing productivity growth in the 1920s. Manufacturing
              output and employment grew for decades because cheaper power
              made previously unviable production economically feasible. The same dynamic may apply to
              cognitive work: when intelligence becomes on-tap, the question
              is whether there&rsquo;s unmet demand for cognitive output. In
              sectors like software, creative services, and data analysis, the
              answer is emphatically yes. This is the{" "}
              <Link
                href="/demand-elasticity"
                className="text-[var(--accent)] hover:underline"
              >
                demand elasticity effect
              </Link>
              : lower costs unlock new markets, potentially creating more
              total work than they eliminate.
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
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="04" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            What the Pattern Predicts
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            History doesn&rsquo;t tell us the outcome. It tells us
            the shape. Here is what the pattern predicts, offered not as
            certainties but as the most historically-grounded expectations.
          </p>
          <ForecastColumns />
        </div>
      </section>

      {/* ───── Section 6: Vulnerability Snapshot ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <SectionLabel number="05" />
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-3">
            Occupational Vulnerability Snapshot
          </h2>
          <p className="text-[14px] text-[var(--muted)] leading-[1.75] mb-6">
            Five vulnerability categories, grounded in the historical
            pattern of how general-purpose technologies reshape
            occupational structures.
          </p>
          <VulnerabilityTable />
        </div>
      </section>

      {/* ───── Section 7: The Policy Question ───── */}
      <section className="mb-8">
        <div className="border-t border-black/[0.06] pt-8">
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
              economy, not in protecting the old one. The Morrill Act
              (1862) created land-grant universities that provided the
              skilled workforce for industrialization. The GI Bill (1944)
              sent nearly 8 million veterans through education programs by
              1956; by 1947, WWII veterans accounted for half of all
              college admissions. The VA estimated that increased federal
              income taxes from these better-educated workers paid for the
              program several times over. Community colleges, whose growth
              the GI Bill accelerated, now serve 44% of US undergraduates and
              are the nation&rsquo;s primary workforce development engine.
              The equivalent for AI: radical investment in AI literacy,
              domain-expert + AI collaboration skills, and accessible
              retraining pathways.
            </p>
          </div>

          {/* Lesson 2 */}
          <div className="mb-8">
            <h3 className="text-[16px] font-bold text-[var(--foreground)] mb-2">
              Lesson 2: The Distribution Problem is Institutional, Not
              Technological
            </h3>
            <p className="text-[14px] text-[var(--muted)] leading-[1.8]">
              The computer era&rsquo;s inequality was not
              technologically inevitable. Goldin &amp; Katz document the
              college wage premium rising from 39% (1980) to 79% (2000),
              while real wages for men without degrees declined. Acemoglu
              &amp; Restrepo (2022) find that 50&ndash;70% of US wage
              structure changes over four decades trace to automation
              displacing routine-task workers. But this reflected specific
              institutional choices: declining union density, wage policy,
              trade liberalization, corporate governance norms. Ford&rsquo;s
              Five Dollar Day (January 5, 1914) is the counterexample:
              he raised the prevailing $2.34 to $5.00 per day because mass
              production requires mass consumers. The AI era&rsquo;s
              distributional outcome will similarly reflect choices made now.
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
              true that the prior pattern&rsquo;s timeline (40 to 70
              years) is politically and humanly unacceptable as a
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
              expertise, putting the equivalent of world-class
              legal, medical, educational, and financial guidance within
              reach of everyone rather than only the affluent, it
              could be among the most equalizing forces in human history.
              If it primarily displaces workers while concentrating gains
              among capital owners and a small elite of knowledge workers,
              it could be among the most destabilizing. The technology
              does not decide. We do.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ───── Section: Diffusion Comparison Source ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <DiffusionComparison />
        </div>
      </section>

      {/* ───── Key Sources ───── */}
      <section className="mb-12">
        <div className="border-t border-black/[0.06] pt-8">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
            Key Sources
          </p>
          <div className="space-y-4">
            <SourceCard
              title="The History of Technological Anxiety and the Future of Economic Growth: Is This Time Different?"
              authors="Joel Mokyr, Chris Vickers, Nicolas L. Ziebarth"
              journal="Journal of Economic Perspectives, Vol. 29, No. 3 (2015)"
              url="https://pubs.aeaweb.org/doi/pdfplus/10.1257/jep.29.3.31"
              note="The anchor reference for this page. Surveys 250 years of technological anxiety across three recurring themes: displacement fears, work dehumanization, and stagnation pessimism. Finds that predictions of widespread technological unemployment were 'by and large, wrong' but cautions against trivializing the costs borne by those actually displaced."
            />
            <SourceCard
              title="Technological Revolutions and Financial Capital"
              authors="Carlota Perez"
              journal="Edward Elgar Publishing (2002)"
              url="https://en.wikipedia.org/wiki/Technological_Revolutions_and_Financial_Capital"
              note="The theoretical framework behind the five-phase GPT arc (Section 01). Models technology waves as recurring surges with installation and deployment periods separated by a turning point."
            />
            <SourceCard
              title="The Computer and the Dynamo: An Historical Perspective on the Modern Productivity Paradox"
              authors="Paul David"
              journal="American Economic Review, Vol. 80, No. 2 (1990)"
              url="https://www.jstor.org/stable/2006600"
              note="Origin of the electrification productivity paradox cited in the Electricity card. Showed that 40 years elapsed between the lightbulb and measurable productivity gains from electrification."
            />
            <SourceCard
              title="Economic Possibilities for our Grandchildren"
              authors="John Maynard Keynes"
              journal="Essays in Persuasion (1930)"
              url="https://www.aspeninstitute.org/wp-content/uploads/files/content/upload/Intro_and_Section_I.pdf"
              note="Keynes predicted a 15-hour work week within 100 years, driven by compound productivity growth. He saw technological unemployment as 'growing-pains of over-rapid changes' rather than a permanent condition."
            />
          </div>
        </div>
      </section>

      {/* ───── Share ───── */}
      <section className="mb-8">
        <ShareSectionBar
          url="https://jobsdata.ai/history"
          title="Historical Technology Comparison"
          description="How past technology revolutions reshaped labor markets"
        />
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

function SourceCard({
  title,
  authors,
  journal,
  url,
  note,
}: {
  title: string;
  authors: string;
  journal: string;
  url: string;
  note: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-black/[0.06] rounded-lg px-5 py-4 hover:border-[var(--accent)]/30 transition-colors group"
    >
      <p className="text-[13px] font-bold text-[var(--foreground)] leading-snug group-hover:text-[var(--accent)] transition-colors">
        {title}
      </p>
      <p className="text-[11px] text-[var(--muted)] mt-1">
        {authors} &middot; {journal}
      </p>
      <p className="text-[12px] text-[var(--muted)] leading-relaxed mt-2">
        {note}
      </p>
    </a>
  );
}

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

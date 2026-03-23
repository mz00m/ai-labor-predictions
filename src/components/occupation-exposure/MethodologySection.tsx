"use client";

import { useState } from "react";
import Link from "next/link";

function Study({
  title,
  authors,
  year,
  url,
  summary,
}: {
  title: string;
  authors: string;
  year: string;
  url: string;
  summary: string;
}) {
  return (
    <div className="pl-3 border-l-2 border-black/[0.06] mb-3 last:mb-0">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] font-medium text-[var(--accent-text)] hover:underline leading-snug"
      >
        {title}
      </a>
      <p className="text-[11px] text-[var(--muted)] mt-0.5">
        {authors} ({year})
      </p>
      <p className="text-[12px] text-[var(--muted)] leading-[1.6] mt-1">
        {summary}
      </p>
    </div>
  );
}

function DimensionResearch({
  id,
  title,
  why,
  children,
}: {
  id: string;
  title: string;
  why: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      id={id}
      className="border-b border-black/[0.04] last:border-0 scroll-mt-24"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between w-full py-4 text-left gap-3"
      >
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[var(--foreground)] leading-snug">
            {title}
          </p>
          <p className="text-[12px] text-[var(--muted)] leading-[1.6] mt-1">
            {why}
          </p>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`text-[var(--muted)] transition-transform flex-shrink-0 mt-1 ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>
      {open && (
        <div className="pb-5">
          {children}
        </div>
      )}
    </div>
  );
}

export default function MethodologySection() {
  return (
    <div className="border border-black/[0.06] rounded-lg overflow-hidden px-5">
      {/* ── Dimension 1: Technical Exposure ── */}
      <DimensionResearch
        id="methodology-exposure"
        title="Dimension 1: Technical AI Exposure"
        why="Which tasks can AI systems actually perform? This is the starting point — but exposure alone doesn't predict displacement, because what AI can do and what organizations will adopt are different questions."
      >
        <Study
          title="GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models"
          authors="Eloundou, Manning, Mishkin, Rock"
          year="2023"
          url="https://arxiv.org/abs/2303.10130"
          summary="The foundational exposure study. Scored ~1,000 occupations on LLM task exposure using both human raters and GPT-4. Found ~80% of US workers have at least 10% of tasks exposed; ~19% have 50%+ exposure. Established the methodology most subsequent studies build on."
        />
        <Study
          title="Labor Market AI Exposure: What Do We Know?"
          authors="Gimbel, Kendall, Kulsakdinun (Yale Budget Lab)"
          year="2026"
          url="https://budgetlab.yale.edu/research/labor-market-ai-exposure-what-do-we-know"
          summary="Meta-analysis comparing 6 independent AI exposure metrics across 778 occupations. Found high agreement on extremes (construction = low, data entry = high) but significant disagreement in the middle. We use their PCA-weighted composite as our validation benchmark (Pearson r = 0.878 with our scores)."
        />
        <Study
          title="Occupational Heterogeneity in Exposure to Generative AI"
          authors="Felten, Raj, Seamans"
          year="2023"
          url="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4414065"
          summary="Extends their earlier AI-occupation exposure framework to generative AI specifically. Maps AI capabilities to O*NET work activities using an independent methodology from Eloundou et al. Important because it measures what AI can actually do on standardized benchmarks rather than relying on LLM self-assessment."
        />
        <Study
          title="AI Adoption in America: Who, What, and Where"
          authors="McElheran, Li, Brynjolfsson, Kroff, Dinlersoz, Foster, Zolas"
          year="2024"
          url="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4673528"
          summary="Uses Census BTOS data to show which firms are actually adopting AI vs. which are just exposed. Key finding: AI adoption is concentrated in large, high-paying firms — exposure and adoption diverge significantly, motivating our separate adoption speed dimension."
        />
        <Study
          title="The Simple Macroeconomics of AI"
          authors="Acemoglu"
          year="2024"
          url="https://www.nber.org/papers/w32487"
          summary="The essential bounding argument for interpreting exposure scores. Using Hulten's theorem: ~20% of tasks are AI-exposed, ~23% can be profitably automated, with ~27% cost savings per task — yielding only 0.53-0.66% TFP gain over a decade. Exposure alone dramatically overstates likely displacement."
        />
      </DimensionResearch>

      {/* ── Dimension 2: Adoption Speed ── */}
      <DimensionResearch
        id="methodology-adoption"
        title="Dimension 2: Institutional Adoption Speed"
        why="A technology can be economically viable for years before organizations actually deploy it. Regulated industries, unionized workplaces, and complex organizations move much slower — this gap between 'can' and 'will' is where most single-dimension analyses go wrong."
      >
        <Study
          title="Hybrid Corn: An Exploration in the Economics of Technological Change"
          authors="Griliches"
          year="1957"
          url="https://www.jstor.org/stable/1905380"
          summary="The classic study of technology diffusion. Showed that even a clearly superior technology (hybrid corn) took 5-25 years to reach full adoption across US states, with the speed depending on local economic incentives. Established S-curve adoption as the baseline model."
        />
        <Study
          title="An Exploration of Technology Diffusion"
          authors="Comin, Hobijn"
          year="2010"
          url="https://www.aeaweb.org/articles?id=10.1257/aer.100.5.2031"
          summary="Analyzed adoption lags for 15 technologies across 166 countries. Found that cross-country adoption gaps have narrowed over time, but within-country institutional factors still create 5-45 year lags between availability and full deployment."
        />
        <Study
          title="Is Distance from Innovation a Barrier to the Adoption of Artificial Intelligence?"
          authors="Hunt, Cockburn, Bessen"
          year="2024"
          url="https://www.nber.org/papers/w33022"
          summary="Directly measures geographic variation in AI adoption using vacancy data. Being 200km from an AI hotspot is associated with 17% lower AI job growth. State borders explain 20% of the adoption distance penalty. AI deployment is spatially concentrated, not evenly distributed — adoption speed is a local phenomenon."
        />
        <Study
          title="Robots and Jobs: Evidence from US Labor Markets"
          authors="Acemoglu, Restrepo"
          year="2020"
          url="https://www.journals.uchicago.edu/doi/10.1086/705716"
          summary="Using IFR robot data and an IV approach, found that one more robot per thousand workers reduces the employment-to-population ratio by 0.2pp and wages by 0.42%. Adoption varied dramatically by industry — automotive adopted 8-10x faster than food processing — demonstrating that sector-specific institutional factors mediate deployment speed."
        />
      </DimensionResearch>

      {/* ── Dimension 3: Worker Adaptability ── */}
      <DimensionResearch
        id="methodology-adaptability"
        title="Dimension 3: Worker Adaptability"
        why="When displacement occurs, some workers land on their feet quickly while others face prolonged unemployment. Financial savings, transferable skills, geographic job density, and age all determine how costly displacement is for the individual — and for the economy."
      >
        <Study
          title="How Adaptable Are American Workers to AI-Induced Job Displacement?"
          authors="Manning, Aguirre"
          year="2026"
          url="https://www.nber.org/papers/w34705"
          summary="Our primary source for this dimension. Constructs a composite adaptability index across 356 occupations (95.9% of US workforce) from four sub-components: net liquid wealth (SIPP), skill transferability (O*NET), geographic job density (Lightcast), and age fraction 55+. Professional workers score 0.734; admin support scores 0.360."
        />
        <Study
          title="Trade Adjustment: Worker-Level Evidence"
          authors="Autor, Dorn, Hanson, Song"
          year="2014"
          url="https://academic.oup.com/qje/article-abstract/129/4/1799/1854509"
          summary="Tracked 2M+ workers displaced by the China trade shock using longitudinal earnings records. Found that geographic concentration of affected industries predicted worse outcomes: workers in regions with many similar displaced peers competed for the same alternative jobs. Directly motivates the geographic job density sub-component."
        />
        <Study
          title="What Happens to Workers at Firms that Automate?"
          authors="Bessen, Goos, Salomons, van den Berge"
          year="2025"
          url="https://direct.mit.edu/rest/article/107/1/125/114750/What-Happens-to-Workers-at-Firms-that-Automate"
          summary="First worker-level estimates of automation adjustment using Dutch administrative data covering all private non-financial industries (2000-2016). Cumulative wage income loss of ~8% over 5 years; only 2% of tenured workers leave in the year of automation. Critically, costs are borne disproportionately by older workers with longer tenure — quantifying the outcomes that Manning & Aguirre's adaptability index predicts."
        />
        <Study
          title="Recessions and the Costs of Job Loss"
          authors="Davis, von Wachter"
          year="2011"
          url="https://www.brookings.edu/articles/recessions-and-the-costs-of-job-loss/"
          summary="Using Social Security earnings records for 3.6M workers, found that displaced workers in their 50s suffer ~25% larger present-value lifetime earnings losses than workers in their 30s. Older workers also face longer unemployment spells and lower re-employment rates, directly motivating the age fraction sub-component in Manning & Aguirre's framework."
        />
      </DimensionResearch>

      {/* ── Dimension 4: Demand Elasticity ── */}
      <DimensionResearch
        id="methodology-elasticity"
        title="Dimension 4: Demand Elasticity"
        why="The Jevons Paradox: when technology makes output cheaper, total demand for that output often expands. If demand expands faster than productivity grows, employment increases — even as each worker becomes more productive. This is the most overlooked factor in AI displacement forecasts."
      >
        <div className="mb-4">
          <Link
            href="/demand-elasticity"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent-text)] hover:underline"
          >
            Read the full demand elasticity explainer on jobsdata.ai &rarr;
          </Link>
        </div>
        <Study
          title="Automation and Jobs: When Technology Boosts Employment"
          authors="Bessen"
          year="2019"
          url="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2935003"
          summary="The key paper on this dimension. Analyzed 150 years of US Census data and found that in most occupations, automation increased employment when demand was elastic. The ATM example: ATMs reduced the cost of operating a bank branch, so banks opened more branches, and teller employment grew for 30 years."
        />
        <Study
          title="Is Automation Labor-Displacing? Productivity Growth, Employment, and the Labor Share"
          authors="Autor, Salomons"
          year="2018"
          url="https://www.brookings.edu/articles/is-automation-labor-displacing-productivity-growth-employment-and-the-labor-share/"
          summary="Found that at the industry level, productivity growth from automation almost always increased employment in that industry — but reduced employment economy-wide through cross-industry competition effects. The within-industry expansion is the demand elasticity mechanism."
        />
        <Study
          title="Jevons' Paradox"
          authors="Alcott"
          year="2005"
          url="https://doi.org/10.1016/j.ecolecon.2005.03.020"
          summary="Formalizes when and why cost reduction leads to increased consumption. The paradox holds when demand is elastic (many potential customers priced out) and fails when demand is inelastic (everyone who wants the service already has it). This is why office admin (internal cost center) differs from arts/media (vast unserved market)."
        />
        <Study
          title="Automation and New Tasks: How Technology Displaces and Reinstates Labor"
          authors="Acemoglu, Restrepo"
          year="2019"
          url="https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3"
          summary="The theoretical foundation for why displacement is not the whole story. Technology operates through two opposing forces: displacement (capital replaces labor in existing tasks) and reinstatement (new tasks are created where labor has comparative advantage). Whether employment grows or shrinks depends on the balance — and reinstatement has historically dominated."
        />
        <Study
          title="New Frontiers: The Origins and Content of New Work, 1940-2018"
          authors="Autor, Chin, Salomons, Seegmiller"
          year="2022"
          url="https://www.nber.org/papers/w30389"
          summary="Found that 60% of 2018 employment was in job titles that didn't exist in 1940, most created by prior waves of automation expanding demand. AI's ability to create new task categories — not just automate existing ones — is a major source of potential demand expansion."
        />
        <p className="text-[11px] text-[var(--muted)] leading-[1.5] mt-3 italic">
          Note: Our per-occupation elasticity classifications (high/moderate/low)
          are qualitative assessments informed by these frameworks, not derived
          from a specific empirical paper. No validated, occupation-specific
          demand elasticity parameters exist for AI-era services.
        </p>
      </DimensionResearch>

      {/* ── Dimension 5: AI Complementarity ── */}
      <DimensionResearch
        id="methodology-complementarity"
        title="Dimension 5: AI Complementarity"
        why="The same technology can be used to replace workers or to make them more productive. Whether AI is deployed as a substitute or complement depends on management decisions, task structure, and organizational incentives — not just technical capability. Job dimensionality (the number of distinct task clusters) is a key structural input: high-dimensional jobs trigger a 'focus effect' that raises wages, while low-dimensional jobs face stronger firm incentive for full automation."
      >
        <Study
          title="Artificial Intelligence, Productivity, and the Workforce: Evidence from Corporate Executives"
          authors="Baslandze, Foster, Moreira, Peterman"
          year="2026"
          url="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6410338"
          summary="Surveyed ~750 CFOs on whether AI was replacing or enhancing workers in each occupation group. Found that office/admin is the only group where replacement dominates (NEI = 2.03). Management (0.14) and engineering (0.10) are strongly enhancement-dominant. This is the most direct empirical measure of how firms are actually deploying AI."
        />
        <Study
          title="The Turing Trap: The Promise & Peril of Human-Like Artificial Intelligence"
          authors="Brynjolfsson"
          year="2022"
          url="https://direct.mit.edu/daed/article/151/2/272/110622/The-Turing-Trap-The-Promise-amp-Peril-of-Human"
          summary="Argues that the current AI development paradigm over-optimizes for human replacement ('passing the Turing test') when the larger economic opportunity is augmentation. Whether AI is used to substitute or complement depends on incentive structures, not just technical capability."
        />
        <Study
          title="Generative AI at Work"
          authors="Brynjolfsson, Li, Raymond"
          year="2025"
          url="https://academic.oup.com/qje/article/140/2/889/7990658"
          summary="The largest empirical study of AI complementarity in production. Studied 5,172 customer-support agents: 15% average productivity increase from AI assistance, ~30% for least-experienced workers, with durable learning effects even when AI was unavailable. Gains came from augmentation (AI-generated suggestions workers could accept, modify, or reject), not replacement."
        />
        <Study
          title="Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence"
          authors="Brynjolfsson, Chandar, Chen"
          year="2025"
          url="https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/"
          summary="Using ADP payroll data covering 3.5-5M workers, found a 13% relative employment decline for ages 22-25 in AI-exposed occupations — but only in automation-heavy quintiles. Augmentation-heavy occupation quintiles show positive youth employment trends. Makes the automation-vs-augmentation distinction empirically testable: the deployment choice predicts who gets displaced."
        />
        <Study
          title="Artificial Intelligence: The Ambiguous Labor Market Impact of Automating Prediction"
          authors="Agrawal, Gans, Goldfarb"
          year="2019"
          url="https://www.aeaweb.org/articles?id=10.1257/jep.33.2.31"
          summary="Decomposes decisions into prediction (what AI automates) and judgment (what humans provide). When AI improves prediction, the value of human judgment increases — making the two complementary rather than substitutive. Jobs heavy in judgment (management, medicine) benefit most from AI prediction improvements."
        />
        <Study
          title="O-Ring Automation"
          authors="Gans, Goldfarb"
          year="2024"
          url="https://www.nber.org/papers/w33886"
          summary="Applies Kremer's O-Ring production function to AI automation. In high-dimensional jobs (many complementary tasks), automating some tasks frees workers to concentrate on remaining ones — the 'focus effect' raises quality and wages. In low-dimensional jobs, partial automation doesn't free the worker for much else, and firms have stronger incentive to invest in automating the remaining tasks. Job dimensionality is the structural mechanism that determines whether AI complements or substitutes."
        />
        <Study
          title="The O-Ring Theory of Economic Development"
          authors="Kremer"
          year="1993"
          url="https://academic.oup.com/qje/article-abstract/108/3/551/1881852"
          summary="The foundational insight behind the dimensionality mechanism: if production requires many steps and each step needs to be done well, productivity is multiplicative in skill. In multi-task roles, automating one task well compounds through all remaining tasks — a structural argument for why high-dimensional jobs see augmentation rather than replacement."
        />
        <Study
          title="How Will AI-driven Automation Actually Affect Jobs?"
          authors="Imas, Shukla"
          year="2026"
          url="https://aleximas.substack.com/p/how-will-ai-driven-automation-actually"
          summary="Synthesizes the O-Ring automation framework for practitioners. A management consultant with high exposure across 7-8 complementary tasks may see wages rise (focus effect). A truck driver with moderate exposure on 1 critical task faces existential risk because firms have enormous incentive to automate driving once it's feasible. Dimensionality determines whether exposure translates to complementarity or substitution."
        />
        <p className="text-[11px] text-[var(--muted)] leading-[1.5] mt-3 italic">
          Note: Job dimensionality (number of task clusters with &ge;10% time
          share) is used as a structural input to complementarity scoring, not
          as a separate dimension. High-dimensional jobs (&ge;5 clusters)
          receive a complementarity bonus of up to +1.0; low-dimensional jobs
          (&le;2 clusters) receive a penalty of up to &minus;1.5. For
          occupations with CFO survey data, the adjustment is milder
          (&plusmn;0.5) since executive sentiment should carry more weight than
          structural heuristics.
        </p>
        <p className="text-[11px] text-[var(--muted)] leading-[1.5] mt-2 italic">
          The &ldquo;Dimensionality&rdquo; toggle above the treemap lets you
          turn this adjustment on or off. When enabled, the chart steadily
          highlights occupations where dimensionality increases net risk
          above 3.5 &mdash; the jobs where low task complexity makes
          automation pressure materially worse.
          Comparing scores with and without dimensionality shows how much job
          structure (vs. task composition alone) drives the complementarity
          estimate.
        </p>
      </DimensionResearch>

      {/* ── Composite Score ── */}
      <DimensionResearch
        id="methodology-composite"
        title="Composite Score Calculation"
        why="How the five dimensions combine into a single net displacement risk score."
      >
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          The net displacement risk score combines the five dimensions with the
          following weights: Technical Exposure (30%), Adoption Speed (20%),
          Worker Adaptability (15%), Demand Elasticity (15%),
          Complementarity (20%).
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          Exposure and adoption speed are
          &ldquo;pressure&rdquo; factors that drive displacement up.
          Adaptability, elasticity, and complementarity are
          &ldquo;buffer&rdquo; factors that moderate it. Each side is
          normalized to 0&ndash;10 independently before combining: Pressure =
          weighted average of Exposure and Speed
          (0&ndash;10); Absorption = weighted average of Adaptability,
          Elasticity, and Complementarity (0&ndash;10). Net Risk = (Pressure
          &minus; Absorption + 10) / 2, clamped to 0&ndash;10. This ensures
          defensive factors can fully counterbalance pressure &mdash; an
          occupation with maximum exposure but equally strong adaptability,
          demand elasticity, and complementarity scores 5.0 (neutral), not 10.
        </p>

        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mt-5 mb-2">
          How Dimensionality Enters the Composite Score
        </h4>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          Dimensionality is not a separate dimension &mdash; it is a structural
          adjustment to the complementarity score (Dimension 5). It captures the
          insight from the O-Ring production function (Kremer 1993, Gans &amp;
          Goldfarb 2024): jobs where tasks are multiplicative and interdependent
          behave differently under automation than jobs where tasks are separable.
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          We measure <em>effective dimensions</em> as the number of distinct task
          clusters in an occupation that each account for &ge;10% of work time
          (derived from BLS time-use data). This count determines the adjustment:
        </p>
        <ul className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3 ml-4 list-disc space-y-1">
          <li>
            <strong>Low-dimensional (&le;2 clusters):</strong> Penalty of &minus;1.5
            to complementarity. These jobs have few, separable tasks. When AI automates
            one task, there is little remaining work to &ldquo;focus&rdquo; on, and
            firms face strong incentive to automate the rest. Example: a data entry
            clerk whose work is almost entirely information processing faces full
            automation risk with little remaining task to anchor the role.
          </li>
          <li>
            <strong>Mid-dimensional (3&ndash;4 clusters):</strong> No adjustment.
            These jobs have moderate task complexity where the effect is ambiguous.
          </li>
          <li>
            <strong>High-dimensional (&ge;5 clusters):</strong> Bonus of +1.0 to
            complementarity. These jobs have many interlinked tasks. Automating one
            frees the worker to concentrate on the rest &mdash; the &ldquo;focus
            effect&rdquo; raises quality across all remaining tasks and can increase
            wages. Example: a management consultant with 7&ndash;8 complementary
            tasks sees AI boost their productivity rather than replace them.
          </li>
        </ul>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          For the ~8 occupation groups with CFO survey data (Baslandze et al. 2026),
          the adjustment is milder (&plusmn;0.5) because executive sentiment about
          actual deployment intent is a stronger signal than structural heuristics
          alone. For all other groups, we rely on the heuristic-based
          &plusmn;1.5/+1.0 adjustments.
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          The adjusted complementarity score is clamped to 0&ndash;10, then feeds
          into the absorption side of the composite at its 15% weight. So the maximum
          impact of dimensionality on the final net risk score is roughly
          &plusmn;0.1&ndash;0.2 points &mdash; a subtle but structurally meaningful
          shift that separates occupations with identical exposure but different
          internal task structures.
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75]">
          The weighting is intentionally simple and transparent. Reasonable
          people will disagree on weights. The tool&rsquo;s value is not in the
          precise composite number but in showing that single-dimension exposure
          scores omit most of what determines actual displacement.
        </p>
      </DimensionResearch>

      {/* ── Limitations ── */}
      <DimensionResearch
        id="methodology-limitations"
        title="Limitations"
        why="What this framework doesn't capture."
      >
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          This framework operates at the SOC major group level (22 groups),
          which masks significant within-group variation. A &ldquo;computer
          and mathematical&rdquo; group includes both data entry clerks and
          machine learning researchers.
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          The composite weights are author-chosen, not econometrically
          estimated. Demand elasticity classifications are qualitative
          assessments, not measured parameters. CFO complementarity data covers
          only 8 of 22 groups.
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75] mb-3">
          The task-composition model assumes gradual, task-by-task automation
          and does not capture <strong>binary replacement risks</strong> &mdash;
          cases where a single technological breakthrough could automate the
          dominant task cluster wholesale. For example, heavy truck drivers
          score 3 effective dimensions and high complementarity (9.0/10)
          because 70% of their work is physical-manual, which the model treats
          as AI-complementary. But autonomous vehicle technology targets
          &ldquo;driving&rdquo; as a monolithic capability, not a set of
          separable sub-tasks. If that capability crosses the threshold, the
          complementarity buffer disappears. Similar binary risks apply to
          other transportation roles and any occupation where one dominant
          physical task is the target of a single-purpose automation technology.
        </p>
        <p className="text-[13px] text-[var(--muted)] leading-[1.75]">
          These scores describe structural tendencies, not predictions for
          individual workers. A person&rsquo;s actual risk depends on their
          specific role, employer, geography, skills, and adaptability &mdash;
          not just their occupation group&rsquo;s average.
        </p>
      </DimensionResearch>
    </div>
  );
}

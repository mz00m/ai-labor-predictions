"use client";

export default function MethodologySection() {
  return (
    <div className="mt-12 pt-8 border-t border-black/[0.06]">
      <h3 className="text-[18px] font-bold text-[var(--foreground)] tracking-tight mb-4">
        Methodology: How we link tasks to compute costs
      </h3>

      <div className="space-y-6 max-w-3xl">
        {/* TL;DR box */}
        <div className="rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/[0.04] p-5">
          <h4 className="text-[13px] font-bold text-[#6366F1] uppercase tracking-wide mb-2">
            TL;DR
          </h4>
          <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
            We break every job into its component tasks using federal labor data (O*NET, BLS). For each
            task, we calculate what it costs in real AI API spend to replicate one hour of human work,
            then project when that cost drops below the human wage — the <strong>economic crossover
            point</strong>. We layer in how much independent research metrics agree on each
            occupation&apos;s AI exposure (Yale Budget Lab), and how fast each industry actually adopts
            new technology. The result: a task-by-task map of where AI has economic incentive to
            replace human labor, and when.
          </p>
          <p className="text-[12px] text-[var(--muted)] mt-2">
            This is <strong className="text-[var(--foreground)]">not</strong> a prediction of job loss.
            Economic viability is necessary but not sufficient — real adoption depends on organizational
            inertia, regulation, quality requirements, and new task creation.
          </p>
        </div>

        {/* Step 1: How we decouple tasks from jobs */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            Step 1: Decoupling tasks from jobs
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
            AI doesn&apos;t automate jobs — it automates tasks. A &ldquo;financial analyst&rdquo; is really
            a bundle of 5-8 distinct activities: some are highly automatable (data gathering, report
            drafting), others are not (client relationships, judgment calls). To model AI impact
            accurately, we need to decompose every job into these atomic units of work.
          </p>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-4">
            We do this in three layers, each building on the last:
          </p>

          <div className="space-y-3 text-[12px]">
            {/* Layer 1: O*NET */}
            <div className="rounded-lg border border-black/[0.06] p-4">
              <div className="flex items-start gap-3">
                <span className="text-[var(--foreground)] font-bold text-[14px] shrink-0 w-6 h-6 rounded-full bg-black/[0.04] flex items-center justify-center">1</span>
                <div>
                  <p className="font-semibold text-[var(--foreground)] mb-1">
                    O*NET work activities — what people actually do
                  </p>
                  <p className="text-[var(--muted)] mb-2">
                    The U.S. Department of Labor&apos;s{" "}
                    <a
                      href="https://www.onetonline.org/find/descriptor/browse/4.A/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--foreground)]"
                    >
                      Occupational Information Network (O*NET)
                    </a>{" "}
                    catalogs every occupation in the economy by its <strong className="text-[var(--foreground)]">Generalized Work Activities</strong> —
                    a taxonomy of 41 discrete activities organized into four domains:
                  </p>
                  <ul className="text-[var(--muted)] space-y-0.5 ml-4 list-disc list-outside">
                    <li><strong className="text-[var(--foreground)]">Information Input</strong> — observing, gathering, monitoring data</li>
                    <li><strong className="text-[var(--foreground)]">Mental Processes</strong> — analyzing, deciding, evaluating, planning</li>
                    <li><strong className="text-[var(--foreground)]">Work Output</strong> — physical activity, operating equipment, handling objects</li>
                    <li><strong className="text-[var(--foreground)]">Interacting with Others</strong> — communicating, leading, coordinating, negotiating</li>
                  </ul>
                  <p className="text-[var(--muted)] mt-2">
                    We map these 41 activities into 8 task categories (information processing, communication,
                    analysis, creative, coordination, physical, interpersonal, technical) and estimate what share
                    of each job&apos;s working hours fall into each category. The{" "}
                    <a
                      href="https://www.pewresearch.org/social-trends/2023/07/26/2023-ai-and-jobs-methodology-for-onet-analysis/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--foreground)]"
                    >
                      Pew Research Center methodology
                    </a>{" "}
                    for mapping O*NET activities to AI exposure informed our category design.
                  </p>
                </div>
              </div>
            </div>

            {/* Layer 2: BLS wages + employment */}
            <div className="rounded-lg border border-black/[0.06] p-4">
              <div className="flex items-start gap-3">
                <span className="text-[var(--foreground)] font-bold text-[14px] shrink-0 w-6 h-6 rounded-full bg-black/[0.04] flex items-center justify-center">2</span>
                <div>
                  <p className="font-semibold text-[var(--foreground)] mb-1">
                    BLS employment and wages — the human cost baseline
                  </p>
                  <p className="text-[var(--muted)] mb-2">
                    The Bureau of Labor Statistics&apos;{" "}
                    <a
                      href="https://www.bls.gov/oes/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--foreground)]"
                    >
                      Occupational Employment and Wage Statistics (OEWS)
                    </a>{" "}
                    (May 2024 release) provides median hourly wages and employment counts for all 22 SOC
                    major occupation groups — covering 154 million workers. This is the human labor cost that
                    AI compute must undercut to create economic incentive for automation.
                  </p>
                  <p className="text-[var(--muted)]">
                    Gender composition comes from the{" "}
                    <a
                      href="https://www.bls.gov/cps/cpsaat11.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--foreground)]"
                    >
                      Current Population Survey (CPS) 2024 annual averages
                    </a>{" "}
                    (Table 11), which reports employed persons by detailed occupation and sex.
                  </p>
                </div>
              </div>
            </div>

            {/* Layer 3: AI exposure validation */}
            <div className="rounded-lg border border-black/[0.06] p-4">
              <div className="flex items-start gap-3">
                <span className="text-[var(--foreground)] font-bold text-[14px] shrink-0 w-6 h-6 rounded-full bg-black/[0.04] flex items-center justify-center">3</span>
                <div>
                  <p className="font-semibold text-[var(--foreground)] mb-1">
                    AI exposure scores — external validation
                  </p>
                  <p className="text-[var(--muted)] mb-2">
                    Our task decomposition produces an internal model of which jobs are most automatable. To
                    check whether the model is directionally correct, we compare it against independent
                    exposure research:
                  </p>
                  <ul className="text-[var(--muted)] space-y-1 ml-4 list-disc list-outside">
                    <li>
                      <a
                        href="https://budgetlab.yale.edu/research/labor-market-ai-exposure-what-do-we-know"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[var(--foreground)]"
                      >
                        Yale Budget Lab (Gimbel et al., 2026)
                      </a>{" "}
                      — Meta-analysis comparing 6 independent AI exposure metrics (Eloundou et al., Eisfeldt et al.,
                      Felten et al., Tomlinson et al.) across 778 occupations using PCA-weighted z-scores. This is the
                      source of the &ldquo;Certainty&rdquo; indicator in the economy view.
                    </li>
                    <li>
                      <a
                        href="https://github.com/rmmomin/jobs-ai-exposure"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[var(--foreground)]"
                      >
                        Yale Budget Lab data repository
                      </a>{" "}
                      — GPT-scored AI exposure (0-10 scale) for 342 BLS Occupational Outlook Handbook occupations
                      across three dimensions: direct automation, indirect productivity, and digital work emphasis.
                      Validated at Pearson 0.878 against the Yale PCA composite and 0.885 against OpenAI/UPenn&apos;s
                      GPTs-are-GPTs (Eloundou et al.). This is the source of the &ldquo;Exposure&rdquo; scores in the economy view.
                    </li>
                    <li>
                      <a
                        href="https://arxiv.org/abs/2303.10130"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[var(--foreground)]"
                      >
                        Eloundou et al. (2024) — GPTs are GPTs
                      </a>{" "}
                      — The foundational exposure study: human and GPT-4 annotators assessed which O*NET tasks
                      LLMs could speed up, finding ~80% of workers have at least 10% of tasks affected.
                    </li>
                  </ul>
                  <p className="text-[var(--muted)] mt-2">
                    The key finding from this validation: all metrics agree on which jobs have <em>low</em> exposure
                    (construction, maintenance, farming) but disagree on the <em>magnitude</em> of exposure for highly
                    exposed jobs (tech, legal, office/admin). We surface this disagreement as the certainty indicator
                    so readers know where the evidence is strong and where it is contested.
                  </p>
                </div>
              </div>
            </div>

            {/* Layer 4: Industry adoption speed */}
            <div className="rounded-lg border border-black/[0.06] p-4">
              <div className="flex items-start gap-3">
                <span className="text-[var(--foreground)] font-bold text-[14px] shrink-0 w-6 h-6 rounded-full bg-black/[0.04] flex items-center justify-center">4</span>
                <div>
                  <p className="font-semibold text-[var(--foreground)] mb-1">
                    Industry adoption speed — how fast sectors actually move
                  </p>
                  <p className="text-[var(--muted)] mb-2">
                    Even when AI is cheaper than human labor for a task, industries adopt at very different speeds.
                    We model this as a multiplier on the adoption lag, based on a five-factor composite:
                  </p>
                  <ul className="text-[var(--muted)] space-y-0.5 ml-4 list-disc list-outside">
                    <li><strong className="text-[var(--foreground)]">Regulatory burden</strong> (25%) — OECD Product Market Regulation data</li>
                    <li><strong className="text-[var(--foreground)]">Digital maturity</strong> (25%) — IT workforce share by industry (BLS), McKinsey Digital America</li>
                    <li><strong className="text-[var(--foreground)]">Competitive pressure</strong> (20%) — Industry concentration; Autor et al. (2020)</li>
                    <li><strong className="text-[var(--foreground)]">Labor rigidity</strong> (15%) — Union density by industry (BLS); Acemoglu &amp; Restrepo (2020)</li>
                    <li><strong className="text-[var(--foreground)]">Organizational complexity</strong> (15%) — Firm size distributions; Brynjolfsson et al. (2021)</li>
                  </ul>
                  <p className="text-[var(--muted)] mt-2">
                    Technology adopts fastest (0.6x lag) and Healthcare slowest (1.6x lag).
                    Combined with per-task adoption lags (1.5-4.5 years), informed by Griliches (1957), Comin &amp;
                    Hobijn (2010), and Rogers (2003), this produces realistic deployment timelines rather than
                    theoretical cost-crossover dates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observed adoption overlay */}
        <div className="rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/[0.04] p-5">
          <h4 className="text-[13px] font-bold text-[#6366F1] uppercase tracking-wide mb-2">
            Ground truth: observed AI adoption
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-2">
            The model above projects <em>when</em> AI becomes economically viable for each task. But we
            can now cross-reference those projections against <em>actual</em> usage data. The{" "}
            <a
              href="https://www.anthropicindex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              Anthropic Economic Index
            </a>{" "}
            (March 2026) analyzed millions of real AI conversations and found:
          </p>
          <ul className="text-[13px] text-[var(--muted)] space-y-1 ml-4 list-disc list-outside mb-3">
            <li>
              <strong className="text-[var(--foreground)]">49% of occupations</strong> already have 25%+
              of their tasks being performed using Claude &mdash; suggesting the cost-crossover point has
              already been reached for a significant share of knowledge work.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Task value is broadening:</strong> the average
              hourly wage of tasks performed on Claude declined from $49.30/hr to $47.90/hr over the study
              period, as adoption spread from high-wage early adopters to a wider range of work.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Model selection tracks complexity:</strong> users
              choose more capable (and expensive) models for higher-wage tasks, consistent with our model tier
              mapping in Step 2.
            </li>
          </ul>
          <p className="text-[12px] text-[var(--muted)]">
            This data is from a single provider and reflects usage patterns, not full automation. But it is
            the first large-scale empirical check on theoretical exposure models &mdash; and it broadly
            confirms the task-level ordering predicted by O*NET-based analysis.
          </p>
        </div>

        {/* Token economics model */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            Step 2: Token economics — from API pricing to $/hour
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
            For each task, we calculate what it costs in real AI API spend to produce one hour of
            equivalent human work. The formula:
          </p>
          <div className="bg-black/[0.02] rounded-lg p-3 font-mono text-[12px] text-[var(--foreground)] mb-4">
            Cost/hr = Calls × (InputTokens/1M × InputPrice + OutputTokens/1M × OutputPrice) × CallOverhead × DeploymentOverhead
          </div>
          <div className="space-y-3 text-[12px]">
            <div className="flex gap-3 rounded-lg border border-black/[0.06] p-3">
              <span className="text-[var(--foreground)] font-semibold shrink-0 w-[120px]">
                1. Model tier
              </span>
              <span className="text-[var(--muted)]">
                Each task maps to a model tier based on cognitive complexity.{" "}
                <strong className="text-[var(--foreground)]">Small models</strong> ($0.10-0.20/M tokens)
                handle classification and data extraction.{" "}
                <strong className="text-[var(--foreground)]">Mid-tier</strong> ($0.50-1.50/M) handles
                writing, chat, drafting.{" "}
                <strong className="text-[var(--foreground)]">Frontier</strong> ($5-15/M) handles reasoning,
                analysis, expert judgment. Based on current API pricing from OpenAI, Anthropic, Google.
              </span>
            </div>
            <div className="flex gap-3 rounded-lg border border-black/[0.06] p-3">
              <span className="text-[var(--foreground)] font-semibold shrink-0 w-[120px]">
                2. Token volume
              </span>
              <span className="text-[var(--muted)]">
                We estimate input and output tokens per model call based on real-world AI usage:
                an email draft uses ~800 input / ~600 output tokens; a legal analysis uses ~20K input / ~5K output.
                The <strong className="text-[var(--foreground)]">calls per human hour</strong> reflects
                how many independent AI invocations are needed to match what a human does in an hour:
                simple classification might need 60 calls/hr, while deep research needs 4-8.
              </span>
            </div>
            <div className="flex gap-3 rounded-lg border border-black/[0.06] p-3">
              <span className="text-[var(--foreground)] font-semibold shrink-0 w-[120px]">
                3. Overhead multiplier
              </span>
              <span className="text-[var(--muted)]">
                Real systems cost more than single API calls. <strong className="text-[var(--foreground)]">Call overhead</strong> (2-6x):
                prompt retries (1.2-1.5x), multi-step agents (2-5x), RAG/tool calls (1.2-3x).{" "}
                <strong className="text-[var(--foreground)]">Deployment overhead</strong> (5x):
                integration engineering, error handling, validation pipelines, human-in-the-loop review,
                monitoring, and organizational adoption costs. This 5x deployment multiplier is based on
                production data from Sequoia Capital (2025) showing real-world AI system costs at 3-8x raw inference.
              </span>
            </div>
          </div>
          <div className="mt-4 text-[12px] text-[var(--muted)]">
            <p className="mb-2">
              <strong className="text-[var(--foreground)]">The key economic insight:</strong>{" "}
              AI cost scales with tokens (volume), while human cost scales with time. A $60/hr analyst
              doing 3 hours of research costs $180. The equivalent AI task — 120K input tokens, 8K output,
              12 frontier calls with 3x overhead — costs roughly $18. AI is already 10x cheaper for many
              knowledge tasks.
            </p>
            <p>
              This compute floor — the raw token cost to replicate one hour of human work — is the
              most important number in AI labor economics. It represents the minimum a firm must invest
              before any organizational change, any integration engineering, any validation pipeline.
              It is falling 30-45% per year across task types, and unlike human wages, it has no floor.
              Understanding this number is the starting point for any serious analysis of where AI
              will reshape work: not because cheap compute guarantees adoption, but because it sets
              the boundary on what is economically possible.
            </p>
          </div>
        </div>

        {/* Cost decline rates */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            Step 3: How fast costs are falling
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
            Each task category has an annual cost decline rate. These are derived from observed data:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left py-2 pr-4 text-[var(--foreground)] font-semibold">Task type</th>
                  <th className="text-left py-2 pr-4 text-[var(--foreground)] font-semibold">Annual decline</th>
                  <th className="text-left py-2 text-[var(--foreground)] font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4">Information processing</td>
                  <td className="py-2 pr-4">42-48%</td>
                  <td className="py-2">
                    Commodity LLM pricing (GPT-3.5 level fell 280x in 18 months — Stanford HAI 2025)
                  </td>
                </tr>
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4">Communication & writing</td>
                  <td className="py-2 pr-4">38-45%</td>
                  <td className="py-2">
                    Writing/summarization quality at GPT-4 level dropped from $20 to ~$0.40/M tokens in 3 years (a16z)
                  </td>
                </tr>
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4">Analysis & reasoning</td>
                  <td className="py-2 pr-4">28-38%</td>
                  <td className="py-2">
                    Frontier reasoning models still expensive, but efficiency gains of 2x/yr (Epoch AI)
                  </td>
                </tr>
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4">Creative & generative</td>
                  <td className="py-2 pr-4">30-42%</td>
                  <td className="py-2">
                    Image/video generation falling fast; taste and direction remain human-priced
                  </td>
                </tr>
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4">Interpersonal</td>
                  <td className="py-2 pr-4">15-25%</td>
                  <td className="py-2">
                    AI conversation quality improving, but trust and physical presence are not compute-bound
                  </td>
                </tr>
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4">Physical & manual</td>
                  <td className="py-2 pr-4">8-15%</td>
                  <td className="py-2">
                    Robotics cost tied to hardware, not inference. Improvement tracks manufacturing cost curves, not Moore&apos;s Law
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Coordination & management</td>
                  <td className="py-2 pr-4">18-30%</td>
                  <td className="py-2">
                    Scheduling/tracking commoditized; leadership and judgment declining slowly
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* The crossover calculation */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            Step 4: The crossover calculation
          </h4>
          <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-2">
            <p>
              For each task, we calculate the <strong className="text-[var(--foreground)]">crossover year</strong>:
              the year when the compute cost for AI to perform that task drops below the human labor cost for
              those hours. The formula:
            </p>
            <div className="bg-black/[0.02] rounded-lg p-3 font-mono text-[12px]">
              crossover when: computeCost x (1 - annualDeclineRate)^years &lt; humanWage x taskTimeShare
            </div>
            <p>
              This is the economic inflection point. Before crossover, there&apos;s no cost incentive to
              deploy AI (even if AI <em>can</em> do the task). After crossover, the economic case
              exists — but adoption is a separate question entirely. Firms must redesign processes,
              retrain staff, navigate regulation, and build organizational trust. Historical technology
              diffusion research (Griliches 1957, Comin &amp; Hobijn 2010) suggests this institutional
              drag adds 1.5-4.5 years beyond economic viability, varying significantly by industry
              and task type. Exposure is not automation.
            </p>
          </div>
        </div>

        {/* Exposure scores & measurement uncertainty */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            Reading the certainty indicators
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
            The economy view displays a &ldquo;Certainty&rdquo; badge for each occupation group, derived from
            the Yale Budget Lab&apos;s cross-metric variance analysis. This tells you how much independent
            researchers agree about each group&apos;s exposure:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left py-2 pr-4 text-[var(--foreground)] font-semibold">Certainty</th>
                  <th className="text-left py-2 pr-4 text-[var(--foreground)] font-semibold">Variance</th>
                  <th className="text-left py-2 text-[var(--foreground)] font-semibold">Interpretation</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4"><span style={{ color: "#10B981" }}>Low uncertainty</span></td>
                  <td className="py-2 pr-4">&lt; 0.3</td>
                  <td className="py-2">Metrics agree. Automation projections for these groups are well-calibrated.</td>
                </tr>
                <tr className="border-b border-black/[0.04]">
                  <td className="py-2 pr-4"><span style={{ color: "#F59E0B" }}>Moderate uncertainty</span></td>
                  <td className="py-2 pr-4">0.3 - 0.5</td>
                  <td className="py-2">Metrics partially agree. True exposure may be higher or lower than shown.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><span style={{ color: "#EF4444" }}>High uncertainty</span></td>
                  <td className="py-2 pr-4">&gt; 0.5</td>
                  <td className="py-2">Metrics disagree. Automation projections should be interpreted with caution.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-[var(--muted)] mt-3">
            The regression coefficient (beta = 0.0617, p &lt; 0.0001) indicates that disagreement increases
            moderately but consistently with exposure. This means our cost-crossover projections for the
            most-exposed groups (Computer &amp; Math, Legal, Office &amp; Admin) carry inherently more
            measurement uncertainty than projections for less-exposed groups (Construction, Farming,
            Building &amp; Grounds).
          </p>
        </div>

        {/* Adaptive Capacity Index */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            Adaptive capacity: who can transition?
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">
            Economic exposure tells you which tasks are vulnerable. Adaptive capacity tells you which
            <em> workers</em> can navigate the transition. We integrate the Manning &amp; Aguirre (NBER, 2026)
            adaptive capacity index, which measures four dimensions of an occupation&apos;s resilience:
          </p>
          <div className="space-y-2 text-[12px] mb-4">
            <div className="flex gap-3 rounded-lg border border-black/[0.06] p-3">
              <span className="text-[var(--foreground)] font-semibold shrink-0 w-[140px]">Net liquid wealth</span>
              <span className="text-[var(--muted)]">
                Occupation-level median from SIPP 2022-2024 (log-transformed). Measures financial runway
                to weather job transitions without immediate distress.
              </span>
            </div>
            <div className="flex gap-3 rounded-lg border border-black/[0.06] p-3">
              <span className="text-[var(--foreground)] font-semibold shrink-0 w-[140px]">Skill transferability</span>
              <span className="text-[var(--muted)]">
                Growth-weighted cosine similarity of O*NET Skills and Work Activities across occupations,
                weighted by BLS 2024-2034 employment projections. Higher = your skills work in more growing fields.
              </span>
            </div>
            <div className="flex gap-3 rounded-lg border border-black/[0.06] p-3">
              <span className="text-[var(--foreground)] font-semibold shrink-0 w-[140px]">Geographic density</span>
              <span className="text-[var(--muted)]">
                Lightcast employment-weighted average log CBSA density. Urban workers have more alternative
                employers within commuting distance.
              </span>
            </div>
            <div className="flex gap-3 rounded-lg border border-black/[0.06] p-3">
              <span className="text-[var(--foreground)] font-semibold shrink-0 w-[140px]">Age (fraction 55+)</span>
              <span className="text-[var(--muted)]">
                From ACS data. Inverted: occupations with fewer older workers score higher, reflecting
                longer remaining career horizon and typically greater willingness to retrain.
              </span>
            </div>
          </div>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-2">
            The key finding: AI exposure and adaptive capacity are <strong className="text-[var(--foreground)]">positively
            correlated</strong> (r = 0.502, bootstrap 95% CI: [0.353, 0.624]). Most highly-exposed workers —
            professionals, managers, technologists — have strong savings, transferable skills, and urban job access.
            The 6.1 million workers who combine high exposure with low adaptability are concentrated in clerical
            and administrative support roles.
          </p>
          <p className="text-[12px] text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Key limitation:</strong> The index measures occupation-level
            characteristics, not individual workers. Within any occupation, there is substantial heterogeneity in
            savings, skills, and geography. The index uses equal component weighting for transparency, though
            components may contribute unequally to actual adaptability.
          </p>
        </div>

        {/* What this doesn't capture */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            What this model does not capture
          </h4>
          <ul className="text-[12px] text-[var(--muted)] space-y-1.5 list-disc list-outside ml-4">
            <li>
              <strong className="text-[var(--foreground)]">Task bundling (O-ring effects)</strong> —
              In practice, tasks within a job are interconnected. Automating 6 of 7 tasks doesn&apos;t mean
              automating 85% of the job; the remaining task may become more valuable because it&apos;s the
              bottleneck.{" "}
              <a
                href="https://www.nber.org/papers/w34639"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--foreground)]"
              >
                Gans &amp; Goldfarb (2026)
              </a>{" "}
              formalize this: linear exposure indices overstate displacement when tasks are complements.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Quality differences</strong> —
              AI cost parity doesn&apos;t mean quality parity. Many tasks have a quality premium for human
              execution that justifies higher cost.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Regulatory and trust barriers</strong> —
              Healthcare, legal, and financial services face regulatory requirements that slow adoption
              independent of cost.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">New task creation</strong> —
              As AI automates existing tasks, new categories of work emerge. Historically, technology
              has created more jobs than it has destroyed (though the transition period can be painful).
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Induced demand</strong> —
              Cheaper AI makes more work economically viable. If legal analysis costs 90% less, society
              may demand 10x more of it — potentially increasing total employment in that domain.
            </li>
          </ul>
        </div>

        {/* Sources */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">Sources</h4>
          <ul className="text-[11px] text-[var(--muted)] space-y-1">
            <li>
              <a href="https://www.onetonline.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                O*NET OnLine — Occupational Information Network (U.S. Department of Labor)
              </a>
            </li>
            <li>
              <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Bureau of Labor Statistics — Occupational Employment and Wage Statistics, May 2024
              </a>
            </li>
            <li>
              <a href="https://www.bls.gov/cps/cpsaat11.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Bureau of Labor Statistics — Current Population Survey 2024 (Table 11, gender by occupation)
              </a>
            </li>
            <li>
              <a href="https://budgetlab.yale.edu/research/labor-market-ai-exposure-what-do-we-know" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Yale Budget Lab (Gimbel et al., 2026): &quot;Labor Market AI Exposure: What Do We Know?&quot; — 6 exposure metrics across 778 occupations
              </a>
            </li>
            <li>
              <a href="https://github.com/rmmomin/jobs-ai-exposure" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Yale Budget Lab data repository — GPT-scored exposure for 342 BLS occupations (0-10 scale)
              </a>
            </li>
            <li>
              <a href="https://arxiv.org/abs/2303.10130" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Eloundou et al. (2024): &quot;GPTs are GPTs&quot; — foundational AI task exposure study (OpenAI/UPenn)
              </a>
            </li>
            <li>
              <a href="https://github.com/CharlesD353/ai-labour-calculator" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Dillon (2025): &quot;AI Labour Calculator&quot; — task tier compute requirements, S-curve substitutability model
              </a>
            </li>
            <li>
              <a href="https://epoch.ai/blog/trends-in-the-dollar-training-cost-of-machine-learning-systems" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Epoch AI: Trends in the Cost of Computing — algorithmic efficiency doubling ~annually
              </a>
            </li>
            <li>
              <a href="https://aiindex.stanford.edu/report/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Stanford HAI: AI Index Report 2025 — inference cost declining ~280x in 18 months for equivalent capability
              </a>
            </li>
            <li>
              <a href="https://a16z.com/llmflation-llm-inference-cost/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                a16z &quot;LLMflation&quot; — 1,000x cost decline for equivalent MMLU performance in 3 years
              </a>
            </li>
            <li>
              <a href="https://www.pewresearch.org/social-trends/2023/07/26/2023-ai-and-jobs-methodology-for-onet-analysis/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Pew Research Center — methodology for mapping O*NET activities to AI exposure
              </a>
            </li>
            <li>
              <a href="https://arxiv.org/html/2510.13369v1" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Moravec&apos;s Paradox Applied to Labor Markets — why physical tasks are harder to automate than cognitive ones
              </a>
            </li>
            <li>
              <a href="https://www.anthropicindex.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Anthropic Economic Index: Learning Curves (March 2026) — observed AI usage across occupations, task value trends, learning curve data
              </a>
            </li>
            <li>
              <a href="https://www.nber.org/papers/w34705" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Manning &amp; Aguirre (2026): &quot;How Adaptable Are American Workers to AI-Induced Job Displacement?&quot; — adaptive capacity index for 356 occupations (NBER w34705)
              </a>
            </li>
            <li>
              <a href="https://www.nber.org/papers/w33886" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Gans &amp; Goldfarb (2024): &quot;O-Ring Automation&quot; — multiplicative task structure and firm incentive to fully automate low-dimensional jobs
              </a>
            </li>
            <li>
              <a href="https://aleximas.substack.com/p/how-will-ai-driven-automation-actually" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Imas &amp; Shukla (2026): &quot;Ghosts of Electricity&quot; — practical implications of O-Ring automation for trucking, warehousing, and knowledge work
              </a>
            </li>
          </ul>
        </div>

        {/* O-Ring framework caveat */}
        <div className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/[0.04] p-5">
          <h4 className="text-[13px] font-bold text-[#D97706] uppercase tracking-wide mb-2">
            Important Modeling Caveat
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed">
            This tool evaluates each task independently — when task A crosses cost parity, it has no
            effect on task B. In reality, most jobs have complementary tasks where the{" "}
            <a href="https://www.nber.org/papers/w33886" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
              O-Ring production function
            </a>{" "}
            applies: automating some tasks lets workers concentrate on remaining ones, multiplying
            quality across the whole job. The <strong className="text-[var(--foreground)]">dimensionality score</strong> and{" "}
            <strong className="text-[var(--foreground)]">phase transition warning</strong> above are corrections
            for this — they flag when a job&apos;s structure makes the additive model misleading. But the
            underlying cost-crossover calculation remains separable. A fully multiplicative model is a
            direction for future work.
          </p>
        </div>
      </div>
    </div>
  );
}

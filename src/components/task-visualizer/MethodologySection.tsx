"use client";

export default function MethodologySection() {
  return (
    <div className="mt-12 pt-8 border-t border-black/[0.06]">
      <h3 className="text-[18px] font-bold text-[var(--foreground)] tracking-tight mb-4">
        Methodology: How we link tasks to compute costs
      </h3>

      <div className="space-y-6 max-w-3xl">
        {/* Core framework */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            The core idea
          </h4>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed">
            Every job is a bundle of tasks. We decompose each job into 5-8 task components using the{" "}
            <a
              href="https://www.onetonline.org/find/descriptor/browse/4.A/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              O*NET Generalized Work Activities
            </a>{" "}
            taxonomy, which categorizes all work into four domains: Information Input (observing, gathering),
            Mental Processes (analyzing, deciding), Work Output (physical activity), and Interacting
            with Others (communicating, leading).
          </p>
        </div>

        {/* Token economics model */}
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--foreground)] mb-2">
            Token economics: from API pricing to $/hour
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
            How fast costs are falling
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
            The crossover calculation
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
              bottleneck.
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
              <a href="https://github.com/CharlesD353/ai-labour-calculator" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Dillon (2025): &quot;AI Labour Calculator&quot; — task tier compute requirements, S-curve substitutability model
              </a>
            </li>
            <li>
              <a href="https://epochai.org/trends-in-the-cost-of-computing" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
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
              <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
                Bureau of Labor Statistics — Occupational Employment and Wage Statistics (median hourly wages)
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
          </ul>
        </div>
      </div>
    </div>
  );
}

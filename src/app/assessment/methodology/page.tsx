"use client";

import { useState } from "react";
import Link from "next/link";

function Expandable({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-semibold text-gray-700">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-4 text-base text-gray-500 leading-relaxed border-t border-gray-50">{children}</div>}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-black text-accent">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function SectionNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold mr-3 flex-shrink-0">
      {n}
    </span>
  );
}

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16">
      {/* Header */}
      <div className="mb-12">
        <Link href="/assessment" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          &larr; Back to AI Action Plan
        </Link>
        <h1 className="mt-4 text-heading-2xl sm:text-title font-extrabold tracking-tight text-gray-900 leading-tight">
          How Your AI Action Plan<br />Gets Built
        </h1>
        <p className="mt-4 text-xl text-gray-500 leading-relaxed max-w-2xl">
          This isn&apos;t a chatbot summarizing your intake form. Your report is built on a structured
          knowledge base of occupational data, verified tool intelligence, peer-reviewed research, and
          a multi-step AI analysis pipeline designed to produce specific, actionable recommendations.
        </p>
        <p className="mt-3 text-md text-gray-400">
          Here&apos;s exactly what&apos;s behind the curtain.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-12">
        <Stat value="481" label="Verified research sources" />
        <Stat value="64" label="Evaluated AI tools" />
        <Stat value="62" label="Human capabilities scored" />
        <Stat value="17" label="Industry templates" />
      </div>

      {/* ─── Section 1: Research Foundation ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={1} />
          Research Foundation
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Every assessment is grounded in a curated database of 481 verified sources spanning peer-reviewed
          research, government statistics, and institutional analysis. This is the same research base
          that powers <a href="/" className="text-accent hover:underline">jobsdata.ai</a>,
          a public dashboard tracking AI&apos;s impact on jobs, wages, and adoption across 16 prediction
          categories.
        </p>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          The core finding driving this product comes from a 2026 field experiment by Kim, Kim &amp; Koning
          (INSEAD &amp; Harvard Business School) involving 515 firms. The study found that companies who
          received help identifying <em>where</em> AI fit into their operations saw 1.9x more revenue,
          discovered 44% more AI use cases, and needed roughly 40% less capital to grow &mdash; compared
          to companies with identical tools and training but no task-level mapping.
        </p>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          That task-level mapping is exactly what your AI Action Plan provides.
        </p>

        <Expandable title="How we evaluate sources (Evidence Tier System)">
          <div className="pt-3 space-y-3">
            <p>
              Every source is classified into one of four evidence tiers before it enters our database.
              Your assessment only cites Tier 1 and Tier 2 sources.
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="py-2 font-semibold text-gray-700">Tier</th>
                  <th className="py-2 font-semibold text-gray-700">Description</th>
                  <th className="py-2 font-semibold text-gray-700">Examples</th>
                </tr>
              </thead>
              <tbody className="text-gray-500">
                <tr className="border-b border-gray-50">
                  <td className="py-2 font-medium text-gray-700">1</td>
                  <td className="py-2">Peer-reviewed research, government statistics, RCTs</td>
                  <td className="py-2">AER, NBER, BLS, Census, Science, Nature</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-2 font-medium text-gray-700">2</td>
                  <td className="py-2">Think tanks, international organizations, industry research</td>
                  <td className="py-2">Brookings, McKinsey, OECD, IMF, Gartner</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-2 font-medium text-gray-700">3</td>
                  <td className="py-2">Major journalism and expert commentary</td>
                  <td className="py-2">NYT, WSJ, FT, Reuters, MIT Tech Review</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-700">4</td>
                  <td className="py-2">Social media, blogs, podcasts</td>
                  <td className="py-2">Not used in assessment reports</td>
                </tr>
              </tbody>
            </table>
            <p>
              For each assessment, the top 8 most relevant citations are selected based on your
              industry, filtered to Tier 1&ndash;2 only, sorted by evidence quality and recency.
              Every statistic in your report traces back to a real, verifiable publication.
            </p>
          </div>
        </Expandable>
      </section>

      {/* ─── Section 2: O*NET & BLS Data ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={2} />
          O*NET Occupational Task Data
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Your task analysis isn&apos;t generated from scratch. It starts with structured occupational data
          from the U.S. Department of Labor&apos;s <a href="https://www.onetonline.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">O*NET database</a> &mdash;
          the most comprehensive public taxonomy of work activities in the United States.
        </p>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          We&apos;ve mapped 30 O*NET work activities across 10 categories to specific AI opportunity profiles.
          Each mapping includes an AI potential score (high, medium, low), a concrete AI approach,
          the human judgment that remains essential, which industries it applies to, and estimated
          time savings.
        </p>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          When you take the assessment, your industry and stated functions are matched against
          these mappings. The result is an evidence-backed starting point for your task analysis &mdash;
          not a hallucinated list of generic suggestions.
        </p>

        <Expandable title="O*NET categories covered">
          <div className="pt-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {[
                "Information & Data Input",
                "Mental Processes & Decision Making",
                "Communication & Coordination",
                "Administrative & Documentation",
                "Customer Service & Relations",
                "Creative & Content Production",
                "Management & Planning",
                "Compliance & Legal",
                "Research & Analysis",
                "Inventory & Operations",
              ].map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                  {cat}
                </div>
              ))}
            </div>
            <p className="mt-3 text-gray-500">
              Each task mapping includes AI potential classification, specific AI approaches,
              why the human element remains essential, applicable industries, and quantified
              time-savings estimates (typically 1&ndash;10 hours/week per task).
            </p>
          </div>
        </Expandable>
      </section>

      {/* ─── Section 3: 4-Step Pipeline ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={3} />
          The 4-Step Analysis Pipeline
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Your report isn&apos;t generated in a single AI call. It&apos;s built through a four-step sequential pipeline
          where each step builds on the outputs of the previous one. This produces more coherent, internally
          consistent reports than a single-pass approach.
        </p>

        <div className="space-y-3 mb-4">
          {[
            {
              step: "Step 1: Organization Profile",
              desc: "Analyzes your industry, size, AI maturity, and any uploaded documents to produce an executive summary, AI readiness score with rationale, and quick-win opportunities.",
            },
            {
              step: "Step 2: Task Analysis",
              desc: "Cross-references your stated functions against O*NET task data and industry templates to identify specific tasks where AI can help most. Each task gets an AI opportunity score, complexity rating, and concrete approach.",
            },
            {
              step: "Step 3: Tools & Roadmap",
              desc: "Matches your tasks to our verified tool knowledge base of 64 products. Generates a tiered recommendation system (Start Here, Add Next, Consider Later), a 3-phase implementation roadmap, and ROI projections.",
            },
            {
              step: "Step 4: Risk Assessment",
              desc: "Evaluates displacement risk, skill gaps, change management considerations, and data privacy implications specific to your industry and AI maturity level.",
            },
          ].map((s) => (
            <div key={s.step} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <div className="text-base font-semibold text-gray-900 mb-1">{s.step}</div>
              <div className="text-base text-gray-500">{s.desc}</div>
            </div>
          ))}
        </div>

        <Expandable title="What gets injected into each step">
          <div className="pt-3 space-y-2">
            <p>Each pipeline step receives structured context from six knowledge sources:</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li><strong>Your intake data</strong> &mdash; organization, functions, roles, tools, challenges, goals</li>
              <li><strong>O*NET task mappings</strong> &mdash; filtered to your industry and functions</li>
              <li><strong>Tool knowledge base</strong> &mdash; 64 tools filtered by industry and company size</li>
              <li><strong>Research context</strong> &mdash; latest Tier 1&ndash;2 data points for your industry</li>
              <li><strong>Evidence citations</strong> &mdash; top 8 verifiable sources for your sector</li>
              <li><strong>Human capabilities</strong> &mdash; skills scored for AI-era appreciation</li>
              <li><strong>Industry templates</strong> &mdash; departments, challenges, and opportunity areas for your field</li>
            </ul>
            <p className="mt-2">
              This means the AI isn&apos;t generating from its general training data alone. It&apos;s working
              with curated, verified, industry-specific inputs that constrain and improve its output.
            </p>
          </div>
        </Expandable>

        <Expandable title="Proportionality controls">
          <div className="pt-3 space-y-2">
            <p>
              We enforce a proportionality rule across the pipeline: the distribution of recommendations
              must match the distribution of your intake signals. If you mentioned grant writing once
              out of eight functions, grant writing won&apos;t become the focus of multiple tasks and tools.
              This prevents the common AI failure mode of latching onto one detail and over-amplifying it.
            </p>
          </div>
        </Expandable>
      </section>

      {/* ─── Section 4: Report Structure ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={4} />
          What Your Report Contains
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Your AI Action Plan is a structured document &mdash; available as both an interactive web report
          and a downloadable PDF &mdash; containing nine sections:
        </p>

        <div className="space-y-2">
          {[
            { title: "At a Glance", desc: "One-page executive summary with AI readiness score, top 3 actions, projected impact, and the first tool to try." },
            { title: "AI Opportunity Summary", desc: "Executive narrative covering your organization's AI readiness, industry context, strengths, and opportunities." },
            { title: "Task-by-Task Analysis", desc: "Every key task scored for AI opportunity (high/medium/low), with current process, AI approach, complexity, and expected impact." },
            { title: "Tool Recommendations", desc: "Specific products organized in three tiers: Start Here (free/cheap, immediate value), Add Next (compounds gains), Consider Later (higher investment, higher payoff)." },
            { title: "Implementation Roadmap", desc: "3-phase plan (0\u20133 months, 3\u20136 months, 6\u201312+ months) with objectives, actions, owners, and estimated investment." },
            { title: "Risk Assessment", desc: "Displacement risk, skill gaps, change management notes, and data privacy considerations specific to your sector." },
            { title: "Projected Time & Cost Savings", desc: "ROI projections with current cost, projected savings, time-to-value, confidence level, and calculation basis." },
            { title: "Next Steps", desc: "Concrete actions to take after reading the report." },
            { title: "Your Inputs", desc: "Reference section showing what you told us, so you can verify the report is grounded in your actual situation." },
          ].map((s) => (
            <div key={s.title} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
              <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div>
                <span className="text-base font-semibold text-gray-900">{s.title}</span>
                <span className="text-base text-gray-500"> &mdash; {s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 5: ROI Methodology ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={5} />
          ROI Projection Methodology
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Every ROI projection includes a confidence rating (high, moderate, low) and a plain-language
          explanation of how the estimate was calculated. We deliberately err on the side of conservative
          estimates &mdash; if the research says 20&ndash;40% time savings, we&apos;ll cite the lower end.
        </p>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Projections are built from three inputs: your stated time allocation (from intake), research-backed
          productivity benchmarks (from our 481-source database), and tool-specific capabilities (from our
          verified tool knowledge base). For nonprofits and mission-driven organizations, we frame savings as
          capacity recovered &mdash; hours per week freed for mission work &mdash; rather than purely
          dollar-denominated returns.
        </p>

        <Expandable title="Research backing for productivity estimates">
          <div className="pt-3 space-y-2">
            <p>Our productivity benchmarks draw from multiple peer-reviewed and institutional sources, including:</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Brynjolfsson, Li, &amp; Raymond (2023): 14% productivity increase for customer support agents using AI</li>
              <li>Noy &amp; Zhang (2023): 37% faster completion for professional writing tasks</li>
              <li>Dell&apos;Acqua et al. (2023, Harvard/BCG): 12.2% more tasks completed, 25.1% faster, 40% higher quality for consulting tasks within AI&apos;s frontier</li>
              <li>Kim, Kim &amp; Koning (2026): 1.9x revenue for firms with AI task mapping; 12% productivity lift</li>
              <li>OECD (2025): AI adoption rates and SME productivity impacts across G7</li>
            </ul>
            <p className="mt-2">
              We use the conservative end of published ranges and clearly label the basis for each projection
              so you can evaluate the assumptions yourself.
            </p>
          </div>
        </Expandable>
      </section>

      {/* ─── Section 6: Risk Framework ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={6} />
          Risk Assessment Framework
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          The risk section evaluates five dimensions, calibrated to your industry, organization size, and
          AI maturity level:
        </p>

        <div className="space-y-2 mb-4">
          {[
            { dim: "Displacement Risk", desc: "How AI adoption might change roles on your team. Framed as evolution, not elimination \u2014 which tasks shift, which grow, which are new." },
            { dim: "Skill Gaps", desc: "Specific capabilities your team needs to develop to use AI tools effectively. Drawn from our 62-capability framework." },
            { dim: "Change Management", desc: "Organizational readiness factors: staff anxiety, leadership buy-in, training needs, rollout sequencing." },
            { dim: "Data Privacy", desc: "Industry-specific considerations for what data can and cannot be shared with AI tools. For nonprofits: beneficiary data, donor obligations, GDPR for international programs." },
            { dim: "Common Pitfalls", desc: "The mistakes organizations at your maturity level typically make \u2014 and how to avoid them." },
          ].map((d) => (
            <div key={d.dim} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <div className="text-base font-semibold text-gray-900 mb-1">{d.dim}</div>
              <div className="text-base text-gray-500">{d.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-md text-gray-500 leading-relaxed">
          Risk assessments are industry-aware. A nonprofit gets guidance on board governance, funder perception,
          and beneficiary trust. A law firm gets guidance on privilege, confidentiality, and regulatory compliance.
          A restaurant gets guidance on staff communication and customer data handling.
        </p>
      </section>

      {/* ─── Section 7: Tool Knowledge Base ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={7} />
          Verified Tool Knowledge Base
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Tool recommendations come from a curated knowledge base of 64 AI and automation products,
          each independently evaluated and verified. We have no affiliate relationships, sponsorships,
          or financial incentives tied to any recommendation.
        </p>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Each tool entry includes verified pricing, specific automation capabilities, integration points,
          known limitations, and which company sizes it best serves. Tools are filtered to your industry
          and company size before being considered, and sorted with free/freemium options first for
          smaller teams.
        </p>

        <Expandable title="Tool categories (11 business functions)">
          <div className="pt-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {[
                "Office & Productivity",
                "Administrative Automation",
                "Billing & Finance",
                "Marketing & Content",
                "Customer Management",
                "Data & Analytics",
                "HR & Recruiting",
                "Compliance & Legal",
                "Sales Enablement",
                "IT & Security",
                "Inventory & Supply Chain",
              ].map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                  {cat}
                </div>
              ))}
            </div>
            <p className="mt-3 text-gray-500">
              Tools are classified as AI-native, AI-enhanced, AI-optional, or traditional-with-AI &mdash;
              so you know whether AI is the core product or an add-on feature.
            </p>
          </div>
        </Expandable>

        <Expandable title="Recommendation tiers">
          <div className="pt-3 space-y-2">
            <p>Tools are organized into three recommendation tiers based on your readiness:</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li><strong>Start Here</strong> &mdash; Free or cheap, immediate value, low learning curve. Try this week.</li>
              <li><strong>Add Next</strong> &mdash; Once the first tools are working, these compound your gains.</li>
              <li><strong>Consider Later</strong> &mdash; Higher investment, higher payoff. Requires a foundation of AI comfort.</li>
            </ul>
            <p className="mt-2">
              This prevents the common problem of getting overwhelmed with 15 tools at once.
              You get a clear sequence.
            </p>
          </div>
        </Expandable>
      </section>

      {/* ─── Section 8: Human Capabilities ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={8} />
          Human Capabilities Framework
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          AI doesn&apos;t just automate tasks &mdash; it changes which human skills become more valuable. We
          maintain a framework of 62 professional capabilities across 13 function areas, each scored for
          how much they <em>appreciate</em> (grow in value) as AI handles more routine work.
        </p>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          These aren&apos;t generic &ldquo;soft skills.&rdquo; Each capability includes research backing on why it&apos;s
          appreciating, concrete development actions, and specific reasons it resists automation. Your
          report surfaces the top capabilities most relevant to your functions and industry.
        </p>

        <Expandable title="What makes a capability 'appreciate'?">
          <div className="pt-3 space-y-2">
            <p>
              A capability appreciates when AI adoption increases demand for it. Research on 12M+ job
              postings shows that as companies automate routine work, they increase hiring for roles
              requiring judgment under ambiguity, relationship management, creative synthesis, and
              institutional knowledge.
            </p>
            <p>
              Each capability is scored 0&ndash;10 on appreciation potential. Only capabilities scoring 7+
              are included in the knowledge base. Examples:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li><strong>Organizational Judgment &amp; Prioritization</strong> (9/10) &mdash; Knowing what matters most when everything is urgent</li>
              <li><strong>Stakeholder Relationship Management</strong> (9/10) &mdash; Trust-building that no AI can substitute</li>
              <li><strong>Narrative Synthesis</strong> (8/10) &mdash; Turning complex data into a story that moves people to act</li>
            </ul>
          </div>
        </Expandable>

        <Expandable title="Function categories (13)">
          <div className="pt-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {[
                "Administrative",
                "Communications",
                "Creative & Design",
                "Customer Service",
                "Education",
                "Finance",
                "Healthcare",
                "Legal",
                "Marketing",
                "Operations",
                "People Management",
                "Sales",
                "Technology",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </Expandable>
      </section>

      {/* ─── Section 9: Privacy ─── */}
      <section className="mb-14">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <SectionNum n={9} />
          Privacy &amp; Data Handling
        </h2>
        <p className="text-md text-gray-500 leading-relaxed mb-4">
          Your uploaded documents and intake data are processed in-memory only. Nothing is written to disk,
          stored in a database, or retained after your report is generated. Here&apos;s the specific data flow:
        </p>

        <div className="space-y-2 mb-4">
          {[
            { label: "Uploaded files", detail: "Read into memory, PII stripped automatically, analyzed, then discarded. Never touch a filesystem." },
            { label: "Intake form data", detail: "Stored in our database to power your report page and dashboard. Contains only what you typed \u2014 never file contents." },
            { label: "Report output", detail: "Stored so you can return to it. Contains analysis, not your raw inputs." },
            { label: "AI processing", detail: "Your data is sent to Anthropic\u2019s Claude API for analysis. Anthropic does not train on API inputs. Your data is not retained by the AI provider." },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <div>
                <span className="text-base font-semibold text-gray-900">{item.label}</span>
                <span className="text-base text-gray-500"> &mdash; {item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="border-t border-gray-100 pt-10 mb-10">
        <p className="text-md text-gray-500 leading-relaxed mb-8">
          The research shows that knowing where to use AI matters more than having the tools. This assessment
          gives you that knowledge.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center py-8 px-6 bg-gray-50 border border-gray-100 rounded-xl">
        <h3 className="text-heading-sm font-bold text-gray-900 mb-2">
          Ready to find out where AI fits in your work?
        </h3>
        <p className="text-md text-gray-500 mb-6">
          5 minutes. Free. Research-backed. Yours to keep.
        </p>
        <Link
          href="/assessment/start"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-[#4F52D4] text-white font-semibold text-lg px-7 py-3 rounded-lg transition-colors"
        >
          Get Your AI Plan of Action
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

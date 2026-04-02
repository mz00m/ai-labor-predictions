import Link from "next/link";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tell us about your organization",
    description:
      "Industry, team size, department focus, key functions, and current tools. Our guided questionnaire adapts to your specific context.",
  },
  {
    step: "02",
    title: "Upload relevant documents",
    description:
      "Job descriptions, handbooks, process docs, org charts — whatever helps us understand how your team works. All files are processed in-memory and immediately discarded.",
  },
  {
    step: "03",
    title: "Receive your AI adoption plan",
    description:
      "A detailed, downloadable PDF report with specific tool recommendations, an implementation roadmap, and ROI projections tailored to your organization.",
  },
];

const REPORT_SECTIONS = [
  { title: "Executive Summary", description: "High-level findings and priority actions" },
  { title: "Task-Level AI Opportunity Analysis", description: "Every key function scored for AI readiness" },
  { title: "Tool Recommendations", description: "Specific categories of tools matched to your workflows" },
  { title: "Risk Assessment", description: "Displacement risk, skill gaps, and change management" },
  {
    title: "Implementation Roadmap",
    description: "Phased plan: immediate (0-3 mo), medium-term (3-6 mo), long-term (1 yr+)",
  },
  { title: "ROI Projections", description: "Estimated savings and time-to-value by area" },
  { title: "Further Evaluation Points", description: "Specific next steps to deepen your AI strategy" },
];

const TRUST_POINTS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Zero data retention",
    description: "Uploaded files are processed in-memory only. No content is stored on our servers or in any database.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ),
    title: "PII automatically stripped",
    description: "Personal information is detected and redacted before any analysis. Only sanitized content is reviewed.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Research-backed recommendations",
    description: "Analysis draws on 300+ sources tracking AI's real impact on jobs, wages, and productivity across industries.",
  },
];

export default function AssessmentLanding() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#5C61F6]/[0.06] blur-[100px]" />
          <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#3b82f6]/[0.04] blur-[80px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 text-[12px] font-medium text-[#5C61F6] bg-[#5C61F6]/[0.08] rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5C61F6] animate-pulse" />
            Powered by jobsdata.ai research
          </div>

          <h1 className="text-[40px] sm:text-[56px] font-black tracking-tight text-white leading-[1.05] max-w-3xl">
            Your organization&apos;s AI
            <br />
            <span className="text-[#5C61F6]">adoption roadmap</span>
          </h1>

          <p className="mt-5 text-[17px] text-[#8B95A5] leading-relaxed max-w-2xl">
            A comprehensive, evidence-based assessment of where AI can improve your
            operations — with specific tool recommendations, implementation timelines,
            and ROI projections tailored to your industry and team.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/assessment/start"
              className="inline-flex items-center justify-center gap-2 bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[15px] px-7 py-3 rounded-lg transition-colors"
            >
              Start Your Assessment
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 border border-white/[0.1] text-[#8B95A5] hover:text-white hover:border-white/[0.2] font-medium text-[15px] px-7 py-3 rounded-lg transition-colors"
            >
              View Pricing
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex flex-wrap gap-8 text-[13px]">
            <div>
              <div className="text-[28px] font-black text-white">300+</div>
              <div className="text-[#5A6478]">Research sources analyzed</div>
            </div>
            <div>
              <div className="text-[28px] font-black text-white">16</div>
              <div className="text-[#5A6478]">Industry categories</div>
            </div>
            <div>
              <div className="text-[28px] font-black text-white">PDF</div>
              <div className="text-[#5A6478]">Downloadable report</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#5C61F6] mb-3">
          How it works
        </h2>
        <p className="text-[24px] sm:text-[32px] font-bold text-white mb-10 max-w-2xl">
          Three steps to a tailored AI strategy
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative bg-[#111827]/60 border border-white/[0.06] rounded-xl p-6 hover:border-[#5C61F6]/30 transition-colors"
            >
              <div className="text-[11px] font-mono font-bold text-[#5C61F6] mb-3">
                STEP {step.step}
              </div>
              <h3 className="text-[17px] font-bold text-white mb-2">{step.title}</h3>
              <p className="text-[14px] text-[#8B95A5] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#5C61F6] mb-3">
          What you receive
        </h2>
        <p className="text-[24px] sm:text-[32px] font-bold text-white mb-10 max-w-2xl">
          A complete AI adoption plan
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="flex gap-3 bg-[#111827]/40 border border-white/[0.04] rounded-lg p-4"
            >
              <div className="mt-0.5 text-[#5C61F6] flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white mb-0.5">{section.title}</h3>
                <p className="text-[13px] text-[#5A6478]">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Security */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#5C61F6] mb-3">
          Data security
        </h2>
        <p className="text-[24px] sm:text-[32px] font-bold text-white mb-10 max-w-2xl">
          Your data stays yours
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="flex gap-4">
              <div className="text-[#5C61F6] flex-shrink-0 mt-1">{point.icon}</div>
              <div>
                <h3 className="text-[15px] font-semibold text-white mb-1">{point.title}</h3>
                <p className="text-[13px] text-[#8B95A5] leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#5C61F6] mb-3">
          Pricing
        </h2>
        <p className="text-[24px] sm:text-[32px] font-bold text-white mb-10 max-w-2xl">
          Straightforward, one-time pricing
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {/* Core Assessment */}
          <div className="relative bg-[#111827]/60 border-2 border-[#5C61F6]/40 rounded-xl p-6">
            <div className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-[#5C61F6] bg-[#5C61F6]/[0.08] rounded-full px-2.5 py-0.5 mb-4">
              Core Assessment
            </div>
            <div className="mb-4">
              <span className="text-[40px] font-black text-white">$100</span>
              <span className="text-[14px] text-[#5A6478] ml-2">one-time</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                "Full AI opportunity analysis",
                "Task-level recommendations",
                "Tool category recommendations",
                "Implementation roadmap (short/medium/long)",
                "Risk assessment and skill gap analysis",
                "ROI projections",
                "Downloadable PDF report",
                "Account access to refine and update",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-[13px] text-[#C5CDD8]">
                  <svg className="w-4 h-4 text-[#5C61F6] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/assessment/start"
              className="block w-full text-center bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[14px] py-2.5 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Policy Add-on */}
          <div className="relative bg-[#111827]/40 border border-white/[0.06] rounded-xl p-6">
            <div className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-[#8B95A5] bg-white/[0.04] rounded-full px-2.5 py-0.5 mb-4">
              Add-on
            </div>
            <div className="mb-4">
              <span className="text-[40px] font-black text-white">+$100</span>
              <span className="text-[14px] text-[#5A6478] ml-2">one-time</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                "Draft AI usage policy for your org",
                "Customized prompt library (10-20 prompts)",
                "Prompts matched to your workflows",
                "Data handling and ethics guidelines",
                "Available after initial assessment",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-[13px] text-[#C5CDD8]">
                  <svg className="w-4 h-4 text-[#5A6478] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="block w-full text-center border border-white/[0.1] text-[#5A6478] font-medium text-[14px] py-2.5 rounded-lg cursor-default">
              Available from your dashboard
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#5C61F6] mb-3">
          Built for
        </h2>
        <p className="text-[24px] sm:text-[32px] font-bold text-white mb-10 max-w-2xl">
          Small and mid-size organizations across industries
        </p>

        <div className="flex flex-wrap gap-2">
          {[
            "Nonprofits",
            "Restaurants",
            "Manufacturing",
            "Healthcare",
            "Retail",
            "Professional Services",
            "Accounting",
            "Legal",
            "Education",
            "Construction",
            "Real Estate",
            "Media & Marketing",
            "Logistics",
            "Government",
          ].map((industry) => (
            <span
              key={industry}
              className="text-[13px] text-[#8B95A5] bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-1.5"
            >
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16 text-center">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-white mb-4">
          Ready to assess your AI opportunities?
        </h2>
        <p className="text-[15px] text-[#8B95A5] mb-8 max-w-xl mx-auto">
          Start with a free preview to see how it works, then unlock your full
          report for $100.
        </p>
        <Link
          href="/assessment/start"
          className="inline-flex items-center justify-center gap-2 bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[15px] px-8 py-3 rounded-lg transition-colors"
        >
          Start Your Assessment
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </section>
    </div>
  );
}

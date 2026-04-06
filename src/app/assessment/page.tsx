import Link from "next/link";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tell us about your work",
    description:
      "Your role, industry, daily tasks, and the tools you already use. Our guided questionnaire adapts to show you what matters for your specific work.",
  },
  {
    step: "02",
    title: "Share what you can",
    description:
      "Job descriptions, process docs, or just a link to your company website. The more we understand your day-to-day, the more specific we can get. Everything is processed in-memory and immediately discarded.",
  },
  {
    step: "03",
    title: "Get your personalized action plan",
    description:
      "A downloadable PDF with specific ways AI can save you time on your actual tasks, plus a clear plan for what to try first, what to learn next, and where the biggest wins are.",
  },
];

const REPORT_SECTIONS = [
  { title: "Your AI Opportunity Summary", description: "Where the biggest time savings are in your work" },
  { title: "Task-by-Task Analysis", description: "Each of your key tasks scored for AI potential" },
  { title: "Tool Recommendations", description: "What to use, what it does, and what to expect" },
  { title: "Your Action Plan", description: "What to start today, this quarter, and this year" },
  { title: "Skills to Build", description: "The capabilities that will make you more effective with AI" },
  { title: "Time & Value Projections", description: "Realistic estimates of hours saved per week" },
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
    description: "Built on 300+ sources including a 2026 field experiment with 515 firms showing that knowing where to use AI matters more than having the tools.",
  },
];

const TESTIMONIAL_SCENARIOS = [
  {
    role: "Data Analyst",
    industry: "Educational Institution",
    quote: "The task analysis was the most helpful for me! Risks and change management had a ton of gold in there too. I really like the flow and the inclusion of next steps to make it actionable.",
  },
  {
    role: "Program Lead",
    industry: "Technical Advisory Firm",
    quote: "This could be a huge asset to NGO leaders -- I can picture using the report as a catalyst for getting going, for the many that are stuck trying to figure out how to start.",
  },
  {
    role: "Chief Operating Officer",
    industry: "Workforce Development Organization",
    quote: "It hits points we have already discussed and are acting on but gives my team some new information to cross reference against. It also provides structure to our approach which will help my OPs team leader who doesn't have a lot of change management experience. Very helpful!",
  },
  {
    role: "Program Staff",
    industry: "Museum",
    quote: "This is really great. I haven't known where to start and have been a little skeptical, but this makes it really easy!",
  },
];

export default function AssessmentLanding() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#5C61F6]/[0.05] blur-[100px]" />
          <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#3b82f6]/[0.04] blur-[80px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 text-[12px] font-medium text-[#5C61F6] bg-[#5C61F6]/[0.08] rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5C61F6] animate-pulse" />
            Built on jobsdata.ai research
          </div>

          <h1 className="font-serif text-[40px] sm:text-[56px] font-bold tracking-tight text-gray-900 leading-[1.05] max-w-3xl">
            Get your time back
            <br />
            <span className="text-[#5C61F6]">with a clear AI plan</span>
          </h1>

          <p className="mt-5 text-[17px] text-gray-500 leading-relaxed max-w-2xl">
            Find out exactly which parts of your work AI can handle so you can
            spend more time on the things that actually need you. A personalized,
            task-by-task action plan for individual workers, nonprofits, and small business teams.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/assessment/start"
              className="inline-flex items-center justify-center gap-2 bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[15px] px-7 py-3 rounded-lg transition-colors"
            >
              Get Your AI Plan of Action
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <span className="inline-flex items-center gap-2 text-[14px] font-medium text-green-600 bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Free!
            </span>
          </div>
          <div className="mt-4">
            <Link
              href="/assessment/methodology"
              className="text-[13px] text-gray-400 hover:text-[#5C61F6] transition-colors"
            >
              How it works: 481 sources, 64 tools, 4-step AI pipeline &rarr;
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex flex-wrap gap-8 text-[13px]">
            <div>
              <div className="text-[28px] font-black text-gray-900">1.9x</div>
              <div className="text-gray-400">More revenue when firms knew where to apply AI</div>
            </div>
            <div>
              <div className="text-[28px] font-black text-gray-900">44%</div>
              <div className="text-gray-400">More AI uses discovered with the right guidance</div>
            </div>
            <div>
              <div className="text-[28px] font-black text-gray-900">~40%</div>
              <div className="text-gray-400">Less funding needed -- same team, more output</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-gray-300">
            Source: Kim, Kim &amp; Koning (2026), INSEAD &amp; Harvard Business School. Field experiment, 515 firms.
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <span className="text-[12px] font-medium uppercase tracking-widest text-[#5C61F6]/60 mb-4 block">
          Who this is for
        </span>
        <h2 className="font-serif text-[24px] sm:text-[32px] font-semibold text-gray-900 mb-4 max-w-2xl">
          You know AI is changing work. You just need a starting point.
        </h2>
        <p className="text-[15px] text-gray-500 leading-relaxed max-w-3xl mb-10">
          Whether you&apos;re an individual contributor looking to level up, a manager trying to
          help your team work smarter, or a small business owner who wears ten hats, this
          gives you a clear, practical plan based on what you actually do every day.
        </p>

        <p className="text-[12px] text-gray-400 mb-4">Real testimonials from users.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIAL_SCENARIOS.map((t) => (
            <div
              key={t.role}
              className="bg-gray-50 border border-gray-100 rounded-xl p-5"
            >
              <p className="text-[13px] text-gray-600 leading-relaxed italic mb-3">
                &quot;{t.quote}&quot;
              </p>
              <p className="text-[12px] text-[#5C61F6] font-semibold">{t.role}</p>
              <p className="text-[11px] text-gray-400">{t.industry}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why a plan matters */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <span className="text-[12px] font-medium uppercase tracking-widest text-[#5C61F6]/60 mb-4 block">
          The research
        </span>
        <h2 className="font-serif text-[24px] sm:text-[32px] font-semibold text-gray-900 mb-4 max-w-3xl">
          The #1 thing holding people back from AI isn&apos;t the technology. It&apos;s knowing where to use it.
        </h2>
        <div className="text-[15px] text-gray-500 leading-relaxed max-w-3xl space-y-4 mb-10">
          <p>
            A 2026 study from INSEAD and Harvard Business School followed 515 companies. Every single one
            had the same AI tools, the same training, the same budget. The only difference? Some got help
            figuring out <span className="text-gray-700 font-medium">where</span> AI fit into their actual work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <div className="text-[28px] font-black text-[#5C61F6]">1.9x</div>
            <div className="text-[14px] font-semibold text-gray-900 mt-1">More revenue</div>
            <p className="text-[13px] text-gray-400 mt-1">
              Not because they had better tools. Because they knew where to point them.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <div className="text-[28px] font-black text-[#5C61F6]">44%</div>
            <div className="text-[14px] font-semibold text-gray-900 mt-1">More ways to use AI</div>
            <p className="text-[13px] text-gray-400 mt-1">
              Most people stop at the obvious stuff. The real gains are in the tasks you haven&apos;t thought of yet.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <div className="text-[28px] font-black text-[#5C61F6]">18%</div>
            <div className="text-[14px] font-semibold text-gray-900 mt-1">More likely to land customers</div>
            <p className="text-[13px] text-gray-400 mt-1">
              Knowing where AI helps means you move faster on the things that matter.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <div className="text-[28px] font-black text-[#5C61F6]">~40%</div>
            <div className="text-[14px] font-semibold text-gray-900 mt-1">Less money needed to grow</div>
            <p className="text-[13px] text-gray-400 mt-1">
              When AI handles the right tasks, you do more with what you already have.
            </p>
          </div>
        </div>

        <p className="text-[14px] text-gray-400 leading-relaxed max-w-3xl">
          The researchers called this the &quot;mapping problem&quot; -- the challenge of figuring out where AI
          actually helps <span className="italic">your</span> specific work. That&apos;s exactly what this assessment does for you.
        </p>
        <p className="text-[11px] text-gray-300 mt-3">
          Kim, Kim &amp; Koning (2026). &quot;Mapping AI into Production.&quot; INSEAD Working Paper. Field experiment, 515 firms.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <span className="text-[12px] font-medium uppercase tracking-widest text-[#5C61F6]/60 mb-4 block">
          How it works
        </span>
        <h2 className="font-serif text-[24px] sm:text-[32px] font-semibold text-gray-900 mb-10 max-w-2xl">
          Three steps to knowing exactly where to start
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-[#5C61F6]/30 transition-colors"
            >
              <div className="text-[11px] font-mono font-bold text-[#5C61F6] mb-3">
                STEP {step.step}
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <span className="text-[12px] font-medium uppercase tracking-widest text-[#5C61F6]/60 mb-4 block">
          What you get
        </span>
        <h2 className="font-serif text-[24px] sm:text-[32px] font-semibold text-gray-900 mb-10 max-w-2xl">
          A plan built around your actual work
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="flex gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4"
            >
              <div className="mt-0.5 text-[#5C61F6] flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900 mb-0.5">{section.title}</h3>
                <p className="text-[13px] text-gray-400">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Security */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <span className="text-[12px] font-medium uppercase tracking-widest text-[#5C61F6]/60 mb-4 block">
          Data security
        </span>
        <h2 className="font-serif text-[24px] sm:text-[32px] font-semibold text-gray-900 mb-10 max-w-2xl">
          Your data stays yours
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="flex gap-4">
              <div className="text-[#5C61F6] flex-shrink-0 mt-1">{point.icon}</div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1">{point.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-gray-400 mt-6">
          Featured research:{" "}
          <a
            href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6513481"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C61F6] hover:underline"
          >
            Kim, Kim &amp; Koning (2026), INSEAD &amp; Harvard Business School
          </a>
          {" "}&middot; Field experiment, 515 firms
        </p>
      </section>

      {/* Industries */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <span className="text-[12px] font-medium uppercase tracking-widest text-[#5C61F6]/60 mb-4 block">
          Works across industries
        </span>
        <h2 className="font-serif text-[24px] sm:text-[32px] font-semibold text-gray-900 mb-10 max-w-2xl">
          Tailored to how work actually gets done in your field
        </h2>

        <div className="flex flex-wrap gap-2">
          {[
            "Nonprofits",
            "Restaurants & Hospitality",
            "Manufacturing",
            "Healthcare & Medical",
            "Retail",
            "Professional Services",
            "Accounting & Finance",
            "Legal",
            "Education",
            "Construction & Trades",
            "Real Estate",
            "Media & Marketing",
            "Logistics & Transportation",
            "Government",
          ].map((industry) => (
            <span
              key={industry}
              className="text-[12px] text-gray-400 bg-gray-50 rounded px-3 py-1"
            >
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16 text-center">
        <h2 className="font-serif text-[28px] sm:text-[36px] font-semibold text-gray-900 mb-4">
          Companies that figured out where to use AI
          <br />
          <span className="text-[#5C61F6]">made nearly twice the revenue.</span>
        </h2>
        <p className="text-[15px] text-gray-500 mb-8 max-w-xl mx-auto">
          The ones that didn&apos;t had the exact same tools. Find out where AI fits in your work. It takes 5 minutes. It&apos;s free.
        </p>
        <Link
          href="/assessment/start"
          className="inline-flex items-center justify-center gap-2 bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[15px] px-8 py-3 rounded-lg transition-colors"
        >
          Get Your AI Plan of Action
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </section>
    </div>
  );
}

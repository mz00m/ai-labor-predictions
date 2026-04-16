import { Metadata } from "next";
import costsData from "@/data/hosting-costs.json";
import RecentSources from "@/components/RecentSources";
import AboutStats from "@/components/AboutStats";
import { getRecentSources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why this project exists, how the methodology works, and who built it. A synthesis of AI-and-labor data for workforce, education, philanthropy, and policy leaders.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Early Signals of AI Impact",
    description:
      "Why this project exists, how the methodology works, and who built it.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Early Signals of AI Impact",
    description:
      "Why this project exists, how the methodology works, and who built it.",
  },
};

function computeTotalCost(): number {
  const data = costsData as { projectStartDate: string; categories: { services: { monthlyCost: number; oneTimeCost: number; costType: string; startDate: string; endDate: string | null }[] }[] };
  return data.categories.flatMap((c) => c.services).reduce((sum, s) => {
    if (s.costType === "one-time" || s.costType === "cumulative") return sum + s.oneTimeCost;
    const start = new Date(s.startDate);
    const end = s.endDate ? new Date(s.endDate) : new Date();
    const months = Math.ceil((end.getTime() - start.getTime()) / (30.44 * 24 * 60 * 60 * 1000));
    return sum + s.monthlyCost * Math.max(months, 0);
  }, 0);
}

export default function AboutPage() {
  const recentSources = getRecentSources(20);
  const totalCost = computeTotalCost().toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  return (
    <div className="flex flex-col lg:flex-row lg:gap-10">
      {/* Left column - all About + Methodology content */}
      <div className="lg:flex-1 min-w-0 space-y-14">
        {/* Header */}
        <section className="mb-2">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
            About This Project
          </p>
          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1] mb-4"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Evidence Over Narrative
          </h1>
          <p
            className="text-2xl sm:text-[20px] text-[var(--muted)] leading-relaxed"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Society is trying to figure out what AI means for work and the answers keep changing.
          </p>
        </section>

        {/* Mission */}
        <section className="max-w-3xl space-y-4">
          <p className="text-md text-[var(--muted)] leading-relaxed">
            For years I&rsquo;ve wanted a single place that synthesizes what we actually
            know about AI&rsquo;s impact on economic opportunity: not the hype, not the doom,
            but the evidence.
          </p>
          <p className="text-md text-[var(--muted)] leading-relaxed">
            This site started as a way to track how predictions about displacement,
            wages, adoption, and corporate behavior evolve as new research, data, and real-world
            evidence emerge. It quickly grew into something more: a resource for simplifying
            complex economic research on how AI will impact jobs so that anyone &mdash; whether
            you&rsquo;re a workforce leader, a parent with a college-bound kid, or just someone
            trying to plan &mdash; can engage with this new and unclear future in a clear-headed way.
          </p>
          <p className="text-md text-[var(--muted)] leading-relaxed">
            Explore the visualizations
            ({" "}
            <a href="/task-visualizer" className="link-draw-underline hover:text-[var(--foreground)]">job tasks</a>,{" "}
            <a href="/task-visualizer/economy" className="link-draw-underline hover:text-[var(--foreground)]">full economy</a>,{" "}
            <a href="/compare" className="link-draw-underline hover:text-[var(--foreground)]">predictions</a>{" "}
            ) and explainers
            ({" "}
            <a href="/j-curve" className="link-draw-underline hover:text-[var(--foreground)]">J-Curve</a>,{" "}
            <a href="/history" className="link-draw-underline hover:text-[var(--foreground)]">historical context</a>,{" "}
            <a href="/demand-elasticity" className="link-draw-underline hover:text-[var(--foreground)]">demand elasticity</a>,{" "}
            <a href="/signals" className="link-draw-underline hover:text-[var(--foreground)]">early indicators</a>{" "}
            ) or chat with Gob, our friendly research-backed robot. The goal is to help the people
            who need it most have a more thoughtful, evidence-grounded response to what&rsquo;s ahead.
          </p>
        </section>

        {/* About Matt */}
        <section className="max-w-3xl">
          <div className="about-card border border-black/[0.06] rounded-lg px-5 py-5 bg-[var(--background)]">
            <p className="text-md font-bold text-[var(--foreground)] mb-2">
              Who&rsquo;s behind this?
            </p>
            <p className="text-md text-[var(--muted)] leading-relaxed">
              <a
                href="https://www.linkedin.com/in/mattzieger"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--foreground)] underline hover:text-[var(--accent)] transition-colors"
              >
                Matt Zieger
              </a>{" "}
              built this as a personal project...to learn, know how to better advise his kids on what the future will look like for them, and to just maybe help everyone else wrestling with these questions navigate an uncertain new world. While not formally affiliated with his day job, Matt is Chief Program &amp; Partnership Officer at the GitLab Foundation, where he leads the{" "}
              <a
                href="https://www.gitlabfoundation.org/futureofwork"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw-underline hover:text-[var(--foreground)]"
              >
                AI for Economic Opportunity Fund
              </a>{" "}
              and co-founded{" "}
              <a
                href="https://www.opportunityai.org/about"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw-underline hover:text-[var(--foreground)]"
              >
                OpportunityAI
              </a>
              .
            </p>
            <AboutStats totalCost={totalCost} />
            <p className="text-md text-[var(--muted)] leading-relaxed mt-3">
              Have ideas? Reach out on{" "}
              <a
                href="https://www.linkedin.com/in/mattzieger"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw-underline hover:text-[var(--foreground)]"
              >
                LinkedIn
              </a>
              {" or "}
              <a
                href="https://x.com/mattzieger"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw-underline hover:text-[var(--foreground)]"
              >
                X
              </a>
              .
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-black/[0.06]" />

        {/* Methodology link */}
        <section id="methodology" className="scroll-mt-16">
          <h2 className="text-4xl sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
            Methodology &amp; Sources
          </h2>
          <p className="text-lg text-[var(--muted)] mt-2 max-w-3xl mb-4">
            Full documentation of how we collect, weight, combine, and present
            evidence across every section of the site.
          </p>
          <a
            href="/methodology"
            className="inline-flex items-center gap-2 text-md font-semibold text-[var(--accent)] hover:text-[#5C61F6] transition-colors"
          >
            Read the full methodology
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10m0 0l-4-4m4 4l-4 4" />
            </svg>
          </a>
        </section>

      </div>

      {/* Right column - compact auto-scrolling recent sources feed */}
      <div className="mt-10 lg:mt-0 lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-16">
          <RecentSources sources={recentSources} />
        </div>
      </div>
    </div>
  );
}

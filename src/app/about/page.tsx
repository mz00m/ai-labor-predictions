import { Metadata } from "next";
import costsData from "@/data/hosting-costs.json";
import RecentSources from "@/components/RecentSources";
import AboutStats from "@/components/AboutStats";
import { getRecentSources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why JobsData.ai exists, how it works, and who built it—a plain-language guide to the evidence on AI and work.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Early Signals of AI Impact",
    description:
      "Why JobsData.ai exists, how it works, and who built it.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Early Signals of AI Impact",
    description:
      "Why JobsData.ai exists, how it works, and who built it.",
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
            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1] mb-4 font-serif"
          >
            A clearer view of AI and work
          </h1>
          <p
            className="text-2xl sm:text-heading-sm text-[var(--muted)] leading-relaxed font-serif"
          >
            The debate moves fast. This site keeps the evidence in one place.
          </p>
        </section>

        {/* Mission */}
        <section className="max-w-3xl space-y-4">
          <p className="text-md text-[var(--muted)] leading-relaxed">
            I built JobsData.ai because I wanted a straightforward answer to a hard
            question: what is AI actually doing to jobs and economic opportunity?
            Most coverage starts with either excitement or alarm. This project starts
            with the evidence.
          </p>
          <p className="text-md text-[var(--muted)] leading-relaxed">
            The site tracks forecasts about jobs, wages, adoption, and employer behavior,
            then checks those forecasts against new research and real-world data. It is
            meant for anyone making decisions in the middle of that uncertainty: workforce
            leaders, educators, policymakers, parents, and workers planning what comes next.
          </p>
          <p className="text-md text-[var(--muted)] leading-relaxed">
            You can explore the visualizations
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
            ), or ask Gob a question about the research. The numbers will change as better
            evidence arrives. That is the point: to show what we know now, what remains
            uncertain, and how the picture changes over time.
          </p>
        </section>

        {/* About Matt */}
        <section className="max-w-3xl">
          <div className="about-card border border-card rounded-lg p-4 sm:p-6 bg-[var(--background)]">
            <p className="text-md font-bold text-[var(--foreground)] mb-2">
              Who&rsquo;s behind this?
            </p>
            <p className="text-md text-[var(--muted)] leading-relaxed">
              I&rsquo;m{" "}
              <a
                href="https://www.linkedin.com/in/mattzieger"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--foreground)] underline hover:text-[var(--accent)] transition-colors"
              >
                Matt Zieger
              </a>
              . I started this as a personal project: partly to learn, partly to give my
              own kids a more useful answer about the future they are entering, and partly
              to help other people wrestling with the same questions.
            </p>
            <p className="text-md text-[var(--muted)] leading-relaxed mt-3">
              In my day job, I&rsquo;m Chief Program &amp; Partnership Officer at the GitLab
              Foundation, where I lead the{" "}
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
              . JobsData.ai is an independent personal project and is not affiliated with
              the GitLab Foundation.
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
        <div className="border-t border-card" />

        {/* Methodology link */}
        <section id="methodology" className="scroll-mt-16">
          <h2 className="text-4xl sm:text-title-sm font-bold tracking-tight text-[var(--foreground)]">
            Methodology &amp; Sources
          </h2>
          <p className="text-lg text-[var(--muted)] mt-2 max-w-3xl mb-4">
            See how the site collects, weighs, combines, and presents its evidence.
          </p>
          <a
            href="/methodology"
            className="inline-flex items-center gap-2 text-md font-semibold text-[var(--accent)] hover:text-accent transition-colors"
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

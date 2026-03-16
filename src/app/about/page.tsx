import { Metadata } from "next";
import Methodology from "@/components/Methodology";
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
      {/* Left column — all About + Methodology content */}
      <div className="lg:flex-1 min-w-0 space-y-14">
        {/* Header */}
        <section className="mb-2">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
            About This Project
          </p>
          <h1
            className="text-[36px] sm:text-[44px] font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1] mb-4"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Evidence Over Narrative
          </h1>
          <p
            className="text-[18px] sm:text-[20px] text-[var(--muted)] leading-relaxed"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Synthesizing what we actually know about AI&rsquo;s impact on
            economic opportunity &mdash; not the hype, not the doom, but
            the evidence.
          </p>
        </section>

        {/* Mission */}
        <section className="max-w-3xl space-y-4">
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            Society is trying to figure out what AI means for work, and the answers keep
            changing.
          </p>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            This site initially started as a way for me to track how predictions about displacement,
            wages, adoption, and corporate behavior evolve as new research, data, and real-world
            evidence emerge.
          </p>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            I quickly realized there was also a lot of value in simplifying complex economic theories
            and research to help the average person understand what it means for their jobs, their
            kids headed off to college, and just generally what we should plan for as a society!
            I hope you take some time to interact with the visualizations
            ({" "}
            <a href="/task-visualizer" className="underline hover:text-[var(--foreground)] transition-colors">job task breakdown</a>,{" "}
            <a href="/task-visualizer/economy" className="underline hover:text-[var(--foreground)] transition-colors">economy-wide view</a>,{" "}
            <a href="/compare" className="underline hover:text-[var(--foreground)] transition-colors">prediction comparison</a>{" "}
            ) and read through some of the explainers
            ({" "}
            <a href="/j-curve" className="underline hover:text-[var(--foreground)] transition-colors">the J-Curve</a>,{" "}
            <a href="/history" className="underline hover:text-[var(--foreground)] transition-colors">historical context</a>,{" "}
            <a href="/demand-elasticity" className="underline hover:text-[var(--foreground)] transition-colors">demand elasticity</a>,{" "}
            <a href="/signals" className="underline hover:text-[var(--foreground)] transition-colors">leading indicators</a>{" "}
            ) and I hope you find them useful.
          </p>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            The goal is to help the people who need it most, leaders in workforce development,
            education, philanthropy, and policy, but also just the average person trying to navigate
            this new AI-enabled world have a more thoughtful, evidence-grounded response to
            what&rsquo;s coming.
          </p>
          <AboutStats totalCost={totalCost} />
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            If you have ideas on how to make it better, I&rsquo;d love to hear from you:{" "}
            <a
              href="https://www.linkedin.com/in/mattzieger"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)] transition-colors"
            >
              LinkedIn
            </a>
            {" / "}
            <a
              href="https://x.com/mattzieger"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)] transition-colors"
            >
              X
            </a>
          </p>
        </section>

        {/* About Matt */}
        <section className="max-w-3xl">
          <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-[var(--background)]">
            <p className="text-[14px] font-bold text-[var(--foreground)] mb-2">
              Who is behind this?
            </p>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed">
              <a
                href="https://linkedin.com/in/mattzieger"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--foreground)] underline hover:text-[var(--accent)] transition-colors"
              >
                Matt Zieger
              </a>{" "}
              is building this as a personal project, to learn and help everyone navigate this new and uncertain world. While this is not formally affiliated with his day job, he&rsquo;s the Chief Program &amp; Partnership Officer at the GitLab Foundation, where he leads the{" "}
              <a
                href="https://www.gitlabfoundation.org/futureofwork"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--foreground)] transition-colors"
              >
                AI for Economic Opportunity Fund
              </a>{" "}
              and is the co-founder and chair of{" "}
              <a
                href="https://www.opportunityai.org/about"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--foreground)] transition-colors"
              >
                OpportunityAI
              </a>
              .
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-black/[0.06]" />

        {/* Methodology */}
        <section id="methodology" className="scroll-mt-16">
          <Methodology />
        </section>

      </div>

      {/* Right column — compact auto-scrolling recent sources feed */}
      <div className="mt-10 lg:mt-0 lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-16">
          <RecentSources sources={recentSources} />
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Methodology from "@/components/Methodology";

export const metadata: Metadata = {
  title: "About — Early Signals of AI Impact",
  description:
    "Why this project exists, how the methodology works, and who built it. A synthesis of AI-and-labor data for workforce, education, philanthropy, and policy leaders.",
  openGraph: {
    title: "About — Early Signals of AI Impact",
    description:
      "Why this project exists, how the methodology works, and who built it.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <section>
        <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          About This Project
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-3xl space-y-4">
        <p className="text-[14px] text-[var(--muted)] leading-relaxed">
          Society is trying to figure out what AI means for work &mdash; and the answers keep
          changing.
        </p>
        <p className="text-[14px] text-[var(--muted)] leading-relaxed">
          For years I&rsquo;ve wanted a single place that synthesizes what we actually
          know about AI&rsquo;s impact on economic opportunity &mdash; not the hype, not the doom,
          but the evidence.
          This dashboard makes that process visible by tracking how predictions about displacement,
          wages, adoption, and corporate behavior evolve as new research, data, and real-world
          evidence emerge. The goal is to help the people who need it most &mdash; leaders in
          workforce development, education, philanthropy, and policy &mdash; have a more thoughtful,
          evidence-grounded response to what&rsquo;s coming.
        </p>
        <p className="text-[14px] text-[var(--muted)] leading-relaxed">
          It&rsquo;s a weekend project, built in the open, and very much a work in progress.
        </p>
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
        <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-white">
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
      <section id="methodology">
        <Methodology />
      </section>
    </div>
  );
}

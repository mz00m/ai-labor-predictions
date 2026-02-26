import Methodology from "@/components/Methodology";

export default function AboutPage() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <section>
        <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          About This Project
        </p>
        <h1 className="text-[36px] sm:text-[46px] font-black tracking-tight text-[var(--foreground)] leading-[1.08] max-w-3xl">
          See the future before it&rsquo;s here.
        </h1>
      </section>

      {/* Mission */}
      <section className="max-w-2xl space-y-5">
        <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
          For years I&rsquo;ve wanted a single place that synthesizes what we actually know about
          AI&rsquo;s impact on economic opportunity &mdash; not the hype, not the doom, but the evidence.
        </p>
        <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
          This project pulls together peer-reviewed research, government data, corporate filings,
          think tank analysis, and journalism into one living dashboard. The goal is to help
          the people who need it most &mdash; leaders in workforce development, education, philanthropy,
          and policy &mdash; have a more thoughtful, evidence-grounded response to what&rsquo;s coming.
        </p>
        <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
          It&rsquo;s a weekend project, built in the open, and very much a work in progress.
          If you have ideas on how to make it better, I&rsquo;d love to hear from you.
        </p>
      </section>

      {/* About Matt */}
      <section className="max-w-2xl">
        <div className="border border-black/[0.06] rounded-lg px-6 py-5">
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
            Built by
          </p>
          <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
            <a
              href="https://linkedin.com/in/mattzieger"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:text-[var(--accent)] transition-colors"
            >
              Matt Zieger
            </a>{" "}
            is a Senior Program Officer at the GitLab Foundation, where he leads global
            grantmaking and partnerships focused on improving economic mobility. He has over
            20 years of experience across nonprofits, impact investing, and economic development.
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

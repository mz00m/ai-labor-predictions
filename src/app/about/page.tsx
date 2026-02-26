import Methodology from "@/components/Methodology";

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
          changing. For years I&rsquo;ve wanted a single place that synthesizes what we actually
          know about AI&rsquo;s impact on economic opportunity &mdash; not the hype, not the doom,
          but the evidence.
        </p>
        <p className="text-[14px] text-[var(--muted)] leading-relaxed">
          This dashboard makes that process visible by tracking how predictions about displacement,
          wages, adoption, and corporate behavior evolve as new research, data, and real-world
          evidence emerge. The goal is to help the people who need it most &mdash; leaders in
          workforce development, education, philanthropy, and policy &mdash; have a more thoughtful,
          evidence-grounded response to what&rsquo;s coming.
        </p>
        <p className="text-[14px] text-[var(--muted)] leading-relaxed">
          It&rsquo;s a weekend project, built in the open, and very much a work in progress.
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
            Built by
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
            is building this as a personal vibe-coding project, as a way to learn and hopefully create something helpful for others. While not affiliated with his day job, he's the Chief Program & Partnership Officer at the GitLab Foundation, 
            where he wakes up every day trying to help people earn a living wage.
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

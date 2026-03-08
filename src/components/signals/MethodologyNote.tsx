"use client";

export default function MethodologyNote() {
  return (
    <section className="border-t border-black/[0.06] pt-8">
      <h2 className="text-[22px] font-bold text-[var(--foreground)] mb-4">
        How to Read This Data
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 text-[13px] text-[var(--muted)] leading-relaxed">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            The construction permits analogy
          </h3>
          <p>
            Before a building goes up, construction permits spike in that
            neighborhood. This page works the same way: before AI replaces tasks
            in an industry, developers start downloading the tools to build
            those automation systems. We track both Python and JavaScript
            package downloads as a leading indicator of where AI automation
            is heading.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            What is the Automation Acceleration Index?
          </h3>
          <p>
            The AAI compares how fast industry-specific automation tools are
            growing versus general AI infrastructure (like the OpenAI or
            Anthropic SDKs). When the AAI is above 1.0, it means the tools
            that automate specific jobs are growing faster than the underlying
            AI platform &mdash; a signal that we&apos;re moving from
            &ldquo;people using AI&rdquo; to &ldquo;AI doing the work.&rdquo;
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            What counts as &ldquo;surging&rdquo;?
          </h3>
          <p>
            A tool gets flagged as surging if it shows 3 or more consecutive
            months of greater than 20% month-over-month growth, or if its recent
            growth rate has at least doubled compared to the prior quarter.
            These are the tools gaining adoption fastest &mdash; and the
            industries they serve are worth watching.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            Community signals
          </h3>
          <p>
            GitHub stars and issues, plus StackOverflow question volume, provide
            supplementary context alongside download data. Stars indicate
            developer interest, issues reflect active development and bug
            reports, and SO questions show how many people are trying to use a
            tool. These are shown as compact indicators on each tool but are
            not factored into the AAI calculation.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            Important caveats
          </h3>
          <p>
            Package downloads do not equal production use. CI/CD pipelines,
            Docker builds, and dependency resolution inflate counts. The signal
            is in the relative growth rates across industries, not the absolute
            numbers. New tools with small user bases can show extreme growth
            percentages. And correlation is not causation &mdash; rising tool
            adoption doesn&apos;t prove job displacement, but it does indicate
            where investment and capability are concentrating.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-black/[0.04] text-[11px] text-[var(--muted)]">
        <p>
          Data sources:{" "}
          <a
            href="https://pypistats.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            pypistats.org
          </a>{" "}
          (Python packages),{" "}
          <a
            href="https://www.npmjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            npm registry
          </a>{" "}
          (JavaScript packages),{" "}
          <a
            href="https://www.bls.gov/ces/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            Bureau of Labor Statistics CES
          </a>{" "}
          (employment data),{" "}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            GitHub API
          </a>{" "}
          (stars &amp; issues),{" "}
          <a
            href="https://api.stackexchange.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            Stack Exchange API
          </a>{" "}
          (question volume). Updated monthly.
        </p>
      </div>
    </section>
  );
}

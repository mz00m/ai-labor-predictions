"use client";

export default function MethodologyNote() {
  return (
    <section className="border-t border-black/[0.06] pt-8">
      <h2 className="text-[22px] font-bold text-[var(--foreground)] mb-4">
        Methodology &amp; Caveats
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 text-[13px] text-[var(--muted)] leading-relaxed">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            What is the AAI?
          </h3>
          <p>
            The Automation Acceleration Index is the ratio of average
            month-over-month download growth for automation-focused packages
            (Tier 2 + Tier 3) to the average growth of general AI infrastructure
            packages (Tier 1). An AAI above 1.0 means automation tooling is
            growing faster than the underlying AI platform it builds on.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            Package Tiers
          </h3>
          <p>
            <strong>Tier 1 (Infrastructure)</strong> includes core AI libraries
            like openai, anthropic, and transformers &mdash; these track general
            AI adoption.{" "}
            <strong>Tier 2 (Automation Enablers)</strong> covers agent
            frameworks, browser automation, and document processing tools.{" "}
            <strong>Tier 3 (Domain-Specific)</strong> targets specific
            industries like healthcare, data analysis, and creative work.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            Breakout Detection
          </h3>
          <p>
            A package is flagged as a &ldquo;breakout&rdquo; if it shows 3 or
            more consecutive months of &gt;20% month-over-month growth, or if
            its recent 3-month average growth rate has at least doubled compared
            to the prior quarter.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">
            Important Caveats
          </h3>
          <p>
            PyPI downloads &ne; production usage. CI/CD pipelines, Docker
            builds, and dependency resolution inflate counts. The signal is in
            relative growth rates, not absolute numbers. New packages with small
            bases can show extreme growth percentages. This is a leading
            indicator, not a direct measure of job displacement.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-black/[0.04] text-[11px] text-[var(--muted)]">
        <p>
          Data source:{" "}
          <a
            href="https://pypistats.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            pypistats.org
          </a>{" "}
          (last 180 days of daily download data, excluding mirrors). Historical
          backfill available via Google BigQuery&apos;s{" "}
          <code className="text-[10px] bg-black/[0.04] px-1 py-0.5 rounded">
            bigquery-public-data.pypi.file_downloads
          </code>{" "}
          dataset. Updated monthly.
        </p>
      </div>
    </section>
  );
}

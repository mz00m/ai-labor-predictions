export function Portfolio() {
  return (
    <section id="work" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Case study
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-400">
            A production site, live on the web. Not a concept.
          </p>
        </div>

        <a
          href="https://jobsdata.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-12 block overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1 transition-all hover:border-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/5"
        >
          {/* Header bar */}
          <div className="border-b border-white/[0.06] bg-surface-2/50 px-8 py-4 sm:px-10">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">jobsdata.ai</span>
              <span className="text-[13px] text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                Visit live site &rarr;
              </span>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h3 className="text-xl font-semibold text-white">
              AI Labor Market Predictions
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-400">
              A public dashboard tracking AI&apos;s impact on the US labor market.
              17 interactive prediction graphs synthesizing 300+ research
              sources — academic papers, government data, and institutional
              analysis — into a single navigable interface with a 4-tier
              evidence system.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/[0.06] pt-8">
              {[
                { value: "17", label: "Interactive graphs" },
                { value: "300+", label: "Verified sources" },
                { value: "4-tier", label: "Evidence system" },
                { value: "5", label: "Data categories" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-semibold text-white tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[13px] text-gray-600">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Tech tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "React", "Recharts", "TypeScript", "Tailwind CSS"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.06] bg-surface-2 px-3 py-1 text-[12px] text-gray-500"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

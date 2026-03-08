export function Portfolio() {
  return (
    <section id="work" className="px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
          Case <span className="font-semibold">study</span>
        </h2>

        <div className="mt-6 h-px w-full bg-white/[0.06]" />

        <a
          href="https://jobsdata.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-12 block"
        >
          {/* Image placeholder with arc decoration */}
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-surface-1">
            {/* Decorative arc inside the card */}
            <svg
              className="pointer-events-none absolute bottom-0 left-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 800 400"
            >
              <ellipse
                cx="400"
                cy="420"
                rx="350"
                ry="120"
                fill="none"
                stroke="rgba(20,184,166,0.06)"
                strokeWidth="1"
              />
            </svg>

            <div className="relative p-8 sm:p-12">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium text-brand-500">
                    jobsdata.ai
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    AI Labor Market Predictions
                  </h3>
                </div>
                <span className="hidden text-sm text-brand-400 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                  Visit &rarr;
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-400">
                A public dashboard tracking AI&apos;s impact on the US labor
                market. 17 interactive prediction graphs synthesizing 300+
                research sources — academic papers, government data, and
                institutional analysis — into a single navigable interface
                with a 4-tier evidence system.
              </p>

              {/* Horizontal rule */}
              <div className="mt-8 h-px w-full bg-white/[0.06]" />

              {/* Stats row */}
              <div className="mt-8 flex flex-wrap gap-x-16 gap-y-4">
                {[
                  { value: "17", label: "Interactive graphs" },
                  { value: "300+", label: "Verified sources" },
                  { value: "4-tier", label: "Evidence system" },
                  { value: "5", label: "Data categories" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-semibold tabular-nums text-white">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[13px] text-gray-600">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tech */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Next.js", "React", "Recharts", "TypeScript", "Tailwind"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/[0.06] px-2.5 py-1 text-[12px] text-gray-600"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

const projects = [
  {
    title: "AI Labor Market Predictions",
    url: "https://jobsdata.ai",
    description:
      "17 interactive prediction graphs tracking AI's impact on the US labor market. Synthesizes 300+ research sources across displacement, wages, and adoption metrics.",
    tags: ["Next.js", "Recharts", "17 interactive charts", "300+ sources"],
    stats: [
      { label: "Prediction graphs", value: "17" },
      { label: "Verified sources", value: "300+" },
      { label: "Evidence tiers", value: "4" },
    ],
  },
];

export function Portfolio() {
  return (
    <section id="work" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          Our Work
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Data stories in production
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Real projects, live on the web. Not concept art.
        </p>

        <div className="mt-12 space-y-8">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition hover:border-brand-600/50 hover:bg-gray-900 sm:p-10"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold group-hover:text-brand-400 transition">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-gray-400 max-w-xl">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-8 lg:gap-12">
                  {project.stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-2xl font-bold text-white">{s.value}</p>
                      <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-sm text-brand-400 opacity-0 transition group-hover:opacity-100">
                Visit live site &rarr;
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

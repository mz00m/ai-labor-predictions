const services = [
  {
    title: "Research to interactive",
    description:
      "Academic papers, government reports, and institutional analysis — transformed into explorable data stories your audience will actually read.",
    for: "Think tanks, foundations, universities",
  },
  {
    title: "Policy dashboards",
    description:
      "Evidence-based interactive tools for advocacy and public communication. Not Tableau embeds. Real web experiences that embed anywhere.",
    for: "NGOs, government, advocacy orgs",
  },
  {
    title: "Scrollytelling",
    description:
      "Guided narratives that walk readers through complex data, step by step. The format used by the NYT, The Guardian, and The Pudding.",
    for: "Annual reports, impact stories, campaigns",
  },
  {
    title: "Corporate data stories",
    description:
      "Investor relations, ESG reporting, internal analytics — as clean, interactive experiences instead of static slides no one opens twice.",
    for: "Public companies, startups, consulting firms",
  },
];

export function Services() {
  return (
    <section id="services" className="px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
          What we <span className="font-semibold">build</span>
        </h2>

        {/* Divider line */}
        <div className="mt-6 h-px w-full bg-white/[0.06]" />

        <div className="mt-12 space-y-0">
          {services.map((s, i) => (
            <div key={s.title}>
              <div className="group grid gap-4 py-8 sm:grid-cols-12 sm:gap-8">
                <div className="sm:col-span-4">
                  <h3 className="text-[15px] font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-gray-600">{s.for}</p>
                </div>
                <div className="sm:col-span-8">
                  <p className="text-[15px] leading-relaxed text-gray-400">
                    {s.description}
                  </p>
                </div>
              </div>
              {i < services.length - 1 && (
                <div className="h-px w-full bg-white/[0.04]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

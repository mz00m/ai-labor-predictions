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
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What we build
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-400">
            Interactive, embeddable data experiences for organizations whose
            work is too important for static charts.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] sm:grid-cols-2">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group bg-surface-1 p-8 transition-colors hover:bg-surface-2 sm:p-10 ${
                i < 2 ? "sm:border-b sm:border-white/[0.06]" : ""
              } ${i % 2 === 0 ? "sm:border-r sm:border-white/[0.06]" : ""}`}
            >
              <h3 className="text-[15px] font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-400">
                {s.description}
              </p>
              <p className="mt-5 text-[13px] text-gray-600">{s.for}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

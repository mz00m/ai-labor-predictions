const services = [
  {
    title: "Research Visualization",
    description:
      "Transform academic papers, government reports, and institutional analysis into interactive explorable data stories.",
    examples: "Think tanks, foundations, university research groups",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Policy Dashboards",
    description:
      "Evidence-based interactive dashboards for advocacy, public communication, and decision-making. Not Tableau embeds — real web experiences.",
    examples: "NGOs, government agencies, advocacy organizations",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Scrollytelling",
    description:
      "Guided narrative experiences that walk readers through complex data, step by step. The format used by NYT, The Guardian, and The Pudding.",
    examples: "Annual reports, impact reports, campaign microsites",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    title: "Corporate Data Stories",
    description:
      "Investor relations, ESG reporting, and internal analytics — presented as clean, interactive web experiences instead of static slides.",
    examples: "Startups, public companies, consulting firms",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <section id="services" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          What We Do
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Data that moves people to act
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          We build interactive, embeddable data experiences for organizations
          whose work is too important for static charts.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition hover:border-gray-700 hover:bg-gray-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10 text-brand-400">
                {s.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-gray-400">{s.description}</p>
              <p className="mt-4 text-sm text-gray-600">{s.examples}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Share your data",
    description:
      "Send us the research paper, dataset, or report. We review it and identify the core stories your data can tell.",
  },
  {
    number: "02",
    title: "Interactive prototype",
    description:
      "Within days, you get a live prototype — a real interactive site, not a mockup. We iterate from there.",
  },
  {
    number: "03",
    title: "Refine and polish",
    description:
      "We fine-tune the narrative, interactions, and visual design. Every data point is verified and sourced.",
  },
  {
    number: "04",
    title: "Ship it",
    description:
      "You get a production-ready, responsive site deployed to your domain. No ongoing licensing fees.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          How It Works
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          From raw data to live site in weeks, not months
        </h2>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="text-4xl font-bold text-brand-600/20">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

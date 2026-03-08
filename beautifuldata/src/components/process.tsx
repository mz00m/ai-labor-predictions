const steps = [
  {
    number: "01",
    title: "Send us the data",
    description:
      "A research paper, a dataset, a report. We review it and map the stories it can tell.",
  },
  {
    number: "02",
    title: "Live prototype in days",
    description:
      "Not a mockup — a working interactive site. You click through it, we iterate together.",
  },
  {
    number: "03",
    title: "Refine every detail",
    description:
      "Narrative, interactions, visual design. Every data point verified and sourced.",
  },
  {
    number: "04",
    title: "Ship to your domain",
    description:
      "Production-ready, responsive, fast. Deployed to your infrastructure. No licensing fees, ever.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From raw data to live site
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-400">
            Weeks, not months. We move fast because the tools have changed.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-[19px] top-0 hidden h-full w-px bg-gradient-to-b from-brand-600/40 via-brand-600/20 to-transparent lg:left-0 lg:right-0 lg:top-[19px] lg:mx-auto lg:h-px lg:w-full lg:bg-gradient-to-r" />

          <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative pl-12 lg:pl-0">
                {/* Step indicator */}
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-surface-2 text-[13px] font-medium text-brand-400 lg:relative lg:mx-auto lg:mb-6">
                  {step.number}
                </div>
                <div className="lg:text-center">
                  <h3 className="text-[15px] font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

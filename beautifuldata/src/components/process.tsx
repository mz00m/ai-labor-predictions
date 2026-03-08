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
      "Production-ready, responsive, fast. Your infrastructure. No licensing fees, ever.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative px-6 py-28">
      {/* Soft arc across the section */}
      <svg
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 600"
      >
        <path
          d="M 0 300 Q 600 100 1200 300"
          fill="none"
          stroke="rgba(20,184,166,0.05)"
          strokeWidth="1"
        />
      </svg>

      <div className="relative mx-auto max-w-5xl">
        <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
          How it <span className="font-semibold">works</span>
        </h2>

        <div className="mt-6 h-px w-full bg-white/[0.06]" />

        <div className="mt-16 grid gap-16 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="text-[13px] font-medium text-brand-500">
                {step.number}
              </span>
              {/* Small arc under the number */}
              <svg className="mt-2 mb-4 h-3 w-12" viewBox="0 0 48 12">
                <path
                  d="M 0 0 Q 24 12 48 0"
                  fill="none"
                  stroke="rgba(20,184,166,0.2)"
                  strokeWidth="1"
                />
              </svg>
              <h3 className="text-[15px] font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

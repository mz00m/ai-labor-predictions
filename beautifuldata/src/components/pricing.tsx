const tiers = [
  {
    name: "Starter",
    price: "$5k",
    unit: "project",
    description: "One focused interactive visualization, deployed to your domain.",
    features: [
      "Single interactive visualization",
      "Up to 3 chart types",
      "Responsive design",
      "Deployed to your domain",
      "2-3 week delivery",
    ],
    cta: "Get started",
    href: "#contact",
    highlight: false,
  },
  {
    name: "Standard",
    price: "$12k",
    unit: "project",
    description:
      "A multi-page interactive site with scrollytelling narrative.",
    features: [
      "Multi-page interactive site",
      "Scrollytelling narrative",
      "Multiple data sources",
      "Source verification system",
      "4-6 week delivery",
    ],
    cta: "Get started",
    href: "#contact",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$20k+",
    unit: "project",
    description:
      "A full interactive data platform with automated pipelines.",
    features: [
      "Full interactive data site",
      "Custom chart components",
      "Automated data pipeline",
      "Evidence tier system",
      "6-10 week delivery",
    ],
    cta: "Let\u2019s talk",
    href: "#contact",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pricing
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-400">
            Fixed scope, fixed price. No hourly billing surprises.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                tier.highlight
                  ? "border-brand-600/40 bg-surface-1 shadow-xl shadow-brand-600/[0.06]"
                  : "border-white/[0.06] bg-surface-1 hover:border-white/[0.1]"
              }`}
            >
              <div>
                <h3 className="text-[15px] font-semibold text-white">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-[13px] text-gray-600">
                    / {tier.unit}
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-gray-500">
                  {tier.description}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-[14px] text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={`mt-8 block rounded-full px-6 py-3 text-center text-[14px] font-medium transition-all ${
                  tier.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-500 hover:shadow-md hover:shadow-brand-600/20"
                    : "border border-white/[0.1] text-gray-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[14px] text-gray-600">
          Need something different?{" "}
          <a
            href="#contact"
            className="text-brand-400 transition-colors hover:text-brand-300"
          >
            Tell us what you&apos;re building.
          </a>
        </p>
      </div>
    </section>
  );
}

const tiers = [
  {
    name: "Starter",
    price: "$5k",
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
    description: "A multi-page interactive site with scrollytelling narrative.",
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
    description: "A full interactive data platform with automated pipelines.",
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
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
          <span className="font-semibold">Pricing</span>
        </h2>
        <p className="mt-4 text-[17px] text-gray-400">
          Fixed scope, fixed price. No hourly billing.
        </p>

        <div className="mt-6 h-px w-full bg-white/[0.06]" />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-xl border p-8 transition-all ${
                tier.highlight
                  ? "border-brand-600/30 bg-surface-1"
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
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-gray-500">
                  {tier.description}
                </p>
              </div>

              {/* Thin divider */}
              <div className="my-6 h-px w-full bg-white/[0.04]" />

              <ul className="flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-brand-500" />
                    <span className="text-[14px] text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={`mt-8 block rounded-lg px-6 py-3 text-center text-[14px] font-medium transition-all ${
                  tier.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-500"
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

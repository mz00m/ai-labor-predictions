const tiers = [
  {
    name: "Starter",
    price: "$5,000",
    description: "A single focused interactive visualization or dashboard.",
    features: [
      "1 interactive visualization",
      "Up to 3 chart types",
      "Responsive design",
      "Deployed to your domain",
      "2-3 week delivery",
    ],
    cta: "Start a Starter Project",
    href: "#contact",
    highlight: false,
  },
  {
    name: "Standard",
    price: "$12,000",
    description:
      "A multi-view interactive site or scrollytelling data experience.",
    features: [
      "Multi-page interactive site",
      "Scrollytelling narrative",
      "Multiple data sources",
      "Source verification system",
      "4-6 week delivery",
    ],
    cta: "Start a Standard Project",
    // Replace with your Stripe payment link when ready
    href: "#contact",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$20,000+",
    description:
      "A full interactive data platform — like our jobsdata.ai project.",
    features: [
      "Full interactive data site",
      "Custom chart components",
      "Automated data pipeline",
      "Evidence tier system",
      "6-10 week delivery",
    ],
    cta: "Discuss a Premium Project",
    href: "#contact",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          Pricing
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Transparent, project-based pricing
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          No hourly billing surprises. Fixed scope, fixed price.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border p-8 transition ${
                tier.highlight
                  ? "border-brand-600 bg-gray-900 shadow-lg shadow-brand-600/10"
                  : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-4">
                <span className="text-3xl font-bold">{tier.price}</span>
              </p>
              <p className="mt-2 text-sm text-gray-400">{tier.description}</p>

              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={`mt-8 block rounded-lg px-6 py-3 text-center text-sm font-medium transition ${
                  tier.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-500"
                    : "border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Need something custom? <a href="#contact" className="text-brand-400 hover:underline">Let&apos;s talk.</a>
        </p>
      </div>
    </section>
  );
}

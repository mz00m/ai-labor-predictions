import Link from "next/link";

const concepts = [
  {
    title: "The J-Curve",
    href: "/j-curve",
    description:
      "Transformative technologies make productivity look worse before making it better. AI is likely in this dip right now.",
    accent: "border-amber-400/60",
    tag: "Framework",
  },
  {
    title: "The Firm Response",
    href: "/signals#productivity-paths",
    description:
      "When workers get more productive, firms choose one of three paths: reduce headcount, amplify output, or expand into new markets.",
    accent: "border-emerald-400/60",
    tag: "Mechanism",
  },
  {
    title: "The Productivity Question",
    href: "/productivity",
    description:
      "Individual studies show 14-56% productivity gains from AI, but macro data hasn't moved. Understanding this gap is key.",
    accent: "border-blue-400/60",
    tag: "Evidence",
  },
  {
    title: "Historical Parallels",
    href: "/history",
    description:
      "Steam, electricity, computers — every general-purpose technology followed the same arc. AI is doing for cognition what electricity did for physical power.",
    accent: "border-purple-400/60",
    tag: "Context",
  },
];

export default function ConceptExplainers() {
  return (
    <section className="mt-16 mb-4">
      <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-5">
        Important Concepts to Understand
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {concepts.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group card-hover block border-l-[3px] ${c.accent} rounded-r-lg px-5 py-4 no-underline`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-60">
              {c.tag}
            </span>
            <h4 className="text-[15px] font-bold text-[var(--foreground)] mt-1 mb-2 group-hover:text-[var(--accent)] transition-colors">
              {c.title}
              <span className="inline-block ml-1.5 text-[12px] opacity-0 group-hover:opacity-60 transition-opacity duration-150">
                &rarr;
              </span>
            </h4>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed">
              {c.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

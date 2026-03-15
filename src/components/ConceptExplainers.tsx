import Link from "next/link";

const concepts = [
  {
    title: "We've Seen This Before",
    href: "/history",
    description:
      "Every major technology — steam, electricity, computers — displaced jobs, then created more. Here's what those transitions actually looked like and what they tell us about AI.",
    accent: "border-purple-400/60",
    tag: "History",
  },
  {
    title: "Why Productivity Hasn't Moved",
    href: "/productivity",
    description:
      "AI boosts individual output by 14-56% in studies, but the economy-wide numbers haven't budged. This gap explains why job losses haven't materialized yet.",
    accent: "border-blue-400/60",
    tag: "The paradox",
  },
  {
    title: "What Happens to Your Job",
    href: "/signals#productivity-paths",
    description:
      "When AI makes workers more productive, companies do one of three things: cut headcount, increase output, or expand into new markets. Which path your employer takes matters more than the technology itself.",
    accent: "border-emerald-400/60",
    tag: "Firm response",
  },
  {
    title: "The Dip Before the Payoff",
    href: "/j-curve",
    description:
      "New technologies often make things worse before they make them better. AI is likely in this messy middle period right now — and that's actually normal.",
    accent: "border-amber-400/60",
    tag: "J-Curve",
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

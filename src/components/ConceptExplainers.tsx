import Link from "next/link";

const concepts = [
  {
    title: "We've Seen This Before",
    href: "/history",
    description:
      "Every major technology. Steam, electricity, computers. Displaced jobs, then created more. Here's what those transitions actually looked like.",
    accent: "border-purple-400/60",
    tag: "History",
  },
  {
    title: "Why Isn't AI Showing Up Yet?",
    href: "/productivity",
    description:
      "Workers using AI are dramatically more productive. But the economy? Flat. That mismatch is actually the key to understanding everything on this page.",
    accent: "border-blue-400/60",
    tag: "The paradox",
  },
  {
    title: "What Happens to Your Job",
    href: "/task-visualizer",
    description:
      "AI doesn't replace jobs wholesale. It automates specific tasks. See which parts of your role are most exposed and which ones aren't going anywhere.",
    accent: "border-emerald-400/60",
    tag: "Your tasks",
  },
  {
    title: "What Your Employer Will Do",
    href: "/signals#productivity-paths",
    description:
      "When AI makes your team more productive, your company picks one of three paths: cut costs, do more with the same people, or chase new markets. That choice matters more than the tech.",
    accent: "border-red-400/60",
    tag: "Firm response",
  },
  {
    title: "When Cheaper Means More Jobs",
    href: "/demand-elasticity",
    description:
      "AI makes work cheaper. In many sectors, that doesn't eliminate jobs. It creates demand that didn't exist before. The Jevons Paradox, applied to labor.",
    accent: "border-cyan-400/60",
    tag: "Demand elasticity",
  },
  {
    title: "The Dip Before the Payoff",
    href: "/j-curve",
    description:
      "New technologies often make things worse before they make them better. AI is likely in this messy middle right now, and that's actually normal.",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {concepts.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group concept-card block border-l-[3px] ${c.accent} rounded-r-lg px-5 py-4 no-underline`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-60">
              {c.tag}
            </span>
            <h4 className="text-[15px] font-bold text-[var(--foreground)] mt-1 mb-2 group-hover:text-[var(--accent)] transition-colors">
              {c.title}
              <span className="concept-arrow inline-block ml-1.5 text-[12px] opacity-0">
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

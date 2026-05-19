"use client";

import Link from "next/link";

interface Tool {
  href: string;
  label: string;
  tagline: string;
}

const TOOLS: Tool[] = [
  { href: "/model", label: "The Model", tagline: "Engine + knobs" },
  { href: "/model/policy", label: "Diagnose a Policy", tagline: "Single policy × region" },
  { href: "/model/budget", label: "Plan a Budget", tagline: "Optimize for $ cap" },
  { href: "/model/portfolio", label: "Build a Portfolio", tagline: "Stack your own" },
];

/**
 * Persistent tools navigation for the /model family of pages. Pass the current
 * pathname (Next.js usePathname()) so the active tool is highlighted.
 */
export default function ModelToolsNav({ active }: { active: string }) {
  return (
    <nav className="mb-6 -mx-1 overflow-x-auto" aria-label="Model tools">
      <ul className="flex items-stretch gap-1 min-w-max">
        {TOOLS.map((tool) => {
          const isActive = active === tool.href;
          return (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className={`block px-4 py-2.5 rounded-lg border-2 transition-colors ${
                  isActive
                    ? "border-[var(--foreground)] bg-card"
                    : "border-transparent bg-card hover:border-[var(--muted)]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <p
                  className={`text-sm leading-tight ${
                    isActive
                      ? "font-semibold text-[var(--foreground)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {tool.label}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-0.5">
                  {tool.tagline}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/#research-feed", label: "Research" },
  { href: "/#methodology", label: "Methodology" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/[0.04]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-[13px] sm:text-[14px] font-semibold tracking-[-0.01em] text-[var(--foreground)] hover:opacity-70"
        >
          Early Signals of AI Impact
        </Link>
        <div className="hidden sm:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.03] px-2.5 py-1.5 rounded-md"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/mz00m/ai-labor-predictions/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.03] px-2.5 py-1.5 rounded-md"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
            </svg>
            Fork
          </a>
        </div>
      </div>
    </nav>
  );
}

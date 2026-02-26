import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/#research-feed", label: "Research" },
  { href: "/about", label: "About" },
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
        </div>
      </div>
    </nav>
  );
}

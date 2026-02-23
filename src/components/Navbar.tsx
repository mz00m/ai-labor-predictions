import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-[18px] font-black tracking-tight text-[var(--foreground)] hover:opacity-70"
        >
          AI &amp; Labor
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[15px] text-[var(--foreground)] hover:opacity-60 font-bold underline underline-offset-4"
          >
            Dashboard
          </Link>
          <span className="text-[13px] text-[var(--muted)] italic">
            A weekend vibe coding project of{" "}
            <a
              href="https://www.linkedin.com/in/mattzieger"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              Matt Zieger
            </a>
          </span>
        </div>
      </div>
    </nav>
  );
}

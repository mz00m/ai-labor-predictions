"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/#productivity-predictions", label: "Productivity" },
  { href: "/#research-feed", label: "Research" },
  { href: "/about#methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/[0.04]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-[13px] sm:text-[14px] font-semibold tracking-[-0.01em] text-[var(--foreground)] hover:opacity-70"
        >
          Early Signals of AI Impact
        </Link>

        {/* Desktop nav */}
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

        {/* Mobile: About link + hamburger */}
        <div className="flex sm:hidden items-center gap-2" ref={menuRef}>
          <Link
            href="/about"
            className="text-[12px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1.5"
          >
            About
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-1.5 -mr-1.5 rounded-md hover:bg-black/[0.04] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-[var(--muted)]"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </>
              )}
            </svg>
          </button>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="absolute top-12 right-4 left-4 bg-white rounded-lg border border-black/[0.08] shadow-lg py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-[13px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.03] px-4 py-2.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

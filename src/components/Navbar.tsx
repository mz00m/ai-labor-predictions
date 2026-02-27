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
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <svg
            width="215"
            height="32"
            viewBox="0 0 430 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            {/* Bar chart logo */}
            <rect x="33" y="5" width="10" height="46" fill="#F66B5C" />
            <rect x="3" y="25" width="10" height="26" fill="#5C61F6" />
            <rect x="18" y="15" width="10" height="36" fill="#5C61F6" />
            <rect x="33" y="5" width="5" height="5" fill="white" fillOpacity="0.69" />
            <rect x="38" y="0" width="5" height="5" fill="#F66B5C" fillOpacity="0.28" />
            <rect x="18" y="20" width="5" height="5" fill="white" fillOpacity="0.69" />
            <path d="M33 15.5H38V20.5H33V15.5Z" fill="white" fillOpacity="0.75" />
            <rect x="38" y="10" width="5" height="5" fill="white" fillOpacity="0.69" />
            <rect x="23" y="15" width="5" height="5" fill="white" fillOpacity="0.69" />
            {/* Text */}
            <text
              x="58"
              y="40"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              fontSize="22"
              fontWeight="500"
              fill="#6b7280"
            >
              Early Signals of AI Impact
            </text>
          </svg>
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

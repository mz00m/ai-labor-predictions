"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface SectionBarProps {
  title: string;
  description: string;
  href: string;
  tag?: string;
  accentColor: string;
  watermark?: ReactNode;
  className?: string;
}

export default function SectionBar({
  title,
  description,
  href,
  tag,
  accentColor,
  watermark,
  className = "py-16 sm:py-20",
}: SectionBarProps) {
  return (
    <Link
      href={href}
      className={`group relative block -mx-6 sm:-mx-10 px-6 sm:px-10 border-t border-black/[0.06] no-underline ${className}`}
      style={{
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${accentColor}08`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Watermark */}
      {watermark && (
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block opacity-[0.06] group-hover:opacity-[0.10]"
          style={{ transition: "opacity 0.2s ease" }}
        >
          {watermark}
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-4xl">
        {tag && (
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: accentColor }}
          >
            {tag}
          </p>
        )}
        <div className="flex items-start justify-between gap-8">
          <div>
            <h2 className="text-[28px] sm:text-[40px] font-black tracking-tight text-[var(--foreground)] leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-[15px] text-[var(--muted)] leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          {/* Arrow */}
          <div
            className="shrink-0 mt-2 sm:mt-4 text-[var(--muted)] opacity-0 group-hover:opacity-60 translate-x-0 group-hover:translate-x-1"
            style={{ transition: "opacity 0.2s ease, transform 0.2s ease" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

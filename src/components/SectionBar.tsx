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
  stat?: { value: string; label: string };
  className?: string;
}

export default function SectionBar({
  title,
  description,
  href,
  tag,
  accentColor,
  watermark,
  stat,
  className,
}: SectionBarProps) {
  return (
    <Link
      href={href}
      className={`group relative block -mx-6 sm:-mx-10 px-6 sm:px-10 border-t border-black/[0.06] no-underline py-5 sm:py-6 ${className ?? ""}`}
      style={{ transition: "background-color 0.15s ease" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${accentColor}0A`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Watermark — more visible, shifted right */}
      {watermark && (
        <div
          className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block opacity-[0.10] group-hover:opacity-[0.18]"
          style={{ transition: "opacity 0.2s ease" }}
        >
          {watermark}
        </div>
      )}

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: accentColor, transition: "opacity 0.15s ease" }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-6 sm:gap-8">
        {/* Text block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight text-[var(--foreground)] leading-snug">
              {title}
            </h2>
            {tag && (
              <span
                className="text-[10px] font-bold uppercase tracking-widest shrink-0"
                style={{ color: accentColor }}
              >
                {tag}
              </span>
            )}
          </div>
          <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {/* Stat pill — visible on hover */}
        {stat && (
          <div
            className="hidden sm:flex items-baseline gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            style={{ transition: "opacity 0.2s ease, transform 0.2s ease" }}
          >
            <span className="text-[20px] font-black tracking-tight" style={{ color: accentColor }}>
              {stat.value}
            </span>
            <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        )}

        {/* Arrow */}
        <div
          className="shrink-0 text-[var(--muted)] opacity-30 group-hover:opacity-70 translate-x-0 group-hover:translate-x-1"
          style={{ transition: "opacity 0.15s ease, transform 0.15s ease" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

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
  featured?: boolean;
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
  featured,
}: SectionBarProps) {
  return (
    <Link
      href={href}
      className={`group relative block -mx-6 sm:-mx-10 px-6 sm:px-10 border-t border-card no-underline ${featured ? "py-7 sm:py-9" : "py-5 sm:py-6"} ${className ?? ""}`}
      style={{ transition: "background-color 0.2s ease" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${accentColor}${featured ? "0F" : "0A"}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Watermark - larger and more visible for featured */}
      {watermark && (
        <div
          className={`absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block ${featured ? "opacity-[0.15] group-hover:opacity-[0.28] scale-110 group-hover:scale-125" : "opacity-[0.10] group-hover:opacity-[0.18]"}`}
          style={{ transition: "opacity 0.3s ease, transform 0.3s ease" }}
        >
          {watermark}
        </div>
      )}

      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 rounded-r ${featured ? "w-[4px] opacity-40 group-hover:opacity-100" : "w-[3px] opacity-0 group-hover:opacity-100"}`}
        style={{ backgroundColor: accentColor, transition: "opacity 0.2s ease" }}
      />

      {/* Featured glow on hover */}
      {featured && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, ${accentColor}08 0%, transparent 60%)`,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Content */}
      <div className="relative flex items-center gap-6 sm:gap-8">
        {/* Text block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className={`section-title ${featured ? "text-heading-sm sm:text-heading-lg" : "text-2xl sm:text-3xl"} font-extrabold tracking-tight text-[var(--foreground)] leading-snug`}>
              {title}
            </h2>
            {tag && (
              <span
                className="text-2xs font-bold uppercase tracking-widest shrink-0"
                style={{ color: accentColor }}
              >
                {tag}
              </span>
            )}
          </div>
          <p className={`${featured ? "text-md max-w-2xl" : "text-base max-w-xl"} text-[var(--muted)] leading-relaxed line-clamp-2`}>
            {description}
          </p>
        </div>

        {/* Stat pill - always visible for featured, hover-only for regular */}
        {stat && (
          <div
            className={`hidden sm:flex items-baseline gap-1.5 shrink-0 ${featured ? "opacity-60 group-hover:opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"}`}
            style={{ transition: "opacity 0.2s ease, transform 0.2s ease" }}
          >
            <span className={`${featured ? "text-heading" : "text-heading-sm"} font-black tracking-tight`} style={{ color: accentColor }}>
              {stat.value}
            </span>
            <span className="text-2xs text-[var(--muted)] uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        )}

        {/* Arrow */}
        <div
          className={`shrink-0 text-[var(--muted)] ${featured ? "opacity-40" : "opacity-30"} group-hover:opacity-70 translate-x-0 group-hover:translate-x-1`}
          style={{ transition: "opacity 0.15s ease, transform 0.15s ease" }}
        >
          <svg width={featured ? "20" : "16"} height={featured ? "20" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

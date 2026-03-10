"use client";

import { useEffect, useRef, useState } from "react";
import { getTierConfig } from "@/lib/evidence-tiers";
import { format, parseISO } from "date-fns";
import type { SourceWithContext } from "@/lib/sources";

interface RecentSourcesProps {
  sources: SourceWithContext[];
}

export default function RecentSources({ sources }: RecentSourcesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf: number;
    const speed = 0.4; // px per frame (~24px/sec at 60fps)

    function step() {
      if (!paused && el) {
        el.scrollTop += speed;
        // Loop: when we hit the bottom, jump back to the top
        if (el.scrollTop >= el.scrollHeight - el.clientHeight - 1) {
          el.scrollTop = 0;
        }
      }
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Soft outer glow / fade effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow:
            "0 0 40px 8px rgba(255,255,255,0.7), 0 1px 3px rgba(0,0,0,0.03)",
        }}
      />

      {/* Main container — white bg with very subtle border */}
      <div
        className="relative bg-white/80 backdrop-blur-sm rounded-2xl"
        style={{
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-black/[0.04]">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)] opacity-50">
            Recently Added
          </h3>
        </div>

        {/* Scrolling feed with top/bottom fade masks */}
        <div className="relative">
          {/* Top fade */}
          <div
            className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))",
            }}
          />

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-10 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0))",
            }}
          />

          <div
            ref={scrollRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="max-h-[420px] overflow-y-auto px-4 py-3 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {sources.map((source) => {
              const config = getTierConfig(source.evidenceTier);
              return (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 py-2.5 border-b border-black/[0.03] last:border-b-0 hover:opacity-60 transition-opacity"
                >
                  <span
                    className="mt-[5px] inline-block w-1.5 h-1.5 rounded-full shrink-0 opacity-70"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-[var(--foreground)] leading-snug line-clamp-2 opacity-80">
                      {source.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="text-[9px] font-medium opacity-60"
                        style={{ color: config.color }}
                      >
                        {config.shortLabel}
                      </span>
                      <span className="text-[9px] text-[var(--muted)] opacity-25">
                        ·
                      </span>
                      <span className="text-[10px] text-[var(--muted)] opacity-40">
                        {source.dateAdded
                          ? `Added ${format(parseISO(source.dateAdded), "MMM d, yyyy")}`
                          : format(parseISO(source.datePublished), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

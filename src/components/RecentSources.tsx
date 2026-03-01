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
    <div className="bg-[var(--accent-light)] rounded-xl border border-[var(--accent)]/10 overflow-hidden">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[var(--accent-light)] px-4 py-3 border-b border-[var(--accent)]/10">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)]">
          Recently Added
        </h3>
      </div>

      {/* Scrolling feed */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="max-h-[420px] overflow-y-auto px-4 py-2 scrollbar-none"
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
              className="flex items-start gap-2 py-2 border-b border-black/[0.04] last:border-b-0 hover:opacity-70 transition-opacity"
            >
              <span
                className="mt-[5px] inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[var(--foreground)] leading-snug truncate">
                  {source.title}
                </p>
                <p className="text-[11px] text-[var(--muted)] opacity-60 mt-0.5">
                  {format(parseISO(source.datePublished), "MMM d, yyyy")}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

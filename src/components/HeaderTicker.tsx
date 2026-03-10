"use client";

import { useEffect, useRef, useState } from "react";
import { getTierConfig } from "@/lib/evidence-tiers";
import type { Source } from "@/lib/types";

interface HeaderTickerProps {
  sources: Pick<Source, "id" | "title" | "url" | "evidenceTier" | "dateAdded" | "datePublished">[];
}

export default function HeaderTicker({ sources }: HeaderTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf: number;
    const speed = 0.3;

    function step() {
      if (!paused && el) {
        el.scrollTop += speed;
        if (el.scrollTop >= el.scrollHeight - el.clientHeight - 1) {
          el.scrollTop = 0;
        }
      }
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  if (!sources.length) return null;

  return (
    <div
      className="hidden lg:block fixed top-0 right-0 w-[260px] h-12 z-40 pointer-events-none"
      style={{ opacity: 0.35 }}
    >
      {/* Left fade into navbar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10"
        style={{
          background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))",
        }}
      />

      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-8 z-10"
        style={{
          background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
        }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-2 z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3 z-10"
        style={{
          background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
        }}
      />

      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="h-full overflow-hidden px-5 py-1 pointer-events-auto"
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
              className="flex items-center gap-1.5 py-[3px] hover:opacity-60 transition-opacity"
            >
              <span
                className="inline-block w-1 h-1 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-[9px] text-[var(--foreground)] truncate leading-tight">
                {source.title}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

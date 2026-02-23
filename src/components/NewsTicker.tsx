"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import type { TickerHeadline } from "@/lib/ticker-utils";

const CACHE_KEY = "ticker-headlines";
const CACHE_TTL = 3600000; // 1 hour in ms

function SentimentIcon({ sentiment }: { sentiment: TickerHeadline["sentiment"] }) {
  if (sentiment === "displacement") {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0 text-red-400"
      >
        <path
          d="M6 2v8M6 10l-3-3M6 10l3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (sentiment === "advancement") {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0 text-emerald-400"
      >
        <path
          d="M6 10V2M6 2L3 5M6 2l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // neutral
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0 text-blue-300/60"
    >
      <path
        d="M2 6h8M10 6l-3-3M10 6l-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeadlineItem({ headline }: { headline: TickerHeadline }) {
  let timeAgo: string;
  try {
    timeAgo = formatDistanceToNowStrict(new Date(headline.pubDate), {
      addSuffix: true,
    }).replace("ago", "ago");
  } catch {
    timeAgo = "";
  }

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap px-4">
      <SentimentIcon sentiment={headline.sentiment} />
      <span className="text-[11px] sm:text-[12px] font-semibold text-blue-200/70">
        {headline.source}
      </span>
      {timeAgo && (
        <>
          <span className="text-blue-300/30">·</span>
          <span className="text-[11px] sm:text-[12px] text-blue-200/40">
            {timeAgo}
          </span>
        </>
      )}
      <span className="text-blue-300/30">·</span>
      <a
        href={headline.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] sm:text-[13px] text-blue-50/90 hover:text-white"
      >
        {headline.title}
      </a>
    </span>
  );
}

export default function NewsTicker() {
  const [headlines, setHeadlines] = useState<TickerHeadline[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadHeadlines() {
      // Check sessionStorage cache first
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL && data?.length > 0) {
            setHeadlines(data);
            setLoaded(true);
            return;
          }
        }
      } catch {
        // sessionStorage unavailable (SSR or private mode)
      }

      // Fetch from API
      try {
        const res = await fetch("/api/ticker");
        if (!res.ok) throw new Error("Ticker fetch failed");
        const json = await res.json();
        const data = json.headlines || [];
        setHeadlines(data);

        // Cache in sessionStorage
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data, timestamp: Date.now() })
          );
        } catch {
          // sessionStorage full or unavailable
        }
      } catch {
        // Silently fail — ticker just stays empty
      } finally {
        setLoaded(true);
      }
    }

    loadHeadlines();
  }, []);

  // Always render the container to avoid layout shift
  return (
    <div
      className="relative bg-[#2a5280] h-9 sm:h-10 overflow-hidden flex items-center rounded-lg"
      role="marquee"
      aria-label="Latest AI labor market headlines"
    >
      {/* LIVE label */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center gap-1.5 pl-3 pr-2 sm:pl-4 sm:pr-3 bg-[#2a5280] z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-100/80">
          Live
        </span>
      </div>

      {/* Gradient fade after LIVE label */}
      <div className="absolute left-[68px] sm:left-[78px] top-0 bottom-0 w-8 bg-gradient-to-r from-[#2a5280] to-transparent z-10 pointer-events-none" />

      {/* Scrolling content */}
      {loaded && headlines.length > 0 && (
        <div className="ticker-track flex items-center ml-[76px] sm:ml-[86px]">
          {/* First copy */}
          <div className="ticker-content flex items-center">
            {headlines.map((h) => (
              <HeadlineItem key={h.id} headline={h} />
            ))}
            <span className="inline-block w-16" />
          </div>
          {/* Duplicate for seamless loop */}
          <div className="ticker-content flex items-center" aria-hidden="true">
            {headlines.map((h) => (
              <HeadlineItem key={`dup-${h.id}`} headline={h} />
            ))}
            <span className="inline-block w-16" />
          </div>
        </div>
      )}

      {/* Fallback: empty dark bar while loading or if no headlines */}
    </div>
  );
}

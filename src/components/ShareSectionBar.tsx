"use client";

import { useState } from "react";

interface ShareSectionBarProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareSectionBar({
  url,
  title,
  description,
}: ShareSectionBarProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function shareTwitter() {
    const text = encodeURIComponent(
      description ? `${title} — ${description}` : title
    );
    const u = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
      "_blank",
      "noopener"
    );
  }

  function shareLinkedIn() {
    const u = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      "_blank",
      "noopener"
    );
  }

  return (
    <div className="mt-8 rounded-xl bg-white/[0.05] dark:bg-white/[0.07] border border-white/[0.1] dark:border-white/[0.12]">
      <div className="px-5 pt-4 pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Share this view
        </span>
      </div>
      <div className="flex items-center gap-3 px-5 pb-4 pt-2 flex-wrap">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied ? "Copied" : "Copy link"}
        </button>

        <button
          onClick={shareTwitter}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-lg bg-white/[0.08] dark:bg-white/[0.1] text-[var(--foreground)] hover:bg-white/[0.15] dark:hover:bg-white/[0.18] transition-colors border border-white/[0.06] dark:border-white/[0.1]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share
        </button>

        <button
          onClick={shareLinkedIn}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-lg bg-white/[0.08] dark:bg-white/[0.1] text-[var(--foreground)] hover:bg-white/[0.15] dark:hover:bg-white/[0.18] transition-colors border border-white/[0.06] dark:border-white/[0.1]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </button>
      </div>
    </div>
  );
}

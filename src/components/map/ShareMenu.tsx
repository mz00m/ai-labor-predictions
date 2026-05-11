"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compact "Share" dropdown for /map. Pulls the current region context
 * (label + key stat + share URL) and exposes one-click share to
 * Twitter/X, LinkedIn, and Copy link.
 *
 * The URL is whatever the parent computed from the current selection —
 * see `RegionalExplorer.shareUrl`. We don't construct it here so the
 * deep-link encoding logic stays in one place.
 */

export interface ShareContext {
  /** Pretty region label, e.g. "Travis County, TX" or "Risk Map". */
  label: string;
  /** Headline stat, e.g. "42% of jobs in automation-risk occupations". */
  stat?: string;
  /** Full sentence to include in social posts. */
  fullText: string;
  /** Absolute URL pointing at the current selection. */
  url: string;
}

interface Props {
  context: ShareContext;
}

export default function ShareMenu({ context }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(context.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback for browsers without clipboard API
      window.prompt("Copy this link:", context.url);
    }
  }

  function tweetUrl() {
    const text = encodeURIComponent(context.fullText);
    const url = encodeURIComponent(context.url);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  function linkedinUrl() {
    // LinkedIn pulls title/description from the page's OG meta when the
    // article-share URL is used; passing url=… is enough.
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(context.url)}`;
  }

  function emailUrl() {
    const subject = encodeURIComponent(`AI labor risk — ${context.label}`);
    const body = encodeURIComponent(`${context.fullText}\n\n${context.url}`);
    return `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-card rounded-md text-2xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.02] transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
        title="Share this view"
      >
        <ShareIcon />
        <span>Share</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 z-30 w-[260px] bg-white border border-card rounded-md shadow-md overflow-hidden text-sm"
        >
          <div className="px-3 py-2 border-b border-card bg-[#FAFAFA]">
            <div className="text-2xs text-[var(--muted)] uppercase tracking-wider mb-0.5">
              Sharing
            </div>
            <div className="font-semibold text-[var(--foreground)] text-2xs leading-tight truncate">
              {context.label}
            </div>
            {context.stat && (
              <div className="text-2xs text-[var(--muted)] mt-0.5 leading-tight">
                {context.stat}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-black/[0.03] transition-colors text-xs"
            role="menuitem"
          >
            <CopyIcon />
            <span className="flex-1">{copied ? "Copied!" : "Copy link"}</span>
            <span className="font-mono text-2xs text-[var(--muted)] opacity-60 truncate max-w-[120px]">
              {trimUrl(context.url)}
            </span>
          </button>

          <a
            href={tweetUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 hover:bg-black/[0.03] transition-colors text-xs"
            role="menuitem"
          >
            <XIcon />
            <span>Share on X / Twitter</span>
          </a>

          <a
            href={linkedinUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 hover:bg-black/[0.03] transition-colors text-xs"
            role="menuitem"
          >
            <LinkedInIcon />
            <span>Share on LinkedIn</span>
          </a>

          <a
            href={emailUrl()}
            className="flex items-center gap-2 px-3 py-2 hover:bg-black/[0.03] transition-colors text-xs border-t border-card"
            role="menuitem"
          >
            <EmailIcon />
            <span>Email this view</span>
          </a>
        </div>
      )}
    </div>
  );
}

function trimUrl(url: string): string {
  try {
    const u = new URL(url);
    const tail = u.search ? `${u.pathname}${u.search}` : u.pathname;
    return tail.length > 30 ? `…${tail.slice(-30)}` : tail;
  } catch {
    return url.slice(-30);
  }
}

function ShareIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.5 5.5L8 2M8 2L4.5 5.5M8 2v9.5M3 11v2.5a1 1 0 001 1h8a1 1 0 001-1V11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="9" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 1h7a1 1 0 011 1v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9.524 6.787L14.875 1h-1.268L8.96 6.026 5.247 1H1l5.611 7.598L1 14.583h1.268l4.906-5.308 3.918 5.308H15l-5.476-7.796zM7.815 8.547l-.568-.78L2.726 1.945H4.68l3.653 5.018.568.78 4.745 6.518h-1.954L7.815 8.547z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM5.06 13H3V6.5h2.06V13zM4.03 5.6a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zM13 13h-2.06V9.87c0-.75-.01-1.71-1.04-1.71-1.04 0-1.2.81-1.2 1.65V13H6.65V6.5h1.97v.89h.03c.27-.52.94-1.07 1.94-1.07 2.08 0 2.46 1.37 2.46 3.15V13z" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 4l5.5 4.5L13.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

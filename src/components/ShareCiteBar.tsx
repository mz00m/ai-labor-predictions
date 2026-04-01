"use client";

import { useState, useRef } from "react";

interface ShareCiteBarProps {
  slug: string;
  title: string;
  value: number;
  unit: string;
  sourceCount: number;
  timeHorizon: string;
}

type CiteFormat = "plain" | "apa" | "bibtex";

export default function ShareCiteBar({
  slug,
  title,
  value,
  unit,
  sourceCount,
  timeHorizon,
}: ShareCiteBarProps) {
  const [showCite, setShowCite] = useState(false);
  const [citeFormat, setCiteFormat] = useState<CiteFormat>("plain");
  const [copied, setCopied] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const citeRef = useRef<HTMLDivElement>(null);

  const url = `https://jobsdata.ai/predictions/${slug}`;
  const today = new Date().toISOString().slice(0, 10);
  const unitSymbol = unit.includes("%") ? "%" : "";
  const shareText = `${title}: ${value}${unitSymbol} | based on ${sourceCount} sources. ${url}`;

  const citations: Record<CiteFormat, string> = {
    plain: `jobsdata.ai. "${title}." jobsdata.ai/predictions/${slug}. Accessed ${today}. Based on ${sourceCount} sources.`,
    apa: `jobsdata.ai. (${new Date().getFullYear()}). ${title}. Retrieved ${today}, from ${url}`,
    bibtex: `@misc{jobsdata_${slug.replace(/-/g, "_")},
  title     = {${title}},
  author    = {jobsdata.ai},
  year      = {${new Date().getFullYear()}},
  url       = {${url}},
  note      = {Based on ${sourceCount} sources. Accessed ${today}}
}`,
  };

  const embedCode = `<iframe src="${url}?embed=1" width="600" height="400" style="border:1px solid #e5e7eb;border-radius:8px;" title="${title}"></iframe>`;

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  function shareTwitter() {
    const text = encodeURIComponent(`${title}: ${value}${unitSymbol} | based on ${sourceCount} sources.`);
    const u = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${u}`, "_blank", "noopener");
  }

  function shareLinkedIn() {
    const u = encodeURIComponent(url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`, "_blank", "noopener");
  }

  return (
    <div className="rounded-xl bg-white/[0.05] dark:bg-white/[0.07] border border-white/[0.1] dark:border-white/[0.12]">
      {/* Header label */}
      <div className="px-5 pt-4 pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Share this prediction
        </span>
      </div>
      {/* Action buttons row */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-2 flex-wrap">
        <button
          onClick={() => copyToClipboard(url, "link")}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied === "link" ? "Copied" : "Copy link"}
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

        <div className="w-px h-7 bg-white/[0.12] dark:bg-white/[0.15] mx-1" />

        <button
          onClick={() => { setShowCite(!showCite); setShowEmbed(false); }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-lg transition-colors border ${
            showCite
              ? "bg-[var(--accent)]/[0.15] text-[var(--accent)] border-[var(--accent)]/[0.3]"
              : "bg-white/[0.08] dark:bg-white/[0.1] text-[var(--foreground)] hover:bg-white/[0.15] dark:hover:bg-white/[0.18] border-white/[0.06] dark:border-white/[0.1]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 17C4.89543 17 4 16.1046 4 15V11C4 9.89543 4.89543 9 6 9H8L10 5V17H6Z" />
            <path d="M15 17C13.8954 17 13 16.1046 13 15V11C13 9.89543 13.8954 9 15 9H17L19 5V17H15Z" />
          </svg>
          Cite
        </button>

        <button
          onClick={() => { setShowEmbed(!showEmbed); setShowCite(false); }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-lg transition-colors border ${
            showEmbed
              ? "bg-[var(--accent)]/[0.15] text-[var(--accent)] border-[var(--accent)]/[0.3]"
              : "bg-white/[0.08] dark:bg-white/[0.1] text-[var(--foreground)] hover:bg-white/[0.15] dark:hover:bg-white/[0.18] border-white/[0.06] dark:border-white/[0.1]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Embed
        </button>
      </div>

      {/* Citation panel */}
      {showCite && (
        <div ref={citeRef} className="border-t border-black/[0.06] dark:border-white/[0.08] px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            {(["plain", "apa", "bibtex"] as CiteFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setCiteFormat(fmt)}
                className={`px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
                  citeFormat === fmt
                    ? "bg-[var(--accent)] text-white"
                    : "bg-black/[0.04] dark:bg-white/[0.06] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {fmt === "plain" ? "Plain" : fmt === "apa" ? "APA" : "BibTeX"}
              </button>
            ))}
          </div>
          <div className="relative">
            <pre className="text-[12px] leading-relaxed text-[var(--foreground)] bg-black/[0.03] dark:bg-white/[0.03] rounded p-3 overflow-x-auto whitespace-pre-wrap font-mono">
              {citations[citeFormat]}
            </pre>
            <button
              onClick={() => copyToClipboard(citations[citeFormat], "cite")}
              className="absolute top-2 right-2 px-2 py-1 text-[11px] font-medium rounded bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
            >
              {copied === "cite" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Embed panel */}
      {showEmbed && (
        <div className="border-t border-black/[0.06] dark:border-white/[0.08] px-4 py-4">
          <p className="text-[12px] text-[var(--muted)] mb-2">
            Paste this HTML to embed the chart on your site:
          </p>
          <div className="relative">
            <pre className="text-[12px] leading-relaxed text-[var(--foreground)] bg-black/[0.03] dark:bg-white/[0.03] rounded p-3 overflow-x-auto whitespace-pre-wrap font-mono">
              {embedCode}
            </pre>
            <button
              onClick={() => copyToClipboard(embedCode, "embed")}
              className="absolute top-2 right-2 px-2 py-1 text-[11px] font-medium rounded bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
            >
              {copied === "embed" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

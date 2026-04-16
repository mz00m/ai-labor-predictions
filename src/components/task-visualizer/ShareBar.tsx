"use client";

import { useState, useCallback } from "react";

interface Props {
  jobTitle: string;
  jobId: string;
}

function shareUrl(jobId: string): string {
  return `https://www.jobsdata.ai/task-visualizer?job=${jobId}`;
}

function shareText(jobTitle: string): string {
  return `How will AI affect the job of a ${jobTitle.toLowerCase()}? See the task-by-task breakdown:`;
}

export default function ShareBar({ jobTitle, jobId }: Props) {
  const [copied, setCopied] = useState(false);
  const url = shareUrl(jobId);
  const text = shareText(jobTitle);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`AI impact on ${jobTitle}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-2xs text-[var(--muted)] mr-1">Share</span>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-2xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.03] transition-colors"
        title="Copy link"
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#059669]">
              <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Link
          </>
        )}
      </button>

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-2xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.03] transition-colors"
        title="Share on X"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-2xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.03] transition-colors"
        title="Share on LinkedIn"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>

      {/* Email */}
      <a
        href={emailUrl}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-2xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/[0.03] transition-colors"
        title="Share via email"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1 4.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Email
      </a>
    </div>
  );
}

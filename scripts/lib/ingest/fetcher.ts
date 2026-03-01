import fs from "fs";
import type { SourceContent } from "./types";

/**
 * Fetch source content from a URL, local file, or raw text string.
 */
export async function fetchSource(
  input: string,
  mode: "url" | "file" | "text"
): Promise<SourceContent> {
  switch (mode) {
    case "file": {
      if (!fs.existsSync(input)) {
        throw new Error(`File not found: ${input}`);
      }
      const text = fs.readFileSync(input, "utf-8");
      return { text };
    }

    case "url": {
      const res = await fetch(input, {
        headers: {
          "User-Agent":
            "AI-Labor-Predictions-Bot/1.0 (research-data-ingestion)",
          Accept: "text/html,application/xhtml+xml,text/plain",
        },
        redirect: "follow",
      });
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText} for ${input}`);
      }
      const contentType = res.headers.get("content-type") || "";
      const body = await res.text();

      if (
        contentType.includes("text/html") ||
        contentType.includes("xhtml")
      ) {
        return {
          text: stripHtml(body),
          url: input,
          title: extractTitle(body),
        };
      }
      // Plain text or other formats
      return { text: body, url: input };
    }

    case "text":
    default:
      return { text: input };
  }
}

/** Strip HTML to readable plain text */
function stripHtml(html: string): string {
  let text = html;

  // Remove script, style, nav, footer, header blocks
  text = text.replace(
    /<(script|style|nav|footer|header|aside|noscript)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Convert block elements to newlines
  text = text.replace(
    /<\/(p|div|h[1-6]|li|tr|blockquote|section|article|figcaption)>/gi,
    "\n"
  );
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<hr\s*\/?>/gi, "\n---\n");
  text = text.replace(/<\/?(ul|ol)>/gi, "\n");

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&mdash;": "\u2014",
    "&ndash;": "\u2013",
    "&hellip;": "\u2026",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&ldquo;": "\u201c",
    "&rdquo;": "\u201d",
    "&bull;": "\u2022",
    "&middot;": "\u00b7",
    "&trade;": "\u2122",
    "&copy;": "\u00a9",
    "&reg;": "\u00ae",
    "&eacute;": "\u00e9",
  };
  for (const [entity, char] of Object.entries(entities)) {
    text = text.replaceAll(entity, char);
  }

  // Decode numeric entities
  text = text.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code))
  );
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );

  // Clean up whitespace
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n /g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/** Extract <title> from HTML */
function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return undefined;
  return match[1].replace(/\s+/g, " ").trim();
}

export interface NBERPaper {
  id: string;
  title: string;
  abstract: string | null;
  authors: string[];
  publishedDate: string;
  url: string;
  jelCodes: string[];
}

const NBER_RSS_URLS = [
  "https://www.nber.org/rss/ls.xml", // Labor Studies
  "https://www.nber.org/rss/pr.xml", // Productivity, Innovation & Entrepreneurship
];

const AI_KEYWORDS = [
  "artificial intelligence",
  "machine learning",
  "automation",
  "ai",
  "generative ai",
  "large language model",
  "chatgpt",
  "robot",
  "algorithmic",
  "deep learning",
];

const LABOR_KEYWORDS = [
  "labor",
  "labour",
  "employment",
  "wage",
  "job",
  "workforce",
  "worker",
  "occupation",
  "hiring",
  "displacement",
  "unemployment",
];

/**
 * Parse NBER RSS XML into structured papers.
 * Uses same regex-based approach as arxiv.ts.
 */
function parseNBERRss(xml: string): NBERPaper[] {
  const papers: NBERPaper[] = [];
  const items = xml.split("<item>").slice(1);

  for (const item of items) {
    const getTag = (tag: string): string => {
      const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return match ? match[1].trim() : "";
    };

    const title = getTag("title")
      .replace(/<!\[CDATA\[/g, "")
      .replace(/\]\]>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const link = getTag("link").trim();
    const description = getTag("description")
      .replace(/<!\[CDATA\[/g, "")
      .replace(/\]\]>/g, "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const pubDate = getTag("pubDate").trim();

    // Extract author from dc:creator if available
    const creatorMatch = item.match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/);
    const authors = creatorMatch
      ? creatorMatch[1].split(/,|;| and /).map((a) => a.trim()).filter(Boolean)
      : [];

    // Extract paper number from URL for a stable ID
    const paperNumMatch = link.match(/\/papers\/w(\d+)/);
    const id = paperNumMatch ? `nber-w${paperNumMatch[1]}` : `nber-${title.slice(0, 40).replace(/\W/g, "-")}`;

    // Parse date
    let publishedDate = "";
    if (pubDate) {
      try {
        publishedDate = new Date(pubDate).toISOString().split("T")[0];
      } catch {
        publishedDate = new Date().toISOString().split("T")[0];
      }
    }

    if (title && link) {
      papers.push({
        id,
        title,
        abstract: description || null,
        authors,
        publishedDate,
        url: link,
        jelCodes: [], // JEL codes not reliably available in RSS
      });
    }
  }

  return papers;
}

/**
 * Check if a paper is relevant to AI + labor topics.
 */
function isRelevant(paper: NBERPaper): boolean {
  const text = `${paper.title} ${paper.abstract || ""}`.toLowerCase();

  const hasAI = AI_KEYWORDS.some((kw) => text.includes(kw));
  const hasLabor = LABOR_KEYWORDS.some((kw) => text.includes(kw));

  // Relevant JEL codes: J (Labor), O33 (Tech Change), O47 (Productivity)
  const hasRelevantJEL = paper.jelCodes.some(
    (code) => code.startsWith("J") || code === "O33" || code === "O47"
  );

  return (hasAI && hasLabor) || (hasAI && hasRelevantJEL);
}

export async function discoverNBERPapers(): Promise<NBERPaper[]> {
  const allPapers: NBERPaper[] = [];
  const seenIds = new Set<string>();

  for (const url of NBER_RSS_URLS) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 86400 },
      });

      if (!res.ok) {
        console.error(`NBER RSS error for ${url}: ${res.status}`);
        continue;
      }

      const xml = await res.text();
      const papers = parseNBERRss(xml);

      for (const paper of papers) {
        if (!seenIds.has(paper.id) && isRelevant(paper)) {
          seenIds.add(paper.id);
          allPapers.push(paper);
        }
      }
    } catch (err) {
      console.error(`NBER RSS failed for ${url}:`, err);
    }
  }

  return allPapers;
}

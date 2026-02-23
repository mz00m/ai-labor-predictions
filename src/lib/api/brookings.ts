export interface BrookingsPaper {
  id: string;
  title: string;
  description: string | null;
  authors: string[];
  publishedDate: string;
  url: string;
}

const BROOKINGS_RSS_URLS = [
  "https://www.brookings.edu/topic/labor-markets/feed/",
  "https://www.brookings.edu/topic/technology-innovation/feed/",
  "https://www.brookings.edu/topic/artificial-intelligence/feed/",
];

const RELEVANCE_KEYWORDS = [
  "artificial intelligence",
  "ai",
  "automation",
  "machine learning",
  "generative ai",
  "labor",
  "employment",
  "wage",
  "job",
  "workforce",
  "worker",
  "displacement",
  "chatgpt",
  "large language model",
];

/**
 * Parse Brookings RSS XML into structured papers.
 */
function parseBrookingsRss(xml: string): BrookingsPaper[] {
  const papers: BrookingsPaper[] = [];
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

    // Extract author from dc:creator
    const creatorMatch = item.match(/<dc:creator[^>]*>(?:<!\[CDATA\[)?([^\]<]+)/);
    const authors = creatorMatch
      ? creatorMatch[1].split(/,|;| and /).map((a) => a.trim()).filter(Boolean)
      : [];

    let publishedDate = "";
    if (pubDate) {
      try {
        publishedDate = new Date(pubDate).toISOString().split("T")[0];
      } catch {
        publishedDate = new Date().toISOString().split("T")[0];
      }
    }

    const id = `brookings-${title.slice(0, 50).toLowerCase().replace(/\W+/g, "-")}`;

    if (title && link) {
      papers.push({
        id,
        title,
        description: description || null,
        authors,
        publishedDate,
        url: link,
      });
    }
  }

  return papers;
}

/**
 * Check if a Brookings paper is relevant to AI + labor topics.
 * Since we're already pulling from relevant topic feeds, we use a lower threshold.
 */
function isRelevant(paper: BrookingsPaper): boolean {
  const text = `${paper.title} ${paper.description || ""}`.toLowerCase();
  let matchCount = 0;

  for (const kw of RELEVANCE_KEYWORDS) {
    if (text.includes(kw)) matchCount++;
  }

  // Require at least 2 keyword matches since topic feeds are pre-filtered
  return matchCount >= 2;
}

export async function discoverBrookingsPapers(): Promise<BrookingsPaper[]> {
  const allPapers: BrookingsPaper[] = [];
  const seenIds = new Set<string>();

  for (const url of BROOKINGS_RSS_URLS) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 86400 },
      });

      if (!res.ok) {
        console.error(`Brookings RSS error for ${url}: ${res.status}`);
        continue;
      }

      const xml = await res.text();
      const papers = parseBrookingsRss(xml);

      for (const paper of papers) {
        if (!seenIds.has(paper.id) && isRelevant(paper)) {
          seenIds.add(paper.id);
          allPapers.push(paper);
        }
      }
    } catch (err) {
      console.error(`Brookings RSS failed for ${url}:`, err);
    }
  }

  return allPapers;
}

import { NextResponse } from "next/server";
import {
  parseGoogleNewsRss,
  deduplicateHeadlines,
  isWithinDays,
  classifySentiment,
  generateId,
  type TickerHeadline,
} from "@/lib/ticker-utils";

export const revalidate = 3600; // revalidate every hour

const RSS_FEEDS = [
  "https://news.google.com/rss/search?q=AI+jobs+when:7d&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=AI+layoffs+when:7d&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=AI+hiring+workforce+when:7d&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=artificial+intelligence+employment+when:7d&hl=en-US&gl=US&ceid=US:en",
];

export async function GET() {
  try {
    // Fetch all RSS feeds in parallel, tolerating individual failures
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (url) => {
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; AI-Labor-Dashboard/1.0)",
          },
          next: { revalidate: 3600 },
        });
        if (!res.ok) return "";
        return res.text();
      })
    );

    // Collect all successful XML responses
    const allXml = results
      .filter(
        (r): r is PromiseFulfilledResult<string> =>
          r.status === "fulfilled" && r.value.length > 0
      )
      .map((r) => r.value);

    // Parse all feeds
    const allRaw = allXml.flatMap((xml) => parseGoogleNewsRss(xml));

    // Deduplicate
    const unique = deduplicateHeadlines(allRaw);

    // Filter to last 7 days
    const recent = unique.filter((h) => isWithinDays(h.pubDate, 7));

    // Classify sentiment and build final headlines
    const headlines: TickerHeadline[] = recent
      .map((h) => ({
        id: generateId(h.title),
        title: h.title,
        link: h.link,
        source: h.source,
        pubDate: h.pubDate,
        sentiment: classifySentiment(h.title),
      }))
      .sort(
        (a, b) =>
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )
      .slice(0, 15);

    return NextResponse.json({
      headlines,
      count: headlines.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Ticker feed error:", err);
    return NextResponse.json({
      headlines: [],
      count: 0,
      fetchedAt: new Date().toISOString(),
    });
  }
}

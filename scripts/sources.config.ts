/**
 * Source Adapter Registry
 *
 * Each adapter implements the SourceAdapter interface and fetches
 * from a single research/signal source. All adapters are registered
 * in ADAPTERS and run in parallel by fetch-sources.ts.
 */

import { fetchWithRetry } from "./utils/retry";
import { fetchNBER } from "./adapters/nber";
import { fetchOpenAlex } from "./adapters/open-alex";
import type { SourceName, RawItem, SourceAdapter } from "./types";

// Re-export shared types
export type { SourceName, RawItem, SourceAdapter };

// ─── Academic Adapters ────────────────────────────────────────────────

async function fetchSemanticScholar(
  query: string,
  since: Date
): Promise<RawItem[]> {
  const BASE = "https://api.semanticscholar.org/graph/v1";
  const headers: HeadersInit = process.env.SEMANTIC_SCHOLAR_API_KEY
    ? { "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY }
    : {};

  // Use year range instead of publicationDateOrYear (which often returns empty for recent papers)
  const currentYear = new Date().getFullYear();
  const sinceYear = since.getFullYear();
  const yearFilter = sinceYear === currentYear ? `${currentYear}` : `${sinceYear}-${currentYear}`;
  const res = await fetchWithRetry(
    () =>
      fetch(
        `${BASE}/paper/search?query=${encodeURIComponent(query)}&fields=title,url,externalIds,authors,year,publicationDate,citationCount,abstract&limit=50&year=${yearFilter}`,
        { headers }
      ).then((r) => r.json()),
    { label: "semanticScholar", retries: 3, baseDelayMs: 1000 }
  );

  return (res.data ?? [])
    .filter(
      (p: any) => p.publicationDate && new Date(p.publicationDate) >= since
    )
    .map(
      (p: any): RawItem => ({
        title: p.title,
        url:
          p.url ??
          `https://www.semanticscholar.org/paper/${p.paperId}`,
        doi: p.externalIds?.DOI,
        abstract: p.abstract,
        authors: (p.authors ?? []).map((a: any) => a.name),
        publishedAt: new Date(p.publicationDate),
        citationCount: p.citationCount ?? 0,
        source: "semanticScholar",
      })
    );
}

async function fetchArxiv(query: string, since: Date): Promise<RawItem[]> {
  const url =
    `http://export.arxiv.org/api/query?` +
    `search_query=${encodeURIComponent(`all:${query}`)}&` +
    `sortBy=submittedDate&sortOrder=descending&max_results=50`;

  const xml = await fetchWithRetry(
    () => fetch(url).then((r) => r.text()),
    { label: "arxiv", retries: 3, baseDelayMs: 1500 }
  );

  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

  return entries
    .map((match): RawItem | null => {
      const entry = match[1];
      const title =
        entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
      const id = entry.match(/<id>(.*?)<\/id>/)?.[1]?.trim() ?? "";
      const published =
        entry.match(/<published>(.*?)<\/published>/)?.[1]?.trim();
      const summary =
        entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim();
      const authors = [...entry.matchAll(/<name>(.*?)<\/name>/g)].map(
        (m) => m[1]
      );

      if (!published || new Date(published) < since) return null;

      return {
        title,
        url: id.replace("http://arxiv.org/abs/", "https://arxiv.org/abs/"),
        abstract: summary,
        authors,
        publishedAt: new Date(published),
        citationCount: 0,
        source: "arxiv",
      };
    })
    .filter((item): item is RawItem => item !== null);
}

async function fetchSSRN(query: string, since: Date): Promise<RawItem[]> {
  const apiKey = process.env.GOOGLE_CSE_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!apiKey || !cx) return [];

  const dateRestrict = `d${Math.ceil((Date.now() - since.getTime()) / 86400000)}`;
  const url =
    `https://www.googleapis.com/customsearch/v1?` +
    `key=${apiKey}&cx=${cx}&q=${encodeURIComponent(`site:ssrn.com ${query}`)}&dateRestrict=${dateRestrict}&num=10`;

  const res = await fetchWithRetry(
    () => fetch(url).then((r) => r.json()),
    { label: "ssrn", retries: 3, baseDelayMs: 1000 }
  );

  return (res.items ?? []).map(
    (item: any): RawItem => ({
      title: item.title,
      url: item.link,
      abstract: item.snippet,
      publishedAt: since,
      source: "ssrn",
    })
  );
}

async function fetchPubMed(query: string, since: Date): Promise<RawItem[]> {
  const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  const minDate = since.toISOString().split("T")[0].replace(/-/g, "/");

  const searchRes = await fetchWithRetry(
    () =>
      fetch(
        `${BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&mindate=${minDate}&datetype=pdat&retmax=20&retmode=json`
      ).then((r) => r.json()),
    { label: "pubmed-search" }
  );

  const ids: string[] = searchRes.esearchresult?.idlist ?? [];
  if (ids.length === 0) return [];

  const summaryRes = await fetchWithRetry(
    () =>
      fetch(
        `${BASE}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`
      ).then((r) => r.json()),
    { label: "pubmed-summary" }
  );

  return ids
    .map((id): RawItem => {
      const doc = summaryRes.result[id];
      return {
        title: doc?.title ?? "",
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        authors: (doc?.authors ?? []).map((a: any) => a.name),
        publishedAt: doc?.pubdate ? new Date(doc.pubdate) : since,
        source: "pubmed",
      };
    })
    .filter((item) => item.title);
}

// ─── Policy & Practitioner Adapters ───────────────────────────────────

async function fetchBLS(query: string, since: Date): Promise<RawItem[]> {
  const apiKey = process.env.BLS_API_KEY;
  if (!apiKey) {
    console.warn("[bls] BLS_API_KEY not set — skipping BLS adapter");
    return [];
  }

  const BLS_SERIES = [
    "CEU0000000001",
    "CEU5000000001",
    "CEU6054000001",
    "CEU5500000001",
    "LNS14000000",
  ];

  const startYear = since.getFullYear().toString();
  const endYear = new Date().getFullYear().toString();

  const res = await fetchWithRetry(
    () =>
      fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesid: BLS_SERIES,
          startyear: startYear,
          endyear: endYear,
          registrationkey: apiKey,
          calculations: true,
          annualaverage: false,
        }),
      }).then((r) => r.json()),
    { label: "bls", retries: 3, baseDelayMs: 2000 }
  );

  if (res.status !== "REQUEST_SUCCEEDED") {
    console.warn("[bls] API returned non-success status:", res.status, res.message);
    return [];
  }

  return (res.Results?.series ?? []).flatMap((series: any) => {
    const latestData = series.data?.[0];
    if (!latestData) return [];

    const periodLabel = `${latestData.year} ${latestData.periodName}`;
    const change = latestData.calculations?.net_changes?.["1"];

    return [
      {
        title: `BLS ${series.seriesID}: ${periodLabel} — ${latestData.value}${change ? ` (MoM: ${change > 0 ? "+" : ""}${change})` : ""}`,
        url: `https://data.bls.gov/timeseries/${series.seriesID}`,
        abstract: `Latest BLS data for series ${series.seriesID}. Value: ${latestData.value} for ${periodLabel}.`,
        publishedAt: new Date(),
        source: "bls" as const,
      },
    ];
  });
}

async function fetchFRED(query: string, since: Date): Promise<RawItem[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    console.warn("[fred] FRED_API_KEY not set — skipping FRED adapter");
    return [];
  }

  const FRED_SERIES = [
    { id: "PAYEMS", label: "Total Nonfarm Payrolls" },
    { id: "JTSJOL", label: "Job Openings: Total Nonfarm" },
    { id: "UNEMPLOY", label: "Unemployment Level" },
    { id: "LES1252881600Q", label: "Employment Cost Index: Wages" },
  ];

  const observationStart = since.toISOString().split("T")[0];

  const results = await Promise.allSettled(
    FRED_SERIES.map(async (series) => {
      const res = await fetchWithRetry(
        () =>
          fetch(
            `https://api.stlouisfed.org/fred/series/observations?` +
              `series_id=${series.id}&observation_start=${observationStart}&` +
              `sort_order=desc&limit=1&api_key=${apiKey}&file_type=json`
          ).then((r) => r.json()),
        { label: `fred-${series.id}`, retries: 2, baseDelayMs: 500 }
      );

      const latest = res.observations?.[0];
      if (!latest || latest.value === ".") return null;

      return {
        title: `FRED ${series.label}: ${latest.value} (${latest.date})`,
        url: `https://fred.stlouisfed.org/series/${series.id}`,
        abstract: `FRED macro indicator: ${series.label}. Latest value: ${latest.value} as of ${latest.date}.`,
        publishedAt: new Date(latest.date),
        source: "fred" as const,
      };
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<RawItem | null> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value)
    .filter((item): item is RawItem => item !== null);
}

// ─── Signal Adapters ──────────────────────────────────────────────────

async function fetchHNAlgolia(
  query: string,
  since: Date
): Promise<RawItem[]> {
  const sinceUnix = Math.floor(since.getTime() / 1000);
  const url =
    `https://hn.algolia.com/api/v1/search?` +
    `query=${encodeURIComponent(query)}&` +
    `tags=story&` +
    `numericFilters=created_at_i>${sinceUnix},points>25&` +
    `hitsPerPage=20`;

  const res = await fetchWithRetry(
    () => fetch(url).then((r) => r.json()),
    { label: "hn-algolia", retries: 3, baseDelayMs: 500 }
  );

  return (res.hits ?? []).map(
    (hit: any): RawItem => ({
      title: hit.title,
      url:
        hit.url ??
        `https://news.ycombinator.com/item?id=${hit.objectID}`,
      abstract: `HN discussion (${hit.points} pts, ${hit.num_comments} comments): ${hit.title}`,
      publishedAt: new Date(hit.created_at),
      source: "hnAlgolia",
    })
  );
}

async function fetchGoogleCSE(
  query: string,
  since: Date
): Promise<RawItem[]> {
  const apiKey = process.env.GOOGLE_CSE_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!apiKey || !cx) return [];

  const dateRestrict = `d${Math.ceil((Date.now() - since.getTime()) / 86400000)}`;
  const url =
    `https://www.googleapis.com/customsearch/v1?` +
    `key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&dateRestrict=${dateRestrict}&num=10`;

  const res = await fetchWithRetry(
    () => fetch(url).then((r) => r.json()),
    { label: "googleCse", retries: 3, baseDelayMs: 1000 }
  );

  return (res.items ?? []).map(
    (item: any): RawItem => ({
      title: item.title,
      url: item.link,
      abstract: item.snippet,
      publishedAt: since,
      source: "googleCse",
    })
  );
}

// ─── Adapter Registry ─────────────────────────────────────────────────

export const ADAPTERS: SourceAdapter[] = [
  // Academic
  {
    name: "semanticScholar",
    tier: "academic",
    fetch: fetchSemanticScholar,
  },
  { name: "arxiv", tier: "academic", fetch: fetchArxiv },
  { name: "ssrn", tier: "academic", fetch: fetchSSRN },
  { name: "pubmed", tier: "academic", fetch: fetchPubMed },
  { name: "openAlex", tier: "academic", fetch: fetchOpenAlex },
  // Policy
  { name: "nber", tier: "policy", fetch: fetchNBER },
  { name: "bls", tier: "policy", fetch: fetchBLS },
  { name: "fred", tier: "policy", fetch: fetchFRED },
  // Signal
  { name: "googleCse", tier: "signal", fetch: fetchGoogleCSE },
  { name: "hnAlgolia", tier: "signal", fetch: fetchHNAlgolia },
];

// ─── Graph-Topic Affinity Scoring ─────────────────────────────────────

export const GRAPH_AFFINITY_SIGNALS: Record<string, string[]> = {
  "overall-us-displacement": [
    "job displacement", "jobs at risk", "automation risk", "jobs eliminated",
    "workforce reduction", "layoffs AI", "structural unemployment",
  ],
  "white-collar-professional-displacement": [
    "white collar", "knowledge worker", "professional services", "office work",
    "legal AI", "accounting automation", "analyst automation",
  ],
  "tech-sector-displacement": [
    "software engineer", "developer jobs", "coding jobs", "programmer",
    "tech layoffs", "IT workforce", "entry level software",
  ],
  "creative-industry-displacement": [
    "creative work", "design AI", "content creation", "copywriter",
    "graphic designer", "illustrator AI", "generative images",
  ],
  "education-sector-displacement": [
    "teacher AI", "education automation", "tutoring AI", "higher education jobs",
    "instructional design", "academic jobs",
  ],
  "healthcare-admin-displacement": [
    "healthcare administrative", "medical billing", "prior authorization",
    "clinical documentation", "healthcare AI workforce",
  ],
  "customer-service-automation": [
    "customer service AI", "chatbot", "call center automation", "contact center",
    "support automation", "virtual agent",
  ],
  "median-wage-impact": [
    "wage impact", "wage growth", "earnings AI", "compensation AI",
    "real wages", "income inequality AI",
  ],
  "entry-level-wage-impact": [
    "entry level", "early career", "junior", "new grad", "starting salary",
    "young workers AI", "recent graduates",
  ],
  "high-skill-wage-premium": [
    "AI wage premium", "skill premium", "high skill wage", "AI complementarity",
    "augmentation wages", "productivity wage",
  ],
  "freelancer-rate-impact": [
    "freelancer", "gig worker", "contractor rates", "Upwork", "Fiverr",
    "independent worker", "platform worker",
  ],
  "geographic-wage-divergence": [
    "geographic inequality", "regional wage", "AI hub", "tech hub wage",
    "rural urban wage", "place-based inequality",
  ],
  "ai-adoption-rate": [
    "AI adoption", "firm AI use", "business AI", "company AI investment",
    "Census BTOS", "AI deployment enterprise",
  ],
  "genai-work-adoption": [
    "generative AI use", "ChatGPT work", "LLM at work", "AI tools workers",
    "AI at workplace", "employee AI use",
  ],
  "workforce-ai-exposure": [
    "AI exposure", "job exposure", "occupation exposure", "task automation share",
    "O*NET AI", "job vulnerability AI",
  ],
  "earnings-call-ai-mentions": [
    "earnings call", "S&P 500 AI", "executive AI mention", "investor AI",
    "quarterly results AI", "CEO AI workforce",
  ],
};

export function computeJobsdataAffinity(item: RawItem): number {
  const text = `${item.title} ${item.abstract ?? ""}`.toLowerCase();
  let bonus = 0;

  for (const [, signals] of Object.entries(GRAPH_AFFINITY_SIGNALS)) {
    const matched = signals.filter((s) => text.includes(s.toLowerCase()));
    if (matched.length > 0) bonus += 0.15;
  }

  const highValueDomains = [
    "nber.org",
    "bls.gov",
    "stlouisfed.org",
    "arxiv.org",
    "semanticscholar.org",
    "openalex.org",
  ];
  if (highValueDomains.some((d) => item.url.includes(d))) bonus += 0.1;

  return Math.min(bonus, 0.5);
}

export function scoreItem(
  item: RawItem,
  query: string,
  now: Date
): number {
  // 1. Recency: exponential decay, half-life 7 days
  const daysSince =
    (now.getTime() - item.publishedAt.getTime()) / 86400000;
  const recency = Math.exp(-daysSince / 7);

  // 2. Citation velocity: log-scaled, capped at 100 citations
  const citationVelocity = item.citationCount
    ? Math.min(Math.log1p(item.citationCount) / Math.log1p(100), 1)
    : 0;

  // 3. Query relevance: keyword overlap
  const queryWords = query.toLowerCase().split(/\s+/);
  const text = `${item.title} ${item.abstract ?? ""}`.toLowerCase();
  const relevance =
    queryWords.filter((w) => text.includes(w)).length / queryWords.length;

  // 4. jobsdata.ai graph affinity bonus
  const affinity = computeJobsdataAffinity(item);

  // Weighted composite
  const base = 0.35 * recency + 0.15 * citationVelocity + 0.35 * relevance;
  return Math.min(base + affinity, 1);
}

/**
 * Tracked Institutions — RSS/Atom/Sitemap adapter for institutional research sites
 *
 * Polls a curated list of high-signal institutional publishers (Yale Budget Lab,
 * Stanford DEL, Brookings, Anthropic Research, IMF, OECD, Fed banks, IZA, etc.)
 * that publish research/policy briefs on their own sites rather than via NBER
 * or arXiv. Without this adapter, the weekly digest pipeline misses major
 * institutional updates (e.g., the June 2026 Goldman 9% revision, Yale BL
 * "not-yet" piece, Anthropic Economic Index Cadences).
 *
 * Architecture:
 * - Institutions are configured in scripts/config/tracked-institutions.json
 * - Each entry declares a feedType: "rss" | "atom" | "sitemap"
 * - RSS/Atom: parse <item>/<entry>, filter by query keywords + since date
 * - Sitemap: parse <url><loc>/<lastmod>, filter to URLs whose path matches
 *   `pathInclude` substring AND lastmod >= since, then fetch each page and
 *   extract <title> + <meta name="description"> for relevance scoring
 * - Per-institution fetch is wrapped in try/catch so one broken feed doesn't
 *   take down the whole digest
 *
 * Known limitation: Many institutions have abandoned proper RSS. Sitemap-based
 * coverage is more robust but requires per-page fetching, which is rate-limited
 * via a per-institution max of 20 candidate pages per run.
 */

import fs from "fs";
import path from "path";
import { fetchWithRetry } from "../utils/retry";
import type { RawItem } from "../types";

interface TrackedInstitution {
  publisher: string;
  domain: string;
  feedUrl: string;
  feedType: "rss" | "atom" | "sitemap";
  tier: number;
  /** For sitemap mode: only include URLs whose path contains this substring */
  pathInclude?: string;
  notes?: string;
}

interface InstitutionConfig {
  institutions: TrackedInstitution[];
}

const CONFIG_PATH = path.join(
  process.cwd(),
  "scripts/config/tracked-institutions.json"
);

const SITEMAP_MAX_PAGES_PER_INST = 20;
const SITEMAP_PAGE_TIMEOUT_MS = 8000;

function loadInstitutions(): TrackedInstitution[] {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.warn(`[trackedInstitutions] config not found at ${CONFIG_PATH}`);
    return [];
  }
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    const cfg = JSON.parse(raw) as InstitutionConfig;
    return cfg.institutions ?? [];
  } catch (err) {
    console.warn(`[trackedInstitutions] failed to load config: ${err}`);
    return [];
  }
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

interface ParsedEntry {
  title: string;
  link: string;
  description: string;
  pubDate: string | null;
}

function parseRssItems(xml: string): ParsedEntry[] {
  const items: ParsedEntry[] = [];
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const entry = match[1];
    const title =
      entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]?.trim() ??
      entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ??
      "";
    const link = entry.match(/<link>(.*?)<\/link>/)?.[1]?.trim() ?? "";
    const description =
      entry
        .match(
          /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/
        )?.[1]
        ?.trim() ??
      entry.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() ??
      "";
    const pubDate = entry.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() ?? null;
    if (title) items.push({ title, link, description, pubDate });
  }
  return items;
}

function parseAtomItems(xml: string): ParsedEntry[] {
  const items: ParsedEntry[] = [];
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entry = match[1];
    const title =
      entry.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
    const link =
      entry.match(/<link[^>]*href="([^"]+)"/)?.[1]?.trim() ?? "";
    const description =
      entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1]?.trim() ??
      entry.match(/<content[^>]*>([\s\S]*?)<\/content>/)?.[1]?.trim() ??
      "";
    const pubDate =
      entry.match(/<published>(.*?)<\/published>/)?.[1]?.trim() ??
      entry.match(/<updated>(.*?)<\/updated>/)?.[1]?.trim() ??
      null;
    if (title) items.push({ title, link, description, pubDate });
  }
  return items;
}

interface SitemapUrl {
  loc: string;
  lastmod: string | null;
}

function parseSitemap(xml: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const entry = match[1];
    const loc = entry.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim();
    const lastmod = entry.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]?.trim() ?? null;
    if (loc) urls.push({ loc, lastmod });
  }
  return urls;
}

async function fetchPageMetadata(
  url: string,
  signal?: AbortSignal
): Promise<{ title: string; description: string } | null> {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "jobsdata-digest/1.0" },
      signal,
    });
    if (!r.ok) return null;
    const html = await r.text();
    const title =
      html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] ??
      html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ??
      "";
    const description =
      html.match(/<meta property="og:description" content="([^"]+)"/i)?.[1] ??
      html.match(/<meta name="description" content="([^"]+)"/i)?.[1] ??
      "";
    return { title: stripHtml(title), description: stripHtml(description) };
  } catch {
    return null;
  }
}

async function fetchSitemapInstitution(
  inst: TrackedInstitution,
  query: string,
  since: Date
): Promise<RawItem[]> {
  const xml = await fetchWithRetry(
    () =>
      fetch(inst.feedUrl, {
        headers: { "User-Agent": "jobsdata-digest/1.0" },
        redirect: "follow",
      }).then((r) => {
        if (!r.ok) throw new Error(`${inst.publisher} sitemap returned ${r.status}`);
        return r.text();
      }),
    {
      label: `tracked-${inst.publisher.toLowerCase().replace(/\s+/g, "-")}`,
      retries: 2,
      baseDelayMs: 1500,
    }
  );

  // Many sitemap indexes contain nested sitemap references; resolve them.
  const nestedSitemaps = [
    ...xml.matchAll(/<sitemap>\s*<loc>(.*?)<\/loc>/g),
  ].map((m) => m[1]);

  let allUrls: SitemapUrl[] = parseSitemap(xml);
  for (const nested of nestedSitemaps.slice(0, 5)) {
    try {
      const nestedXml = await fetch(nested, {
        headers: { "User-Agent": "jobsdata-digest/1.0" },
        redirect: "follow",
      }).then((r) => (r.ok ? r.text() : ""));
      allUrls.push(...parseSitemap(nestedXml));
    } catch {
      /* per-nested failure is non-fatal */
    }
  }

  // Filter to recent + path-matching URLs
  const candidates = allUrls
    .filter((u) => {
      if (inst.pathInclude && !u.loc.includes(inst.pathInclude)) return false;
      if (!u.lastmod) return false;
      const dt = new Date(u.lastmod);
      return !isNaN(dt.getTime()) && dt >= since;
    })
    .sort((a, b) => (b.lastmod ?? "").localeCompare(a.lastmod ?? ""))
    .slice(0, SITEMAP_MAX_PAGES_PER_INST);

  if (candidates.length === 0) return [];

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const results: RawItem[] = [];
  const pageFetches = candidates.map(async (u) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SITEMAP_PAGE_TIMEOUT_MS);
    try {
      const meta = await fetchPageMetadata(u.loc, controller.signal);
      if (!meta) return null;
      const text = `${meta.title} ${meta.description}`.toLowerCase();
      const matchCount = queryWords.filter((w) => text.includes(w)).length;
      if (matchCount < Math.min(2, Math.ceil(queryWords.length * 0.3))) return null;
      return {
        title: `${inst.publisher}: ${meta.title}`,
        url: u.loc,
        abstract: meta.description || undefined,
        publishedAt: u.lastmod ? new Date(u.lastmod) : new Date(),
        source: "trackedInstitutions" as const,
      };
    } finally {
      clearTimeout(timer);
    }
  });

  const settled = await Promise.all(pageFetches);
  for (const r of settled) if (r) results.push(r);
  return results;
}

async function fetchFeedInstitution(
  inst: TrackedInstitution,
  query: string,
  since: Date
): Promise<RawItem[]> {
  const xml = await fetchWithRetry(
    () =>
      fetch(inst.feedUrl, {
        headers: { "User-Agent": "jobsdata-digest/1.0" },
        redirect: "follow",
      }).then((r) => {
        if (!r.ok) throw new Error(`${inst.publisher} feed returned ${r.status}`);
        return r.text();
      }),
    {
      label: `tracked-${inst.publisher.toLowerCase().replace(/\s+/g, "-")}`,
      retries: 2,
      baseDelayMs: 1500,
    }
  );

  // Reject if obviously not XML (Cloudflare HTML, search redirect, etc.)
  if (xml.trim().startsWith("<!DOCTYPE html") || xml.trim().startsWith("<html")) {
    throw new Error(`${inst.publisher} returned HTML instead of feed`);
  }

  const rawItems =
    inst.feedType === "atom" ? parseAtomItems(xml) : parseRssItems(xml);

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const results: RawItem[] = [];

  for (const item of rawItems) {
    if (!item.title) continue;
    const pubDate = item.pubDate ? new Date(item.pubDate) : null;
    if (pubDate && !isNaN(pubDate.getTime()) && pubDate < since) continue;

    const title = stripHtml(item.title);
    const abstract = stripHtml(item.description).slice(0, 500);

    const text = `${title} ${abstract}`.toLowerCase();
    const matchCount = queryWords.filter((w) => text.includes(w)).length;
    if (matchCount < Math.min(2, Math.ceil(queryWords.length * 0.3))) continue;

    results.push({
      title: `${inst.publisher}: ${title}`,
      url: item.link || inst.feedUrl,
      abstract: abstract || undefined,
      publishedAt:
        pubDate && !isNaN(pubDate.getTime()) ? pubDate : new Date(),
      source: "trackedInstitutions",
    });
  }

  return results;
}

async function fetchInstitution(
  inst: TrackedInstitution,
  query: string,
  since: Date
): Promise<RawItem[]> {
  if (inst.feedType === "sitemap") {
    return fetchSitemapInstitution(inst, query, since);
  }
  return fetchFeedInstitution(inst, query, since);
}

export async function fetchTrackedInstitutions(
  query: string,
  since: Date
): Promise<RawItem[]> {
  const institutions = loadInstitutions();
  if (institutions.length === 0) return [];

  const settled = await Promise.allSettled(
    institutions.map((inst) => fetchInstitution(inst, query, since))
  );

  const all: RawItem[] = [];
  let okCount = 0;
  let failCount = 0;
  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    const inst = institutions[i];
    if (result.status === "fulfilled") {
      all.push(...result.value);
      okCount++;
    } else {
      failCount++;
      console.warn(
        `[trackedInstitutions] ${inst.publisher} (${inst.feedUrl}) failed: ${result.reason}`
      );
    }
  }

  console.log(
    `[trackedInstitutions] ${okCount}/${institutions.length} sources OK (${failCount} failed); ${all.length} items returned`
  );

  return all;
}

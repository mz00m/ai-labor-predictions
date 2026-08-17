#!/usr/bin/env npx tsx
/**
 * ask — Query the full jobsdata.ai research corpus from the command line.
 *
 * Retrieves across every ingested source (confirmed-sources.json +
 * source-content/*.json abstracts, key findings, methodology, qualifiers)
 * and every prediction graph, ranks with BM25, then optionally hands the
 * top hits to Claude for a cited synthesis.
 *
 * Usage:
 *   npm run ask "what do we know about entry-level wages?"
 *   npm run ask -- --raw "ages 22-25 relative employment decline"
 *   npm run ask -- --limit 30 --tier 1 "AI adoption rate among firms"
 *   npm run ask -- --json "customer service automation"
 *
 * Flags:
 *   --raw          Ranked retrieval only, no Claude call. Use this from an
 *                  agent that can read and reason over the hits itself.
 *   --json         Same as --raw but emits JSON.
 *   --limit <n>    Number of sources to retrieve (default 20).
 *   --tier <list>  Restrict to evidence tiers, e.g. --tier 1,2
 *
 * The search index is rebuilt by `npm run build:search`, which runs as part
 * of `npm run build`. If it is missing, this falls back to title/publisher/
 * excerpt only and prints a warning.
 */

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { loadEnv } from "./lib/load-env";
import { CLAUDE_SONNET } from "../src/lib/claude-models";

loadEnv();
loadEnv(path.join(process.cwd(), ".env.local"));

const ROOT = process.cwd();
const CS_PATH = path.join(ROOT, "src/data/confirmed-sources.json");
const INDEX_PATH = path.join(ROOT, "src/data/search-index.json");
const CONTENT_DIR = path.join(ROOT, "src/data/source-content");
const PRED_DIR = path.join(ROOT, "src/data/predictions");

const STOPWORDS = new Set(
  ("a an and are as at be but by do does for from has have how i if in into is it its me my of on or " +
    "our so than that the their them then there these they this to us was we were what when where which " +
    "who why will with you your about know tell show give find any all can could would should more most " +
    "much many does did done been being over under between across per vs versus")
    .split(" ")
);

interface ConfirmedSource {
  id: string;
  title: string;
  publisher: string;
  excerpt?: string;
  evidenceTier: number;
  usedIn: string[];
  datePublished: string;
  url?: string;
  _action?: string;
}

interface SourceContent {
  id: string;
  abstract: string;
  keyFindings: string[];
  methodology: string;
  qualifiers: string;
}

interface Hit {
  id: string;
  score: number;
  source: ConfirmedSource;
  content?: SourceContent;
}

/* ------------------------------------------------------------------ */
/*  Args                                                               */
/* ------------------------------------------------------------------ */

function parseArgs(argv: string[]) {
  let limit = 20;
  let raw = false;
  let json = false;
  let tiers: number[] | null = null;
  const rest: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--raw") raw = true;
    else if (a === "--json") {
      json = true;
      raw = true;
    } else if (a === "--limit") limit = parseInt(argv[++i], 10);
    else if (a === "--tier") {
      tiers = argv[++i].split(",").map((t) => parseInt(t.trim(), 10));
    } else rest.push(a);
  }

  return { limit, raw, json, tiers, query: rest.join(" ").trim() };
}

/* ------------------------------------------------------------------ */
/*  Retrieval (BM25)                                                   */
/* ------------------------------------------------------------------ */

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function buildHaystacks(sources: Record<string, ConfirmedSource>): {
  haystacks: Map<string, string>;
  degraded: boolean;
} {
  if (fs.existsSync(INDEX_PATH)) {
    const index: Record<string, string> = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
    return { haystacks: new Map(Object.entries(index)), degraded: false };
  }
  const map = new Map<string, string>();
  for (const [id, s] of Object.entries(sources)) {
    if (s._action === "REMOVE") continue;
    map.set(id, `${s.title} ${s.publisher} ${s.excerpt ?? ""}`.toLowerCase());
  }
  return { haystacks: map, degraded: true };
}

/** Standard BM25 over pre-built haystack strings. */
function rank(query: string, haystacks: Map<string, string>): Map<string, number> {
  const terms = tokenize(query);
  const scores = new Map<string, number>();
  if (terms.length === 0) return scores;

  const k1 = 1.5;
  const b = 0.75;

  const docTokens = new Map<string, string[]>();
  let totalLen = 0;
  for (const [id, hay] of haystacks) {
    const toks = hay.split(/\s+/);
    docTokens.set(id, toks);
    totalLen += toks.length;
  }
  const avgdl = totalLen / Math.max(1, docTokens.size);
  const N = docTokens.size;

  for (const term of terms) {
    // Document frequency for this term (substring-free, token-level match)
    let df = 0;
    const tfByDoc = new Map<string, number>();
    for (const [id, toks] of docTokens) {
      let tf = 0;
      for (const tok of toks) {
        if (tok === term || (term.length > 4 && tok.startsWith(term))) tf++;
      }
      if (tf > 0) {
        df++;
        tfByDoc.set(id, tf);
      }
    }
    if (df === 0) continue;

    const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
    for (const [id, tf] of tfByDoc) {
      const dl = docTokens.get(id)!.length;
      const norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * dl) / avgdl));
      scores.set(id, (scores.get(id) ?? 0) + idf * norm);
    }
  }

  return scores;
}

function loadContent(id: string): SourceContent | undefined {
  const p = path.join(CONTENT_DIR, `${id}.json`);
  if (!fs.existsSync(p)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/*  Prediction graph matching                                          */
/* ------------------------------------------------------------------ */

interface PredHit {
  slug: string;
  title: string;
  unit: string;
  currentValue: number;
  latest?: { date: string; value: number };
  points: number;
  score: number;
}

function matchPredictions(query: string): PredHit[] {
  const terms = new Set(tokenize(query));
  const hits: PredHit[] = [];

  for (const cat of fs.readdirSync(PRED_DIR)) {
    const catDir = path.join(PRED_DIR, cat);
    if (!fs.statSync(catDir).isDirectory() || cat.startsWith("_")) continue;
    for (const f of fs.readdirSync(catDir)) {
      if (!f.endsWith(".json")) continue;
      const p = JSON.parse(fs.readFileSync(path.join(catDir, f), "utf-8"));
      const hay = new Set(
        tokenize(`${p.title} ${p.description ?? ""} ${p.unit} ${p.slug.replace(/-/g, " ")}`)
      );
      let score = 0;
      for (const t of terms) if (hay.has(t)) score++;
      if (score === 0) continue;

      const history = (p.history ?? []).slice().sort((a: any, z: any) => a.date.localeCompare(z.date));
      hits.push({
        slug: p.slug,
        title: p.title,
        unit: p.unit,
        currentValue: p.currentValue,
        latest: history.length ? { date: history[history.length - 1].date, value: history[history.length - 1].value } : undefined,
        points: history.length,
        score,
      });
    }
  }

  return hits.sort((a, z) => z.score - a.score).slice(0, 4);
}

/* ------------------------------------------------------------------ */
/*  Rendering                                                          */
/* ------------------------------------------------------------------ */

function truncate(s: string, n: number): string {
  if (!s) return "";
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

function renderHits(hits: Hit[], preds: PredHit[], detail: boolean): string {
  const lines: string[] = [];

  if (preds.length) {
    lines.push("## Matching prediction graphs\n");
    for (const p of preds) {
      lines.push(
        `- **${p.title}** (\`${p.slug}\`) — current ${p.currentValue} ${p.unit}; ` +
          `${p.points} plotted points${p.latest ? `, latest ${p.latest.date} = ${p.latest.value}` : ""}`
      );
    }
    lines.push("");
  }

  lines.push(`## Sources (${hits.length})\n`);
  hits.forEach((h, i) => {
    const s = h.source;
    lines.push(
      `### [${i + 1}] ${s.title}\n` +
        `- id: \`${s.id}\` | tier ${s.evidenceTier} | ${s.datePublished} | ${s.publisher}\n` +
        (s.url ? `- url: ${s.url}\n` : "") +
        (s.usedIn?.length ? `- graphs: ${s.usedIn.join(", ")}\n` : "")
    );
    const c = h.content;
    if (c) {
      if (c.abstract) lines.push(`- abstract: ${truncate(c.abstract, detail ? 900 : 400)}`);
      if (c.keyFindings?.length) {
        lines.push(`- key findings:`);
        for (const f of c.keyFindings.slice(0, detail ? 8 : 4)) {
          lines.push(`    - ${truncate(f, 320)}`);
        }
      }
      if (detail && c.methodology) lines.push(`- methodology: ${truncate(c.methodology, 400)}`);
      if (detail && c.qualifiers) lines.push(`- qualifiers: ${truncate(c.qualifiers, 400)}`);
    } else if (s.excerpt) {
      lines.push(`- excerpt: ${truncate(s.excerpt, 400)}`);
    }
    lines.push("");
  });

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const { limit, raw, json, tiers, query } = parseArgs(process.argv.slice(2));

  if (!query) {
    console.error(
      'Usage: npm run ask "your question"\n' +
        "       npm run ask -- --raw --limit 30 --tier 1,2 \"your question\""
    );
    process.exit(1);
  }

  const cs = JSON.parse(fs.readFileSync(CS_PATH, "utf-8"));
  const sources: Record<string, ConfirmedSource> = cs.sources;
  const { haystacks, degraded } = buildHaystacks(sources);

  if (degraded) {
    console.error("[ask] warning: search-index.json missing — run `npm run build:search`. Results degraded.\n");
  }

  const scores = rank(query, haystacks);

  const hits: Hit[] = Array.from(scores.entries())
    .map(([id, score]) => ({ id, score, source: sources[id] }))
    .filter((h) => h.source && h.source._action !== "REMOVE")
    .filter((h) => (tiers ? tiers.includes(h.source.evidenceTier) : true))
    .sort((a, z) => z.score - a.score)
    .slice(0, limit);

  for (const h of hits) h.content = loadContent(h.id);

  const preds = matchPredictions(query);

  if (json) {
    console.log(JSON.stringify({ query, predictions: preds, sources: hits }, null, 2));
    return;
  }

  const rendered = renderHits(hits, preds, true);

  if (raw) {
    console.log(rendered);
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[ask] ANTHROPIC_API_KEY not set — falling back to --raw output.\n");
    console.log(rendered);
    return;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = client.messages.stream({
    model: CLAUDE_SONNET,
    max_tokens: 2000,
    system:
      "You are the research librarian for jobsdata.ai, a labor-market evidence dashboard. " +
      "Answer ONLY from the supplied corpus extracts. Cite every claim with its source id in " +
      "backticks, e.g. `dallasfed-young-workers-ai-2026`. Evidence tiers run 1 (peer-reviewed / " +
      "government) to 4 (social); weight accordingly and say so when the best available evidence " +
      "is tier 3 or 4. If the corpus does not answer the question, say that plainly and name what " +
      "is missing rather than reasoning from general knowledge. Where estimates conflict, surface " +
      "the disagreement and note whether they measure the same quantity. Be concise and concrete; " +
      "prefer numbers with their units and dates.",
    messages: [
      {
        role: "user",
        content: `Question: ${query}\n\nCorpus extracts:\n\n${rendered}`,
      },
    ],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      process.stdout.write(event.delta.text);
    }
  }
  process.stdout.write("\n");

  console.error(`\n---\n[ask] ${hits.length} sources retrieved, ${preds.length} graphs matched.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

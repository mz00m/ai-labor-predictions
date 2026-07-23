#!/usr/bin/env tsx
/**
 * Prune stale Neon preview branches to keep us under the Free-tier 10-branch cap.
 *
 * Two modes:
 *   --on-pr <slug>   Delete the specific `preview/<slug>` branch (called after PR close)
 *   --orphans        Nightly sweep — delete every preview/* branch that has no open PR
 *                    and is older than the grace period
 *
 * Env:
 *   NEON_API_KEY       required
 *   NEON_PROJECT_ID    required  (e.g. summer-art-36933988 for jobsdata-chat)
 *   GH_TOKEN           required for --orphans (to look up open PR branches)
 *   GH_REPO            required for --orphans (owner/repo, e.g. mz00m/ai-labor-predictions)
 *   DRY_RUN=1          optional  — log what would delete, don't call DELETE
 *
 * Safety guards (do not remove):
 *   - Only deletes branches whose name starts with "preview/"
 *   - Never deletes primary branches (Neon rejects this anyway)
 *   - Skips branches younger than GRACE_MIN minutes (default 30) to avoid killing
 *     an in-flight Vercel preview build
 */

const API = "https://console.neon.tech/api/v2";
const GRACE_MIN = 30;

interface NeonBranch {
  id: string;
  name: string;
  primary?: boolean;
  protected?: boolean;
  created_at: string;
}

function need(key: string): string {
  const v = process.env[key];
  if (!v) {
    console.error(`missing required env var: ${key}`);
    process.exit(2);
  }
  return v;
}

async function neonFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const key = need("NEON_API_KEY");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init.headers,
    },
  });
  return res;
}

async function listBranches(projectId: string): Promise<NeonBranch[]> {
  const res = await neonFetch(`/projects/${projectId}/branches`);
  if (!res.ok) {
    throw new Error(`list branches failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { branches: NeonBranch[] };
  return data.branches ?? [];
}

async function deleteBranch(projectId: string, branch: NeonBranch): Promise<boolean> {
  // Hard guards — refuse to delete anything that isn't a preview branch
  if (!branch.name.startsWith("preview/")) {
    console.log(`  SKIP (not preview/): ${branch.name}`);
    return false;
  }
  if (branch.primary) {
    console.log(`  SKIP (primary): ${branch.name}`);
    return false;
  }
  if (branch.protected) {
    console.log(`  SKIP (protected): ${branch.name}`);
    return false;
  }
  const ageMs = Date.now() - new Date(branch.created_at).getTime();
  if (ageMs < GRACE_MIN * 60_000) {
    console.log(
      `  SKIP (grace ${GRACE_MIN}min): ${branch.name} — age ${Math.round(ageMs / 60_000)}min`
    );
    return false;
  }

  if (process.env.DRY_RUN === "1") {
    console.log(`  DRY: would delete ${branch.name} (${branch.id})`);
    return true;
  }

  const res = await neonFetch(`/projects/${projectId}/branches/${branch.id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    console.log(`  FAIL: ${branch.name} — ${res.status} ${await res.text()}`);
    return false;
  }
  console.log(`  DEL: ${branch.name} (${branch.id})`);
  return true;
}

async function getOpenPRHeadRefs(): Promise<Set<string>> {
  const token = need("GH_TOKEN");
  const repo = need("GH_REPO");
  const res = await fetch(
    `https://api.github.com/repos/${repo}/pulls?state=open&per_page=100`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  if (!res.ok) {
    throw new Error(`GH pulls failed: ${res.status} ${await res.text()}`);
  }
  const prs = (await res.json()) as Array<{ head: { ref: string } }>;
  return new Set(prs.map((p) => p.head.ref));
}

async function runOnPr(projectId: string, slug: string): Promise<void> {
  const target = `preview/${slug}`;
  const branches = await listBranches(projectId);
  const match = branches.find((b) => b.name === target);
  if (!match) {
    console.log(`no branch named ${target}`);
    return;
  }
  console.log(`deleting for closed PR: ${target}`);
  await deleteBranch(projectId, match);
}

async function runOrphans(projectId: string): Promise<void> {
  const [branches, openRefs] = await Promise.all([
    listBranches(projectId),
    getOpenPRHeadRefs(),
  ]);

  const previews = branches.filter((b) => b.name.startsWith("preview/") && !b.primary);
  console.log(
    `found ${previews.length} preview branches; ${openRefs.size} open PRs on the repo`
  );

  const orphans = previews.filter((b) => {
    const gitRef = b.name.slice("preview/".length);
    return !openRefs.has(gitRef);
  });
  console.log(`${orphans.length} preview branches have no matching open PR`);

  for (const b of orphans) {
    await deleteBranch(projectId, b);
  }
}

async function main(): Promise<void> {
  const projectId = need("NEON_PROJECT_ID");
  const args = process.argv.slice(2);
  const onPrIdx = args.indexOf("--on-pr");
  if (onPrIdx !== -1) {
    const slug = args[onPrIdx + 1];
    if (!slug) {
      console.error("--on-pr requires a branch slug");
      process.exit(2);
    }
    await runOnPr(projectId, slug);
    return;
  }
  if (args.includes("--orphans")) {
    await runOrphans(projectId);
    return;
  }
  console.error("usage: prune-neon-branches.ts (--on-pr <slug> | --orphans)");
  process.exit(2);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

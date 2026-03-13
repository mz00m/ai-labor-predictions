import { NextResponse } from "next/server";

export const revalidate = 86400; // revalidate once per day

export async function GET() {
  try {
    // Use GitHub API to get total commit count for the repo
    // The Contributors endpoint returns commit counts per contributor
    const res = await fetch(
      "https://api.github.com/repos/mz00m/ai-labor-predictions/contributors?per_page=100&anon=1",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "jobsdata-ai/1.0",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ commitCount: null });
    }

    const contributors = await res.json();
    const totalCommits = contributors.reduce(
      (sum: number, c: { contributions: number }) => sum + c.contributions,
      0
    );

    return NextResponse.json({ commitCount: totalCommits });
  } catch {
    return NextResponse.json({ commitCount: null });
  }
}

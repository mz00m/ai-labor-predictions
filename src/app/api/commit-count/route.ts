import { NextResponse } from "next/server";

export const revalidate = 86400; // revalidate once per day

function parseLinkHeader(header: string | null): Record<string, string> {
  if (!header) return {};
  const links: Record<string, string> = {};
  for (const part of header.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) links[match[2]] = match[1];
  }
  return links;
}

export async function GET() {
  try {
    // Fetch page 1 with per_page=1 to get the total from the Link header's last page number
    const res = await fetch(
      "https://api.github.com/repos/mz00m/ai-labor-predictions/commits?per_page=1",
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

    // GitHub's Link header contains the last page number, which equals total commits
    const links = parseLinkHeader(res.headers.get("link"));
    if (links.last) {
      const url = new URL(links.last);
      const lastPage = parseInt(url.searchParams.get("page") || "0", 10);
      return NextResponse.json({ commitCount: lastPage });
    }

    // If no Link header, there's only 1 page — count the items
    const commits = await res.json();
    return NextResponse.json({ commitCount: Array.isArray(commits) ? commits.length : null });
  } catch {
    return NextResponse.json({ commitCount: null });
  }
}

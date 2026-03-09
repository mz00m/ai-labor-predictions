/**
 * Admin endpoint for chat query analytics.
 * Protected by a simple bearer token (CHAT_ANALYTICS_TOKEN env var).
 *
 * GET /api/chat/analytics
 *   ?days=7        — lookback window (default 7)
 *   ?detail=true   — include individual queries (default false)
 */

import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request: Request) {
  // Auth check
  const token = process.env.CHAT_ANALYTICS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Analytics not configured. Set CHAT_ANALYTICS_TOKEN." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${token}`) {
    return unauthorized();
  }

  if (!process.env.POSTGRES_URL) {
    return new Response(
      JSON.stringify({ error: "Database not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(request.url);
  const days = Math.min(parseInt(url.searchParams.get("days") || "7", 10), 90);
  const detail = url.searchParams.get("detail") === "true";

  // Category breakdown
  const categoryCounts = await sql`
    SELECT category, COUNT(*)::int as count
    FROM chat_queries
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY category
    ORDER BY count DESC
  `;

  // Subcategory breakdown
  const subcategoryCounts = await sql`
    SELECT category, subcategory, COUNT(*)::int as count
    FROM chat_queries
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
      AND subcategory IS NOT NULL
    GROUP BY category, subcategory
    ORDER BY count DESC
  `;

  // Intent breakdown
  const intentCounts = await sql`
    SELECT intent, COUNT(*)::int as count
    FROM chat_queries
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY intent
    ORDER BY count DESC
  `;

  // Total queries
  const totalResult = await sql`
    SELECT COUNT(*)::int as total
    FROM chat_queries
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
  `;

  // Daily trend
  const dailyTrend = await sql`
    SELECT DATE(created_at) as date, COUNT(*)::int as count
    FROM chat_queries
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;

  const result: Record<string, unknown> = {
    period: { days, from: new Date(Date.now() - days * 86400000).toISOString().split("T")[0] },
    total: totalResult.rows[0]?.total ?? 0,
    categories: categoryCounts.rows,
    subcategories: subcategoryCounts.rows,
    intents: intentCounts.rows,
    dailyTrend: dailyTrend.rows,
  };

  // Optionally include recent individual queries
  if (detail) {
    const recentQueries = await sql`
      SELECT query, category, subcategory, intent, created_at
      FROM chat_queries
      WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
      ORDER BY created_at DESC
      LIMIT 200
    `;
    result.recentQueries = recentQueries.rows;
  }

  return new Response(JSON.stringify(result, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

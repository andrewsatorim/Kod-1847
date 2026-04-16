import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";
  const lte = to + "T23:59:59";

  try {
    const { rows: pageCounts } = await pool.query(
      `SELECT page, COUNT(*)::int AS views
       FROM analytics_pageviews
       WHERE created_at >= $1 AND created_at <= $2
       GROUP BY page
       ORDER BY views DESC`,
      [from, lte]
    );

    const { rows: timeData } = await pool.query(
      `SELECT page, metadata->>'seconds' AS seconds
       FROM analytics_events
       WHERE event_type = 'time_on_page' AND created_at >= $1 AND created_at <= $2`,
      [from, lte]
    );

    const timeByPage: Record<string, number[]> = {};
    for (const row of timeData) {
      const sec = parseInt(row.seconds);
      if (row.page && !isNaN(sec)) {
        if (!timeByPage[row.page]) timeByPage[row.page] = [];
        timeByPage[row.page].push(sec);
      }
    }

    const result = pageCounts.map((r: { page: string; views: number }) => {
      const times = timeByPage[r.page] || [];
      const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
      return { page: r.page, views: r.views, avgTime };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("TopPages error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

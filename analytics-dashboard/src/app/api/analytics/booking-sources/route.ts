import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";

  try {
    const { rows } = await pool.query(
      `SELECT metadata->>'source' AS source
       FROM analytics_events
       WHERE event_type = 'booking_submit' AND created_at >= $1 AND created_at <= $2`,
      [from, to + "T23:59:59"]
    );

    const sources: Record<string, number> = {};
    for (const row of rows) {
      const src = row.source || "unknown";
      sources[src] = (sources[src] || 0) + 1;
    }

    const result = Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(result);
  } catch (err) {
    console.error("BookingSources error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

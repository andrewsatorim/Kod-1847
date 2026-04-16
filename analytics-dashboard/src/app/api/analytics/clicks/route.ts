import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";

  try {
    const { rows } = await pool.query(
      `SELECT event_type, metadata
       FROM analytics_events
       WHERE event_type IN ('click_reserve', 'click_pdf', 'click_phone', 'click_telegram', 'click_instagram')
       AND created_at >= $1 AND created_at <= $2`,
      [from, to + "T23:59:59"]
    );

    const clicks: Record<string, number> = {};
    for (const row of rows) {
      let label = row.event_type;
      const meta = row.metadata as Record<string, string> | null;
      if (row.event_type === "click_pdf" && meta?.menu) {
        label = `PDF: ${meta.menu}`;
      } else if (meta?.location) {
        label = `${row.event_type} (${meta.location})`;
      }
      clicks[label] = (clicks[label] || 0) + 1;
    }

    const result = Object.entries(clicks)
      .map(([button, count]) => ({ button, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Clicks error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

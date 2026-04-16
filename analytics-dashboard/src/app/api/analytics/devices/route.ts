import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";

  try {
    const { rows } = await pool.query(
      `SELECT device, browser FROM analytics_sessions
       WHERE started_at >= $1 AND started_at <= $2`,
      [from, to + "T23:59:59"]
    );

    const devices: Record<string, number> = {};
    const browsers: Record<string, number> = {};

    for (const row of rows) {
      const d = row.device || "unknown";
      const b = row.browser || "unknown";
      devices[d] = (devices[d] || 0) + 1;
      browsers[b] = (browsers[b] || 0) + 1;
    }

    return NextResponse.json({
      devices: Object.entries(devices).map(([name, value]) => ({ name, value })),
      browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    });
  } catch (err) {
    console.error("Devices error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";
  const gte = from;
  const lte = to + "T23:59:59";

  try {
    const [pageviewsRes, sessionsRes, bookingsRes] = await Promise.all([
      pool.query(
        "SELECT COUNT(*)::int AS count FROM analytics_pageviews WHERE created_at >= $1 AND created_at <= $2",
        [gte, lte]
      ),
      pool.query(
        "SELECT session_id, duration, pages_viewed FROM analytics_sessions WHERE started_at >= $1 AND started_at <= $2",
        [gte, lte]
      ),
      pool.query(
        "SELECT COUNT(*)::int AS count FROM analytics_events WHERE event_type = 'booking_submit' AND created_at >= $1 AND created_at <= $2",
        [gte, lte]
      ),
    ]);

    const totalPageviews = pageviewsRes.rows[0].count;
    const sessions = sessionsRes.rows;
    const totalSessions = sessions.length;
    const totalBookings = bookingsRes.rows[0].count;

    const avgDuration = totalSessions > 0
      ? Math.round(sessions.reduce((sum: number, s: { duration: number }) => sum + (s.duration || 0), 0) / totalSessions)
      : 0;

    const bounced = sessions.filter((s: { pages_viewed: number }) => (s.pages_viewed || 0) <= 1).length;
    const bounceRate = totalSessions > 0 ? Math.round((bounced / totalSessions) * 100) : 0;

    const conversionRate = totalSessions > 0 ? ((totalBookings / totalSessions) * 100).toFixed(1) : "0";

    return NextResponse.json({ totalPageviews, totalSessions, avgDuration, bounceRate, totalBookings, conversionRate });
  } catch (err) {
    console.error("Overview error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

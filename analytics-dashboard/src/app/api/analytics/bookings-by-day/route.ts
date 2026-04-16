import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") || "";
  const to = req.nextUrl.searchParams.get("to") || "";

  try {
    const { rows } = await pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*)::int AS bookings
       FROM analytics_events
       WHERE event_type = 'booking_submit' AND created_at >= $1 AND created_at <= $2
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [from, to + "T23:59:59"]
    );
    return NextResponse.json(rows.map((r: { date: string; bookings: number }) => ({
      date: String(r.date).slice(0, 10),
      bookings: r.bookings,
    })));
  } catch (err) {
    console.error("BookingsByDay error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM events)::int AS events,
        (SELECT COUNT(*) FROM menu_categories)::int AS "menuCategories",
        (SELECT COUNT(*) FROM menu_items)::int AS "menuItems",
        (SELECT COUNT(*) FROM contacts)::int AS contacts,
        (SELECT COUNT(*) FROM texts)::int AS texts,
        (SELECT COUNT(*) FROM partnership_formats)::int AS "partnershipFormats",
        (SELECT COUNT(*) FROM club_events)::int AS "clubEvents"
    `);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

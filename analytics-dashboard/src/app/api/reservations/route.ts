import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const visited = searchParams.get("visited");
    const source = searchParams.get("source");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);

    const where: string[] = [];
    const params: (string | number)[] = [];

    if (from) {
      params.push(from);
      where.push(`created_at >= $${params.length}`);
    }
    if (to) {
      params.push(to + "T23:59:59");
      where.push(`created_at <= $${params.length}`);
    }
    if (visited) {
      params.push(visited);
      where.push(`visited = $${params.length}`);
    }
    if (source) {
      params.push(source);
      where.push(`source = $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    params.push(limit);

    const { rows } = await pool.query(
      `SELECT id, name, phone, date, time, guests, comment, consent, source, event_name,
              visited, manager_note, iiko_id, iiko_status, iiko_error,
              created_at, updated_at
         FROM reservations
         ${whereSql}
         ORDER BY created_at DESC
         LIMIT $${params.length}`,
      params
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Reservations GET error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

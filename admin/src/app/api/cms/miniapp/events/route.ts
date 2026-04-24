import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM miniapp_events ORDER BY event_date ASC, event_time ASC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_date, event_time, category, title_ru, title_en, desc_ru, desc_en, hall, seats_total, seats_taken, is_active, is_visible } = body;

    const { rows } = await pool.query(
      `INSERT INTO miniapp_events
       (event_date, event_time, category, title_ru, title_en, desc_ru, desc_en, hall, seats_total, seats_taken, is_active, is_visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [event_date, event_time, category || "", title_ru || "", title_en || "", desc_ru || "", desc_en || "", hall || null, seats_total || 0, seats_taken || 0, is_active !== false, is_visible !== false]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

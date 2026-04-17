import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM events ORDER BY sort_order");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Events GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO events (day, month_ru, month_en, name_ru, name_en, desc_ru, desc_en, time, tag_ru, tag_en, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [body.day, body.month_ru, body.month_en, body.name_ru, body.name_en, body.desc_ru, body.desc_en, body.time, body.tag_ru, body.tag_en, body.sort_order ?? 0, body.is_active ?? true]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("Events POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

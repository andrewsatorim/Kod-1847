import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM club_events ORDER BY sort_order");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("ClubEvents GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO club_events (name_ru, name_en, desc_ru, desc_en, detail_ru, detail_en, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [body.name_ru, body.name_en, body.desc_ru, body.desc_en, body.detail_ru, body.detail_en, body.sort_order ?? 0]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("ClubEvents POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM partnership_formats ORDER BY sort_order");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("PartnershipFormats GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO partnership_formats (num, title_ru, title_en, points_ru, points_en, suit_ru, suit_en, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [body.num, body.title_ru, body.title_en, JSON.stringify(body.points_ru || []), JSON.stringify(body.points_en || []), body.suit_ru, body.suit_en, body.sort_order ?? 0]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("PartnershipFormats POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

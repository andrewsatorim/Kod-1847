import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM nav_sections ORDER BY nav_order");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("NavSections GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO nav_sections (key, href, title_ru, title_en, nav_order, is_visible)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [body.key, body.href, body.title_ru, body.title_en, body.nav_order ?? 0, body.is_visible ?? true]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("NavSections POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

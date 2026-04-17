import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { rows } = await pool.query(
      `UPDATE nav_sections SET href=$1, title_ru=$2, title_en=$3, nav_order=$4, is_visible=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [body.href, body.title_ru, body.title_en, body.nav_order, body.is_visible, id]
    );
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("NavSections PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await pool.query(
      `UPDATE club_events SET name_ru=$1, name_en=$2, desc_ru=$3, desc_en=$4, detail_ru=$5, detail_en=$6, sort_order=$7
       WHERE id=$8`,
      [body.name_ru, body.name_en, body.desc_ru, body.desc_en, body.detail_ru, body.detail_en, body.sort_order, id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ClubEvents PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM club_events WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ClubEvents DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

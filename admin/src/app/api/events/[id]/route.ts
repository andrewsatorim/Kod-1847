import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await pool.query(
      `UPDATE events SET day=$1, month_ru=$2, month_en=$3, name_ru=$4, name_en=$5,
       desc_ru=$6, desc_en=$7, time=$8, tag_ru=$9, tag_en=$10, sort_order=$11, is_active=$12
       WHERE id=$13`,
      [body.day, body.month_ru, body.month_en, body.name_ru, body.name_en, body.desc_ru, body.desc_en, body.time, body.tag_ru, body.tag_en, body.sort_order, body.is_active, id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Events PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Events DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

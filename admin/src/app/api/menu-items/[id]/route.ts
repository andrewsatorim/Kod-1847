import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await pool.query(
      `UPDATE menu_items SET category_id=$1, name_ru=$2, name_en=$3, desc_ru=$4, desc_en=$5, is_flagship=$6, sort_order=$7
       WHERE id=$8`,
      [body.category_id, body.name_ru, body.name_en, body.desc_ru, body.desc_en, body.is_flagship, body.sort_order, id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MenuItems PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM menu_items WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MenuItems DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await pool.query(
      `UPDATE menu_categories SET tab=$1, title_ru=$2, title_en=$3, desc_ru=$4, desc_en=$5, sort_order=$6
       WHERE id=$7`,
      [body.tab, body.title_ru, body.title_en, body.desc_ru, body.desc_en, body.sort_order, id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MenuCategories PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM menu_categories WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MenuCategories DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await pool.query(
      `UPDATE partnership_formats SET num=$1, title_ru=$2, title_en=$3, points_ru=$4, points_en=$5, suit_ru=$6, suit_en=$7, sort_order=$8
       WHERE id=$9`,
      [body.num, body.title_ru, body.title_en, JSON.stringify(body.points_ru || []), JSON.stringify(body.points_en || []), body.suit_ru, body.suit_en, body.sort_order, id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PartnershipFormats PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM partnership_formats WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PartnershipFormats DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

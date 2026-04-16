import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await pool.query(
      "UPDATE texts SET value_ru=$1, value_en=$2 WHERE id=$3",
      [body.value_ru, body.value_en, id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Texts PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM texts WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Texts DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

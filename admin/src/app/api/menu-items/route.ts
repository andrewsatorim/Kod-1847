import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO menu_items (category_id, name_ru, name_en, desc_ru, desc_en, is_flagship, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [body.category_id, body.name_ru, body.name_en, body.desc_ru, body.desc_en, body.is_flagship ?? false, body.sort_order ?? 0]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("MenuItems POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

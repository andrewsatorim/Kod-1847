import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name_ru, name_en, sort_order } = body;

    if (!slug || !["tea", "hookah"].includes(slug)) {
      return NextResponse.json(
        { error: "invalid_slug" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `INSERT INTO miniapp_menu_categories (slug, name_ru, name_en, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [slug, name_ru || "", name_en || "", sort_order || 0]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category_id, name_ru, name_en, description_ru, description_en, sort_order } = body;

    if (!category_id) {
      return NextResponse.json(
        { error: "category_id_required" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `INSERT INTO miniapp_menu_items (category_id, name_ru, name_en, description_ru, description_en, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [category_id, name_ru || "", name_en || "", description_ru || "", description_en || "", sort_order || 0]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

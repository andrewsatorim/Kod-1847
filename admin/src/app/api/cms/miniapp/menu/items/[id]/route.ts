import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { name_ru, name_en, description_ru, description_en, sort_order } = body;

    const { rows } = await pool.query(
      `UPDATE miniapp_menu_items
       SET name_ru = $1, name_en = $2, description_ru = $3, description_en = $4,
           sort_order = $5, updated_at = now()
       WHERE id = $6
       RETURNING *`,
      [name_ru || "", name_en || "", description_ru || "", description_en || "", sort_order || 0, id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const { rows } = await pool.query(
      `DELETE FROM miniapp_menu_items WHERE id = $1 RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

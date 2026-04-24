import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { caption_ru, caption_en, title_ru, title_en, description_ru, description_en, seats, sort_order, is_visible, city_ru, city_en, street_ru, street_en, hours_ru, hours_en } = body;

    const { rows } = await pool.query(
      `UPDATE miniapp_halls
       SET caption_ru = $1, caption_en = $2, title_ru = $3, title_en = $4,
           description_ru = $5, description_en = $6, seats = $7, sort_order = $8,
           is_visible = $9, city_ru = $10, city_en = $11, street_ru = $12, street_en = $13,
           hours_ru = $14, hours_en = $15, updated_at = now()
       WHERE id = $16
       RETURNING *`,
      [caption_ru || "", caption_en || "", title_ru || "", title_en || "", description_ru || "", description_en || "", seats || 0, sort_order || 0, is_visible !== false, city_ru || null, city_en || null, street_ru || null, street_en || null, hours_ru || null, hours_en || null, id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating hall:", error);
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
      `DELETE FROM miniapp_halls WHERE id = $1 RETURNING *`,
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
    console.error("Error deleting hall:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

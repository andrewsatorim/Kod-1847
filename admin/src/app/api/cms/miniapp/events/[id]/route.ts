import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { event_date, event_time, category, title_ru, title_en, desc_ru, desc_en, hall, seats_total, seats_taken, is_active, is_visible } = body;

    const { rows } = await pool.query(
      `UPDATE miniapp_events
       SET event_date = $1, event_time = $2, category = $3, title_ru = $4, title_en = $5,
           desc_ru = $6, desc_en = $7, hall = $8, seats_total = $9, seats_taken = $10,
           is_active = $11, is_visible = $12, updated_at = now()
       WHERE id = $13
       RETURNING *`,
      [event_date, event_time, category || "", title_ru || "", title_en || "", desc_ru || "", desc_en || "", hall || null, seats_total || 0, seats_taken || 0, is_active !== false, is_visible !== false, id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating event:", error);
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
      `DELETE FROM miniapp_events WHERE id = $1 RETURNING *`,
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
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { rows } = await pool.query(`SELECT * FROM miniapp_address LIMIT 1`);
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { city_ru, city_en, street_ru, street_en, hours_ru, hours_en, latitude, longitude } = body;

    const { rows } = await pool.query(
      `UPDATE miniapp_address
       SET city_ru = $1, city_en = $2, street_ru = $3, street_en = $4,
           hours_ru = $5, hours_en = $6, latitude = $7, longitude = $8,
           updated_at = now()
       WHERE id = 1
       RETURNING *`,
      [city_ru || "", city_en || "", street_ru || "", street_en || "", hours_ru || "", hours_en || "", latitude || null, longitude || null]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

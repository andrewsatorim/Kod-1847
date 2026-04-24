import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    let query = `SELECT * FROM miniapp_menu_categories`;
    const params = [];

    if (slug && ["tea", "hookah"].includes(slug)) {
      query += ` WHERE slug = $1`;
      params.push(slug);
    }

    query += ` ORDER BY sort_order ASC`;

    const { rows } = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

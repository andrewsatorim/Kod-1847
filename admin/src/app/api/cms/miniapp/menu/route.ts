import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    let catQuery = `SELECT * FROM miniapp_menu_categories`;
    const catParams: string[] = [];

    if (slug && ["tea", "hookah"].includes(slug)) {
      catQuery += ` WHERE slug = $1`;
      catParams.push(slug);
    }

    catQuery += ` ORDER BY sort_order ASC, id ASC`;

    const { rows: categories } = await pool.query(catQuery, catParams);

    if (categories.length === 0) {
      return NextResponse.json([]);
    }

    const categoryIds = categories.map((c) => c.id);
    const { rows: items } = await pool.query(
      `SELECT * FROM miniapp_menu_items
       WHERE category_id = ANY($1::int[])
       ORDER BY sort_order ASC, id ASC`,
      [categoryIds]
    );

    const result = categories.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.category_id === cat.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

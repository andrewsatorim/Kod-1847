import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const tab = req.nextUrl.searchParams.get("tab") || "tea";
    const { rows: categories } = await pool.query(
      "SELECT * FROM menu_categories WHERE tab = $1 ORDER BY sort_order",
      [tab]
    );

    // Fetch items for each category
    const catIds = categories.map((c: { id: number }) => c.id);
    let itemsByCategory: Record<number, unknown[]> = {};

    if (catIds.length > 0) {
      const { rows: items } = await pool.query(
        "SELECT * FROM menu_items WHERE category_id = ANY($1) ORDER BY sort_order",
        [catIds]
      );
      itemsByCategory = {};
      for (const item of items) {
        if (!itemsByCategory[item.category_id]) itemsByCategory[item.category_id] = [];
        itemsByCategory[item.category_id].push(item);
      }
    }

    const result = categories.map((cat: { id: number }) => ({
      ...cat,
      menu_items: itemsByCategory[cat.id] || [],
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("MenuCategories GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO menu_categories (tab, title_ru, title_en, desc_ru, desc_en, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [body.tab, body.title_ru, body.title_en, body.desc_ru, body.desc_en, body.sort_order ?? 0]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("MenuCategories POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

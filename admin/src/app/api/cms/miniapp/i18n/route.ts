import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang");

    let query = `SELECT * FROM miniapp_i18n`;
    const params = [];

    if (lang && ["ru", "en"].includes(lang)) {
      query += ` WHERE lang = $1`;
      params.push(lang);
    }

    query += ` ORDER BY key ASC`;

    const { rows } = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching i18n:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, lang, value } = body;

    if (!key || !lang || !["ru", "en"].includes(lang)) {
      return NextResponse.json(
        { error: "invalid_parameters" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `INSERT INTO miniapp_i18n (key, lang, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (key, lang) DO UPDATE SET value = $3, updated_at = now()
       RETURNING *`,
      [key, lang, value || ""]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating i18n:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

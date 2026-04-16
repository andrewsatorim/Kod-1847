import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM contacts ORDER BY id");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Contacts GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO contacts (key, value_ru, value_en) VALUES ($1,$2,$3) RETURNING *`,
      [body.key, body.value_ru || "", body.value_en || ""]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("Contacts POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

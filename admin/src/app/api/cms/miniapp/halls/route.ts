import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM miniapp_halls ORDER BY sort_order ASC, id ASC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching halls:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

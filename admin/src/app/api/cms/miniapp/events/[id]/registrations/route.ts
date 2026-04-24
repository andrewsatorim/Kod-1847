import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);

    const { rows } = await pool.query(
      `SELECT * FROM miniapp_event_registrations
       WHERE event_id = $1
       ORDER BY created_at DESC`,
      [eventId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}

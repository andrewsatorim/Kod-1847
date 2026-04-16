import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const ALLOWED_VISITED = new Set(["pending", "came", "no_show", "cancelled"]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (typeof body.visited === "string") {
      if (!ALLOWED_VISITED.has(body.visited)) {
        return NextResponse.json({ error: "Invalid visited status" }, { status: 400 });
      }
      values.push(body.visited);
      updates.push(`visited = $${values.length}`);
    }
    if (typeof body.manager_note === "string") {
      values.push(body.manager_note);
      updates.push(`manager_note = $${values.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE reservations SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Reservation PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reservation DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

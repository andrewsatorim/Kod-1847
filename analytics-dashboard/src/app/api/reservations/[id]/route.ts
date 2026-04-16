import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

const ALLOWED_STATUSES = new Set(["pending", "came", "no_show", "cancelled"]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (!Number.isFinite(numId)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const body = await req.json();
  const sets: string[] = [];
  const args: unknown[] = [];

  if (typeof body.visit_status === "string") {
    if (!ALLOWED_STATUSES.has(body.visit_status)) return NextResponse.json({ error: "bad status" }, { status: 400 });
    args.push(body.visit_status);
    sets.push(`visit_status = $${args.length}`);
  }
  if (typeof body.manager_note === "string") {
    args.push(body.manager_note);
    sets.push(`manager_note = $${args.length}`);
  }
  if (sets.length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  args.push(numId);
  await dbQuery(`update reservations set ${sets.join(", ")} where id = $${args.length}`, args);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (!Number.isFinite(numId)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  await dbQuery(`delete from reservations where id = $1`, [numId]);
  return NextResponse.json({ ok: true });
}

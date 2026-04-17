import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { spawn } from "child_process";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM publish_jobs ORDER BY created_at DESC LIMIT 1"
    );
    return NextResponse.json(rows[0] || { status: "idle" });
  } catch (err) {
    console.error("Publish GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { rows: running } = await pool.query(
      "SELECT id FROM publish_jobs WHERE status = 'running' LIMIT 1"
    );
    if (running.length > 0) {
      return NextResponse.json({ error: "Сборка уже запущена" }, { status: 409 });
    }

    const { rows } = await pool.query(
      "INSERT INTO publish_jobs (status, started_at) VALUES ('running', NOW()) RETURNING *"
    );
    const jobId = rows[0].id;

    const proc = spawn("/bin/bash", ["/root/kod1847-sync/deploy.sh"], {
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let log = "";
    proc.stdout?.on("data", (d: Buffer) => { log += d.toString(); });
    proc.stderr?.on("data", (d: Buffer) => { log += d.toString(); });

    proc.on("close", async (code: number | null) => {
      const status = code === 0 ? "success" : "error";
      await pool.query(
        "UPDATE publish_jobs SET status=$1, log=$2, finished_at=NOW() WHERE id=$3",
        [status, log.slice(0, 10000), jobId]
      );
    });

    proc.unref();
    return NextResponse.json({ jobId, status: "running" });
  } catch (err) {
    console.error("Publish POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

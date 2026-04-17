import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, from = "ru", to = "en" } = await req.json();
    const res = await fetch("http://127.0.0.1:5555/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: from, target: to }),
    });
    const data = await res.json();
    return NextResponse.json({ result: data.translatedText });
  } catch (err) {
    console.error("Translate error:", err);
    return NextResponse.json({ error: "Translate error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kod1847-jwt-secret-change-me"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for login endpoint and public endpoints
  if (pathname === "/api/auth/login") return NextResponse.next();
  if (pathname.startsWith("/api/public/")) {
    // Add CORS headers for public endpoints
    const origin = request.headers.get("origin") || "";
    const res = NextResponse.next();
    if (
      origin.includes("kod1847.ru") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1")
    ) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }
    return res;
  }

  // Only protect API routes
  if (!pathname.startsWith("/api/")) return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: "/api/:path*",
};

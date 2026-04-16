import { NextRequest, NextResponse } from "next/server";

const IIKO_BASE_URL = "https://api-ru.iiko.services";
const IIKO_API_LOGIN = "99bc25d40d5c4587afec2bcad7794e4e";

let _token: string | null = null;
let _tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiLogin: IIKO_API_LOGIN }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iiko auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  _token = data.token;
  _tokenExpiry = Date.now() + 50 * 60 * 1000;
  return _token!;
}

// Allowed iiko API paths (whitelist for security)
const ALLOWED_PATHS = [
  "/api/1/organizations",
  "/api/1/nomenclature",
  "/api/1/stop_lists",
  "/api/1/deliveries/by_delivery_date_and_status",
  "/api/1/loyalty/iiko/customer/info",
  "/api/1/employees/info",
  "/api/1/discounts",
  "/api/1/payment_types",
  "/api/1/terminal_groups",
  "/api/1/reserve/available_restaurant_sections",
  "/api/1/reserve/restaurant_sections_workload",
];

export async function POST(req: NextRequest) {
  try {
    const { path, body } = await req.json();

    if (!path || !ALLOWED_PATHS.includes(path)) {
      return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
    }

    const token = await getAccessToken();

    const iikoRes = await fetch(`${IIKO_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body || {}),
    });

    if (!iikoRes.ok) {
      const text = await iikoRes.text();
      return NextResponse.json(
        { error: `iiko API error (${iikoRes.status}): ${text}` },
        { status: iikoRes.status }
      );
    }

    const data = await iikoRes.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

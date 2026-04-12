// iiko Cloud API client
// Docs: https://api-ru.iiko.services/swagger/index.html
// Base URL for Russia: https://api-ru.iiko.services

const IIKO_BASE_URL = "https://api-ru.iiko.services";

let _token: string | null = null;
let _tokenExpiry: number = 0;

// Hardcoded API login (public anon-level key, similar to Supabase anon key approach)
const IIKO_API_LOGIN = "99bc25d40d5c4587afec2bcad7794e4e";

// Organization ID will be auto-discovered on first call if not set
let _organizationId: string | null = null;

function getApiLogin(): string | null {
  return IIKO_API_LOGIN || process.env.NEXT_PUBLIC_IIKO_API_LOGIN || null;
}

function getOrganizationId(): string | null {
  return _organizationId || process.env.NEXT_PUBLIC_IIKO_ORGANIZATION_ID || null;
}

export function isIikoConfigured(): boolean {
  return !!getApiLogin();
}

async function getAccessToken(): Promise<string> {
  // Token valid for ~60 min, refresh at 50 min
  if (_token && Date.now() < _tokenExpiry) return _token;

  const apiLogin = getApiLogin();
  if (!apiLogin) throw new Error("NEXT_PUBLIC_IIKO_API_LOGIN not configured");

  const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiLogin }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iiko auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  _token = data.token;
  _tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 minutes
  return _token!;
}

export async function iikoPost<T = unknown>(path: string, body: Record<string, unknown>): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${IIKO_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iiko API error ${path} (${res.status}): ${text}`);
  }

  return res.json();
}

// ── Convenience helpers ────────────────────────────────────────

/** Auto-discover organization ID on first call */
export async function ensureOrgId(): Promise<string> {
  const existing = getOrganizationId();
  if (existing) return existing;

  const token = await getAccessToken();
  const res = await fetch(`${IIKO_BASE_URL}/api/1/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error("Failed to discover iiko organization");
  const data = await res.json();
  const orgs = data.organizations || [];
  if (orgs.length === 0) throw new Error("No iiko organizations found for this API login");

  _organizationId = orgs[0].id;
  return _organizationId!;
}

export function getOrgId(): string {
  const id = getOrganizationId();
  if (!id) throw new Error("Organization ID not yet discovered. Call ensureOrgId() first.");
  return id;
}

export function getOrgIds(): string[] {
  return [getOrgId()];
}

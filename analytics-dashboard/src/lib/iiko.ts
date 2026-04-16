// iiko Cloud API client — all calls go through /api/iiko server proxy (avoids CORS)

// Organization ID will be auto-discovered on first call
let _organizationId: string | null = null;

export function isIikoConfigured(): boolean {
  return true; // API key is hardcoded server-side in /api/iiko
}

export async function iikoPost<T = unknown>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/iiko", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, body }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(data.error || `iiko proxy error (${res.status})`);
  }

  return res.json();
}

// ── Convenience helpers ────────────────────────────────────────

/** Auto-discover organization ID on first call */
export async function ensureOrgId(): Promise<string> {
  if (_organizationId) return _organizationId;

  const data = await iikoPost<{ organizations: { id: string; name: string }[] }>(
    "/api/1/organizations",
    {}
  );

  const orgs = data.organizations || [];
  if (orgs.length === 0) throw new Error("No iiko organizations found for this API login");

  _organizationId = orgs[0].id;
  return _organizationId;
}

export function getOrgId(): string {
  if (!_organizationId) throw new Error("Organization ID not yet discovered. Call ensureOrgId() first.");
  return _organizationId;
}

export function getOrgIds(): string[] {
  return [getOrgId()];
}

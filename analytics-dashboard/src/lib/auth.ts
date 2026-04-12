const AUTH_KEY = "kod1847_analytics_auth";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function authenticate(password: string): boolean {
  // Password is checked client-side against env var
  // For production, use a proper auth flow
  const correct = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "kod1847admin";
  if (password === correct) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

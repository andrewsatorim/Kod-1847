import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hqtctbbohjdgwmqxsafv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdGN0YmJvaGpkZ3dtcXhzYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5Mjc5NTMsImV4cCI6MjA5MTUwMzk1M30.QJsRvX-FZuW6WkrB70kLT-6gUCXil9hjIAPfmPQMBsE";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _supabase;
}

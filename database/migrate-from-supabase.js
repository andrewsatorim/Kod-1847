const SUPABASE_URL = "https://hqtctbbohjdgwmqxsafv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdGN0YmJvaGpkZ3dtcXhzYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5Mjc5NTMsImV4cCI6MjA5MTUwMzk1M30.QJsRvX-FZuW6WkrB70kLT-6gUCXil9hjIAPfmPQMBsE";

const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fetchSupabase(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    console.error(`Failed to fetch ${table}: ${res.status}`);
    return [];
  }
  return res.json();
}

async function migrate(table, columns, transform) {
  console.log(`\n--- ${table} ---`);
  const rows = await fetchSupabase(table);
  console.log(`Fetched ${rows.length} rows from Supabase`);
  if (!rows.length) return;

  // Clear existing data
  await pool.query(`DELETE FROM ${table}`);

  for (const row of rows) {
    const values = columns.map((col) => {
      const val = transform ? transform(col, row[col], row) : row[col];
      return val;
    });
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
    const colNames = columns.join(",");
    try {
      await pool.query(`INSERT INTO ${table} (${colNames}) VALUES (${placeholders})`, values);
    } catch (err) {
      console.error(`  Error inserting row id=${row.id}: ${err.message}`);
    }
  }
  console.log(`Inserted ${rows.length} rows into PostgreSQL`);

  // Reset sequence
  try {
    await pool.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT COALESCE(MAX(id), 0) FROM ${table}))`);
  } catch (e) {
    // ignore if no sequence
  }
}

async function main() {
  console.log("=== Migrating data from Supabase to PostgreSQL ===\n");

  // Events
  await migrate("events", [
    "id", "day", "month_ru", "month_en", "name_ru", "name_en",
    "desc_ru", "desc_en", "time", "tag_ru", "tag_en",
    "sort_order", "is_active", "created_at",
  ]);

  // Menu categories
  await migrate("menu_categories", [
    "id", "tab", "title_ru", "title_en", "desc_ru", "desc_en", "sort_order",
  ]);

  // Menu items
  await migrate("menu_items", [
    "id", "category_id", "name_ru", "name_en", "desc_ru", "desc_en",
    "is_flagship", "sort_order",
  ]);

  // Partnership formats
  await migrate("partnership_formats", [
    "id", "num", "title_ru", "title_en", "points_ru", "points_en",
    "suit_ru", "suit_en", "sort_order",
  ], (col, val) => {
    if ((col === "points_ru" || col === "points_en") && val) {
      return JSON.stringify(val);
    }
    return val;
  });

  // Club events
  await migrate("club_events", [
    "id", "name_ru", "name_en", "desc_ru", "desc_en",
    "detail_ru", "detail_en", "sort_order",
  ]);

  // Contacts
  await migrate("contacts", [
    "id", "key", "value_ru", "value_en",
  ]);

  // Texts
  await migrate("texts", [
    "id", "key", "value_ru", "value_en",
  ]);

  // Analytics sessions
  await migrate("analytics_sessions", [
    "id", "session_id", "device", "browser",
    "pages_viewed", "max_scroll_depth", "duration", "started_at",
  ]);

  // Analytics pageviews
  await migrate("analytics_pageviews", [
    "id", "page", "referrer", "device", "browser",
    "screen_width", "session_id", "created_at",
  ]);

  // Analytics events
  await migrate("analytics_events", [
    "id", "event_type", "page", "metadata", "session_id", "created_at",
  ], (col, val) => {
    if (col === "metadata" && val) return JSON.stringify(val);
    return val;
  });

  console.log("\n=== Migration complete ===");
  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});

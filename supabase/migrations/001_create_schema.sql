-- ============================================================
-- Код 1847 — Database Schema
-- ============================================================

-- 1. events
CREATE TABLE events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day         text NOT NULL,
  month_ru    text NOT NULL,
  month_en    text NOT NULL,
  name_ru     text NOT NULL,
  name_en     text NOT NULL,
  desc_ru     text NOT NULL DEFAULT '',
  desc_en     text NOT NULL DEFAULT '',
  time        text NOT NULL,
  tag_ru      text NOT NULL DEFAULT '',
  tag_en      text NOT NULL DEFAULT '',
  sort_order  int  NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. menu_categories
CREATE TABLE menu_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab         text NOT NULL CHECK (tab IN ('tea','hookah','food')),
  title_ru    text NOT NULL,
  title_en    text NOT NULL,
  desc_ru     text NOT NULL DEFAULT '',
  desc_en     text NOT NULL DEFAULT '',
  sort_order  int  NOT NULL DEFAULT 0
);

-- 3. menu_items
CREATE TABLE menu_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  uuid NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_ru      text NOT NULL,
  name_en      text NOT NULL,
  desc_ru      text NOT NULL DEFAULT '',
  desc_en      text NOT NULL DEFAULT '',
  is_flagship  boolean NOT NULL DEFAULT false,
  sort_order   int  NOT NULL DEFAULT 0
);

-- 4. partnership_formats
CREATE TABLE partnership_formats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  num         text NOT NULL,
  title_ru    text NOT NULL,
  title_en    text NOT NULL,
  points_ru   jsonb NOT NULL DEFAULT '[]',
  points_en   jsonb NOT NULL DEFAULT '[]',
  suit_ru     text NOT NULL DEFAULT '',
  suit_en     text NOT NULL DEFAULT '',
  sort_order  int  NOT NULL DEFAULT 0
);

-- 5. club_events
CREATE TABLE club_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru     text NOT NULL,
  name_en     text NOT NULL,
  desc_ru     text NOT NULL DEFAULT '',
  desc_en     text NOT NULL DEFAULT '',
  detail_ru   text NOT NULL DEFAULT '',
  detail_en   text NOT NULL DEFAULT '',
  sort_order  int  NOT NULL DEFAULT 0
);

-- 6. contacts
CREATE TABLE contacts (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key       text NOT NULL UNIQUE,
  value_ru  text NOT NULL,
  value_en  text NOT NULL
);

-- 7. texts
CREATE TABLE texts (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key       text NOT NULL UNIQUE,
  value_ru  text NOT NULL,
  value_en  text NOT NULL
);

-- 8. analytics_pageviews
CREATE TABLE analytics_pageviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page          text NOT NULL,
  referrer      text,
  device        text,
  browser       text,
  screen_width  int,
  session_id    text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 9. analytics_events
CREATE TABLE analytics_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  text NOT NULL,
  page        text,
  metadata    jsonb DEFAULT '{}',
  session_id  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 10. analytics_sessions
CREATE TABLE analytics_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        text NOT NULL UNIQUE,
  started_at        timestamptz NOT NULL DEFAULT now(),
  duration          int DEFAULT 0,
  pages_viewed      int DEFAULT 0,
  max_scroll_depth  int DEFAULT 0,
  device            text,
  browser           text
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_events_active_sort ON events (is_active, sort_order);
CREATE INDEX idx_menu_items_category ON menu_items (category_id, sort_order);
CREATE INDEX idx_menu_categories_tab ON menu_categories (tab, sort_order);
CREATE INDEX idx_analytics_pageviews_created ON analytics_pageviews (created_at);
CREATE INDEX idx_analytics_events_created ON analytics_events (created_at);
CREATE INDEX idx_analytics_sessions_started ON analytics_sessions (started_at);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Content tables: public read, authenticated write
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Auth write events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read menu_categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Auth write menu_categories" ON menu_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Auth write menu_items" ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read partnership_formats" ON partnership_formats FOR SELECT USING (true);
CREATE POLICY "Auth write partnership_formats" ON partnership_formats FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read club_events" ON club_events FOR SELECT USING (true);
CREATE POLICY "Auth write club_events" ON club_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Auth write contacts" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read texts" ON texts FOR SELECT USING (true);
CREATE POLICY "Auth write texts" ON texts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Analytics tables: public insert (for tracking), authenticated read
CREATE POLICY "Public insert analytics_pageviews" ON analytics_pageviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read analytics_pageviews" ON analytics_pageviews FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public insert analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read analytics_events" ON analytics_events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public insert analytics_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update analytics_sessions" ON analytics_sessions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Auth read analytics_sessions" ON analytics_sessions FOR SELECT TO authenticated USING (true);

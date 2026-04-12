-- =============================================
-- Код 1847 — Database Schema
-- =============================================

-- 1. events — мероприятия
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  day text NOT NULL,
  month_ru text NOT NULL,
  month_en text NOT NULL,
  name_ru text NOT NULL,
  name_en text NOT NULL,
  desc_ru text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  time text NOT NULL,
  tag_ru text NOT NULL DEFAULT '',
  tag_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. menu_categories — категории меню
CREATE TABLE menu_categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tab text NOT NULL CHECK (tab IN ('tea', 'hookah', 'food')),
  title_ru text NOT NULL,
  title_en text NOT NULL,
  desc_ru text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0
);

-- 3. menu_items — позиции меню
CREATE TABLE menu_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id bigint NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_ru text NOT NULL,
  name_en text NOT NULL,
  desc_ru text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  is_flagship boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);

-- 4. partnership_formats — форматы сотрудничества
CREATE TABLE partnership_formats (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  num text NOT NULL,
  title_ru text NOT NULL,
  title_en text NOT NULL,
  points_ru jsonb NOT NULL DEFAULT '[]',
  points_en jsonb NOT NULL DEFAULT '[]',
  suit_ru text NOT NULL DEFAULT '',
  suit_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0
);

-- 5. club_events — собственные мероприятия клуба
CREATE TABLE club_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name_ru text NOT NULL,
  name_en text NOT NULL,
  desc_ru text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  detail_ru text NOT NULL DEFAULT '',
  detail_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0
);

-- 6. contacts — контактная информация
CREATE TABLE contacts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value_ru text NOT NULL DEFAULT '',
  value_en text NOT NULL DEFAULT ''
);

-- 7. texts — текстовые блоки сайта
CREATE TABLE texts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value_ru text NOT NULL DEFAULT '',
  value_en text NOT NULL DEFAULT ''
);

-- 8. analytics_pageviews
CREATE TABLE analytics_pageviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page text NOT NULL,
  referrer text,
  device text,
  browser text,
  screen_width int,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. analytics_events
CREATE TABLE analytics_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type text NOT NULL,
  page text,
  metadata jsonb DEFAULT '{}',
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. analytics_sessions
CREATE TABLE analytics_sessions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id text NOT NULL UNIQUE,
  started_at timestamptz NOT NULL DEFAULT now(),
  duration int,
  pages_viewed int,
  max_scroll_depth int,
  device text,
  browser text
);

-- =============================================
-- RLS Policies
-- =============================================

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

-- Public read for content tables
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read menu_categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read partnership_formats" ON partnership_formats FOR SELECT USING (true);
CREATE POLICY "Public read club_events" ON club_events FOR SELECT USING (true);
CREATE POLICY "Public read contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Public read texts" ON texts FOR SELECT USING (true);

-- Authenticated write for content tables
CREATE POLICY "Auth write events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write menu_categories" ON menu_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write menu_items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write partnership_formats" ON partnership_formats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write club_events" ON club_events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write texts" ON texts FOR ALL USING (auth.role() = 'authenticated');

-- Analytics: public insert, authenticated read
CREATE POLICY "Public insert analytics_pageviews" ON analytics_pageviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read analytics_pageviews" ON analytics_pageviews FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read analytics_events" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert analytics_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read analytics_sessions" ON analytics_sessions FOR SELECT USING (auth.role() = 'authenticated');

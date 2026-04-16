-- ============================================================
-- KOD 1847 — PostgreSQL Schema
-- Run on server: psql -U kod1847 -d kod1847 -f schema.sql
-- ============================================================

-- Events
CREATE TABLE IF NOT EXISTS events (
  id            SERIAL PRIMARY KEY,
  day           VARCHAR(10) NOT NULL DEFAULT '',
  month_ru      VARCHAR(50) NOT NULL DEFAULT '',
  month_en      VARCHAR(50) NOT NULL DEFAULT '',
  name_ru       VARCHAR(255) NOT NULL DEFAULT '',
  name_en       VARCHAR(255) NOT NULL DEFAULT '',
  desc_ru       TEXT NOT NULL DEFAULT '',
  desc_en       TEXT NOT NULL DEFAULT '',
  time          VARCHAR(20) NOT NULL DEFAULT '',
  tag_ru        VARCHAR(100) NOT NULL DEFAULT '',
  tag_en        VARCHAR(100) NOT NULL DEFAULT '',
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id            SERIAL PRIMARY KEY,
  tab           VARCHAR(20) NOT NULL DEFAULT 'tea',
  title_ru      VARCHAR(255) NOT NULL DEFAULT '',
  title_en      VARCHAR(255) NOT NULL DEFAULT '',
  desc_ru       TEXT NOT NULL DEFAULT '',
  desc_en       TEXT NOT NULL DEFAULT '',
  sort_order    INT NOT NULL DEFAULT 0
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id            SERIAL PRIMARY KEY,
  category_id   INT NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_ru       VARCHAR(255) NOT NULL DEFAULT '',
  name_en       VARCHAR(255) NOT NULL DEFAULT '',
  desc_ru       TEXT NOT NULL DEFAULT '',
  desc_en       TEXT NOT NULL DEFAULT '',
  is_flagship   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INT NOT NULL DEFAULT 0
);

-- Partnership formats
CREATE TABLE IF NOT EXISTS partnership_formats (
  id            SERIAL PRIMARY KEY,
  num           VARCHAR(10) NOT NULL DEFAULT '',
  title_ru      VARCHAR(255) NOT NULL DEFAULT '',
  title_en      VARCHAR(255) NOT NULL DEFAULT '',
  points_ru     JSONB NOT NULL DEFAULT '[]',
  points_en     JSONB NOT NULL DEFAULT '[]',
  suit_ru       TEXT NOT NULL DEFAULT '',
  suit_en       TEXT NOT NULL DEFAULT '',
  sort_order    INT NOT NULL DEFAULT 0
);

-- Club events (used on partnership page)
CREATE TABLE IF NOT EXISTS club_events (
  id            SERIAL PRIMARY KEY,
  name_ru       VARCHAR(255) NOT NULL DEFAULT '',
  name_en       VARCHAR(255) NOT NULL DEFAULT '',
  desc_ru       TEXT NOT NULL DEFAULT '',
  desc_en       TEXT NOT NULL DEFAULT '',
  detail_ru     VARCHAR(255) NOT NULL DEFAULT '',
  detail_en     VARCHAR(255) NOT NULL DEFAULT '',
  sort_order    INT NOT NULL DEFAULT 0
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id            SERIAL PRIMARY KEY,
  key           VARCHAR(100) NOT NULL,
  value_ru      TEXT NOT NULL DEFAULT '',
  value_en      TEXT NOT NULL DEFAULT ''
);

-- Text blocks
CREATE TABLE IF NOT EXISTS texts (
  id            SERIAL PRIMARY KEY,
  key           VARCHAR(100) UNIQUE NOT NULL,
  value_ru      TEXT NOT NULL DEFAULT '',
  value_en      TEXT NOT NULL DEFAULT ''
);

-- Admin users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  phone         VARCHAR(50) NOT NULL,
  date          VARCHAR(50) NOT NULL DEFAULT '',
  guests        VARCHAR(20) NOT NULL DEFAULT '',
  comment       TEXT NOT NULL DEFAULT '',
  consent       BOOLEAN NOT NULL DEFAULT FALSE,
  iiko_id       VARCHAR(255),
  iiko_status   VARCHAR(50),
  iiko_error    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics: sessions
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id              SERIAL PRIMARY KEY,
  session_id      VARCHAR(100) NOT NULL,
  device          VARCHAR(50) NOT NULL DEFAULT 'unknown',
  browser         VARCHAR(50) NOT NULL DEFAULT 'unknown',
  pages_viewed    INT NOT NULL DEFAULT 0,
  max_scroll_depth INT NOT NULL DEFAULT 0,
  duration        INT NOT NULL DEFAULT 0,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON analytics_sessions(started_at);

-- Analytics: pageviews
CREATE TABLE IF NOT EXISTS analytics_pageviews (
  id            SERIAL PRIMARY KEY,
  page          VARCHAR(500) NOT NULL DEFAULT '',
  referrer      TEXT,
  device        VARCHAR(50) NOT NULL DEFAULT 'unknown',
  browser       VARCHAR(50) NOT NULL DEFAULT 'unknown',
  screen_width  INT,
  session_id    VARCHAR(100) NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON analytics_pageviews(created_at);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON analytics_pageviews(session_id);

-- Analytics: events
CREATE TABLE IF NOT EXISTS analytics_events (
  id            SERIAL PRIMARY KEY,
  event_type    VARCHAR(100) NOT NULL DEFAULT '',
  page          VARCHAR(500) NOT NULL DEFAULT '',
  metadata      JSONB NOT NULL DEFAULT '{}',
  session_id    VARCHAR(100) NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at);

-- ============================================================
-- PostgreSQL tuning for 1.9 GB RAM (add to postgresql.conf)
-- ============================================================
-- shared_buffers = 384MB
-- effective_cache_size = 1GB
-- work_mem = 4MB
-- maintenance_work_mem = 64MB
-- max_connections = 30
-- wal_buffers = 8MB
-- checkpoint_completion_target = 0.9
-- random_page_cost = 1.1
-- ============================================================

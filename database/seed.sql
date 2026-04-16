-- ============================================================
-- KOD 1847 — Seed data
-- Run after schema.sql: psql -U kod1847 -d kod1847 -f seed.sql
-- ============================================================

-- Default admin user (password: kod1847admin — change after first login!)
-- Hash generated with bcryptjs, 10 rounds
INSERT INTO users (email, password_hash) VALUES
  ('admin@kod1847.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (email) DO NOTHING;

-- Default text blocks
INSERT INTO texts (key, value_ru, value_en) VALUES
  ('philosophy', '', ''),
  ('hero_subtitle', '', ''),
  ('tea_room_title', '', ''),
  ('tea_room_desc', '', ''),
  ('hookah_room_title', '', ''),
  ('hookah_room_desc', '', ''),
  ('menu_subtitle', '', ''),
  ('events_subtitle', '', ''),
  ('partnership_subtitle', '', ''),
  ('club_subtitle', '', ''),
  ('contact_subtitle', '', '')
ON CONFLICT (key) DO NOTHING;

-- Default contacts
INSERT INTO contacts (key, value_ru, value_en) VALUES
  ('address', '', ''),
  ('hours', '', ''),
  ('phone', '', ''),
  ('telegram', '', ''),
  ('instagram', '', ''),
  ('partnership_phone', '', '')
ON CONFLICT DO NOTHING;

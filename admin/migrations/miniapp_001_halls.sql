CREATE TABLE IF NOT EXISTS miniapp_halls (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) NOT NULL CHECK (slug IN ('tea', 'hookah')),
  caption_ru TEXT DEFAULT '',
  caption_en TEXT DEFAULT '',
  title_ru TEXT DEFAULT '',
  title_en TEXT DEFAULT '',
  description_ru TEXT,
  description_en TEXT,
  seats INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  city_ru VARCHAR(255),
  city_en VARCHAR(255),
  street_ru TEXT,
  street_en TEXT,
  hours_ru TEXT,
  hours_en TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_miniapp_halls_slug ON miniapp_halls(slug);
CREATE INDEX IF NOT EXISTS idx_miniapp_halls_sort_order ON miniapp_halls(sort_order);

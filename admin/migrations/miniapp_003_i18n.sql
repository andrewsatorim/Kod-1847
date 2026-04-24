CREATE TABLE IF NOT EXISTS miniapp_i18n (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  lang VARCHAR(10) NOT NULL CHECK (lang IN ('ru', 'en')),
  value TEXT DEFAULT '',
  section VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(key, lang)
);

CREATE INDEX IF NOT EXISTS idx_miniapp_i18n_key ON miniapp_i18n(key);
CREATE INDEX IF NOT EXISTS idx_miniapp_i18n_lang ON miniapp_i18n(lang);
CREATE INDEX IF NOT EXISTS idx_miniapp_i18n_section ON miniapp_i18n(section);

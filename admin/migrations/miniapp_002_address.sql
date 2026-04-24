CREATE TABLE IF NOT EXISTS miniapp_address (
  id SERIAL PRIMARY KEY,
  city_ru VARCHAR(255) DEFAULT 'Москва',
  city_en VARCHAR(255) DEFAULT 'Moscow',
  street_ru TEXT,
  street_en TEXT,
  hours_ru TEXT,
  hours_en TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

INSERT INTO miniapp_address (city_ru, city_en, street_ru, street_en)
VALUES ('Москва', 'Moscow', '', '')
ON CONFLICT DO NOTHING;

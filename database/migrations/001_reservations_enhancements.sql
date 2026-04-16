-- ============================================================
-- Reservations: новые поля для карточек заявок
-- Применить: sudo -u postgres psql -d kod1847 -f 001_reservations_enhancements.sql
-- ============================================================

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS time          VARCHAR(10)  NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS source        VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS event_name    VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS visited       VARCHAR(20)  NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS manager_note  TEXT         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW();

-- Ограничение на допустимые значения visited
ALTER TABLE reservations
  DROP CONSTRAINT IF EXISTS reservations_visited_check;
ALTER TABLE reservations
  ADD CONSTRAINT reservations_visited_check
  CHECK (visited IN ('pending', 'came', 'no_show', 'cancelled'));

-- Индексы для списков и фильтров
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_visited    ON reservations(visited);
CREATE INDEX IF NOT EXISTS idx_reservations_source     ON reservations(source);

-- Автообновление updated_at при UPDATE
CREATE OR REPLACE FUNCTION reservations_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reservations_updated_at ON reservations;
CREATE TRIGGER trg_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION reservations_touch_updated_at();

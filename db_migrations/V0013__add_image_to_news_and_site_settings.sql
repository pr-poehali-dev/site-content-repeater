-- Добавляем колонку для изображения в таблицу новостей
ALTER TABLE t_p6890055_site_content_repeate.news 
ADD COLUMN image_url TEXT;

-- Создаем таблицу для хранения настроек сайта
CREATE TABLE IF NOT EXISTS t_p6890055_site_content_repeate.site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индекс для быстрого поиска по ключу
CREATE INDEX idx_site_settings_key ON t_p6890055_site_content_repeate.site_settings(setting_key);
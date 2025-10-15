CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, is_admin) 
VALUES ('gabuniaalan13@gmail.com', '$2b$10$dummy.hash.placeholder', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO news (title, description, date) VALUES
  ('Обновление 1.5', 'Добавлены новые квесты и улучшена система крафта', '15 октября 2025'),
  ('Новый ивент', 'Хэллоуин ивент стартует на следующей неделе!', '10 октября 2025'),
  ('Набор в команду', 'Ищем модераторов и помощников администрации', '5 октября 2025')
ON CONFLICT DO NOTHING;
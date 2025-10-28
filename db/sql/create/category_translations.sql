CREATE TYPE language_code AS ENUM ('uk', 'en', 'ru');

CREATE TABLE category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(category_id, language_code)
);
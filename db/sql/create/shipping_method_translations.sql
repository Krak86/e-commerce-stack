CREATE TABLE shipping_method_translations (
  id SERIAL PRIMARY KEY,
  shipping_method_id INTEGER NOT NULL REFERENCES shipping_methods(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL,
  description TEXT
);
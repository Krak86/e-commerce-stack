CREATE TABLE product_translations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(product_id, language_code)
);
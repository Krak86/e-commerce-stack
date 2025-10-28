CREATE TABLE payment_method_translations (
  id SERIAL PRIMARY KEY,
  payment_method_id INTEGER NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL, -- 'Карта', 'Готівка', 'PayPal'
  description TEXT
);

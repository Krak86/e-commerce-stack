CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly ключ
  created_at TIMESTAMP DEFAULT now()
);

-- Приклад запиту з приєднанням перекладів (українська)
SELECT c.id, c.slug, t.name, t.description
FROM categories c
JOIN category_translations t ON c.id = t.category_id
WHERE t.language_code = 'uk';


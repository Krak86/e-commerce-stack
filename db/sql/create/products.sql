CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

SELECT p.id, p.slug, p.price, p.stock, pt.name, pt.description
FROM products p
JOIN product_translations pt ON p.id = pt.product_id
WHERE pt.language_code = 'uk'
ORDER BY p.id
LIMIT 10 OFFSET 0;

SELECT
  p.id,
  p.slug,
  p.price,
  p.stock,
  pt.name,
  pt.description,
  c.slug AS category_slug,
  ct.name AS category_name
FROM products p
JOIN product_translations pt ON p.id = pt.product_id
JOIN categories c ON p.category_id = c.id
JOIN category_translations ct ON c.id = ct.category_id
WHERE pt.language_code = 'uk'
  AND ct.language_code = 'uk'
  AND c.slug = 'sports'
ORDER BY p.id
LIMIT 10 OFFSET 0;
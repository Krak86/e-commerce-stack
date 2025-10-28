CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_order_time NUMERIC(10,2) NOT NULL,
  variant TEXT
);

--✅ Повний запит з деталями товарів, перекладом, thumbnail
SELECT
  o.id AS order_id,
  o.status,
  o.total_amount,
  o.created_at,
  oi.quantity,
  oi.price_at_order_time,
  oi.variant,
  p.slug,
  pt.name,
  pt.description,
  pi.image_url
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = 'uk'
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
WHERE o.user_id = 'user-uuid-here'
ORDER BY o.created_at DESC;

--✅ Єдиний запит з пагінацією, перекладом і thumbnail
SELECT
  o.id AS order_id,
  o.status,
  o.total_amount,
  o.created_at,
  oi.quantity,
  oi.price_at_order_time,
  oi.variant,
  p.slug,
  pt.name,
  pt.description,
  pi.image_url
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = 'uk'
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
WHERE o.user_id = 'user-uuid-here'
  AND o.id IN (
    SELECT id FROM orders
    WHERE user_id = 'user-uuid-here'
    ORDER BY created_at DESC
    LIMIT 10 OFFSET 0
  )
ORDER BY o.created_at DESC;

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  variant TEXT,
  price_snapshot NUMERIC(10,2),
  added_at TIMESTAMP DEFAULT now()

  CONSTRAINT unique_cart_item_per_user
    UNIQUE (user_id, product_id)
);
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id INTEGER NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW(),

  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_favorite
    UNIQUE (user_id, product_id)
);

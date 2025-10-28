CREATE TYPE shipping_status AS ENUM ('pending', 'shipped', 'delivered', 'cancelled', 'other');

CREATE TABLE shipping (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method_id INTEGER NOT NULL REFERENCES shipping_methods(id) ON DELETE RESTRICT,
  status shipping_status NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  shipping_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

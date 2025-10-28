CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'other');

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UAH',
  status payment_status NOT NULL DEFAULT 'pending',
  method_id INTEGER NOT NULL REFERENCES payment_methods(id) ON DELETE RESTRICT,
  transaction_id TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

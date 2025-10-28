CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'card', 'paypal', 'crypto', 'cash'
  is_active BOOLEAN DEFAULT true
);

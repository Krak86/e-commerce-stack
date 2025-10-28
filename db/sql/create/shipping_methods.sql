CREATE TABLE shipping_methods (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'nova_poshta', 'courier', 'pickup'
  is_active BOOLEAN DEFAULT true
);

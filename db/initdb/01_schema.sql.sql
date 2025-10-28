CREATE TYPE language_code AS ENUM ('uk', 'en', 'ru');

CREATE TYPE user_role AS ENUM ('guest', 'user', 'admin');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  confirmed_at TIMESTAMP,
  confirmation_sent_at TIMESTAMP,
  invited_at TIMESTAMP,
  last_signed_in_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  metadata JSONB,
  auth_provider TEXT DEFAULT 'local',
  provider_user_id TEXT,
  role user_role DEFAULT 'user',
  language_code language_code DEFAULT 'uk' 
);

CREATE OR REPLACE FUNCTION update_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_addresses_updated_at
BEFORE UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION update_addresses_updated_at();

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  street TEXT NOT NULL,
  house TEXT,
  apartment TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly ключ
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(category_id, language_code)
);

CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'other');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT,
  shipping_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP
);

CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'card', 'paypal', 'crypto', 'cash'
  is_active BOOLEAN DEFAULT true
);

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


CREATE TABLE payment_method_translations (
  id SERIAL PRIMARY KEY,
  payment_method_id INTEGER NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL, -- 'Карта', 'Готівка', 'PayPal'
  description TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE product_translations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(product_id, language_code)
);

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  variant TEXT,
  price_snapshot NUMERIC(10,2),
  added_at TIMESTAMP DEFAULT now()

  CONSTRAINT unique_cart_item_per_user
    UNIQUE (user_id, product_id, quantity)
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_order_time NUMERIC(10,2) NOT NULL,
  variant TEXT
);

CREATE TABLE shipping_methods (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'nova_poshta', 'courier', 'pickup'
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE shipping_method_translations (
  id SERIAL PRIMARY KEY,
  shipping_method_id INTEGER NOT NULL REFERENCES shipping_methods(id) ON DELETE CASCADE,
  language_code language_code DEFAULT 'uk'
  name TEXT NOT NULL,
  description TEXT
);

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

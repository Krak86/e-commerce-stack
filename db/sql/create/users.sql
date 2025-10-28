CREATE TYPE user_role AS ENUM ('guest', 'user', 'admin');
CREATE TYPE language_code AS ENUM ('uk', 'en', 'ru');

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


-- Minimal SQL for users and company_profile tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  signup_type VARCHAR(1) NOT NULL DEFAULT 'e',
  gender CHAR(1) NOT NULL DEFAULT 'o',
  mobile_no VARCHAR(20) NOT NULL UNIQUE,
  is_mobile_verified BOOLEAN DEFAULT FALSE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_profile (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) DEFAULT '',
  website TEXT DEFAULT '',
  logo_url TEXT DEFAULT NULL,
  industry TEXT NOT NULL,
  description TEXT DEFAULT '',
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

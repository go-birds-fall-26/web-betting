CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CREATE TABLE IF NOT EXISTS events (
-- );

-- CREATE TABLE IF NOT EXISTS markets (
-- );

-- CREATE TABLE IF NOT EXISTS markets_outcomes (
-- );

-- CREATE TABLE IF NOT EXISTS bets (
-- );

-- CREATE TABLE IF NOT EXISTS wallet_transactions (
-- );


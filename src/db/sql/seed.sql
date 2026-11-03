CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  balance_cents INTEGER NOT NULL DEFAULT 0 CHECK (balance_cents >= 0)
);

-- CREATE TABLE IF NOT EXISTS events (
-- );

-- CREATE TABLE IF NOT EXISTS markets (
-- );

-- CREATE TABLE IF NOT EXISTS markets_outcomes (
-- );

-- CREATE TABLE IF NOT EXISTS bets (
-- );

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdraw', 'bet', 'payout', 'refund')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents <> 0),
  balance_after_cents INTEGER NOT NULL CHECK (balance_after_cents >= 0),
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  bet_id INTEGER NULL
);

-- Development/Test User
INSERT INTO users (email, password_hash, balance_cents)
VALUES ('test_user@example.com', 'placeholder_hash', 0)
ON CONFLICT (email) DO NOTHING;

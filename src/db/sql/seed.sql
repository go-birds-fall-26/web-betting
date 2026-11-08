CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  balance_cents INTEGER NOT NULL DEFAULT 0 CHECK (balance_cents >= 0)
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  espn_game_id TEXT NOT NULL UNIQUE,
  home_team_id TEXT NOT NULL,
  home_team_name TEXT NOT NULL,
  away_team_id TEXT NOT NULL,
  away_team_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'final', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS markets (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id),
  created_by INTEGER NULL REFERENCES users(id),
  question TEXT NOT NULL,
  template TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '{}',
  yes_count INTEGER NOT NULL DEFAULT 0 CHECK (yes_count >= 0),
  no_count INTEGER NOT NULL DEFAULT 0 CHECK (no_count >= 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'settled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS markets_outcomes (
  id SERIAL PRIMARY KEY,
  market_id INTEGER NOT NULL UNIQUE REFERENCES markets(id),
  result TEXT NOT NULL CHECK (result IN ('yes', 'no', 'tie', 'cancelled')),
  settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  market_id INTEGER NOT NULL REFERENCES markets(id),
  side TEXT NOT NULL CHECK (side IN ('yes', 'no')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents BETWEEN 1 AND 99),
  fee_cents INTEGER NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'cashed_out', 'won', 'lost', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdraw', 'bet', 'payout', 'refund')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents <> 0),
  balance_after_cents INTEGER NOT NULL CHECK (balance_after_cents >= 0),
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  bet_id INTEGER NULL REFERENCES bets(id)
);

-- Dev seed: week 10 games from the Markets sketches (real ESPN IDs)
INSERT INTO events(espn_game_id, home_team_id, home_team_name, away_team_id, away_team_name, start_time)
VALUES
  ('401873052', '19', 'Giants',  '28', 'Commanders', '2026-11-13T01:15Z'),
  ('401873053', '8',  'Lions',   '17', 'Patriots',   '2026-11-15T14:30Z'),
  ('401873058', '1',  'Falcons', '12', 'Chiefs',     '2026-11-15T18:00Z'),
  ('401873056', '5',  'Browns',  '34', 'Texans',     '2026-11-15T18:00Z'),
  ('401873060', '9',  'Packers', '16', 'Vikings',    '2026-11-15T18:00Z')
ON CONFLICT (espn_game_id) DO NOTHING;

-- Development/Test User
INSERT INTO users (first_name, last_name, email, password_hash, balance_cents)
VALUES ('Test', 'User', 'test_user@example.com', 'placeholder_hash', 0)
ON CONFLICT (email) DO NOTHING;
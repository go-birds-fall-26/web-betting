CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  balance_cents INTEGER NOT NULL DEFAULT 0 CHECK (balance_cents >= 0)
);

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL,
  color TEXT NOT NULL,
  alternate_color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  espn_game_id TEXT NOT NULL UNIQUE,
  season_type INTEGER NOT NULL CHECK (season_type IN (2, 3)),
  week INTEGER NOT NULL CHECK (week > 0),
  home_team_id TEXT NOT NULL REFERENCES teams(id),
  away_team_id TEXT NOT NULL REFERENCES teams(id),
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

INSERT INTO teams (id, location, name, abbreviation, logo_url, color, alternate_color)
VALUES
  ('1', 'Atlanta', 'Falcons', 'ATL', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/atl.png', 'a71930', '000000'),
  ('2', 'Buffalo', 'Bills', 'BUF', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/buf.png', '00338d', 'd50a0a'),
  ('3', 'Chicago', 'Bears', 'CHI', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/chi.png', '0b1c3a', 'e64100'),
  ('4', 'Cincinnati', 'Bengals', 'CIN', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cin.png', 'fb4f14', '000000'),
  ('5', 'Cleveland', 'Browns', 'CLE', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cle.png', '472a08', 'ff3c00'),
  ('6', 'Dallas', 'Cowboys', 'DAL', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/dal.png', '002a5c', 'b0b7bc'),
  ('7', 'Denver', 'Broncos', 'DEN', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/den.png', '0a2343', 'fc4c02'),
  ('8', 'Detroit', 'Lions', 'DET', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/det.png', '0076b6', 'bbbbbb'),
  ('9', 'Green Bay', 'Packers', 'GB', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/gb.png', '204e32', 'ffb612'),
  ('10', 'Tennessee', 'Titans', 'TEN', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ten.png', '4495d2', '001532'),
  ('11', 'Indianapolis', 'Colts', 'IND', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ind.png', '003b75', 'ffffff'),
  ('12', 'Kansas City', 'Chiefs', 'KC', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/kc.png', 'e31837', 'ffb612'),
  ('13', 'Las Vegas', 'Raiders', 'LV', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lv.png', '000000', 'a5acaf'),
  ('14', 'Los Angeles', 'Rams', 'LAR', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lar.png', '003594', 'ffd100'),
  ('15', 'Miami', 'Dolphins', 'MIA', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/mia.png', '008e97', 'fc4c02'),
  ('16', 'Minnesota', 'Vikings', 'MIN', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/min.png', '4f2683', 'ffc62f'),
  ('17', 'New England', 'Patriots', 'NE', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png', '002a5c', 'c60c30'),
  ('18', 'New Orleans', 'Saints', 'NO', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/no.png', 'd3bc8d', '000000'),
  ('19', 'New York', 'Giants', 'NYG', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyg.png', '003c7f', 'c9243f'),
  ('20', 'New York', 'Jets', 'NYJ', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyj.png', '115740', 'ffffff'),
  ('21', 'Philadelphia', 'Eagles', 'PHI', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/phi.png', '06424d', '000000'),
  ('22', 'Arizona', 'Cardinals', 'ARI', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ari.png', 'a40227', 'ffffff'),
  ('23', 'Pittsburgh', 'Steelers', 'PIT', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/pit.png', '000000', 'ffb612'),
  ('24', 'Los Angeles', 'Chargers', 'LAC', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lac.png', '0080c6', 'ffc20e'),
  ('25', 'San Francisco', '49ers', 'SF', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sf.png', 'aa0000', 'b3995d'),
  ('26', 'Seattle', 'Seahawks', 'SEA', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png', '002a5c', '69be28'),
  ('27', 'Tampa Bay', 'Buccaneers', 'TB', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/tb.png', 'bd1c36', '3e3a35'),
  ('28', 'Washington', 'Commanders', 'WSH', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/wsh.png', '5a1414', 'ffb612'),
  ('29', 'Carolina', 'Panthers', 'CAR', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/car.png', '0085ca', '000000'),
  ('30', 'Jacksonville', 'Jaguars', 'JAX', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/jax.png', '007487', 'd7a22a'),
  ('33', 'Baltimore', 'Ravens', 'BAL', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/bal.png', '29126f', '000000'),
  ('34', 'Houston', 'Texans', 'HOU', 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/hou.png', '021018', 'eb0028')
ON CONFLICT (id) DO NOTHING;

-- Dev seed: five NFL week 10 games (real ESPN IDs)
INSERT INTO events(espn_game_id, season_type, week, home_team_id, away_team_id, start_time)
VALUES
  ('401873052', 2, 10, '19', '28', '2026-11-13T01:15Z'),
  ('401873053', 2, 10, '8',  '17', '2026-11-15T14:30Z'),
  ('401873058', 2, 10, '1',  '12', '2026-11-15T18:00Z'),
  ('401873056', 2, 10, '5',  '34', '2026-11-15T18:00Z'),
  ('401873060', 2, 10, '9',  '16', '2026-11-15T18:00Z')
ON CONFLICT (espn_game_id) DO NOTHING;

-- Development/Test User
INSERT INTO users (first_name, last_name, email, password_hash, balance_cents)
VALUES ('Test', 'User', 'test_user@example.com', 'placeholder_hash', 0)
ON CONFLICT (email) DO NOTHING;
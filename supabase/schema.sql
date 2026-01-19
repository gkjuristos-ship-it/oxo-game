-- OXO Multiplayer Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fid INTEGER UNIQUE NOT NULL,
  username TEXT,
  display_name TEXT,
  pfp_url TEXT,
  elo INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player1_fid INTEGER NOT NULL REFERENCES players(fid),
  player2_fid INTEGER REFERENCES players(fid),
  board TEXT DEFAULT '[null,null,null,null,null,null,null,null,null]',
  current_turn INTEGER,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  winner_fid INTEGER,
  result TEXT CHECK (result IN ('win', 'lose', 'draw')),
  room_code TEXT,
  is_ranked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matchmaking queue
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fid INTEGER UNIQUE NOT NULL REFERENCES players(fid),
  elo INTEGER DEFAULT 1000,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_players INTEGER DEFAULT 16,
  current_players INTEGER DEFAULT 0,
  status TEXT DEFAULT 'registration' CHECK (status IN ('registration', 'starting', 'live', 'finished')),
  bracket JSONB,
  prize_pool TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournament participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  fid INTEGER NOT NULL REFERENCES players(fid),
  seed INTEGER,
  eliminated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, fid)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_room_code ON matches(room_code);
CREATE INDEX IF NOT EXISTS idx_matches_players ON matches(player1_fid, player2_fid);
CREATE INDEX IF NOT EXISTS idx_queue_joined ON matchmaking_queue(joined_at);
CREATE INDEX IF NOT EXISTS idx_players_elo ON players(elo DESC);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  fid,
  username,
  display_name,
  elo,
  wins,
  ROW_NUMBER() OVER (ORDER BY elo DESC) as rank
FROM players
WHERE wins > 0 OR losses > 0
ORDER BY elo DESC;

-- Function to update player stats after match
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
DECLARE
  k_factor INTEGER := 32;
  expected_p1 FLOAT;
  expected_p2 FLOAT;
  new_elo_p1 INTEGER;
  new_elo_p2 INTEGER;
  p1_elo INTEGER;
  p2_elo INTEGER;
BEGIN
  -- Only run when match finishes
  IF NEW.status = 'finished' AND OLD.status = 'playing' THEN
    -- Get current ELOs
    SELECT elo INTO p1_elo FROM players WHERE fid = NEW.player1_fid;
    SELECT elo INTO p2_elo FROM players WHERE fid = NEW.player2_fid;

    IF NEW.is_ranked AND NEW.player2_fid IS NOT NULL THEN
      -- Calculate expected scores
      expected_p1 := 1.0 / (1.0 + POWER(10, (p2_elo - p1_elo) / 400.0));
      expected_p2 := 1.0 / (1.0 + POWER(10, (p1_elo - p2_elo) / 400.0));

      IF NEW.winner_fid = NEW.player1_fid THEN
        -- Player 1 wins
        new_elo_p1 := p1_elo + ROUND(k_factor * (1 - expected_p1));
        new_elo_p2 := p2_elo + ROUND(k_factor * (0 - expected_p2));
        
        UPDATE players SET wins = wins + 1, elo = new_elo_p1, updated_at = NOW() 
        WHERE fid = NEW.player1_fid;
        UPDATE players SET losses = losses + 1, elo = GREATEST(new_elo_p2, 100), updated_at = NOW() 
        WHERE fid = NEW.player2_fid;
        
      ELSIF NEW.winner_fid = NEW.player2_fid THEN
        -- Player 2 wins
        new_elo_p1 := p1_elo + ROUND(k_factor * (0 - expected_p1));
        new_elo_p2 := p2_elo + ROUND(k_factor * (1 - expected_p2));
        
        UPDATE players SET losses = losses + 1, elo = GREATEST(new_elo_p1, 100), updated_at = NOW() 
        WHERE fid = NEW.player1_fid;
        UPDATE players SET wins = wins + 1, elo = new_elo_p2, updated_at = NOW() 
        WHERE fid = NEW.player2_fid;
        
      ELSE
        -- Draw
        new_elo_p1 := p1_elo + ROUND(k_factor * (0.5 - expected_p1));
        new_elo_p2 := p2_elo + ROUND(k_factor * (0.5 - expected_p2));
        
        UPDATE players SET draws = draws + 1, elo = new_elo_p1, updated_at = NOW() 
        WHERE fid = NEW.player1_fid;
        UPDATE players SET draws = draws + 1, elo = new_elo_p2, updated_at = NOW() 
        WHERE fid = NEW.player2_fid;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for stats update
DROP TRIGGER IF EXISTS on_match_finish ON matches;
CREATE TRIGGER on_match_finish
  AFTER UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_player_stats();

-- Function to clean up old queue entries
CREATE OR REPLACE FUNCTION cleanup_stale_queue()
RETURNS void AS $$
BEGIN
  DELETE FROM matchmaking_queue
  WHERE joined_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now - restrict as needed)
CREATE POLICY "Allow all for players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all for matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all for queue" ON matchmaking_queue FOR ALL USING (true);
CREATE POLICY "Allow all for tournaments" ON tournaments FOR ALL USING (true);
CREATE POLICY "Allow all for participants" ON tournament_participants FOR ALL USING (true);

-- Enable Realtime for matches
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;

-- Insert some sample data for testing
INSERT INTO players (fid, username, display_name, elo, wins, losses) VALUES
  (1, 'watson', 'WATSON', 2847, 156, 23),
  (2, 'turing', 'TURING', 2691, 142, 31),
  (3, 'wilkes', 'WILKES', 2534, 128, 45),
  (4, 'lovelace', 'LOVELACE', 2488, 119, 52),
  (5, 'babbage', 'BABBAGE', 2401, 107, 61)
ON CONFLICT (fid) DO NOTHING;

-- Sample tournaments
INSERT INTO tournaments (name, description, max_players, current_players, status, prize_pool, start_time) VALUES
  ('DAILY BLITZ', 'Quick daily tournament', 16, 12, 'registration', '0.01 ETH', NOW() + INTERVAL '2 hours'),
  ('WEEKLY CUP', 'Weekly championship', 32, 28, 'starting', '0.1 ETH', NOW() + INTERVAL '30 minutes'),
  ('GRAND PRIX', 'Monthly grand tournament', 64, 64, 'live', '1 ETH', NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

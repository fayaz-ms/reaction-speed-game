CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  reaction_time_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scores_player_id ON scores(player_id);
CREATE INDEX idx_scores_reaction_time ON scores(reaction_time_ms ASC);

-- Leaderboard view: best time per player
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  ROW_NUMBER() OVER (ORDER BY MIN(s.reaction_time_ms) ASC) AS rank,
  p.username,
  MIN(s.reaction_time_ms) AS best_time
FROM scores s
JOIN players p ON p.id = s.player_id
GROUP BY p.id, p.username
ORDER BY best_time ASC;

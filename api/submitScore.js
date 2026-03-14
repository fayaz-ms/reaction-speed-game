import pg from 'pg';

const { Pool } = pg;

let pool;

// In-memory fallback store when DATABASE_URL is not set
const memoryStore = {
  players: new Map(),
  scores: [],
};

// Make memoryStore globally accessible for serverless
if (!globalThis.__memoryStore) {
  globalThis.__memoryStore = memoryStore;
}

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, reaction_time_ms } = req.body;

  // Check if nickname is missing or empty
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ error: 'Nickname is required' });
  }

  // Validate nickname length (3-20 characters)
  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3) {
    return res.status(400).json({ error: 'Nickname must be at least 3 characters' });
  }
  
  if (trimmedUsername.length > 20) {
    return res.status(400).json({ error: 'Nickname must be maximum 20 characters' });
  }

  const time = parseInt(reaction_time_ms, 10);
  if (!Number.isFinite(time) || time < 1 || time > 10000) {
    return res.status(400).json({ error: 'Invalid reaction time' });
  }

  const sanitizedUsername = trimmedUsername.slice(0, 20);
  const db = getPool();

  if (!db) {
    // In-memory fallback
    const store = globalThis.__memoryStore || memoryStore;
    if (!store.players.has(sanitizedUsername)) {
      store.players.set(sanitizedUsername, { scores: [] });
    }
    const player = store.players.get(sanitizedUsername);
    player.scores.push(time);
    store.scores.push({ username: sanitizedUsername, reaction_time_ms: time, created_at: new Date() });
    const best = Math.min(...player.scores);
    return res.status(200).json({ success: true, best_time: best });
  }

  try {
    // Upsert player
    const playerResult = await db.query(
      `INSERT INTO players (username) VALUES ($1)
       ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
       RETURNING id`,
      [sanitizedUsername]
    );
    const playerId = playerResult.rows[0].id;

    // Insert score
    await db.query(
      `INSERT INTO scores (player_id, reaction_time_ms) VALUES ($1, $2)`,
      [playerId, time]
    );

    // Get personal best
    const bestResult = await db.query(
      `SELECT MIN(reaction_time_ms) as best FROM scores WHERE player_id = $1`,
      [playerId]
    );

    return res.status(200).json({
      success: true,
      best_time: bestResult.rows[0].best,
    });
  } catch (err) {
    console.error('submitScore error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

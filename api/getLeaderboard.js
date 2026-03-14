import pg from 'pg';

const { Pool } = pg;

let pool;

// In-memory fallback store (shared with submitScore via global)
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limitParam = parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 100 ? limitParam : 10;

  const db = getPool();

  if (!db) {
    // In-memory fallback leaderboard
    const store = globalThis.__memoryStore || memoryStore;
    const playerBests = new Map();
    for (const score of store.scores) {
      const cur = playerBests.get(score.username);
      if (!cur || score.reaction_time_ms < cur) {
        playerBests.set(score.username, score.reaction_time_ms);
      }
    }
    const leaderboard = Array.from(playerBests.entries())
      .map(([username, best_time]) => ({ username, best_time }))
      .sort((a, b) => a.best_time - b.best_time)
      .slice(0, limit)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));
    return res.status(200).json(leaderboard);
  }

  try {
    const result = await db.query(
      `SELECT
        ROW_NUMBER() OVER (ORDER BY MIN(s.reaction_time_ms) ASC) AS rank,
        p.username,
        MIN(s.reaction_time_ms) AS best_time
      FROM scores s
      JOIN players p ON p.id = s.player_id
      GROUP BY p.id, p.username
      ORDER BY best_time ASC
      LIMIT $1`,
      [limit]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('getLeaderboard error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

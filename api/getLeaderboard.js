import pg from 'pg';

const { Pool } = pg;

let pool;

function getPool() {
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

  try {
    const db = getPool();

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

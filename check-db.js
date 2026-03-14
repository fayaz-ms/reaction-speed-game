import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function checkDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✓ Connected to Neon PostgreSQL\n');

    // Check players
    const playersResult = await client.query('SELECT COUNT(*) as count FROM players');
    console.log(`Total Players: ${playersResult.rows[0].count}`);

    // Check scores
    const scoresResult = await client.query('SELECT COUNT(*) as count FROM scores');
    console.log(`Total Scores: ${scoresResult.rows[0].count}`);

    // Show leaderboard
    const leaderboardResult = await client.query('SELECT * FROM leaderboard LIMIT 10');
    console.log('\nTop 10 Leaderboard:');
    console.log('-------------------');
    leaderboardResult.rows.forEach(row => {
      console.log(`${row.rank}. ${row.username} - ${row.best_time}ms`);
    });

  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    await client.end();
  }
}

checkDatabase();

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function resetLeaderboard() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to Neon PostgreSQL...');
    await client.connect();
    console.log('✓ Connected\n');

    // Show current state
    console.log('BEFORE RESET:');
    console.log('-------------');
    const playersResult = await client.query('SELECT COUNT(*) as count FROM players');
    console.log(`Total Players: ${playersResult.rows[0].count}`);
    
    const scoresResult = await client.query('SELECT COUNT(*) as count FROM scores');
    console.log(`Total Scores: ${scoresResult.rows[0].count}`);

    // Show current leaderboard
    const leaderboardResult = await client.query('SELECT * FROM leaderboard LIMIT 10');
    console.log('\nCurrent Leaderboard:');
    leaderboardResult.rows.forEach(row => {
      console.log(`  ${row.rank}. ${row.username} - ${row.best_time}ms`);
    });

    // Confirm reset
    console.log('\n⚠️  WARNING: This will delete ALL leaderboard data!');
    console.log('Proceeding with reset in 2 seconds...\n');
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TRUNCATE scores first (due to foreign key constraint)
    console.log('Resetting scores table...');
    await client.query('TRUNCATE TABLE scores RESTART IDENTITY CASCADE');
    console.log('✓ Scores table cleared');

    // TRUNCATE players
    console.log('Resetting players table...');
    await client.query('TRUNCATE TABLE players RESTART IDENTITY CASCADE');
    console.log('✓ Players table cleared');

    // Verify reset
    console.log('\nAFTER RESET:');
    console.log('------------');
    const playersAfter = await client.query('SELECT COUNT(*) as count FROM players');
    console.log(`Total Players: ${playersAfter.rows[0].count}`);
    
    const scoresAfter = await client.query('SELECT COUNT(*) as count FROM scores');
    console.log(`Total Scores: ${scoresAfter.rows[0].count}`);

    const leaderboardAfter = await client.query('SELECT * FROM leaderboard');
    console.log(`Leaderboard Entries: ${leaderboardAfter.rows.length}`);

    console.log('\n✅ Leaderboard reset complete!');
    console.log('The database is now empty and ready for real gameplay data.');

  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetLeaderboard();

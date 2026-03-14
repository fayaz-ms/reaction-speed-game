// Test the deployed APIs with Neon database
const API_BASE = 'https://reaction-speed-game-kohl.vercel.app/api';

async function testAPIs() {
  console.log('Testing Reaction Speed Game APIs with Neon PostgreSQL\n');
  
  // Test 1: Submit a score
  console.log('1. Testing POST /api/submitScore...');
  try {
    const submitResponse = await fetch(`${API_BASE}/submitScore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'TestPlayer_' + Date.now(),
        reaction_time_ms: 245
      })
    });
    const submitResult = await submitResponse.json();
    console.log('   ✓ Score submitted:', submitResult);
  } catch (error) {
    console.error('   ✗ Submit failed:', error.message);
  }

  // Test 2: Get leaderboard
  console.log('\n2. Testing GET /api/getLeaderboard...');
  try {
    const leaderboardResponse = await fetch(`${API_BASE}/getLeaderboard?limit=10`);
    const leaderboard = await leaderboardResponse.json();
    console.log(`   ✓ Leaderboard retrieved (${leaderboard.length} entries):`);
    leaderboard.slice(0, 5).forEach(entry => {
      console.log(`      ${entry.rank}. ${entry.username} - ${entry.best_time}ms`);
    });
  } catch (error) {
    console.error('   ✗ Leaderboard failed:', error.message);
  }

  // Test 3: Submit multiple scores
  console.log('\n3. Testing multiple score submissions...');
  const testScores = [
    { username: 'SpeedDemon', reaction_time_ms: 198 },
    { username: 'QuickReflexes', reaction_time_ms: 312 },
    { username: 'FastClicker', reaction_time_ms: 225 }
  ];

  for (const score of testScores) {
    try {
      const response = await fetch(`${API_BASE}/submitScore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(score)
      });
      const result = await response.json();
      console.log(`   ✓ ${score.username}: ${score.reaction_time_ms}ms (best: ${result.best_time}ms)`);
    } catch (error) {
      console.error(`   ✗ Failed for ${score.username}:`, error.message);
    }
  }

  // Test 4: Get updated leaderboard
  console.log('\n4. Testing updated leaderboard...');
  try {
    const response = await fetch(`${API_BASE}/getLeaderboard?limit=10`);
    const leaderboard = await response.json();
    console.log(`   ✓ Updated leaderboard (${leaderboard.length} entries):`);
    leaderboard.forEach(entry => {
      console.log(`      ${entry.rank}. ${entry.username} - ${entry.best_time}ms`);
    });
  } catch (error) {
    console.error('   ✗ Failed:', error.message);
  }

  console.log('\n✓ API Testing Complete!');
}

testAPIs().catch(console.error);

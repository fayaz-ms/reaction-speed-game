const API_BASE = '/api';

export async function submitScore(username, reactionTimeMs) {
  const res = await fetch(`${API_BASE}/submitScore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, reaction_time_ms: reactionTimeMs }),
  });
  if (!res.ok) throw new Error('Failed to submit score');
  return res.json();
}

export async function getLeaderboard(limit = 10) {
  const res = await fetch(`${API_BASE}/getLeaderboard?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

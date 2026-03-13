/**
 * Generate a random delay between min and max milliseconds
 */
export function getRandomDelay(min = 2000, max = 5000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format reaction time for display
 */
export function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get rating based on reaction time
 */
export function getRating(ms) {
  if (ms < 200) return { label: 'Incredible!', color: '#ff006e', emoji: '🏆' };
  if (ms < 250) return { label: 'Amazing!', color: '#39ff14', emoji: '⚡' };
  if (ms < 300) return { label: 'Great!', color: '#00f0ff', emoji: '🔥' };
  if (ms < 400) return { label: 'Good', color: '#b026ff', emoji: '👍' };
  if (ms < 500) return { label: 'Average', color: '#ffaa00', emoji: '😊' };
  return { label: 'Keep Practicing', color: '#ff4444', emoji: '💪' };
}

/**
 * Calculate average from an array of numbers
 */
export function calculateAverage(scores) {
  if (!scores.length) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

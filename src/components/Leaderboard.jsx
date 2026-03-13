import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLeaderboard } from '../lib/db';
import { formatTime } from '../lib/utils';

export default function Leaderboard({ refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLeaderboard(10)
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load leaderboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-bold neon-text mb-4 flex items-center gap-2">
        🏆 Global Leaderboard
      </h2>

      {loading && (
        <div className="text-center py-8 text-gray-400 animate-pulse">Loading...</div>
      )}

      {error && (
        <div className="text-center py-8 text-yellow-400 text-sm">{error}</div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No scores yet. Be the first!
        </div>
      )}

      <AnimatePresence>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.username}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-3 px-4 rounded-xl mb-2"
            style={{
              background: i < 3 ? `${medalColors[i]}11` : 'transparent',
              borderLeft: i < 3 ? `3px solid ${medalColors[i]}` : '3px solid transparent',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-lg font-bold w-8 text-center"
                style={{ color: i < 3 ? medalColors[i] : '#666' }}
              >
                {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${entry.rank}`}
              </span>
              <span className="font-medium text-white">{entry.username}</span>
            </div>
            <span className="font-mono font-bold text-sm" style={{ color: 'var(--neon-green)' }}>
              {formatTime(entry.best_time)}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

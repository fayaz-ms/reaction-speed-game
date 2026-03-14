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

  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          🏆 Global Leaderboard
        </h2>
      </div>

      {loading && (
        <div className="text-center py-12 animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Loading...
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-sm" style={{ color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
          No scores yet. Be the first!
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div>
          <div className="table-header">
            <div style={{ flex: '0 0 60px' }}>Rank</div>
            <div style={{ flex: '1' }}>Player</div>
            <div style={{ flex: '0 0 100px', textAlign: 'right' }}>Best Time</div>
          </div>
          <AnimatePresence>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.username}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.03 }}
                className="table-row"
              >
                <div style={{ flex: '0 0 60px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {i < 3 ? (
                    <span style={{ fontSize: '1.25rem' }}>
                      {['🥇', '🥈', '🥉'][i]}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                      #{entry.rank}
                    </span>
                  )}
                </div>
                <div style={{ flex: '1', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {entry.username}
                </div>
                <div
                  style={{
                    flex: '0 0 100px',
                    textAlign: 'right',
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 600,
                    color: 'var(--success)',
                  }}
                >
                  {formatTime(entry.best_time)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

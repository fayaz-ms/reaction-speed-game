import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Game from '../components/Game';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [username, setUsername] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const handleSetName = (e) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      setNameSet(true);
    }
  };

  const handleScoreSubmit = useCallback(() => {
    setLeaderboardKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="text-center pt-12 pb-6 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold"
          style={{ 
            color: 'var(--text-primary)',
            fontSize: '36px',
            letterSpacing: '-0.5px'
          }}
        >
          ⚡ Reaction Speed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-3"
          style={{ 
            color: 'var(--text-muted)',
            fontSize: '16px'
          }}
        >
          Test your reflexes and compete globally.
        </motion.p>
      </header>

      {/* Username Input */}
      {!nameSet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full px-4 mb-8"
        >
          <form onSubmit={handleSetName} className="card p-6">
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              Enter your nickname
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Player name..."
                maxLength={20}
                className="flex-1 px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background: 'var(--bg-card-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)',
                  '--tw-ring-offset-color': 'var(--bg-primary)',
                }}
              />
              <button
                type="submit"
                disabled={username.trim().length < 2}
                className="btn-primary"
              >
                Play
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {nameSet && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 flex items-center justify-between"
              >
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Playing as <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{username}</span>
                </span>
                <button
                  onClick={() => setNameSet(false)}
                  className="text-xs transition-colors hover:underline"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Change name
                </button>
              </motion.div>
            )}
            <Game username={nameSet ? username : ''} onScoreSubmit={handleScoreSubmit} />
          </div>
          <div className="lg:col-span-1">
            <Leaderboard refreshKey={leaderboardKey} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
        <p>Auth – Fayazahmad_Siddik</p>
      </footer>
    </div>
  );
}

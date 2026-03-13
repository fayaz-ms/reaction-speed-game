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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black neon-text"
        >
          ⚡ Reaction Speed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mt-2 text-sm md:text-base"
        >
          Test your reflexes. Compete globally.
        </motion.p>
      </header>

      {/* Username Input */}
      {!nameSet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto w-full px-4 mb-6"
        >
          <form onSubmit={handleSetName} className="glass-card p-6">
            <label className="block text-sm text-gray-400 mb-2">Enter your nickname</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Player name..."
                maxLength={20}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={username.trim().length < 2}
                className="btn-neon disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Play
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {nameSet && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center justify-between"
              >
                <span className="text-sm text-gray-400">
                  Playing as <span className="text-cyan-400 font-bold">{username}</span>
                </span>
                <button
                  onClick={() => setNameSet(false)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
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
      <footer className="text-center py-6 text-gray-600 text-sm border-t border-white/5">
        <p>Auth – Fayazahmad_Siddik</p>
      </footer>
    </div>
  );
}

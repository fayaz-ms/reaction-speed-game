import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getRandomDelay, formatTime, getRating } from '../lib/utils';
import { submitScore } from '../lib/db';

const GAME_STATES = {
  IDLE: 'idle',
  WAITING: 'waiting',
  READY: 'ready',
  RESULT: 'result',
  TOO_EARLY: 'too_early',
};

const clickSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.1;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
};

const successSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.08;
      osc.start(ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
      osc.stop(ctx.currentTime + i * 0.12 + 0.2);
    });
  } catch {}
};

export default function Game({ username, onScoreSubmit }) {
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [reactionTime, setReactionTime] = useState(null);
  const [scores, setScores] = useState([]);
  const [personalBest, setPersonalBest] = useState(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startGame = useCallback(() => {
    clickSound();
    setGameState(GAME_STATES.WAITING);
    setReactionTime(null);
    setIsNewRecord(false);

    const delay = getRandomDelay();
    timerRef.current = setTimeout(() => {
      setGameState(GAME_STATES.READY);
      startTimeRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(async () => {
    if (gameState === GAME_STATES.IDLE || gameState === GAME_STATES.RESULT || gameState === GAME_STATES.TOO_EARLY) {
      startGame();
      return;
    }

    if (gameState === GAME_STATES.WAITING) {
      clearTimeout(timerRef.current);
      clickSound();
      setGameState(GAME_STATES.TOO_EARLY);
      return;
    }

    if (gameState === GAME_STATES.READY) {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setGameState(GAME_STATES.RESULT);
      successSound();

      const newScores = [elapsed, ...scores].slice(0, 5);
      setScores(newScores);

      const isNew = personalBest === null || elapsed < personalBest;
      if (isNew) {
        setPersonalBest(elapsed);
        setIsNewRecord(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39ff14', '#00f0ff', '#b026ff', '#ff006e'],
        });
      }

      if (username) {
        setSubmitting(true);
        try {
          await submitScore(username, elapsed);
          onScoreSubmit?.();
        } catch {}
        setSubmitting(false);
      }
    }
  }, [gameState, scores, personalBest, username, onScoreSubmit, startGame]);

  const getBgColor = () => {
    switch (gameState) {
      case GAME_STATES.WAITING: return 'from-red-900 to-red-700';
      case GAME_STATES.READY: return 'from-green-700 to-green-500';
      case GAME_STATES.TOO_EARLY: return 'from-yellow-900 to-yellow-700';
      default: return 'from-slate-900 to-slate-800';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case GAME_STATES.IDLE: return 'Click to Start';
      case GAME_STATES.WAITING: return 'Wait for GREEN...';
      case GAME_STATES.READY: return 'CLICK NOW!';
      case GAME_STATES.TOO_EARLY: return 'Too Early! Click to retry';
      case GAME_STATES.RESULT: return 'Click to play again';
      default: return '';
    }
  };

  const rating = reactionTime ? getRating(reactionTime) : null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Game Area */}
      <motion.div
        className={`glass-card relative overflow-hidden cursor-pointer select-none bg-gradient-to-br ${getBgColor()} min-h-[320px] flex flex-col items-center justify-center p-8`}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            {gameState === GAME_STATES.RESULT && reactionTime !== null ? (
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-6xl md:text-7xl font-black neon-green-text"
                >
                  {formatTime(reactionTime)}
                </motion.div>
                {rating && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold"
                    style={{ color: rating.color }}
                  >
                    {rating.emoji} {rating.label}
                  </motion.div>
                )}
                {isNewRecord && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.4 }}
                    className="text-lg font-bold text-yellow-400"
                  >
                    🎉 NEW PERSONAL BEST! 🎉
                  </motion.div>
                )}
                {submitting && (
                  <div className="text-sm text-gray-400 animate-pulse">Saving score...</div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className={`text-3xl md:text-4xl font-bold ${gameState === GAME_STATES.READY ? 'neon-green-text animate-pulse' : ''}`}>
                  {getMessage()}
                </div>
                {gameState === GAME_STATES.WAITING && (
                  <div className="text-red-300 text-sm mt-2">Don&apos;t click yet!</div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Personal Best</div>
          <div className="text-xl font-bold neon-green-text">
            {personalBest !== null ? formatTime(personalBest) : '—'}
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Last Score</div>
          <div className="text-xl font-bold" style={{ color: 'var(--neon-blue)' }}>
            {reactionTime !== null ? formatTime(reactionTime) : '—'}
          </div>
        </div>
        <div className="glass-card p-4 text-center col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Games Played</div>
          <div className="text-xl font-bold" style={{ color: 'var(--neon-purple)' }}>
            {scores.length}
          </div>
        </div>
      </div>

      {/* Score History */}
      {scores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">Recent Scores</h3>
          <div className="flex flex-wrap gap-3">
            {scores.map((score, i) => {
              const r = getRating(score);
              return (
                <motion.div
                  key={`${score}-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card px-4 py-2 text-sm font-mono font-bold"
                  style={{ color: r.color, borderColor: `${r.color}33` }}
                >
                  {formatTime(score)}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

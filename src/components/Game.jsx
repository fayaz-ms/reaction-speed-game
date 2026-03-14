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
      case GAME_STATES.WAITING: return '#991b1b';
      case GAME_STATES.READY: return '#15803d';
      case GAME_STATES.TOO_EARLY: return '#a16207';
      default: return '#1e293b';
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
        className="card relative overflow-hidden cursor-pointer select-none min-h-[340px] flex flex-col items-center justify-center p-8"
        onClick={handleClick}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ background: getBgColor() }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="text-center"
          >
            {gameState === GAME_STATES.RESULT && reactionTime !== null ? (
              <div className="space-y-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    fontSize: '72px',
                    fontWeight: 700,
                    letterSpacing: '-1px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {formatTime(reactionTime)}
                </motion.div>
                {rating && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {rating.emoji} {rating.label}
                  </motion.div>
                )}
                {isNewRecord && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-base font-semibold"
                    style={{ color: 'var(--success)' }}
                  >
                    🎉 New Personal Best!
                  </motion.div>
                )}
                {submitting && (
                  <div className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
                    Saving score...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {getMessage()}
                </div>
                {gameState === GAME_STATES.WAITING && (
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Don&apos;t click yet!
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="stat-label">Personal Best</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {personalBest !== null ? formatTime(personalBest) : '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Last Score</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>
            {reactionTime !== null ? formatTime(reactionTime) : '—'}
          </div>
        </div>
        <div className="stat-card col-span-2 md:col-span-1">
          <div className="stat-label">Games Played</div>
          <div className="stat-value">{scores.length}</div>
        </div>
      </div>

      {/* Score History */}
      {scores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-sm mb-4" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
            Recent Scores
          </h3>
          <div className="flex flex-wrap gap-3">
            {scores.map((score, i) => (
              <motion.div
                key={`${score}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="chip"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatTime(score)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

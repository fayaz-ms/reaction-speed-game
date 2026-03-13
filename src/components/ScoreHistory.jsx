import { motion } from 'framer-motion';
import { formatTime, getRating } from '../lib/utils';

export default function ScoreHistory({ scores }) {
  if (!scores || scores.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Score History</h3>
      <div className="space-y-2">
        {scores.map((score, i) => {
          const rating = getRating(score);
          return (
            <motion.div
              key={`${score}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
            >
              <span className="text-gray-400 text-sm">#{i + 1}</span>
              <span className="font-mono font-bold" style={{ color: rating.color }}>
                {formatTime(score)}
              </span>
              <span className="text-sm">{rating.emoji} {rating.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

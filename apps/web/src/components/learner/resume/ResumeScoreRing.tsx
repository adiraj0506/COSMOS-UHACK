'use client'

import { motion } from 'framer-motion'

interface ScoreDimension {
  label:     string
  score:     number
  fillClass: string
  color:     string
}

interface ResumeScoreRingProps {
  score:      number
  dimensions: ScoreDimension[]
}

export default function ResumeScoreRing({ score, dimensions }: ResumeScoreRingProps) {
  const r          = 58
  const cx         = 72
  const cy         = 72
  const circumference = 2 * Math.PI * r
  const dashOffset    = circumference * (1 - score / 100)

  const scoreColor =
    score >= 80 ? '#10b981' :
    score >= 60 ? '#a855f7' :
    score >= 40 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="flex gap-6 items-center">
      {/* Ring */}
      <div className="rs-score-ring shrink-0">
        <svg width="144" height="144" viewBox="0 0 144 144">
          <defs>
            <linearGradient id="rsr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#6366f1" />
              <stop offset="50%"  stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="rsr-glow">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#rsr-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{
              transformOrigin: 'center',
              transform: 'rotate(-90deg)',
              filter: `drop-shadow(0 0 8px ${scoreColor})`,
            }}
          />
          {/* Inner decorative ring */}
          <circle cx={cx} cy={cy} r={42}
            fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
        </svg>
        <div className="rs-score-ring__label">
          <motion.span
            className="rs-score-ring__value"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{ color: scoreColor }}
          >
            {score}
          </motion.span>
          <span className="rs-score-ring__sub">/ 100</span>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 space-y-3">
        {dimensions.map(({ label, score: s, fillClass, color }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
          >
            <div className="flex justify-between items-center mb-1">
              <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8' }}>{label}</span>
              <span style={{ fontSize: 10, fontWeight: 800, color }}>{s}%</span>
            </div>
            <div className="rs-score-bar">
              <motion.div
                className={`rs-score-bar__fill ${fillClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${s}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.07 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

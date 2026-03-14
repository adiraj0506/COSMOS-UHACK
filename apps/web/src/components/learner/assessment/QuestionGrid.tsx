'use client'

import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'

interface QuestionGridProps {
  currentQuestion: number
  totalQuestions?: number
  answeredQuestions?: number[]
  onJump?: (q: number) => void
  onPrev: () => void
  onNext: () => void
}

export default function QuestionGrid({
  currentQuestion,
  totalQuestions = 25,
  answeredQuestions = [1, 2, 5, 6, 10, 11],
  onJump,
  onPrev,
  onNext,
}: QuestionGridProps) {
  function dotClass(n: number) {
    if (n === currentQuestion)          return 'q-dot q-dot--active'
    if (answeredQuestions.includes(n))  return 'q-dot q-dot--answered'
    return 'q-dot q-dot--unanswered'
  }

  const answeredCount = answeredQuestions.length
  const remaining     = totalQuestions - answeredCount

  return (
    <div className="asmnt-card flex flex-col gap-3" style={{ gridColumn: '2', gridRow: '1' }}>
      <p className="asmnt-label">
        <LayoutGrid size={12} style={{ color: '#a855f7' }} />
        Questions
      </p>

      {/* Dot grid */}
      <div className="q-grid">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(n => (
          <motion.button
            key={n}
            className={dotClass(n)}
            onClick={() => onJump?.(n)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            {n}
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="q-legend">
        <div className="q-legend-item">
          <div className="q-legend-dot" style={{ background: '#7c3aed', boxShadow: '0 0 4px rgba(124,58,237,0.5)' }} />
          Answered ({answeredCount})
        </div>
        <div className="q-legend-item">
          <div className="q-legend-dot" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} />
          Not answered ({remaining - 1})
        </div>
        <div className="q-legend-item">
          <div className="q-legend-dot" style={{ background: '#a855f7', boxShadow: '0 0 4px rgba(168,85,247,0.6)' }} />
          Current (Q{currentQuestion})
        </div>
      </div>

      {/* Summary pill */}
      <div style={{
        padding: '8px 12px',
        borderRadius: 10,
        background: 'rgba(124,58,237,0.08)',
        border: '1px solid rgba(139,92,246,0.18)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 3 }}>
          Completion
        </p>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{
            height: '100%',
            width: `${(answeredCount / totalQuestions) * 100}%`,
            background: 'linear-gradient(to right,#7c3aed,#a855f7)',
            boxShadow: '0 0 6px rgba(124,58,237,0.5)',
            borderRadius: 999,
          }} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>
          {answeredCount} <span style={{ color: '#475569', fontWeight: 500 }}>/ {totalQuestions}</span>
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Flag, ChevronLeft, ChevronRight } from 'lucide-react'

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  codeSnippet?: string
  answer: string
  onAnswerChange: (value: string) => void
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  codeSnippet,
  answer,
  onAnswerChange,
  onPrev,
  onNext,
  onSubmit,
}: QuestionCardProps) {
  const [timeLeft, setTimeLeft] = useState(1800) // 30 min in seconds
  const [marked,   setMarked]   = useState(false)

  // Countdown
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')
  const pct = ((questionNumber - 1) / totalQuestions) * 100

  // Minimal syntax highlighter (Python keywords)
  function highlight(code: string) {
    return code
      .replace(/\b(def|return|if|else|elif|for|while|in|not|and|or|None|True|False|import|from|class|pass)\b/g,
        '<span class="code-keyword">$1</span>')
      .replace(/\b([a-z_][a-z0-9_]*)\s*(?=\()/g,
        '<span class="code-fn">$1</span>')
      .replace(/#.*/g, '<span class="code-comment">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
      .replace(/("""[\s\S]*?"""|'[^']*'|"[^"]*")/g,
        '<span class="code-string">$1</span>')
  }

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="asmnt-card asmnt-card--glow-violet"
      style={{ gridColumn: '1', gridRow: '1 / 3' }}
    >
      {/* Header row */}
      <div className="question-header">
        <div className="question-counter">
          Q <span>{questionNumber}</span>
          <span style={{ color: '#475569', margin: '0 4px' }}>/</span>
          {totalQuestions}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMarked(!marked)}
            className={`mark-btn ${marked ? 'marked' : ''}`}
          >
            <Flag size={10} />
            {marked ? 'Marked' : 'Mark'}
          </button>
          <div className="question-timer">
            <Clock size={11} />
            {mm}:{ss}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="q-progress-bar-track">
        <div className="q-progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Question text */}
      <p className="question-text">{questionText}</p>

      {/* Code block */}
      {codeSnippet && (
        <div
          className="code-block"
          dangerouslySetInnerHTML={{ __html: highlight(codeSnippet) }}
        />
      )}

      {/* Answer area */}
      <textarea
        className="answer-area"
        placeholder="Write your solution or explanation here…"
        value={answer}
        onChange={e => onAnswerChange(e.target.value)}
        rows={4}
      />

      {/* Nav */}
      <div className="q-nav">
        <button className="q-nav-btn" onClick={onPrev} disabled={questionNumber === 1}>
          <ChevronLeft size={13} /> Prev
        </button>
        <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>
          {answer.trim().length > 0 ? `${answer.trim().split(/\s+/).length} words` : 'No answer yet'}
        </span>
        <button
          className={`q-nav-btn ${questionNumber < totalQuestions ? 'q-nav-btn--primary' : ''}`}
          onClick={questionNumber < totalQuestions ? onNext : onSubmit}
        >
          {questionNumber < totalQuestions ? <>Next <ChevronRight size={13} /></> : 'Submit'}
        </button>
      </div>
    </motion.div>
  )
}

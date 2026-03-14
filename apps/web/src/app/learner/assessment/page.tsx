'use client'

import './assessment.css'

import { useState } from 'react'
import { motion } from 'framer-motion'

import DashboardShell    from '@/components/learner/dashboard/DashboardShell'
import GoalSelection     from '@/components/learner/assessment/GoalSelection'
import TopicSelection    from '@/components/learner/assessment/TopicSelection'
import StartConfiguration from '@/components/learner/assessment/StartConfiguration'
import QuestionCard      from '@/components/learner/assessment/QuestionCard'
import QuestionGrid      from '@/components/learner/assessment/QuestionGrid'
import OptionsPanel      from '@/components/learner/assessment/OptionsPanel'

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'tips' | 'mentor' | 'api'

const TABS: { id: Tab; label: string }[] = [
  { id: 'tips',   label: '💡 Problem-Solving Tips' },
  { id: 'mentor', label: '🤝 Mentor Guidance'       },
  { id: 'api',    label: '📋 API References'         },
]

// ── Mock questions bank ───────────────────────────────────────────────────────
// TODO backend teammate: GET /api/assessment/questions?goal=backend&topics=DSA
const QUESTIONS = [
  {
    id: 1,
    text: 'Given a binary tree, find its maximum depth. Explain your approach and write the code.',
    code: `def max_depth(root):
    # Base case: empty tree
    if not root:
        return 0
    # Recursive case
    left  = max_depth(root.left)
    right = max_depth(root.right)
    return 1 + max(left, right)`,
  },
  {
    id: 2,
    text: 'Implement a function to check if a linked list has a cycle. What is the time and space complexity?',
    code: `def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
  },
  {
    id: 3,
    text: 'Design a rate limiter using the sliding window algorithm. Write the core logic.',
    code: `class RateLimiter:
    def __init__(self, limit, window):
        self.limit  = limit
        self.window = window
        self.log    = []`,
  },
]

// ── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = (i: number) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.4, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] as const },
})

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AssessmentCenterPage() {
  const [activeTab,       setActiveTab]       = useState<Tab>('tips')
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answered,        setAnswered]        = useState<number[]>([1, 2, 5, 6, 10, 11])

  const handlePrev = () => setCurrentQuestion(q => Math.max(1, q - 1))
  const handleNext = () => {
    setAnswered(prev => prev.includes(currentQuestion) ? prev : [...prev, currentQuestion])
    setCurrentQuestion(q => Math.min(25, q + 1))
  }
  const handleJump = (q: number) => setCurrentQuestion(q)

  const q = QUESTIONS[(currentQuestion - 1) % QUESTIONS.length]

  return (
    <DashboardShell activeHref="/learner/assessment">

      {/* ── Assessment Setup ──────────────────────────────────────────────── */}
      <motion.h2 {...fadeUp(0)} className="section-title">
        ✦ Assessment Setup
      </motion.h2>

      <motion.div {...fadeUp(1)} className="setup-grid">
        <GoalSelection />
        <TopicSelection />
        <StartConfiguration />
      </motion.div>

      {/* ── Current Assessment ────────────────────────────────────────────── */}
      <motion.h2 {...fadeUp(2)} className="section-title">
        ✦ Current Assessment
      </motion.h2>

      {/* Tabs */}
      <motion.div {...fadeUp(3)} className="assessment-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Assessment 2-column grid */}
      <motion.div {...fadeUp(4)} className="assessment-grid">
        <QuestionCard
          questionNumber={currentQuestion}
          totalQuestions={25}
          questionText={q.text}
          codeSnippet={q.code}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <QuestionGrid
          currentQuestion={currentQuestion}
          totalQuestions={25}
          answeredQuestions={answered}
          onJump={handleJump}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <OptionsPanel activeTab={activeTab} />
      </motion.div>

    </DashboardShell>
  )
}

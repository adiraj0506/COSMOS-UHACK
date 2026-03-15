'use client'

import './assessment.css'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import DashboardShell from '@/components/learner/dashboard/DashboardShell'
import GoalSelection from '@/components/learner/assessment/GoalSelection'
import TopicSelection from '@/components/learner/assessment/TopicSelection'
import StartConfiguration from '@/components/learner/assessment/StartConfiguration'
import QuestionCard from '@/components/learner/assessment/QuestionCard'
import QuestionGrid from '@/components/learner/assessment/QuestionGrid'
import OptionsPanel from '@/components/learner/assessment/OptionsPanel'

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'tips' | 'mentor' | 'api'
type Topic = 'DSA' | 'System Design' | 'Web Dev' | 'OS' | 'DBMS' | 'Networking' | 'OOP' | 'SQL'
type GoalKey = 'backend' | 'frontend' | 'fullstack' | 'data' | 'devops' | 'ml'

interface Question {
  id: string
  topic: Topic
  goals: GoalKey[]
  text: string
  code?: string
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'tips', label: '💡 Problem-Solving Tips' },
  { id: 'mentor', label: '🤝 Mentor Guidance' },
  { id: 'api', label: '📋 API References' },
]

const GOAL_KEY: Record<string, GoalKey> = {
  'Backend Developer': 'backend',
  'Frontend Developer': 'frontend',
  'Full Stack Developer': 'fullstack',
  'Data Engineer': 'data',
  'DevOps Engineer': 'devops',
  'ML Engineer': 'ml',
}

const ALL_GOALS: GoalKey[] = ['backend', 'frontend', 'fullstack', 'data', 'devops', 'ml']

// ── Question bank (5 per category) ───────────────────────────────────────────
const QUESTIONS: Question[] = [
  { id: 'dsa-1', topic: 'DSA', goals: ALL_GOALS, text: 'Find the maximum depth of a binary tree and explain the approach.' },
  { id: 'dsa-2', topic: 'DSA', goals: ALL_GOALS, text: 'Detect a cycle in a linked list. What are the time and space complexities?' },
  { id: 'dsa-3', topic: 'DSA', goals: ALL_GOALS, text: 'Find the first non-repeating character in a string.' },
  { id: 'dsa-4', topic: 'DSA', goals: ALL_GOALS, text: 'Given an array, return the length of the longest increasing subsequence.' },
  { id: 'dsa-5', topic: 'DSA', goals: ALL_GOALS, text: 'Implement a queue using two stacks.' },

  { id: 'sd-1', topic: 'System Design', goals: ['backend', 'fullstack', 'devops'], text: 'Design a rate limiter for a public API.' },
  { id: 'sd-2', topic: 'System Design', goals: ['backend', 'fullstack', 'devops'], text: 'Design a URL shortener with analytics.' },
  { id: 'sd-3', topic: 'System Design', goals: ['backend', 'fullstack'], text: 'Design a notification system (email, SMS, push).' },
  { id: 'sd-4', topic: 'System Design', goals: ['backend', 'fullstack'], text: 'Design a feed service for a social network.' },
  { id: 'sd-5', topic: 'System Design', goals: ['backend', 'devops'], text: 'Design log aggregation for microservices.' },

  { id: 'web-1', topic: 'Web Dev', goals: ['frontend', 'fullstack'], text: 'Explain how the browser renders HTML/CSS and paints the page.' },
  { id: 'web-2', topic: 'Web Dev', goals: ['frontend', 'fullstack'], text: 'Describe the difference between CSR and SSR.' },
  { id: 'web-3', topic: 'Web Dev', goals: ['frontend', 'fullstack'], text: 'What is the critical rendering path and how to optimize it?' },
  { id: 'web-4', topic: 'Web Dev', goals: ['frontend', 'fullstack'], text: 'Explain how CORS works and how to fix common issues.' },
  { id: 'web-5', topic: 'Web Dev', goals: ['frontend', 'fullstack'], text: 'How would you implement infinite scrolling efficiently?' },

  { id: 'os-1', topic: 'OS', goals: ['backend', 'devops'], text: 'Explain process vs thread and when to use each.' },
  { id: 'os-2', topic: 'OS', goals: ['backend', 'devops'], text: 'What is a deadlock and how can it be prevented?' },
  { id: 'os-3', topic: 'OS', goals: ['backend', 'devops'], text: 'Explain paging and virtual memory.' },
  { id: 'os-4', topic: 'OS', goals: ['backend', 'devops'], text: 'What is context switching and why is it expensive?' },
  { id: 'os-5', topic: 'OS', goals: ['backend', 'devops'], text: 'Explain CPU scheduling and common algorithms.' },

  { id: 'db-1', topic: 'DBMS', goals: ['backend', 'data'], text: 'What is normalization and when would you denormalize?' },
  { id: 'db-2', topic: 'DBMS', goals: ['backend', 'data'], text: 'Explain ACID properties with examples.' },
  { id: 'db-3', topic: 'DBMS', goals: ['backend', 'data'], text: 'What are indexes and how do they affect performance?' },
  { id: 'db-4', topic: 'DBMS', goals: ['backend', 'data'], text: 'Explain transactions and isolation levels.' },
  { id: 'db-5', topic: 'DBMS', goals: ['backend', 'data'], text: 'Compare SQL vs NoSQL for different workloads.' },

  { id: 'net-1', topic: 'Networking', goals: ['backend', 'devops'], text: 'Explain TCP vs UDP and their use cases.' },
  { id: 'net-2', topic: 'Networking', goals: ['backend', 'devops'], text: 'What happens in a TLS handshake?' },
  { id: 'net-3', topic: 'Networking', goals: ['backend', 'devops'], text: 'Explain DNS resolution steps.' },
  { id: 'net-4', topic: 'Networking', goals: ['backend', 'devops'], text: 'What is HTTP/2 and how is it different from HTTP/1.1?' },
  { id: 'net-5', topic: 'Networking', goals: ['backend', 'devops'], text: 'Explain load balancing strategies.' },

  { id: 'oop-1', topic: 'OOP', goals: ['backend', 'frontend', 'fullstack'], text: 'Explain encapsulation, inheritance, and polymorphism.' },
  { id: 'oop-2', topic: 'OOP', goals: ['backend', 'frontend', 'fullstack'], text: 'What are abstract classes and interfaces? When to use each?' },
  { id: 'oop-3', topic: 'OOP', goals: ['backend', 'frontend', 'fullstack'], text: 'Explain SOLID principles with one example.' },
  { id: 'oop-4', topic: 'OOP', goals: ['backend', 'frontend', 'fullstack'], text: 'What is composition over inheritance?' },
  { id: 'oop-5', topic: 'OOP', goals: ['backend', 'frontend', 'fullstack'], text: 'Describe common design patterns you have used.' },

  { id: 'sql-1', topic: 'SQL', goals: ['backend', 'data'], text: 'Write a query to find the second highest salary.' },
  { id: 'sql-2', topic: 'SQL', goals: ['backend', 'data'], text: 'Explain the difference between INNER JOIN and LEFT JOIN.' },
  { id: 'sql-3', topic: 'SQL', goals: ['backend', 'data'], text: 'How do window functions work and when would you use them?' },
  { id: 'sql-4', topic: 'SQL', goals: ['backend', 'data'], text: 'What is the difference between WHERE and HAVING?' },
  { id: 'sql-5', topic: 'SQL', goals: ['backend', 'data'], text: 'Explain the impact of indexes on INSERT/UPDATE operations.' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] as const },
})

function shuffle<T>(input: T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

function buildQuestionSet(pool: Question[], topics: Topic[]): Question[] {
  const topicList = topics.length ? topics : Array.from(new Set(pool.map(q => q.topic)))
  const picked = topicList.flatMap(topic => {
    const bucket = pool.filter(q => q.topic === topic)
    return shuffle(bucket).slice(0, 5)
  })
  return shuffle(picked)
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AssessmentCenterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('tips')
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState('Backend Developer')
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(['DSA', 'System Design'])
  const [started, setStarted] = useState(false)
  const [questionSet, setQuestionSet] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    setStarted(false)
    setQuestionSet([])
    setCurrentQuestion(1)
  }, [selectedGoal, selectedTopics])

  const goalKey = GOAL_KEY[selectedGoal]
  const goalFiltered = goalKey ? QUESTIONS.filter(q => q.goals.includes(goalKey)) : QUESTIONS
  const topicFiltered = selectedTopics.length
    ? goalFiltered.filter(q => selectedTopics.includes(q.topic))
    : goalFiltered

  const activeQuestions = started ? questionSet : []
  const totalQuestions = activeQuestions.length
  const current = activeQuestions[currentQuestion - 1]

  const answeredQuestions = useMemo(() => (
    activeQuestions
      .map((q, i) => (answers[q.id]?.trim() ? i + 1 : null))
      .filter((v): v is number => v !== null)
  ), [activeQuestions, answers])

  function handleStart() {
    const pool = topicFiltered.length ? topicFiltered : goalFiltered
    const nextSet = buildQuestionSet(pool.length ? pool : QUESTIONS, selectedTopics)
    setQuestionSet(nextSet)
    setAnswers({})
    setCurrentQuestion(1)
    setStarted(true)
  }

  function handlePrev() {
    setCurrentQuestion(q => Math.max(1, q - 1))
  }

  function handleNext() {
    setCurrentQuestion(q => Math.min(totalQuestions, q + 1))
  }

  function handleJump(q: number) {
    if (q >= 1 && q <= totalQuestions) setCurrentQuestion(q)
  }

  function handleAnswerChange(value: string) {
    if (!current) return
    setAnswers(prev => ({ ...prev, [current.id]: value }))
  }

  function handleSubmit() {
    router.push('/learner/dashboard')
  }

  return (
    <DashboardShell activeHref="/learner/assessment">
      <motion.h2 {...fadeUp(0)} className="section-title">
        ✦ Assessment Setup
      </motion.h2>

      <motion.div {...fadeUp(1)} className="setup-grid">
        <GoalSelection value={selectedGoal} onChange={setSelectedGoal} />
        <TopicSelection value={selectedTopics} onChange={setSelectedTopics} />
        <StartConfiguration onStart={handleStart} started={started} />
      </motion.div>

      <motion.h2 {...fadeUp(2)} className="section-title">
        ✦ Current Assessment
      </motion.h2>

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

      {started && totalQuestions > 0 ? (
        <motion.div {...fadeUp(4)} className="assessment-grid">
          <QuestionCard
            questionNumber={currentQuestion}
            totalQuestions={totalQuestions}
            questionText={current?.text ?? 'Question not available.'}
            codeSnippet={current?.code}
            answer={current ? answers[current.id] ?? '' : ''}
            onAnswerChange={handleAnswerChange}
            onPrev={handlePrev}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
          <QuestionGrid
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            answeredQuestions={answeredQuestions}
            onJump={handleJump}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <OptionsPanel activeTab={activeTab} />
        </motion.div>
      ) : (
        <motion.div {...fadeUp(4)} className="asmnt-card asmnt-card--glow-violet" style={{ gridColumn: '1 / 3' }}>
          <p className="text-sm text-gray-400">
            Click "Start Assessment" to begin. Your selected goal and topics will be used to filter questions.
          </p>
        </motion.div>
      )}
    </DashboardShell>
  )
}

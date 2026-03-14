'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardShell from '@/components/learner/dashboard/DashboardShell'
import {
  Rocket, Star, Globe, CheckCircle2, Clock, Circle,
  ChevronDown, Filter, Plus, Zap, Target, Calendar, Flame,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Status   = 'completed' | 'in-progress' | 'pending'
type Priority = 'high' | 'medium' | 'low'
type Category = 'DSA' | 'System Design' | 'Web Dev' | 'Communication' | 'Projects'

interface Subtask { label: string; done: boolean }

interface RoadmapItem {
  id: string
  title: string
  description: string
  deadline: string
  status: Status
  priority: Priority
  category: Category
  progress: number
  icon: 'rocket' | 'star' | 'planet' | 'zap' | 'target'
  subtasks: Subtask[]
}

// ── Mock data — TODO backend: GET /api/learner/roadmap → { items: RoadmapItem[] }
const MOCK_ITEMS: RoadmapItem[] = [
  {
    id: '1', title: 'Master System Design Fundamentals',
    description: 'Cover scalability, load balancing, caching strategies, and database design patterns.',
    deadline: '2025-04-15', status: 'in-progress', priority: 'high', category: 'System Design', progress: 45, icon: 'planet',
    subtasks: [
      { label: 'Scalability & Load Balancing',    done: true  },
      { label: 'Database Design Patterns',         done: true  },
      { label: 'Caching (Redis, CDN)',              done: false },
      { label: 'Message Queues & Event Streaming', done: false },
    ],
  },
  {
    id: '2', title: 'Solve 100 DSA Problems',
    description: 'Focus on arrays, trees, graphs, and dynamic programming patterns.',
    deadline: '2025-04-01', status: 'in-progress', priority: 'high', category: 'DSA', progress: 62, icon: 'rocket',
    subtasks: [
      { label: 'Arrays & Strings (25/25)',   done: true  },
      { label: 'Trees & Graphs (18/25)',     done: false },
      { label: 'Dynamic Programming (0/25)', done: false },
      { label: 'Backtracking (19/25)',       done: false },
    ],
  },
  {
    id: '3', title: 'Build a Full-Stack REST API Project',
    description: 'Create a production-ready backend with Node.js, Express, PostgreSQL, and Docker.',
    deadline: '2025-04-30', status: 'pending', priority: 'high', category: 'Web Dev', progress: 0, icon: 'zap',
    subtasks: [
      { label: 'Project Setup & Auth',     done: false },
      { label: 'Core API Endpoints',       done: false },
      { label: 'Database Schema & ORM',    done: false },
      { label: 'Deploy on Railway/Render', done: false },
    ],
  },
  {
    id: '4', title: 'Mock Interview Practice (5 rounds)',
    description: 'Practice behavioral and technical interviews with peers and AI feedback.',
    deadline: '2025-05-10', status: 'pending', priority: 'medium', category: 'Communication', progress: 0, icon: 'star',
    subtasks: [
      { label: 'Intro & Behavioral Round', done: false },
      { label: 'DSA Live Coding Round',    done: false },
      { label: 'System Design Round',      done: false },
      { label: 'HR & Culture Fit Round',   done: false },
    ],
  },
  {
    id: '5', title: 'Complete Web Development Module',
    description: 'Master React, Next.js, REST API consumption, and frontend performance optimisation.',
    deadline: '2025-03-20', status: 'completed', priority: 'medium', category: 'Web Dev', progress: 100, icon: 'star',
    subtasks: [
      { label: 'React Hooks & State', done: true },
      { label: 'Next.js App Router',  done: true },
      { label: 'API Integration',     done: true },
      { label: 'Performance & SEO',   done: true },
    ],
  },
  {
    id: '6', title: 'Contribute to an Open Source Project',
    description: 'Submit at least 2 merged PRs to a backend-focused open source repository.',
    deadline: '2025-05-31', status: 'pending', priority: 'low', category: 'Projects', progress: 0, icon: 'target',
    subtasks: [
      { label: 'Find suitable repository',      done: false },
      { label: 'Fix a beginner-friendly issue', done: false },
      { label: 'Submit & get PR merged',        done: false },
    ],
  },
]

// ── Config ────────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<Status, { label: string; dot: string; bg: string; border: string; text: string; Icon: React.ElementType }> = {
  completed:    { label: 'Completed',   dot: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  text: '#6ee7b7', Icon: CheckCircle2 },
  'in-progress':{ label: 'In Progress', dot: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)',   text: '#d8b4fe', Icon: Clock        },
  pending:      { label: 'Pending',     dot: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', text: '#9ca3af', Icon: Circle       },
}

const PRIORITY_CFG: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: 'High',   color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  low:    { label: 'Low',    color: '#6b7280', bg: 'rgba(107,114,128,0.1)'  },
}

const CAT_COLOR: Record<Category, string> = {
  DSA: '#818cf8', 'System Design': '#a855f7', 'Web Dev': '#06b6d4', Communication: '#ec4899', Projects: '#10b981',
}

const ICONS: Record<RoadmapItem['icon'], React.ElementType> = {
  rocket: Rocket, star: Star, planet: Globe, zap: Zap, target: Target,
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const daysLeft = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)

function deadlineChip(iso: string, status: Status) {
  if (status === 'completed') return { label: 'Done', color: '#10b981', bg: 'rgba(16,185,129,0.12)' }
  const d = daysLeft(iso)
  if (d < 0)  return { label: `${Math.abs(d)}d overdue`, color: '#f87171', bg: 'rgba(248,113,113,0.12)' }
  if (d <= 7) return { label: `${d}d left`,              color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  }
  return        { label: fmtDate(iso),                   color: '#9ca3af', bg: 'rgba(107,114,128,0.08)' }
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ProgressBar({ value, status }: { value: number; status: Status }) {
  const color = status === 'completed' ? '#10b981' : status === 'in-progress' ? '#a855f7' : '#374151'
  const glow  = status === 'completed' ? 'rgba(16,185,129,0.5)' : 'rgba(168,85,247,0.5)'
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div className="h-full rounded-full"
        initial={{ width: 0 }} animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
        style={{ background: color, boxShadow: value > 0 ? `0 0 8px ${glow}` : 'none' }} />
    </div>
  )
}

function RoadmapCard({ item, index }: { item: RoadmapItem; index: number }) {
  const [open, setOpen] = useState(false)
  const sc   = STATUS_CFG[item.status]
  const pc   = PRIORITY_CFG[item.priority]
  const dc   = deadlineChip(item.deadline, item.status)
  const cat  = CAT_COLOR[item.category]
  const Icon = ICONS[item.icon]
  const done = item.subtasks.filter(s => s.done).length

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.06, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
        border: `1px solid ${item.status === 'in-progress' ? 'rgba(168,85,247,0.22)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: item.status === 'in-progress' ? 'inset 0 0 40px rgba(124,58,237,0.07),0 0 0 1px rgba(139,92,246,0.08)' : 'none',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Category accent line */}
      <div className="h-px" style={{ background: `linear-gradient(to right,${cat},transparent)` }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${cat}20`, border: `1px solid ${cat}40`, color: cat, boxShadow: `0 0 14px ${cat}28` }}>
            <Icon size={17} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: cat }}>{item.category}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.color}30` }}>{pc.label} priority</span>
            </div>
            <h3 className={`text-sm font-bold leading-snug ${item.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>{item.title}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 leading-relaxed">{item.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
              <sc.Icon size={10} style={{ color: sc.dot }} />{sc.label}
            </span>
            <button onClick={() => setOpen(!open)} aria-label={open ? 'Collapse' : 'Expand'}
              className="text-gray-600 hover:text-violet-400 transition p-0.5">
              <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex-1"><ProgressBar value={item.progress} status={item.status} /></div>
          <span className="text-[10px] font-bold shrink-0" style={{ color: item.status === 'completed' ? '#10b981' : '#a855f7' }}>{item.progress}%</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold shrink-0 flex items-center gap-1"
            style={{ background: dc.bg, color: dc.color }}>
            <Calendar size={8} />{dc.label}
          </span>
        </div>

        {/* Subtask dots */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex gap-1">
            {item.subtasks.map((s, i) => (
              <div key={i} className="w-4 h-1.5 rounded-full transition-all"
                style={{
                  background: s.done ? (item.status === 'completed' ? '#10b981' : '#a855f7') : 'rgba(255,255,255,0.07)',
                  boxShadow: s.done ? `0 0 5px ${item.status === 'completed' ? '#10b981' : '#a855f7'}` : 'none',
                }} />
            ))}
          </div>
          <span className="text-[9px] text-gray-600">{done}/{item.subtasks.length} subtasks</span>
        </div>

        {/* Expanded subtasks */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
              <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Subtasks</p>
                {item.subtasks.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: s.done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${s.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
                    }}>
                    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                      style={{ background: s.done ? '#10b981' : 'rgba(255,255,255,0.05)', border: `1px solid ${s.done ? '#10b981' : 'rgba(255,255,255,0.1)'}`, boxShadow: s.done ? '0 0 6px rgba(16,185,129,0.5)' : 'none' }}>
                      {s.done && <CheckCircle2 size={9} className="text-white" />}
                    </div>
                    <span className={`text-xs ${s.done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

function StatCard({ label, value, Icon, color, delay }: { label: string; value: string | number; Icon: React.ElementType; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay }}
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}35`, color, boxShadow: `0 0 12px ${color}28` }}>
        <Icon size={15} />
      </div>
      <div>
        <p className="text-white font-black text-lg leading-none">{value}</p>
        <p className="text-gray-600 text-[10px] mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
type FilterStatus   = 'all' | Status
type FilterCategory = 'all' | Category
type FilterPriority = 'all' | Priority

export default function RoadmapPage() {
  // TODO backend teammate: replace with useSWR/fetch from GET /api/learner/roadmap
  const [items]          = useState<RoadmapItem[]>(MOCK_ITEMS)
  const [fStatus,   setFS] = useState<FilterStatus>('all')
  const [fCategory, setFC] = useState<FilterCategory>('all')
  const [fPriority, setFP] = useState<FilterPriority>('all')
  const [showFilters, setShowFilters] = useState(false)

  const total      = items.length
  const completed  = items.filter(i => i.status === 'completed').length
  const inProgress = items.filter(i => i.status === 'in-progress').length
  const overallPct = Math.round(items.reduce((a, i) => a + i.progress, 0) / total)

  const filtered = items.filter(item => {
    if (fStatus   !== 'all' && item.status   !== fStatus)   return false
    if (fCategory !== 'all' && item.category !== fCategory) return false
    if (fPriority !== 'all' && item.priority !== fPriority) return false
    return true
  })

  const CATS: Category[] = ['DSA', 'System Design', 'Web Dev', 'Communication', 'Projects']

  function FilterBtn({ active, color, onClick, children }: { active: boolean; color?: string; onClick: () => void; children: React.ReactNode }) {
    return (
      <button onClick={onClick} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
        style={{
          background: active ? (color ? `${color}25` : 'rgba(124,58,237,0.3)') : 'rgba(255,255,255,0.04)',
          border: `1px solid ${active ? (color ? `${color}55` : 'rgba(139,92,246,0.5)') : 'rgba(255,255,255,0.07)'}`,
          color: active ? (color ?? '#c4b5fd') : '#6b7280',
        }}
      >{children}</button>
    )
  }

  return (
    <DashboardShell activeHref="/learner/roadmap">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
        className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
            <span style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }}>🗺️</span>
            Your Learning Roadmap
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">Backend Developer path · {total} milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: showFilters ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showFilters ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: showFilters ? '#c4b5fd' : '#6b7280',
            }}>
            <Filter size={12} /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 0 14px rgba(124,58,237,0.4)' }}>
            <Plus size={12} /> Add Goal
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="Total Milestones" value={total}          Icon={Target}       color="#a855f7" delay={0}    />
        <StatCard label="Completed"        value={completed}      Icon={CheckCircle2} color="#10b981" delay={0.05} />
        <StatCard label="In Progress"      value={inProgress}     Icon={Flame}        color="#f59e0b" delay={0.1}  />
        <StatCard label="Overall Progress" value={`${overallPct}%`} Icon={Rocket}     color="#6366f1" delay={0.15} />
      </div>

      {/* Master progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="mb-4 rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(99,102,241,0.06))', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star size={13} className="text-amber-400" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
            <span className="text-white font-bold text-xs">Overall Roadmap Completion</span>
          </div>
          <span className="text-violet-300 font-black text-sm">{overallPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full"
            initial={{ width: 0 }} animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
            style={{ background: 'linear-gradient(to right,#6366f1,#a855f7,#ec4899)', boxShadow: '0 0 12px rgba(168,85,247,0.6)' }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-gray-600">0%</span>
          <span className="text-[9px] text-gray-600">Target: Backend Developer · 100%</span>
        </div>
      </motion.div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mb-4">
            <div className="rounded-2xl p-3 flex flex-wrap gap-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
              <div>
                <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-1.5">Status</p>
                <div className="flex gap-1.5">
                  {(['all','completed','in-progress','pending'] as FilterStatus[]).map(s => (
                    <FilterBtn key={s} active={fStatus === s} onClick={() => setFS(s)}>{s === 'all' ? 'All' : s}</FilterBtn>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-1.5">Category</p>
                <div className="flex gap-1.5 flex-wrap">
                  <FilterBtn active={fCategory === 'all'} onClick={() => setFC('all')}>All</FilterBtn>
                  {CATS.map(c => (
                    <FilterBtn key={c} active={fCategory === c} color={CAT_COLOR[c]} onClick={() => setFC(c)}>{c}</FilterBtn>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-1.5">Priority</p>
                <div className="flex gap-1.5">
                  {(['all','high','medium','low'] as FilterPriority[]).map(p => (
                    <FilterBtn key={p} active={fPriority === p} color={p !== 'all' ? PRIORITY_CFG[p].color : undefined} onClick={() => setFP(p)}>
                      {p === 'all' ? 'All' : p}
                    </FilterBtn>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      {filtered.length === 0
        ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3" style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }}>🪐</span>
            <p className="text-white font-bold text-sm">No milestones found</p>
            <p className="text-gray-600 text-xs mt-1">Try adjusting your filters</p>
          </motion.div>
        )
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-4">
            {filtered.map((item, i) => (
              <RoadmapCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )
      }

    </DashboardShell>
  )
}

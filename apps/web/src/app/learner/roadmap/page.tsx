'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardShell from '@/components/learner/dashboard/DashboardShell'
import {
  Rocket, Star, Globe, CheckCircle2, Clock, Circle,
  Plus, Zap, Target, Flame, X, Pencil, Trash2, ChevronDown,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Status   = 'completed' | 'in-progress' | 'pending'
type Priority = 'high' | 'medium' | 'low'
type Category = 'DSA' | 'System Design' | 'Web Dev' | 'Communication' | 'Projects'
type IconKey  = 'rocket' | 'star' | 'planet' | 'zap' | 'target' | 'flame'

interface Subtask { label: string; done: boolean }

interface RoadmapItem {
  id:          string
  title:       string
  description: string
  deadline:    string
  status:      Status
  priority:    Priority
  category:    Category
  progress:    number
  icon:        IconKey
  subtasks:    Subtask[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ICON_MAP: Record<IconKey, React.ReactNode> = {
  rocket: <Rocket  size={14} />,
  star:   <Star    size={14} />,
  planet: <Globe   size={14} />,
  zap:    <Zap     size={14} />,
  target: <Target  size={14} />,
  flame:  <Flame   size={14} />,
}

const STATUS_STYLE: Record<Status, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed:   { label: 'Completed',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  icon: <CheckCircle2 size={11} /> },
  'in-progress':{ label: 'In Progress', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: <Clock        size={11} /> },
  pending:     { label: 'Pending',     color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: <Circle       size={11} /> },
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high:   '#f87171',
  medium: '#fb923c',
  low:    '#6b7280',
}

const CATEGORIES: Category[] = ['DSA','System Design','Web Dev','Communication','Projects']
const ICONS: IconKey[]        = ['rocket','star','planet','zap','target','flame']

function daysLeft(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, color: '#f87171' }
  if (diff === 0) return { label: 'Due today',  color: '#fb923c' }
  return { label: `${diff}d left`, color: '#6b7280' }
}

// ── Initial data ──────────────────────────────────────────────────────────────
const INITIAL: RoadmapItem[] = [
  {
    id: '1', title: 'Solve 100 DSA Problems',
    description: 'Master core patterns: arrays, trees, graphs, DP',
    deadline: '2025-07-01', status: 'in-progress', priority: 'high',
    category: 'DSA', progress: 60, icon: 'rocket',
    subtasks: [
      { label: 'Arrays & Strings', done: true  },
      { label: 'Trees & Graphs',   done: false },
      { label: 'Dynamic Programming', done: false },
    ],
  },
  {
    id: '2', title: 'System Design Fundamentals',
    description: 'Learn scalable architecture patterns and trade-offs',
    deadline: '2025-08-15', status: 'pending', priority: 'high',
    category: 'System Design', progress: 0, icon: 'planet',
    subtasks: [
      { label: 'CAP Theorem',   done: false },
      { label: 'Load Balancing', done: false },
      { label: 'Caching',        done: false },
    ],
  },
  {
    id: '3', title: 'Build Portfolio Projects',
    description: '3 full-stack projects to showcase on resume',
    deadline: '2025-09-01', status: 'pending', priority: 'medium',
    category: 'Projects', progress: 10, icon: 'star',
    subtasks: [
      { label: 'Chat Application', done: false },
      { label: 'E-Commerce Site',  done: false },
    ],
  },
]

// ── Empty form ────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title:       '',
  description: '',
  deadline:    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  priority:    'medium' as Priority,
  category:    'DSA' as Category,
  icon:        'target' as IconKey,
  subtaskInput: '',
  subtasks:    [] as Subtask[],
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const [items,       setItems]       = useState<RoadmapItem[]>(INITIAL)
  const [showModal,   setShowModal]   = useState(false)
  const [editId,      setEditId]      = useState<string | null>(null)
  const [fStatus,     setFStatus]     = useState<'all' | Status>('all')
  const [fCategory,   setFCategory]   = useState<'all' | Category>('all')
  const [expandedId,  setExpandedId]  = useState<string | null>(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus title input when modal opens
  useEffect(() => {
    if (showModal) setTimeout(() => inputRef.current?.focus(), 120)
  }, [showModal])

  // ── Stats (derived — always up to date) ────────────────────────────────────
  const total      = items.length
  const completed  = items.filter(i => i.status === 'completed').length
  const inProgress = items.filter(i => i.status === 'in-progress').length
  const avgProgress = total
    ? Math.round(items.reduce((s, i) => s + i.progress, 0) / total)
    : 0

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = items.filter(i =>
    (fStatus   === 'all' || i.status   === fStatus) &&
    (fCategory === 'all' || i.category === fCategory)
  )

  // ── Open modal for add ──────────────────────────────────────────────────────
  function openAdd() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  // ── Open modal for edit ─────────────────────────────────────────────────────
  function openEdit(item: RoadmapItem) {
    setEditId(item.id)
    setForm({
      title:        item.title,
      description:  item.description,
      deadline:     item.deadline.split('T')[0],
      priority:     item.priority,
      category:     item.category,
      icon:         item.icon,
      subtaskInput: '',
      subtasks:     item.subtasks,
    })
    setShowModal(true)
  }

  // ── Save (add or update) ────────────────────────────────────────────────────
  function saveGoal() {
    if (!form.title.trim()) return   // guard — title required

    if (editId) {
      // Update existing
      setItems(prev => prev.map(i =>
        i.id === editId
          ? { ...i, title: form.title.trim(), description: form.description.trim(),
              deadline: form.deadline, priority: form.priority,
              category: form.category, icon: form.icon, subtasks: form.subtasks }
          : i
      ))
    } else {
      // Add new
      const goal: RoadmapItem = {
        id:          Date.now().toString(),
        title:       form.title.trim(),
        description: form.description.trim() || 'Custom learning goal',
        deadline:    form.deadline,
        status:      'pending',
        priority:    form.priority,
        category:    form.category,
        progress:    0,
        icon:        form.icon,
        subtasks:    form.subtasks,
      }
      setItems(prev => [goal, ...prev])
    }

    setShowModal(false)
    setForm(EMPTY_FORM)
    setEditId(null)
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  function deleteItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  // ── Cycle status ────────────────────────────────────────────────────────────
  function cycleStatus(id: string) {
    const cycle: Status[] = ['pending', 'in-progress', 'completed']
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i
      const next = cycle[(cycle.indexOf(i.status) + 1) % cycle.length]
      return { ...i, status: next, progress: next === 'completed' ? 100 : i.progress }
    }))
  }

  // ── Toggle subtask ──────────────────────────────────────────────────────────
  function toggleSubtask(itemId: string, idx: number) {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i
      const subtasks = i.subtasks.map((s, j) => j === idx ? { ...s, done: !s.done } : s)
      const progress = subtasks.length
        ? Math.round(subtasks.filter(s => s.done).length / subtasks.length * 100)
        : i.progress
      return { ...i, subtasks, progress }
    }))
  }

  // ── Update progress slider ──────────────────────────────────────────────────
  function updateProgress(id: string, val: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, progress: val } : i))
  }

  // ── Add subtask in form ─────────────────────────────────────────────────────
  function addSubtask() {
    if (!form.subtaskInput.trim()) return
    setForm(f => ({
      ...f,
      subtasks: [...f.subtasks, { label: f.subtaskInput.trim(), done: false }],
      subtaskInput: '',
    }))
  }

  // ── Close modal ─────────────────────────────────────────────────────────────
  function closeModal() {
    setShowModal(false)
    setForm(EMPTY_FORM)
    setEditId(null)
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <DashboardShell activeHref="/learner/roadmap">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-white font-bold text-lg">🗺️ Learning Roadmap</h1>
          <p className="text-gray-500 text-xs">Backend Developer Path</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}
        >
          <Plus size={12} /> Add Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Goals',  value: total,       color: 'text-white'        },
          { label: 'Completed',    value: completed,   color: 'text-green-400'    },
          { label: 'In Progress',  value: inProgress,  color: 'text-violet-400'   },
          { label: 'Avg Progress', value: `${avgProgress}%`, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <p className="text-[10px] text-gray-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all','completed','in-progress','pending'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFStatus(s)}
            className="px-3 py-1 rounded-lg text-xs transition-all"
            style={{
              background: fStatus === s ? 'rgba(124,58,237,0.7)' : 'rgba(0,0,0,0.3)',
              color:      fStatus === s ? '#fff' : '#6b7280',
              border:     `1px solid ${fStatus === s ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >{s}</button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        {(['all', ...CATEGORIES] as const).map(c => (
          <button
            key={c}
            onClick={() => setFCategory(c as any)}
            className="px-3 py-1 rounded-lg text-xs transition-all"
            style={{
              background: fCategory === c ? 'rgba(99,102,241,0.4)' : 'rgba(0,0,0,0.3)',
              color:      fCategory === c ? '#c7d2fe' : '#6b7280',
              border:     `1px solid ${fCategory === c ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >{c}</button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-3xl mb-3">🌌</div>
          <p className="text-gray-400 text-sm font-medium">No goals match this filter</p>
          <p className="text-gray-600 text-xs mt-1">Try a different filter or add a new goal</p>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map(item => {
            const st  = STATUS_STYLE[item.status]
            const dl  = daysLeft(item.deadline)
            const exp = expandedId === item.id

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/10 overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.25)' }}
              >
                {/* Card top */}
                <div className="p-4">

                  {/* Row 1: icon + title + actions */}
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}
                    >
                      {ICON_MAP[item.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm leading-tight truncate">{item.title}</h3>
                      <p className="text-gray-500 text-[11px] mt-0.5 leading-tight">{item.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(item)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-violet-300 hover:bg-white/[0.06] transition"
                      ><Pencil size={10} /></button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition"
                      ><Trash2 size={10} /></button>
                    </div>
                  </div>

                  {/* Row 2: status badge + priority + deadline */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <button
                      onClick={() => cycleStatus(item.id)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all hover:opacity-80 active:scale-95"
                      style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}
                      title="Click to cycle status"
                    >
                      {st.icon} {st.label}
                    </button>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ color: PRIORITY_COLOR[item.priority], background: `${PRIORITY_COLOR[item.priority]}18` }}
                    >{item.priority}</span>
                    <span className="text-[10px]" style={{ color: dl.color }}>{dl.label}</span>
                    <span className="ml-auto text-[10px] text-gray-600">{item.category}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-500">Progress</span>
                      <span className="text-[10px] text-violet-400 font-semibold">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: item.status === 'completed' ? '#4ade80' : 'linear-gradient(90deg,#7c3aed,#6366f1)' }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    {/* Slider to manually adjust progress */}
                    <input
                      type="range" min={0} max={100} value={item.progress}
                      onChange={e => updateProgress(item.id, +e.target.value)}
                      className="w-full mt-1 accent-violet-500"
                      style={{ height: '2px' }}
                    />
                  </div>

                  {/* Expand toggle */}
                  {item.subtasks.length > 0 && (
                    <button
                      onClick={() => setExpandedId(exp ? null : item.id)}
                      className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-300 transition mt-1"
                    >
                      <motion.span animate={{ rotate: exp ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={11} />
                      </motion.span>
                      {item.subtasks.filter(s => s.done).length}/{item.subtasks.length} subtasks
                    </button>
                  )}
                </div>

                {/* Subtasks (expanded) */}
                <AnimatePresence>
                  {exp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-1.5 border-t border-white/[0.06] pt-3">
                        {item.subtasks.map((st, idx) => (
                          <button
                            key={idx}
                            onClick={() => toggleSubtask(item.id, idx)}
                            className="flex items-center gap-2 w-full text-left group"
                          >
                            <div
                              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all"
                              style={{
                                border: st.done ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.15)',
                                background: st.done ? 'rgba(74,222,128,0.15)' : 'transparent',
                              }}
                            >
                              {st.done && <CheckCircle2 size={9} style={{ color: '#4ade80' }} />}
                            </div>
                            <span
                              className="text-[11px] transition-all"
                              style={{ color: st.done ? '#4ade80' : '#9ca3af', textDecoration: st.done ? 'line-through' : 'none' }}
                            >{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────────── */}
      {/* 
        CRITICAL FIX: The original used `fixed` positioning which gets clipped 
        by the glass shell's `overflow: hidden`. We use a portal-style div that 
        is rendered as a sibling inside DashboardShell's scroll container, with 
        a high z-index overlay that fills the shell's viewport using inset-0 
        relative to the nearest positioned ancestor.
      */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onMouseDown={e => { if (e.target === e.currentTarget) closeModal() }}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 12 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{   scale: 0.93, opacity: 0, y: 12  }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 flex flex-col"
              style={{ background: '#0b0818', boxShadow: '0 0 0 1px rgba(139,92,246,0.15), 0 32px 80px rgba(0,0,0,0.8)' }}
              onMouseDown={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                <h3 className="text-white font-bold text-sm">
                  {editId ? 'Edit Goal' : 'Add New Goal'}
                </h3>
                <button onClick={closeModal} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/[0.06] transition">
                  <X size={12} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-5 py-4 space-y-4">

                {/* Title */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block">Goal Title *</label>
                  <input
                    ref={inputRef}
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && saveGoal()}
                    placeholder="e.g. Solve 100 DSA Problems"
                    className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
                  <input
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of this goal"
                    className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                {/* Deadline + Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block">Deadline</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block">Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                      style={{ background: '#0b0818', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm(f => ({ ...f, category: c }))}
                        className="px-2.5 py-1 rounded-lg text-xs transition-all"
                        style={{
                          background: form.category === c ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.04)',
                          color:      form.category === c ? '#c4b5fd' : '#6b7280',
                          border:     `1px solid ${form.category === c ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Icon picker */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block">Icon</label>
                  <div className="flex gap-2">
                    {ICONS.map(ic => (
                      <button
                        key={ic}
                        onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                        style={{
                          background: form.icon === ic ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.04)',
                          border:     `1px solid ${form.icon === ic ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          color:      form.icon === ic ? '#a78bfa' : '#6b7280',
                        }}
                      >{ICON_MAP[ic]}</button>
                    ))}
                  </div>
                </div>

                {/* Subtasks */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 block">Subtasks</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={form.subtaskInput}
                      onChange={e => setForm(f => ({ ...f, subtaskInput: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }}
                      placeholder="Add a subtask and press Enter"
                      className="flex-1 px-3 py-2 rounded-xl text-xs text-white placeholder-gray-600 outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <button
                      onClick={addSubtask}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-violet-400 hover:text-white transition"
                      style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(139,92,246,0.25)' }}
                    ><Plus size={12} /></button>
                  </div>
                  {form.subtasks.length > 0 && (
                    <div className="space-y-1">
                      {form.subtasks.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                          <Circle size={9} className="text-gray-600 shrink-0" />
                          <span className="flex-1">{s.label}</span>
                          <button
                            onClick={() => setForm(f => ({ ...f, subtasks: f.subtasks.filter((_, i) => i !== idx) }))}
                            className="text-gray-700 hover:text-red-400 transition"
                          ><X size={9} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/[0.07]">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-gray-300 rounded-xl hover:bg-white/[0.04] transition"
                >Cancel</button>
                <button
                  onClick={saveGoal}
                  disabled={!form.title.trim()}
                  className="px-5 py-2 text-xs font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: form.title.trim() ? '0 0 12px rgba(124,58,237,0.4)' : 'none' }}
                >
                  {editId ? 'Save Changes' : 'Add Goal'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </DashboardShell>
  )
}

'use client'

import {
  useState, useRef, useCallback, useEffect, useMemo,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronRight, Sparkles, Rocket, Compass,
  Dumbbell, BookOpen, Briefcase, Code2, Palette, Globe,
  Calendar, Target, Clock,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════
//  Types
// ═══════════════════════════════════════════════════════════
export interface OnboardingData {
  goal:        string
  category:    string
  deadline:    string   // ISO date string
  months:      number
  weeks:       number
  days:        number
}

interface CosmicOnboardingProps {
  mode:      'onboarding' | 'update'   // first-time vs re-open from dashboard
  onConfirm: (data: OnboardingData) => void
  onClose:   () => void
  existing?: OnboardingData            // pre-fill when mode='update'
}

// ═══════════════════════════════════════════════════════════
//  Categories
// ═══════════════════════════════════════════════════════════
const CATEGORIES = [
  { id: 'career',     label: 'Career',     icon: Briefcase },
  { id: 'coding',     label: 'Coding',     icon: Code2     },
  { id: 'learning',   label: 'Learning',   icon: BookOpen  },
 
]

// ═══════════════════════════════════════════════════════════
//  Arc Dial geometry
// ═══════════════════════════════════════════════════════════
const CX = 130, CY = 135, R = 100
const START_DEG = 135
const SWEEP_DEG = 270

function toRad(d: number) { return (d * Math.PI) / 180 }
function polarXY(deg: number, cx: number, cy: number, r: number) {
  return { x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) }
}
function buildArc(s: number, e: number, cx: number, cy: number, r: number) {
  const sp = polarXY(s, cx, cy, r)
  const ep = polarXY(e, cx, cy, r)
  const lg = e - s > 180 ? 1 : 0
  return `M ${sp.x} ${sp.y} A ${r} ${r} 0 ${lg} 1 ${ep.x} ${ep.y}`
}

// ── Days ↔ angle ──────────────────────────────────────────
const MIN_DAYS = 7
const MAX_DAYS = 365

function daysToAngle(days: number) {
  const t = (days - MIN_DAYS) / (MAX_DAYS - MIN_DAYS)
  return START_DEG + t * SWEEP_DEG
}
function angleToDays(angleDeg: number) {
  let n = angleDeg - START_DEG
  if (n < 0) n += 360
  n = Math.max(0, Math.min(SWEEP_DEG, n))
  return Math.round(MIN_DAYS + (n / SWEEP_DEG) * (MAX_DAYS - MIN_DAYS))
}
function ptrToDays(px: number, py: number) {
  let a = (Math.atan2(py - CY, px - CX) * 180) / Math.PI
  if (a < 0) a += 360
  return angleToDays(a)
}

// ── Derive human-readable breakdown ──────────────────────
function breakdownDays(days: number) {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + days)
  return {
    days,
    weeks:    Math.round(days / 7),
    months:   +(days / 30.44).toFixed(1),
    deadline: deadline.toISOString().split('T')[0],
    label:    deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  }
}

// ── Days from today to a chosen date ─────────────────────
function dateToDays(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now()
  return Math.max(MIN_DAYS, Math.round(diff / 86_400_000))
}

// ═══════════════════════════════════════════════════════════
//  ArcDial sub-component
// ═══════════════════════════════════════════════════════════
function ArcDial({ days, onChange }: { days: number; onChange: (d: number) => void }) {
  const svgRef   = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  const fillAngle   = daysToAngle(days)
  const trackEnd    = daysToAngle(MAX_DAYS)
  const handlePos   = polarXY(fillAngle, CX, CY, R)

  const getVal = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const sx = 260 / rect.width
    const sy = 260 / rect.height
    onChange(ptrToDays((clientX - rect.left) * sx, (clientY - rect.top) * sy))
  }, [onChange])

  useEffect(() => {
    const mv = (e: MouseEvent) => { if (dragging.current) getVal(e.clientX, e.clientY) }
    const tm = (e: TouchEvent) => { if (dragging.current) getVal(e.touches[0].clientX, e.touches[0].clientY) }
    const up = () => { dragging.current = false }
    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseup',   up)
    window.addEventListener('touchmove', tm, { passive: true })
    window.addEventListener('touchend',  up)
    return () => {
      window.removeEventListener('mousemove', mv)
      window.removeEventListener('mouseup',   up)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend',  up)
    }
  }, [getVal])

  // Zone label positions
  const ZONE_LABELS = [
    { label: 'Days',   angle: 148 },
    { label: 'Weeks',  angle: 198 },
    { label: 'Months', angle: 270 },
    { label: 'Years',  angle: 342 },
    { label: 'Years',  angle: 392 },
  ]
  const DASHES = [174, 224, 316, 367]

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 260 270"
      width="230"
      height="230"
      style={{ cursor: dragging.current ? 'grabbing' : 'grab', flexShrink: 0, display: 'block' }}
      onMouseDown={() => { dragging.current = true }}
      onTouchStart={() => { dragging.current = true }}
    >
      <defs>
        <radialGradient id="ob-dial-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(30,12,65,0.92)" />
          <stop offset="100%" stopColor="rgba(6,3,18,0.97)"   />
        </radialGradient>
        <linearGradient id="ob-arc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6366f1" />
          <stop offset="50%"  stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="ob-glow-h" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ob-glow-r" x="-80%" y="-80%" width="360%" height="360%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer decorative ring */}
      <circle cx={CX} cy={CY} r={120}
        fill="none" stroke="rgba(139,92,246,0.07)" strokeWidth="1" />

      {/* 40 tick marks */}
      {Array.from({ length: 40 }).map((_, i) => {
        const a = START_DEG + (i / 40) * SWEEP_DEG
        const inner = polarXY(a, CX, CY, 108)
        const outer = polarXY(a, CX, CY, 117)
        return (
          <line key={i}
            x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke="rgba(139,92,246,0.22)"
            strokeWidth={i % 5 === 0 ? 1.8 : 0.8}
          />
        )
      })}

      {/* Zone labels */}
      {ZONE_LABELS.map(({ label, angle }, i) => {
        const p = polarXY(angle, CX, CY, 130)
        return (
          <text key={i} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="central"
            fill="rgba(148,163,184,0.6)" fontSize="7.5" fontWeight="600" letterSpacing="0.5">
            {label}
          </text>
        )
      })}

      {/* Dash separators between zones */}
      {DASHES.map((angle, i) => {
        const p = polarXY(angle, CX, CY, 120)
        return (
          <text key={i} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="central"
            fill="rgba(148,163,184,0.35)" fontSize="10">—</text>
        )
      })}

      {/* Dial face */}
      <circle cx={CX} cy={CY} r={96}
        fill="url(#ob-dial-bg)"
        stroke="rgba(139,92,246,0.18)" strokeWidth="1.5" />

      {/* Track (full arc, dim) */}
      <path d={buildArc(START_DEG, START_DEG + SWEEP_DEG, CX, CY, R)}
        fill="none" stroke="rgba(255,255,255,0.07)"
        strokeWidth="10" strokeLinecap="round" />

      {/* Fill arc */}
      <path d={buildArc(START_DEG, fillAngle, CX, CY, R)}
        fill="none" stroke="url(#ob-arc)"
        strokeWidth="10" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 7px rgba(168,85,247,0.75))' }} />

      {/* Inner concentric rings */}
      <circle cx={CX} cy={CY} r={74} fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={55} fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={36} fill="none" stroke="rgba(168,85,247,0.12)" strokeWidth="1" />

      {/* Center rocket */}
      <circle cx={CX} cy={CY} r={40}
        fill="rgba(124,58,237,0.18)"
        stroke="rgba(139,92,246,0.35)" strokeWidth="1.5"
        filter="url(#ob-glow-r)" />
      <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fontSize="26">🚀</text>

      {/* Drag handle outer ring */}
      <circle cx={handlePos.x} cy={handlePos.y} r={13}
        fill="rgba(6,3,18,0.95)"
        stroke="rgba(168,85,247,0.5)" strokeWidth="1.5"
        filter="url(#ob-glow-h)" />
      {/* Drag handle inner dot */}
      <circle cx={handlePos.x} cy={handlePos.y} r={5}
        fill="#a855f7"
        style={{ filter: 'drop-shadow(0 0 5px rgba(168,85,247,1))' }} />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
//  Main popup
// ═══════════════════════════════════════════════════════════
export default function CosmicOnboarding({
  mode, onConfirm, onClose, existing,
}: CosmicOnboardingProps) {
  const [goal,       setGoal]     = useState(existing?.goal     ?? '')
  const [category,   setCat]      = useState(existing?.category ?? 'career')
  const [days,       setDays]     = useState(() => existing?.days ?? 84)
  const [dateInput,  setDateInput] = useState(() => {
    if (existing?.deadline) return existing.deadline
    const d = new Date(); d.setDate(d.getDate() + 84)
    return d.toISOString().split('T')[0]
  })
  const [inputMode,  setInputMode] = useState<'dial' | 'date'>('dial')
  const [step,       setStep]      = useState<1 | 2>(1)

  // Keep dial & date in sync
  const handleDaysChange = useCallback((d: number) => {
    setDays(d)
    const dt = new Date(); dt.setDate(dt.getDate() + d)
    setDateInput(dt.toISOString().split('T')[0])
  }, [])

  const handleDateChange = useCallback((iso: string) => {
    setDateInput(iso)
    setDays(dateToDays(iso))
  }, [])

  const bd = useMemo(() => breakdownDays(days), [days])
  const catLabel = CATEGORIES.find(c => c.id === category)?.label ?? 'Career'
  const goalDisplay = goal.trim() || `${catLabel} Focus`
  const canConfirm = goal.trim().length > 0

  // Min date = today+7
  const minDate = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 7)
    return d.toISOString().split('T')[0]
  }, [])

  function handleConfirm() {
    if (!canConfirm) return
    const data: OnboardingData = {
      goal: goal.trim(),
      category,
      deadline: bd.deadline,
      months:   Math.round(bd.months),
      weeks:    bd.weeks,
      days:     bd.days,
    }
    // Persist to localStorage so it doesn't show again on refresh
    localStorage.setItem('cosmos_onboarding_done', 'true')
    localStorage.setItem('cosmos_user_goal', JSON.stringify(data))
    onConfirm(data)
  }

  const isUpdate = mode === 'update'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        background: 'rgba(2,0,14,0.80)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Ambient star particles */}
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{
            width: i % 4 === 0 ? 2 : 1, height: i % 4 === 0 ? 2 : 1,
            left: `${(i * 41 + 13) % 100}%`, top: `${(i * 57 + 9) % 100}%`,
            opacity: 0.08 + (i % 6) * 0.04,
          }}
          animate={{ opacity: [0.06, 0.35, 0.06] }}
          transition={{ duration: 2.5 + (i % 5), repeat: Infinity, delay: i * 0.12 }}
        />
      ))}

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: 880,
          borderRadius: 22,
          background: 'rgba(9, 5, 26, 0.75)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(139,92,246,0.24)',
          boxShadow: '0 0 0 1px rgba(139,92,246,0.06), 0 40px 90px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient corner glows */}
        <div className="absolute pointer-events-none" style={{
          top: -100, right: -100, width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(99,102,241,0.14)', filter: 'blur(70px)',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: -80, left: -80, width: 240, height: 240, borderRadius: '50%',
          background: 'rgba(124,58,237,0.12)', filter: 'blur(60px)',
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all z-10"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#64748b',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748b' }}
        >
          <X size={14} />
        </button>

        <div style={{ padding: '32px 32px 26px' }}>

          {/* ── Header ── */}
          <motion.div
            className="text-center mb-7"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg,#7c3aed,#6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 18px rgba(124,58,237,0.55)',
              }}>
                {isUpdate ? <Target size={17} color="#fff" /> : <Sparkles size={17} color="#fff" />}
              </div>
              <h1 style={{
                fontSize: 24, fontWeight: 900, letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                <span style={{ color: '#e2e8f0' }}>
                  {isUpdate ? 'UPDATE YOUR ' : 'RELATIVE '}
                </span>
                <span style={{ color: '#a78bfa' }}>
                  {isUpdate ? 'COSMIC ' : 'IMPORTANCE '}
                </span>
                <span style={{ color: '#6ee7b7' }}>
                  {isUpdate ? 'TRAJECTORY' : 'TESTING'}
                </span>
              </h1>
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', letterSpacing: '0.02em' }}>
              {isUpdate
                ? 'Recalibrate your North Star — update your goal and timeline'
                : 'Define your Cosmic Trajectory and set your North Star'}
            </p>

            {/* Step indicator — only for onboarding */}
            {!isUpdate && (
              <div className="flex items-center justify-center gap-2 mt-3">
                {[1, 2].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div style={{
                      width: s === step ? 24 : 8, height: 8, borderRadius: 999,
                      background: s === step ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                      boxShadow: s === step ? '0 0 8px rgba(124,58,237,0.6)' : 'none',
                      transition: 'all 0.3s',
                    }} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Two column body ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

            {/* ── LEFT: Guiding Star ── */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
              style={{
                borderRadius: 16,
                background: 'rgba(255,255,255,0.028)',
                border: '1px solid rgba(139,92,246,0.18)',
                padding: '18px 18px 14px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
            >
              <p style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#e2e8f0', textAlign: 'center',
              }}>
                ✦ YOUR GUIDING STAR (GOAL)
              </p>

              {/* Textarea */}
              <div style={{ position: 'relative' }}>
                <textarea
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="What is your primary focus or aspiration?&#10;&#10;e.g. Land a Backend Developer role at a product startup"
                  rows={5}
                  maxLength={200}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${goal.trim() ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.18)'}`,
                    borderRadius: 12, padding: '11px 13px',
                    color: '#f1f5f9', fontSize: 12.5, fontFamily: 'inherit',
                    resize: 'none', outline: 'none', lineHeight: 1.6,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(139,92,246,0.55)'
                    e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = goal.trim() ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.18)'
                    e.target.style.boxShadow   = 'none'
                  }}
                />
                <span style={{
                  position: 'absolute', bottom: 8, right: 10,
                  fontSize: 9, color: goal.length > 160 ? '#f87171' : '#475569',
                  fontWeight: 600,
                }}>
                  {goal.length}/200
                </span>
              </div>

              {/* Category selector */}
              <div>
                <p style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#475569', marginBottom: 8,
                }}>
                  Category
                </p>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
                }}>
                  {CATEGORIES.map(({ id, label, icon: Icon }) => {
                    const active = category === id
                    return (
                      <motion.button
                        key={id}
                        onClick={() => setCat(id)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 5,
                          padding: '8px 4px',
                          borderRadius: 12, cursor: 'pointer',
                          background: active ? 'rgba(124,58,237,0.22)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${active ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: active ? '0 0 12px rgba(124,58,237,0.35)' : 'none',
                          transition: 'all 0.18s',
                        }}
                      >
                        <Icon size={16} color={active ? '#c4b5fd' : '#475569'} />
                        <span style={{
                          fontSize: 9, fontWeight: 700,
                          letterSpacing: '0.06em',
                          color: active ? '#c4b5fd' : '#475569',
                          transition: 'color 0.18s',
                        }}>
                          {label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: Relative Urgency ── */}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16 }}
              style={{
                borderRadius: 16,
                background: 'rgba(255,255,255,0.028)',
                border: '1px solid rgba(139,92,246,0.18)',
                padding: '18px 16px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <p style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#e2e8f0', marginBottom: 10,
              }}>
                ✦ RELATIVE URGENCY (TIME)
              </p>

              {/* Mode toggle: Dial vs Date Picker */}
              <div style={{
                display: 'flex', gap: 4, padding: '3px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, marginBottom: 10,
              }}>
                {[
                  { id: 'dial',  label: '⚙️ Arc Dial'     },
                  { id: 'date',  label: '📅 Pick Date' },
                ].map(m => (
                  <button key={m.id}
                    onClick={() => setInputMode(m.id as 'dial' | 'date')}
                    style={{
                      padding: '5px 14px', borderRadius: 8,
                      fontSize: 10, fontWeight: 700,
                      cursor: 'pointer', border: '1px solid transparent',
                      background: inputMode === m.id ? 'rgba(124,58,237,0.45)' : 'transparent',
                      color: inputMode === m.id ? '#c4b5fd' : '#64748b',
                      borderColor: inputMode === m.id ? 'rgba(139,92,246,0.45)' : 'transparent',
                      boxShadow: inputMode === m.id ? '0 0 10px rgba(124,58,237,0.3)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {inputMode === 'dial' ? (
                  <motion.div key="dial"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'center' }}
                  >
                    <ArcDial days={days} onChange={handleDaysChange} />

                    {/* Right legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 90 }}>
                      <div style={{
                        padding: '8px 10px', borderRadius: 10,
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.22)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: '50%', background: '#a855f7',
                            boxShadow: '0 0 5px rgba(168,85,247,0.9)',
                          }} />
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#e2e8f0' }}>Time Remaining</span>
                        </div>
                        <p style={{ fontSize: 8.5, color: '#64748b', lineHeight: 1.5 }}>
                          Drag the{' '}
                          <span style={{ color: '#a78bfa', fontWeight: 700 }}>glowing marker</span>
                          {' '}to your target date.
                        </p>
                      </div>

                      {/* Relative importance orb */}
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '10px 6px', borderRadius: 12,
                        background: 'rgba(124,58,237,0.1)',
                        border: '1px solid rgba(139,92,246,0.22)',
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%', marginBottom: 5,
                          background: 'linear-gradient(135deg,rgba(168,85,247,0.4),rgba(99,102,241,0.3))',
                          border: '1.5px solid rgba(168,85,247,0.5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 0 14px rgba(168,85,247,0.4)',
                        }}>
                          <span style={{ fontSize: 17 }}>🚀</span>
                        </div>
                        <span style={{ fontSize: 8.5, color: '#94a3b8', textAlign: 'center', fontWeight: 600, lineHeight: 1.4 }}>
                          Relative<br />Importance
                        </span>
                      </div>
                    </div>
                  </motion.div>

                ) : (
                  <motion.div key="date"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 4px' }}
                  >
                    {/* Date input */}
                    <div>
                      <p style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#64748b', marginBottom: 8,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        <Calendar size={10} color="#a855f7" /> Target Deadline
                      </p>
                      <input
                        type="date"
                        value={dateInput}
                        min={minDate}
                        onChange={e => handleDateChange(e.target.value)}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          borderRadius: 12, padding: '12px 14px',
                          color: '#f1f5f9', fontSize: 14, fontFamily: 'inherit',
                          outline: 'none', cursor: 'pointer',
                          colorScheme: 'dark',
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = 'rgba(139,92,246,0.6)'
                          e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.12)'
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'rgba(139,92,246,0.3)'
                          e.target.style.boxShadow   = 'none'
                        }}
                      />
                    </div>

                    {/* Quick presets */}
                    <div>
                      <p style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#64748b', marginBottom: 8,
                      }}>
                        Quick Presets
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                        {[
                          { label: '1 Month',   days: 30  },
                          { label: '3 Months',  days: 90  },
                          { label: '6 Months',  days: 180 },
                          { label: '1 Year',    days: 365 },
                        ].map(p => {
                          const active = Math.abs(days - p.days) < 8
                          return (
                            <motion.button key={p.label}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleDaysChange(p.days)}
                              style={{
                                padding: '8px 0', borderRadius: 10,
                                fontSize: 11, fontWeight: 700,
                                cursor: 'pointer',
                                background: active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${active ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                color: active ? '#c4b5fd' : '#94a3b8',
                                boxShadow: active ? '0 0 10px rgba(124,58,237,0.3)' : 'none',
                                transition: 'all 0.15s',
                              }}
                            >
                              {p.label}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Selected date display */}
                    <div style={{
                      padding: '12px 14px', borderRadius: 12,
                      background: 'rgba(124,58,237,0.08)',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={13} color="#a855f7" />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{bd.label}</p>
                          <p style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                            {bd.days} days · {bd.weeks} weeks
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Time readout pill — always visible */}
              <motion.div
                key={days}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, marginTop: 10,
                  padding: '7px 16px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(139,92,246,0.2)',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, color: '#6ee7b7' }}>
                  {Math.round(bd.months)} MO
                </span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>|</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#a78bfa' }}>
                  {bd.weeks} WK
                </span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>|</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#67e8f9' }}>
                  {bd.days} D
                </span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>|</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>
                  by {bd.label}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Pathway summary + CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            {/* Summary */}
            <div style={{
              flex: 1, padding: '13px 18px', borderRadius: 14,
              background: 'rgba(255,255,255,0.028)',
              border: `1px solid ${canConfirm ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'border-color 0.3s',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 800, color: '#e2e8f0',
                marginBottom: 3, letterSpacing: '0.08em',
              }}>
                {isUpdate ? '✦ UPDATED COSMIC PATHWAY:' : '✦ MY COSMIC PATHWAY:'}
              </p>
              {canConfirm ? (
                <p style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.65 }}>
                  <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{goalDisplay}</span>
                  {' '}is my focus, with{' '}
                  <span style={{ color: '#6ee7b7', fontWeight: 700 }}>{Math.round(bd.months)} month{Math.round(bd.months) !== 1 ? 's' : ''}</span>
                  {' '}({bd.days} days) until arrival on{' '}
                  <span style={{ color: '#67e8f9', fontWeight: 700 }}>{bd.label}</span>.
                  {' '}<span style={{ color: '#475569', fontStyle: 'italic' }}>Personalization protocols activating…</span>
                </p>
              ) : (
                <p style={{ fontSize: 11, color: '#475569', fontStyle: 'italic' }}>
                  Enter your primary focus above to generate your cosmic pathway…
                </p>
              )}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={canConfirm ? { scale: 1.03, boxShadow: '0 0 36px rgba(99,102,241,0.65)' } : {}}
              whileTap={canConfirm ? { scale: 0.97 } : {}}
              onClick={handleConfirm}
              disabled={!canConfirm}
              style={{
                flexShrink: 0,
                padding: '15px 24px',
                borderRadius: 14,
                background: canConfirm
                  ? 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #a855f7 100%)'
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${canConfirm ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.08)'}`,
                color: canConfirm ? '#fff' : '#475569',
                fontSize: 12, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: canConfirm ? 'pointer' : 'not-allowed',
                boxShadow: canConfirm ? '0 0 26px rgba(99,102,241,0.45)' : 'none',
                whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 7,
                transition: 'all 0.2s',
              }}
            >
              {isUpdate ? 'UPDATE TRAJECTORY' : 'CONFIRM TRAJECTORY'}
              <ChevronRight size={15} />
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  )
}

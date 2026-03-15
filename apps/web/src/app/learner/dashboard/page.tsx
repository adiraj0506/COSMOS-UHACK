'use client'

import './dashboard.css'

import DashboardShell from '@/components/learner/dashboard/DashboardShell'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Target, FileText, Map, MessageSquare,
  Check, Flame, TrendingUp, ChevronRight, ArrowUpRight,
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip,
} from 'recharts'

// ── Mock data ─────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  { id: 'readiness', label: 'Readiness Score', value: '68%',      delta: '+5% this week', deltaGood: true,  icon: Target,   iconClass: 'kpi-icon--violet',  color: '#a855f7', cardClass: 'dash-card--violet'  },
  { id: 'streak',    label: 'Active Streak',   value: '52 days',  delta: 'Keep it up!',   deltaGood: true,  icon: Flame,    iconClass: 'kpi-icon--orange',  color: '#f97316', cardClass: 'dash-card--orange'  },
  { id: 'tasks',     label: 'Tasks Completed', value: '2 / 3',    delta: '1 pending',     deltaGood: false, icon: Check,    iconClass: 'kpi-icon--emerald', color: '#10b981', cardClass: 'dash-card--emerald' },
  { id: 'resume',    label: 'Resume Score',    value: '72 / 100', delta: '3 suggestions', deltaGood: false, icon: FileText, iconClass: 'kpi-icon--pink',    color: '#ec4899', cardClass: 'dash-card--pink'    },
]

const SKILLS = [
  { label: 'DSA',            val: 62, fillClass: 'skill-bar-fill--indigo' },
  { label: 'Problem Solving',val: 72, fillClass: 'skill-bar-fill--violet' },
  { label: 'Web Dev',        val: 40, fillClass: 'skill-bar-fill--cyan'   },
  { label: 'Communication',  val: 55, fillClass: 'skill-bar-fill--pink'   },
]

const RADAR_DATA = [
  { subject: 'DSA',        A: 62 },
  { subject: 'Web Dev',    A: 40 },
  { subject: 'Sys Design', A: 50 },
  { subject: 'Comms',      A: 55 },
]

const PROGRESS_DATA = [
  { day: 'Mon', score: 58 },
  { day: 'Tue', score: 61 },
  { day: 'Wed', score: 60 },
  { day: 'Thu', score: 64 },
  { day: 'Fri', score: 63 },
  { day: 'Sat', score: 67 },
  { day: 'Sun', score: 68 },
]

const TASKS = [
  { label: 'Solve 10 array problems', done: true,  due: '04 Jan' },
  { label: 'Build REST API',          done: true,  due: '12 Feb' },
  { label: 'Deploy backend project',  done: false, due: '1 Apr'  },
]

const RESUME_SUGGESTIONS = [
  'Improve skills section',
  'Add backend project',
  'Highlight API work',
]

const OPPORTUNITIES = [
  { label: 'Backend Internship',       company: 'StartupX',  tag: 'Internship',  color: '#7c3aed', match: 87 },
  { label: 'SolveForIndia Hackathon',  company: 'HackShore', tag: 'Hackathon',   color: '#be185d', match: 79 },
  { label: 'Open Source Backend APIs', company: 'DevNet',    tag: 'Open Source', color: '#065f46', match: 74 },
]

const INSIGHTS = [
  { icon: '📈', label: 'Problem Solving up 5% this week', rowClass: 'insight-row--emerald' },
  { icon: '🎯', label: 'Focus on System Design next',      rowClass: 'insight-row--violet'  },
  { icon: '⚡', label: '3 roadmap tasks due this week',    rowClass: 'insight-row--amber'   },
]

// ── Arc gauge ─────────────────────────────────────────────────────────────────

function ArcGauge({ value }: { value: number }) {
  const r = 54, cx = 66, cy = 70
  const toRad = (d: number) => (d * Math.PI) / 180
  const start = 215, span = 290
  const end   = start + (span * value) / 100
  const pt    = (deg: number) => ({ x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) })
  const s = pt(start), e = pt(end), te = pt(start + span)
  const lg = end - start > 180 ? 1 : 0
  return (
    <svg width="132" height="108" viewBox="0 0 132 118" className="shrink-0" aria-label={`${value}% readiness`}>
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6366f1" />
          <stop offset="55%"  stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="gaugeGlow">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d={`M${s.x} ${s.y} A${r} ${r} 0 1 1 ${te.x} ${te.y}`}
        fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="9" strokeLinecap="round" />
      <path d={`M${s.x} ${s.y} A${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`}
        fill="none" stroke="url(#gaugeGrad)" strokeWidth="9"
        strokeLinecap="round" filter="url(#gaugeGlow)" />
      <text x={cx} y={cy + 4}  textAnchor="middle" fill="white"
        fontSize="26" fontWeight="800" fontFamily="system-ui">{value}%</text>
      <text x={cx} y={cy + 19} textAnchor="middle"
        fill="rgba(167,139,250,0.65)" fontSize="7.5" fontFamily="system-ui" letterSpacing="2.5">
        READINESS
      </text>
    </svg>
  )
}

// ── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = (i: number) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.42, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] as const },
})

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LearnerDashboard() {
  const [targetRole, setTargetRole] = useState('Backend Developer')

  useEffect(() => {
    const raw = localStorage.getItem('cosmos_user_goal')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.goal) setTargetRole(parsed.goal)
      } catch {}
    }
  }, [])

  return (
    <DashboardShell activeHref="/learner/dashboard">

      {/* Row 1 — KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {KPI_CARDS.map(({ id, label, value, delta, deltaGood, icon: Icon, iconClass, color, cardClass }, i) => (
          <motion.div key={id} {...fadeUp(i)}>
            <div className={`dash-card ${cardClass}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`kpi-icon ${iconClass}`}>
                  <Icon size={15} style={{ color }} />
                </div>
                <span className={`kpi-delta ${deltaGood ? 'kpi-delta--good' : 'kpi-delta--warn'}`}>
                  {delta}
                </span>
              </div>
              <p className="kpi-value">{value}</p>
              <p className="kpi-label">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2 — Readiness · Radar · Trend */}
      <div className="grid grid-cols-12 gap-3 mb-4">

        <motion.div {...fadeUp(4)} className="col-span-4">
          <div className="dash-card dash-card--violet h-full">
            <p className="dash-card-label">Readiness Score</p>
            <div className="flex items-center gap-4 mb-2">
              <ArcGauge value={68} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 mb-0.5">Target Role</p>
                <p className="text-white font-bold text-sm mb-3">{targetRole}</p>
                <div className="space-y-2.5">
                  {SKILLS.map(({ label, val, fillClass }) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400">{label}</span>
                        <span className="text-[10px] font-bold text-white">{val}%</span>
                      </div>
                      <div className="skill-bar-track">
                        <div className={`skill-bar-fill ${fillClass}`} style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(5)} className="col-span-4">
          <div className="dash-card h-full">
            <div className="flex items-center justify-between">
              <p className="dash-card-label">Skill Radar</p>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="radar-legend-dot" />
                <span className="text-[9px] text-gray-500">Current level</span>
              </div>
            </div>
            <div style={{ height: 186, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="68%">
                  <PolarGrid stroke="rgba(139,92,246,0.12)" />
                  <PolarAngleAxis dataKey="subject"
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} />
                  <Radar dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.18}
                    strokeWidth={1.5}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.65))' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(6)} className="col-span-4">
          <div className="dash-card dash-card--indigo h-full">
            <div className="flex items-center justify-between">
              <p className="dash-card-label">Progress Trend</p>
              <div className="trend-delta">
                <TrendingUp size={10} /> +10 pts
              </div>
            </div>
            <div style={{ height: 166, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PROGRESS_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#a855f7" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 9 }}
                    axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{
                    background: 'rgba(10,4,28,0.95)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    borderRadius: 10, fontSize: 11, color: '#e5e7eb',
                  }} cursor={{ stroke: 'rgba(168,85,247,0.3)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2}
                    fill="url(#areaGrad)" dot={false}
                    activeDot={{ r: 4, fill: '#a855f7', stroke: '#0a041c', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Row 3 — Roadmap · Resume · Opportunities+Mentor */}
      <div className="grid grid-cols-12 gap-3">

        <motion.div {...fadeUp(7)} className="col-span-4">
          <div className="dash-card dash-card--indigo h-full">
            <div className="flex items-center justify-between">
              <p className="dash-card-label">Roadmap Progress</p>
              <Link href="/learner/roadmap" className="view-all-link">
                View all <ChevronRight size={10} />
              </Link>
            </div>
            <div className="week-progress-pill">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-violet-300 font-semibold">Week 1</span>
                  <span className="text-[10px] font-bold text-violet-200">67%</span>
                </div>
                <div className="week-progress-bar-track">
                  <div className="week-progress-bar-fill" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {TASKS.map(t => (
                <div key={t.label} className={`task-row ${t.done ? 'task-row--done' : 'task-row--pending'}`}>
                  <div className={`task-check ${t.done ? 'task-check--done' : 'task-check--pending'}`}>
                    {t.done && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className={`flex-1 ${t.done ? 'task-label--done' : 'task-label--pending'}`}>
                    {t.label}
                  </span>
                  <span className="task-due">{t.due}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(8)} className="col-span-3">
          <div className="dash-card dash-card--pink h-full">
            <p className="dash-card-label">Resume Strength</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="resume-ring-wrap">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none"
                    stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none"
                    stroke="url(#resumeGrad)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26 * 0.72} ${2 * Math.PI * 26}`} />
                  <defs>
                    <linearGradient id="resumeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="resume-ring-label">72</div>
              </div>
              <div>
                <p className="text-white font-black text-2xl leading-none">72</p>
                <p className="text-gray-500 text-[10px] mt-0.5">out of 100</p>
                <div className="resume-segment-bar">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`resume-segment ${i <= 3 ? 'resume-segment--filled' : 'resume-segment--empty'}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Suggestions</p>
            <div className="space-y-1.5 flex-1">
              {RESUME_SUGGESTIONS.map(s => (
                <div key={s} className="suggestion-row">
                  <div className="suggestion-dot" />
                  <p className="suggestion-text">{s}</p>
                </div>
              ))}
            </div>
            <Link href="/learner/resume" className="cta-btn cta-btn--violet">
              Build Resume <ArrowUpRight size={12} />
            </Link>
          </div>
        </motion.div>

        <motion.div {...fadeUp(9)} className="col-span-5">
          <div className="dash-card h-full">
            <div className="flex items-center justify-between">
              <p className="dash-card-label">Opportunities</p>
              <Link href="/learner/opportunities" className="view-all-link">
                View all <ChevronRight size={10} />
              </Link>
            </div>
            <div className="space-y-2.5 flex-1">
              {OPPORTUNITIES.map(o => (
                <div key={o.label} className="opp-row">
                  <div className="opp-logo" style={{ background: o.color, boxShadow: `0 0 12px ${o.color}50` }}>
                    {o.label[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="opp-title truncate">{o.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="opp-company">{o.company}</span>
                      <span className="dash-badge" style={{ background: o.color }}>{o.tag}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="opp-match-pct" style={{ color: o.color }}>{o.match}%</p>
                    <p className="opp-match-label">match</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="card-divider" />
            <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Mentor Insights</p>
            <div className="space-y-1.5">
              {INSIGHTS.map(ins => (
                <div key={ins.label} className={`insight-row ${ins.rowClass}`}>
                  <span className="text-sm shrink-0">{ins.icon}</span>
                  <p className="insight-text">{ins.label}</p>
                </div>
              ))}
            </div>
            <Link href="/learner/mentor" className="cta-btn cta-btn--mentor">
              <MessageSquare size={12} /> Ask Digital Mentor
            </Link>
          </div>
        </motion.div>

      </div>

    </DashboardShell>
  )
}

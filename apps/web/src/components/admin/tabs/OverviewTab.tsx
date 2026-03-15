'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/tabs/OverviewTab.tsx
// Platform-wide KPIs, trend sparklines, recent activity log
//
// BACKEND: supabase.rpc('get_admin_stats') for all aggregate numbers
// BACKEND: supabase.from('system_logs').select('*').order('created_at',{ascending:false}).limit(10)
//
// FIX: Sparkline values are pre-seeded as module-level constants — never use
// Math.random() inside a component body or render function. SSR and client
// would compute different values, causing a React hydration mismatch.
// When real data is available, replace SPARKLINE_DATA with actual time-series
// from Supabase: supabase.rpc('get_stat_timeseries', { metric, days: 12 })
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Users, Building2, Briefcase, TrendingUp, Activity, Zap, Target, Award } from 'lucide-react'
import { MOCK_LEARNERS, MOCK_COLLEGES, MOCK_RECRUITERS } from '@/types/admin.types'

// ── Pre-seeded sparkline data (12 bars each) ─────────────────────────────────
// Static values = identical on server + client = no hydration mismatch.
// Replace each array with real time-series data from your backend.
const SPARKLINE_DATA: Record<string, number[]> = {
  'Total Learners':  [42, 55, 48, 61, 72, 58, 80, 75, 88, 70, 92, 85],
  'Colleges':        [30, 45, 38, 52, 60, 48, 65, 70, 58, 75, 68, 80],
  'Recruiters':      [55, 40, 62, 50, 45, 68, 55, 72, 60, 78, 65, 82],
  'Placed':          [20, 35, 28, 42, 55, 38, 60, 48, 70, 58, 75, 88],
  'Avg Readiness':   [50, 58, 54, 63, 60, 68, 65, 72, 70, 76, 73, 80],
  'Active Jobs':     [60, 48, 70, 55, 65, 78, 60, 82, 70, 88, 75, 92],
  'Assessments Run': [35, 50, 42, 58, 65, 52, 72, 60, 80, 68, 85, 78],
  'Platform Health': [90, 88, 95, 92, 89, 96, 93, 97, 91, 95, 98, 99],
}

const STATS = [
  { icon: Users,      label: 'Total Learners',  value: MOCK_LEARNERS.length,                                                                             sub: '+12 this week',        color: '#818cf8', glow: 'rgba(129,140,248,0.2)' },
  { icon: Building2,  label: 'Colleges',         value: MOCK_COLLEGES.length,                                                                             sub: '+2 onboarded',         color: '#34d399', glow: 'rgba(52,211,153,0.2)'  },
  { icon: Briefcase,  label: 'Recruiters',        value: MOCK_RECRUITERS.length,                                                                           sub: '3 verified today',     color: '#f59e0b', glow: 'rgba(245,158,11,0.2)'  },
  { icon: Award,      label: 'Placed',            value: MOCK_LEARNERS.filter(l => l.status === 'placed').length,                                          sub: 'this semester',        color: '#06b6d4', glow: 'rgba(6,182,212,0.2)'   },
  { icon: TrendingUp, label: 'Avg Readiness',     value: `${Math.round(MOCK_LEARNERS.reduce((a, l) => a + l.readiness, 0) / MOCK_LEARNERS.length)}%`,     sub: '+4% vs last month',    color: '#a78bfa', glow: 'rgba(167,139,250,0.2)' },
  { icon: Target,     label: 'Active Jobs',        value: MOCK_RECRUITERS.reduce((a, r) => a + r.activeJobs, 0),                                           sub: 'across all companies', color: '#f472b6', glow: 'rgba(244,114,182,0.2)' },
  { icon: Zap,        label: 'Assessments Run',   value: MOCK_LEARNERS.reduce((a, l) => a + l.assessmentsDone, 0),                                        sub: 'total completed',      color: '#fbbf24', glow: 'rgba(251,191,36,0.2)'  },
  { icon: Activity,   label: 'Platform Health',   value: '99.8%',                                                                                          sub: 'uptime this month',    color: '#34d399', glow: 'rgba(52,211,153,0.2)'  },
]

const ACTIVITY = [
  { time: '2m ago',  action: "Learner 'Priya Nair' marked as Placed at Razorpay",         type: 'success' },
  { time: '14m ago', action: "College 'IIT Bombay' onboarded — 480 students imported",     type: 'info'    },
  { time: '31m ago', action: "Recruiter 'Aisha Kapoor' verified — Zepto account approved", type: 'success' },
  { time: '1h ago',  action: "Feature flag 'ai_mentor_v2' enabled by admin",               type: 'info'    },
  { time: '2h ago',  action: "Learner 'Neha Kulkarni' marked inactive — no activity 30d",  type: 'warn'    },
  { time: '3h ago',  action: "College 'Amity Noida' suspended — low compliance score",     type: 'danger'  },
  { time: '4h ago',  action: "Bulk import: 340 learners added from VIT Vellore CSV",       type: 'info'    },
  { time: '5h ago',  action: "Recruiter 'Sonia Jain' (Unacademy) set to inactive",         type: 'warn'    },
]

const typeColor = {
  success: { dot: '#34d399', row: 'rgba(52,211,153,0.04)'  },
  info:    { dot: '#818cf8', row: 'rgba(129,140,248,0.04)' },
  warn:    { dot: '#fbbf24', row: 'rgba(251,191,36,0.04)'  },
  danger:  { dot: '#f87171', row: 'rgba(248,113,113,0.04)' },
}

// ── Sparkline ────────────────────────────────────────────────────────────────
// Receives pre-computed static values — never calls Math.random() at render.
// BACKEND: replace `vals` prop with real time-series from Supabase RPC.
function Sparkline({ color, vals }: { color: string; vals: number[] }) {
  const max = Math.max(...vals)
  return (
    <svg width="64" height="24" viewBox="0 0 64 24">
      {vals.map((v, i) => {
        const h = (v / max) * 22
        return (
          <rect
            key={i}
            x={i * 6}
            y={24 - h}
            width={4}
            height={h}
            rx={1.5}
            fill={color}
            opacity={0.6}
          />
        )
      })}
    </svg>
  )
}

export default function OverviewTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* KPI grid */}
      <div className="grid grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3"
            style={{
              background: 'rgba(10,4,28,0.7)',
              border: `1px solid ${s.color}22`,
              boxShadow: `0 0 0 1px ${s.color}0a`,
            }}
          >
            {/* Glow blob */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl pointer-events-none" style={{ background: s.glow }} />
            <div className="flex items-start justify-between relative">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
              >
                <s.icon size={15} style={{ color: s.color }} />
              </div>
              <Sparkline color={s.color} vals={SPARKLINE_DATA[s.label] ?? [50,50,50,50,50,50,50,50,50,50,50,50]} />
            </div>
            <div className="relative">
              <p className="text-xl font-black text-white leading-none">{s.value}</p>
              <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{s.label}</p>
              <p className="text-[10px] mt-1" style={{ color: s.color }}>{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity feed + distribution */}
      <div className="grid grid-cols-3 gap-3">
        {/* Activity feed */}
        <div
          className="col-span-2 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(10,4,28,0.7)', border: '1px solid rgba(139,92,246,0.12)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <p className="text-xs font-bold text-white">Recent Activity</p>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {ACTIVITY.map((a, i) => {
              const meta = typeColor[a.type as keyof typeof typeColor]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 px-4 py-2.5"
                  style={{ background: meta.row }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: meta.dot, boxShadow: `0 0 6px ${meta.dot}` }} />
                  <p className="text-[12px] text-gray-300 flex-1 leading-snug">{a.action}</p>
                  <span className="text-[10px] text-gray-600 shrink-0 mt-0.5">{a.time}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Distribution panel */}
        <div className="flex flex-col gap-3">
          {/* Learner domains */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(10,4,28,0.7)', border: '1px solid rgba(139,92,246,0.12)' }}
          >
            <p className="text-xs font-bold text-white mb-3">Learner Domains</p>
            {[
              { label: 'Full Stack', pct: 35, color: '#818cf8' },
              { label: 'Backend',    pct: 25, color: '#06b6d4' },
              { label: 'Data Science',pct:20, color: '#34d399' },
              { label: 'Frontend',   pct: 12, color: '#f59e0b' },
              { label: 'DevOps',     pct: 8,  color: '#f472b6' },
            ].map(d => (
              <div key={d.label} className="mb-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-400">{d.label}</span>
                  <span style={{ color: d.color }}>{d.pct}%</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: d.color, width: `${d.pct}%`, boxShadow: `0 0 6px ${d.color}80` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(10,4,28,0.7)', border: '1px solid rgba(139,92,246,0.12)' }}
          >
            <p className="text-xs font-bold text-white mb-3">Platform Status</p>
            {[
              { label: 'Active Learners',    value: MOCK_LEARNERS.filter(l=>l.status==='active').length,   color: '#34d399' },
              { label: 'Placed',             value: MOCK_LEARNERS.filter(l=>l.status==='placed').length,   color: '#818cf8' },
              { label: 'Inactive',           value: MOCK_LEARNERS.filter(l=>l.status==='inactive').length, color: '#94a3b8' },
              { label: 'Active Colleges',    value: MOCK_COLLEGES.filter(c=>c.status==='active').length,   color: '#34d399' },
              { label: 'Verified Recruiters',value: MOCK_RECRUITERS.filter(r=>r.status==='verified').length, color: '#06b6d4'},
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="text-[11px] text-gray-400">{item.label}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

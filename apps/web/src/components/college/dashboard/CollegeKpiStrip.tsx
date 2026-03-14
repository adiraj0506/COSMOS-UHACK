'use client'

import { motion } from 'framer-motion'
import {
  Users, TrendingUp, Trophy, AlertTriangle,
  Activity, GraduationCap,
} from 'lucide-react'
import type { Student, PlacementRecord } from './college.types.ts'
import { MOCK_COLLEGE } from './college.types.ts'

interface CollegeKpiStripProps {
  students:   Student[]
  placements: PlacementRecord[]
}

export default function CollegeKpiStrip({ students, placements }: CollegeKpiStripProps) {
  const total       = students.length
  const avgReady    = Math.round(students.reduce((a, s) => a + s.readinessScore, 0) / total)
  const placed      = placements.length
  const atRisk      = students.filter(s => s.isAtRisk).length
  const active      = students.filter(s => !s.lastActive.includes('w') && !s.lastActive.includes('d')).length
  const highReady   = students.filter(s => s.readinessScore >= 75).length
  const placePct    = Math.round((placed / total) * 100)

  const KPIS = [
    {
      icon: Users,         color: '#06b6d4',
      label: 'Total Students', value: total,
      delta: `${MOCK_COLLEGE.activeBatch} batch`,
      deltaGood: true,
    },
    {
      icon: TrendingUp,    color: '#a855f7',
      label: 'Avg Readiness', value: `${avgReady}%`,
      delta: avgReady >= 60 ? '+8% this month' : 'Needs attention',
      deltaGood: avgReady >= 60,
    },
    {
      icon: Trophy,        color: '#10b981',
      label: 'Placed', value: placed,
      delta: `${placePct}% placement rate`,
      deltaGood: placePct >= 50,
    },
    {
      icon: GraduationCap, color: '#6366f1',
      label: 'High Readiness (75%+)', value: highReady,
      delta: `${Math.round((highReady/total)*100)}% of batch`,
      deltaGood: highReady / total >= 0.4,
    },
    {
      icon: Activity,      color: '#f59e0b',
      label: 'Active Today', value: active,
      delta: `${Math.round((active/total)*100)}% engagement`,
      deltaGood: active / total >= 0.5,
    },
    {
      icon: AlertTriangle, color: '#f43f5e',
      label: 'At Risk', value: atRisk,
      delta: atRisk === 0 ? 'All clear ✓' : `${atRisk} need support`,
      deltaGood: atRisk === 0,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10, marginBottom: 16 }}>
      {KPIS.map(({ icon: Icon, color, label, value, delta, deltaGood }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: i * 0.06, ease: [0.22,1,0.36,1] }}
          style={{
            borderRadius: 16, padding: '14px 16px',
            background: 'rgba(255,255,255,0.032)',
            border: `1px solid ${color}20`,
            backdropFilter: 'blur(18px)',
            boxShadow: `inset 0 0 40px ${color}09, 0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: `${color}18`, border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 10px ${color}22`,
            }}>
              <Icon size={14} style={{ color }} />
            </div>
            <span style={{
              fontSize: 8.5, fontWeight: 600, padding: '2px 6px', borderRadius: 999,
              background: deltaGood ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.1)',
              color: deltaGood ? '#6ee7b7' : '#fca5a5',
              border: `1px solid ${deltaGood ? 'rgba(16,185,129,0.2)' : 'rgba(248,113,113,0.2)'}`,
            }}>
              {delta}
            </span>
          </div>
          <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 3 }}>{value}</p>
          <p style={{ fontSize: 9.5, fontWeight: 500, color: '#475569' }}>{label}</p>
        </motion.div>
      ))}
    </div>
  )
}

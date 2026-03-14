'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import CollegeShell     from '@/components/college/dashboard/CollegeShell'
import CollegeKpiStrip  from '@/components/college/dashboard/CollegeKpiStrip'
import CollegeAnalytics from '@/components/college/dashboard/CollegeAnalytics'
import PlacementBoard   from '@/components/college/dashboard/PlacementBoard'
import StudentTable     from '@/components/college/dashboard/StudentTable'
import {
  MOCK_STUDENTS,
  MOCK_PLACEMENTS,
  MOCK_BRANCH_STATS,
  MOCK_TREND,
  MOCK_SKILL_GAPS,
  MOCK_COLLEGE,
} from '@/components/college/dashboard/college.types'

const fadeUp = (i: number) => ({
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.38, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] as const },
})

const SECTION: React.CSSProperties = {
  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em',
  textTransform: 'uppercase', color: 'rgba(6,182,212,0.65)',
  display: 'flex', alignItems: 'center', gap: 8,
  margin: '20px 0 12px',
}

const SECTION_LINE: React.CSSProperties = {
  flex: 1, height: 1,
  background: 'linear-gradient(to right, rgba(6,182,212,0.22), transparent)',
}

export default function CollegeDashboard() {
  const [students]   = useState(MOCK_STUDENTS)
  const [placements] = useState(MOCK_PLACEMENTS)
  const atRisk = students.filter(s => s.isAtRisk)

  return (
    <CollegeShell activeHref="/college/dashboard">

      {/* ── Page header ── */}
      <motion.div {...fadeUp(0)}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}
      >
        <div>
          <h1 style={{
            fontSize: 17, fontWeight: 900, color: '#fff',
            letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }}>🎓</span>
            College Intelligence Dashboard
          </h1>
          <p style={{ fontSize: 10.5, color: '#334155', marginTop: 2 }}>
            {MOCK_COLLEGE.name} · {MOCK_COLLEGE.city} · Batch {MOCK_COLLEGE.activeBatch} · {students.length} students registered on COSMOS
          </p>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.8)', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7' }}>Live</span>
          <style>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      </motion.div>

      {/* ── KPI strip ── */}
      <motion.div {...fadeUp(1)}>
        <CollegeKpiStrip students={students} placements={placements} />
      </motion.div>

      {/* ── Analytics ── */}
      <motion.div {...fadeUp(2)}>
        <p style={SECTION}>✦ Analytics <span style={SECTION_LINE} /></p>
        <CollegeAnalytics
          branchStats={MOCK_BRANCH_STATS}
          trend={MOCK_TREND}
          skillGaps={MOCK_SKILL_GAPS}
        />
      </motion.div>

      {/* ── Placements + At-Risk ── */}
      <motion.div {...fadeUp(3)}>
        <p style={SECTION}>✦ Placements & At-Risk Students <span style={SECTION_LINE} /></p>
        <PlacementBoard placements={placements} atRisk={atRisk} />
      </motion.div>

      {/* ── Student Roster ── */}
      <motion.div {...fadeUp(4)}>
        <p style={SECTION}>✦ Student Roster <span style={SECTION_LINE} /></p>
        <StudentTable students={students} />
      </motion.div>

      <div style={{ height: 24 }} />

    </CollegeShell>
  )
}

'use client'

import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts'
import type { BranchStats, ReadinessTrend, SkillGap } from './college.types.ts'

interface CollegeAnalyticsProps {
  branchStats: BranchStats[]
  trend:       ReadinessTrend[]
  skillGaps:   SkillGap[]
}

const card: React.CSSProperties = {
  borderRadius: 18,
  background: 'rgba(255,255,255,0.032)',
  border: '1px solid rgba(255,255,255,0.072)',
  backdropFilter: 'blur(18px)',
  padding: 18,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.38)',
}

const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: '#0891b2', marginBottom: 14,
}

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(4,10,28,0.97)',
    border: '1px solid rgba(6,182,212,0.25)',
    borderRadius: 10, fontSize: 11, color: '#e5e7eb',
  },
  cursor: { stroke: 'rgba(6,182,212,0.25)', strokeWidth: 1 },
}

export default function CollegeAnalytics({ branchStats, trend, skillGaps }: CollegeAnalyticsProps) {
  const maxStudents = Math.max(...branchStats.map(b => b.total))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 12 }}>

      {/* ── Branch Breakdown ── */}
      <motion.div style={card}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.05 }}>
        <p style={sectionLabel}>Branch Breakdown</p>

        <div style={{ height: 160, marginBottom: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchStats} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <XAxis dataKey="branch" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle}
                formatter={(val: number, name: string) => [val, name === 'avgReadiness' ? 'Avg Readiness' : name]}
              />
              <Bar dataKey="total" radius={[4,4,0,0]}>
                {branchStats.map((b, i) => (
                  <Cell key={i} fill={b.color} opacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {branchStats.map(b => (
            <div key={b.branch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: b.color, flexShrink: 0, boxShadow: `0 0 4px ${b.color}` }} />
              <span style={{ fontSize: 10.5, fontWeight: 600, color: '#94a3b8', width: 40 }}>{b.branch}</span>
              <div style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(b.total / maxStudents) * 100}%`, background: b.color, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 10, color: '#475569', width: 24, textAlign: 'right' }}>{b.total}</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: b.color, width: 32, textAlign: 'right' }}>{b.avgReadiness}%</span>
              {b.atRisk > 0 && (
                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: 'rgba(244,63,94,0.12)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.2)' }}>
                  {b.atRisk}⚠
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Readiness Trend ── */}
      <motion.div style={card}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ ...sectionLabel, marginBottom: 0 }}>Readiness Trend</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Avg',  color: '#06b6d4' },
              { label: 'High', color: '#10b981' },
              { label: 'Low',  color: '#f43f5e' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 3, borderRadius: 999, background: l.color }} />
                <span style={{ fontSize: 9, color: '#475569' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <defs>
                <linearGradient id="trendAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="trendHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,100]} tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1.5} fill="url(#trendHigh)" dot={false}
                activeDot={{ r: 3, fill: '#10b981', stroke: '#040a1c', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="avg"  stroke="#06b6d4" strokeWidth={2}   fill="url(#trendAvg)" dot={false}
                activeDot={{ r: 4, fill: '#06b6d4', stroke: '#040a1c', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="low"  stroke="#f43f5e" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false}
                activeDot={{ r: 3, fill: '#f43f5e', stroke: '#040a1c', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 12 }}>
          {[
            { label: 'Current Avg', value: `${trend[trend.length-1].avg}%`, color: '#06b6d4' },
            { label: 'Peak',        value: `${Math.max(...trend.map(t=>t.high))}%`, color: '#10b981' },
            { label: 'Improvement', value: `+${trend[trend.length-1].avg - trend[0].avg}%`, color: '#a855f7' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              padding: '8px 10px', borderRadius: 10, textAlign: 'center',
              background: `${color}10`, border: `1px solid ${color}20`,
            }}>
              <p style={{ fontSize: 14, fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 8.5, color: '#475569', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Skill Gaps ── */}
      <motion.div style={card}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.15 }}>
        <p style={sectionLabel}>Top Skill Gaps</p>
        <p style={{ fontSize: 10, color: '#334155', marginBottom: 14, lineHeight: 1.5 }}>
          Skills most students haven't yet mastered across all branches.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {skillGaps.map((sg, i) => (
            <motion.div key={sg.skill}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: sg.color, boxShadow: `0 0 4px ${sg.color}` }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{sg.skill}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#475569' }}>{sg.students} students</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: sg.color }}>{sg.pct}%</span>
                </div>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: sg.color, borderRadius: 999, boxShadow: `0 0 6px ${sg.color}` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${sg.pct}%` }}
                  transition={{ duration: 0.9, ease: [0.22,1,0.36,1], delay: 0.3 + i * 0.06 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 12, background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)' }}>
          <p style={{ fontSize: 10, color: '#0891b2', fontWeight: 700, marginBottom: 3 }}>💡 Recommendation</p>
          <p style={{ fontSize: 10, color: '#334155', lineHeight: 1.55 }}>
            Consider organising a System Design workshop — it's the top gap affecting 58% of placement-ready students.
          </p>
        </div>
      </motion.div>

    </div>
  )
}

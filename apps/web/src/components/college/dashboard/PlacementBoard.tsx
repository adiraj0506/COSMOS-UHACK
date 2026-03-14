'use client'

import { motion } from 'framer-motion'
import { Trophy, AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react'
import type { PlacementRecord, Student } from './college.types.ts'
import { readinessColor } from './college.types.ts'

interface PlacementBoardProps {
  placements: PlacementRecord[]
  atRisk:     Student[]
}

export default function PlacementBoard({ placements, atRisk }: PlacementBoardProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>

      {/* ── Recent Placements ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.05 }}
        style={{
          borderRadius: 18, background: 'rgba(255,255,255,0.032)',
          border: '1px solid rgba(16,185,129,0.16)',
          backdropFilter: 'blur(18px)', padding: 18,
          boxShadow: 'inset 0 0 50px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Trophy size={14} style={{ color: '#10b981' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#10b981' }}>
            Recent Placements
          </p>
          <span style={{
            marginLeft: 'auto', padding: '2px 8px', borderRadius: 6,
            background: 'rgba(16,185,129,0.12)', color: '#6ee7b7',
            fontSize: 9, fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)',
          }}>
            {placements.length} placed
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {placements.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 13px', borderRadius: 12,
                background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              whileHover={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.09)' }}
            >
              {/* Company badge */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${p.logoColor}22`, border: `1px solid ${p.logoColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900, color: p.logoColor,
              }}>
                {p.company[0]}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginBottom: 1 }}>{p.student}</p>
                <p style={{ fontSize: 10.5, color: '#94a3b8' }}>
                  {p.role} · <span style={{ color: p.logoColor }}>{p.company}</span>
                </p>
              </div>

              {/* Package + date */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: '#10b981' }}>{p.package}</p>
                <p style={{ fontSize: 9.5, color: '#475569' }}>{p.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placement rate bar */}
        <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={12} style={{ color: '#10b981' }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#e2e8f0' }}>Placement Rate 2025</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#10b981' }}>
              {Math.round((placements.length / 342) * 100)}%
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(to right,#10b981,#06b6d4)', borderRadius: 999 }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((placements.length / 342) * 100)}%` }}
              transition={{ duration: 1, ease: [0.22,1,0.36,1], delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── At-Risk Students ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.1 }}
        style={{
          borderRadius: 18, background: 'rgba(255,255,255,0.032)',
          border: '1px solid rgba(244,63,94,0.18)',
          backdropFilter: 'blur(18px)', padding: 18,
          boxShadow: 'inset 0 0 50px rgba(244,63,94,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AlertTriangle size={14} style={{ color: '#f43f5e' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f43f5e' }}>
            At-Risk Students
          </p>
          <span style={{
            marginLeft: 'auto', padding: '2px 8px', borderRadius: 6,
            background: 'rgba(244,63,94,0.12)', color: '#fda4af',
            fontSize: 9, fontWeight: 700, border: '1px solid rgba(244,63,94,0.2)',
          }}>
            {atRisk.length} need support
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {atRisk.map((s, i) => {
            const rc = readinessColor(s.readinessScore)
            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 11,
                  background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                whileHover={{ borderColor: 'rgba(244,63,94,0.28)', background: 'rgba(244,63,94,0.09)' }}
              >
                {/* Avatar */}
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#fda4af',
                }}>
                  {s.avatar}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: '#f1f5f9', marginBottom: 1 }}>{s.name}</p>
                  <p style={{ fontSize: 9.5, color: '#475569' }}>
                    {s.branch} · Last active: {s.lastActive}
                  </p>
                </div>

                {/* Score + action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 900, color: rc, lineHeight: 1 }}>{s.readinessScore}%</p>
                    <p style={{ fontSize: 8.5, color: '#475569' }}>readiness</p>
                  </div>
                  <button style={{
                    padding: '5px 10px', borderRadius: 8,
                    background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
                    color: '#fda4af', fontSize: 9.5, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <ExternalLink size={10} /> Nudge
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 12, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, marginBottom: 2 }}>⚡ Action Required</p>
          <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.55 }}>
            {atRisk.length} students with readiness below 40%. Consider scheduling 1:1 counselling sessions.
          </p>
        </div>
      </motion.div>

    </div>
  )
}

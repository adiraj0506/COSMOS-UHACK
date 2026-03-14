'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Clock, Circle, ExternalLink,
} from 'lucide-react'
import type { Student, Branch, PlacementStatus } from './college.types'
import { readinessColor, readinessBg } from './college.types'

interface StudentTableProps {
  students: Student[]
}

const STATUS_CFG: Record<PlacementStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  placed:       { label: 'Placed',       color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2 },
  'in-process': { label: 'In Process',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: Clock        },
  'not-started':{ label: 'Not Started',  color: '#64748b', bg: 'rgba(100,116,139,0.1)',  icon: Circle       },
}

const BRANCHES: ('all' | Branch)[] = ['all','CSE','IT','ECE','MECH','CIVIL','EEE']
type SortKey = 'name' | 'readinessScore' | 'roadmapProgress' | 'streakDays'

export default function StudentTable({ students }: StudentTableProps) {
  const [search,  setSearch]  = useState('')
  const [branch,  setBranch]  = useState<'all'|Branch>('all')
  const [status,  setStatus]  = useState<'all'|PlacementStatus>('all')
  const [risk,    setRisk]    = useState<'all'|'at-risk'|'safe'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('readinessScore')
  const [sortAsc, setSortAsc] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(false) }
  }

  const filtered = useMemo(() => {
    let list = students
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.cosmosId.toLowerCase().includes(q) ||
        s.targetRole.toLowerCase().includes(q) ||
        s.skills.some(sk => sk.toLowerCase().includes(q))
      )
    }
    if (branch !== 'all')  list = list.filter(s => s.branch === branch)
    if (status !== 'all')  list = list.filter(s => s.placementStatus === status)
    if (risk === 'at-risk') list = list.filter(s => s.isAtRisk)
    if (risk === 'safe')    list = list.filter(s => !s.isAtRisk)

    return [...list].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      if (typeof va === 'string') return sortAsc ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
      return sortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })
  }, [students, search, branch, status, risk, sortKey, sortAsc])

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={10} style={{ opacity: 0.3 }} />
    return sortAsc ? <ChevronUp size={10} style={{ color: '#06b6d4' }} /> : <ChevronDown size={10} style={{ color: '#06b6d4' }} />
  }

  const pillBase: React.CSSProperties = {
    padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600,
    cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.04)', color: '#475569',
    transition: 'all 0.15s',
  }
  const pillActive: React.CSSProperties = {
    background: 'rgba(6,182,212,0.2)', borderColor: 'rgba(6,182,212,0.4)', color: '#67e8f9',
    boxShadow: '0 0 8px rgba(6,182,212,0.2)',
  }

  return (
    <div style={{
      borderRadius: 18, background: 'rgba(255,255,255,0.032)',
      border: '1px solid rgba(255,255,255,0.072)',
      backdropFilter: 'blur(18px)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.38)',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0891b2' }}>
          Student Roster
          <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 6, background: 'rgba(6,182,212,0.15)', color: '#67e8f9', fontSize: 9 }}>
            {filtered.length} / {students.length}
          </span>
        </p>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, role, skills…"
            style={{
              paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(6,182,212,0.18)', borderRadius: 10,
              color: '#f1f5f9', fontSize: 11, fontFamily: 'inherit',
              outline: 'none', width: 200,
            }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ padding: '10px 18px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {/* Branch */}
        {BRANCHES.map(b => (
          <button key={b} onClick={() => setBranch(b)}
            style={{ ...pillBase, ...(branch === b ? pillActive : {}) }}>
            {b === 'all' ? 'All Branches' : b}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)', margin: '0 4px', alignSelf: 'center' }} />
        {/* Status */}
        {(['all','placed','in-process','not-started'] as const).map(s => (
  <button
    key={s}
    onClick={() => setStatus(s)}
    className={`cl-pill ${status === s ? "active" : ""}`}
  >
    {s === 'all'
      ? 'All Status'
      : STATUS_CFG[s as PlacementStatus]?.label ?? s}
  </button>
))}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)', margin: '0 4px', alignSelf: 'center' }} />
        {/* Risk */}
        <button onClick={() => setRisk(risk === 'at-risk' ? 'all' : 'at-risk')}
          style={{ ...pillBase, ...(risk === 'at-risk' ? { background:'rgba(244,63,94,0.18)', borderColor:'rgba(244,63,94,0.4)', color:'#fda4af', boxShadow:'0 0 8px rgba(244,63,94,0.2)' } : {}) }}>
          ⚠ At Risk Only
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(6,182,212,0.04)', borderTop: '1px solid rgba(6,182,212,0.08)', borderBottom: '1px solid rgba(6,182,212,0.08)' }}>
              {[
                { label: 'Student',        key: 'name'             },
                { label: 'Branch',         key: null               },
                { label: 'Target Role',    key: null               },
                { label: 'Readiness',      key: 'readinessScore'   },
                { label: 'Roadmap',        key: 'roadmapProgress'  },
                { label: 'Streak',         key: 'streakDays'       },
                { label: 'Status',         key: null               },
                { label: '',               key: null               },
              ].map(col => (
                <th key={col.label}
                  onClick={() => col.key && toggleSort(col.key as SortKey)}
                  style={{
                    padding: '9px 12px', textAlign: 'left',
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#475569',
                    cursor: col.key ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                  }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.key && <SortIcon k={col.key as SortKey} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((s, i) => {
                const sc = STATUS_CFG[s.placementStatus]
                const rc = readinessColor(s.readinessScore)
                const rb = readinessBg(s.readinessScore)
                const isOpen = expanded === s.id

                return (
                  <React.Fragment key={s.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setExpanded(isOpen ? null : s.id)}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        background: isOpen ? 'rgba(6,182,212,0.04)' : s.isAtRisk ? 'rgba(244,63,94,0.03)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                      onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = s.isAtRisk ? 'rgba(244,63,94,0.03)' : 'transparent' }}
                    >
                      {/* Student name + avatar */}
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                            background: `linear-gradient(135deg, ${rc}30, ${rc}18)`,
                            border: `1px solid ${rc}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 800, color: rc,
                          }}>
                            {s.avatar}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <p style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{s.name}</p>
                              {s.isAtRisk && <AlertTriangle size={11} style={{ color: '#f43f5e' }} />}
                            </div>
                            <p style={{ fontSize: 9.5, color: '#475569' }}>{s.cosmosId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Branch */}
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: 5, fontSize: 9.5, fontWeight: 700,
                          background: 'rgba(6,182,212,0.1)', color: '#67e8f9',
                          border: '1px solid rgba(6,182,212,0.2)',
                        }}>
                          {s.branch}
                        </span>
                      </td>

                      {/* Target role */}
                      <td style={{ padding: '10px 12px' }}>
                        <p style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{s.targetRole}</p>
                      </td>

                      {/* Readiness */}
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 60, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${s.readinessScore}%`, background: rc, borderRadius: 999, boxShadow: `0 0 6px ${rc}` }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: rc, minWidth: 28 }}>{s.readinessScore}%</span>
                        </div>
                      </td>

                      {/* Roadmap */}
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 50, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${s.roadmapProgress}%`, background: '#6366f1', borderRadius: 999 }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 700 }}>{s.roadmapProgress}%</span>
                        </div>
                      </td>

                      {/* Streak */}
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: s.streakDays >= 30 ? '#f59e0b' : '#475569' }}>
                          {s.streakDays > 0 ? `🔥 ${s.streakDays}d` : '—'}
                        </span>
                      </td>

                      {/* Placement status */}
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '3px 9px', borderRadius: 6, fontSize: 9.5, fontWeight: 700,
                          background: sc.bg, color: sc.color,
                          border: `1px solid ${sc.color}28`,
                        }}>
                          <sc.icon size={10} />
                          {sc.label}
                        </span>
                      </td>

                      {/* Expand */}
                      <td style={{ padding: '10px 12px' }}>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={14} style={{ color: '#334155' }} />
                        </motion.div>
                      </td>
                    </motion.tr>

                    {/* Expanded row */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.tr key={`${s.id}-exp`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}>
                          <td colSpan={8} style={{ padding: '0 12px 12px 51px', background: 'rgba(6,182,212,0.03)' }}>
                            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingTop: 10 }}>
                              {/* Skills */}
                              <div>
                                <p style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Skills</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                  {s.skills.map(sk => (
                                    <span key={sk} style={{
                                      padding: '2px 8px', borderRadius: 5, fontSize: 9.5, fontWeight: 600,
                                      background: 'rgba(99,102,241,0.12)', color: '#a5b4fc',
                                      border: '1px solid rgba(99,102,241,0.2)',
                                    }}>{sk}</span>
                                  ))}
                                </div>
                              </div>
                              {/* Stats */}
                              {[
                                { l: 'Assessments Done', v: s.assessmentsDone },
                                { l: 'Resume Score',     v: `${s.resumeScore}%` },
                                { l: 'Last Active',      v: s.lastActive },
                                { l: 'Batch',            v: s.batch },
                              ].map(({ l, v }) => (
                                <div key={l}>
                                  <p style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{l}</p>
                                  <p style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{v}</p>
                                </div>
                              ))}
                              {/* View profile */}
                              <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
                                <button style={{
                                  display: 'flex', alignItems: 'center', gap: 5,
                                  padding: '6px 14px', borderRadius: 9,
                                  background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
                                  color: '#67e8f9', fontSize: 10.5, fontWeight: 700, cursor: 'pointer',
                                }}>
                                  <ExternalLink size={11} /> View Full Profile
                                </button>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                )
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px 0', textAlign: 'center', color: '#334155' }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>🔭</p>
                  <p style={{ fontSize: 12, fontWeight: 600 }}>No students match your filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

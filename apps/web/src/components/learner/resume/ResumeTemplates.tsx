'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

export type TemplateId = 'cosmos' | 'nova' | 'orbit' | 'pulsar'

interface Template {
  id:       TemplateId
  name:     string
  desc:     string
  color:    string
  accent:   string
  badge?:   string
  preview:  React.ReactNode
}

const TEMPLATES: Template[] = [
  {
    id:     'cosmos',
    name:   'Cosmos',
    desc:   'Clean dual-column with violet accents',
    color:  '#7c3aed',
    accent: '#a855f7',
    badge:  'Popular',
    preview: (
      <div style={{ padding: 10, fontFamily: 'system-ui' }}>
        <div style={{ height: 3, background: 'linear-gradient(to right,#7c3aed,#a855f7)', borderRadius: 2, marginBottom: 8 }} />
        <div style={{ height: 7, width: '65%', background: 'rgba(255,255,255,0.35)', borderRadius: 3, marginBottom: 4 }} />
        <div style={{ height: 5, width: '40%', background: 'rgba(168,85,247,0.5)', borderRadius: 2, marginBottom: 10 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 6 }}>
          <div>
            {[40, 50, 35, 45].map((w, i) => (
              <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,0.12)', borderRadius: 2, marginBottom: 4 }} />
            ))}
          </div>
          <div>
            {[80, 60, 70, 55, 75].map((w, i) => (
              <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,0.12)', borderRadius: 2, marginBottom: 4 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id:     'nova',
    name:   'Nova',
    desc:   'Bold header with cyan highlights',
    color:  '#06b6d4',
    accent: '#67e8f9',
    preview: (
      <div style={{ padding: 10 }}>
        <div style={{ height: 20, background: 'linear-gradient(135deg,#0e7490,#06b6d4)', borderRadius: 4, marginBottom: 8 }} />
        {[75, 55, 80, 50, 65].map((w, i) => (
          <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,0.12)', borderRadius: 2, marginBottom: 4 }} />
        ))}
      </div>
    ),
  },
  {
    id:     'orbit',
    name:   'Orbit',
    desc:   'Minimal single-column, ATS-friendly',
    color:  '#10b981',
    accent: '#6ee7b7',
    badge:  'ATS Best',
    preview: (
      <div style={{ padding: 10 }}>
        <div style={{ height: 5, width: '50%', background: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 6 }} />
        <div style={{ height: 2, background: 'rgba(16,185,129,0.5)', marginBottom: 8, borderRadius: 1 }} />
        {[90, 70, 80, 60, 75, 65].map((w, i) => (
          <div key={i} style={{ height: 3, width: `${w}%`, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 5 }} />
        ))}
      </div>
    ),
  },
  {
    id:     'pulsar',
    name:   'Pulsar',
    desc:   'Creative sidebar with gradient stripe',
    color:  '#f59e0b',
    accent: '#fde68a',
    preview: (
      <div style={{ padding: 10, display: 'flex', gap: 6 }}>
        <div style={{ width: 18, background: 'linear-gradient(to bottom,#f59e0b,#d97706)', borderRadius: 3 }} />
        <div style={{ flex: 1 }}>
          {[70, 50, 80, 60, 75, 55].map((w, i) => (
            <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,0.12)', borderRadius: 2, marginBottom: 5 }} />
          ))}
        </div>
      </div>
    ),
  },
]

interface ResumeTemplatesProps {
  selected:   TemplateId
  onSelect:   (id: TemplateId) => void
}

export default function ResumeTemplates({ selected, onSelect }: ResumeTemplatesProps) {
  return (
    <div className="rs-card rs-card--amber">
      <p className="rs-label">
        <Sparkles size={12} style={{ color: '#f59e0b' }} />
        Resume Templates
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {TEMPLATES.map(({ id, name, desc, color, accent, badge, preview }) => {
          const active = selected === id
          return (
            <motion.div
              key={id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(id)}
              style={{
                borderRadius: 13,
                border: `2px solid ${active ? color : 'rgba(255,255,255,0.07)'}`,
                background: active ? `${color}12` : 'rgba(255,255,255,0.025)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.18s, background 0.18s',
                boxShadow: active ? `0 0 16px ${color}35` : 'none',
              }}
            >
              {/* Preview thumbnail */}
              <div style={{
                height: 80, background: 'rgba(6,3,16,0.85)',
                borderRadius: '11px 11px 0 0', overflow: 'hidden',
              }}>
                {preview}
              </div>

              {/* Info */}
              <div style={{ padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: active ? accent : '#e2e8f0' }}>
                    {name}
                  </span>
                  {badge && (
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: '1px 5px',
                      borderRadius: 4, background: `${color}20`,
                      color: accent, border: `1px solid ${color}30`,
                    }}>
                      {badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 9, color: '#475569', lineHeight: 1.4 }}>{desc}</p>
              </div>

              {/* Active checkmark */}
              {active && (
                <div style={{
                  position: 'absolute', top: 7, right: 7,
                  width: 18, height: 18, borderRadius: '50%',
                  background: color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 8px ${color}`,
                }}>
                  <Check size={10} color="#fff" strokeWidth={3} />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

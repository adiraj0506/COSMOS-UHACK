'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

export type TemplateId = 'cosmos' | 'nova' | 'orbit' | 'pulsar'

export interface Template {
  id:      TemplateId
  name:    string
  desc:    string
  color:   string
  accent:  string
  badge?:  string
}

export const TEMPLATES: Template[] = [
  { id: 'cosmos', name: 'Cosmos',  desc: 'Dual-column · Violet accents',  color: '#7c3aed', accent: '#c4b5fd', badge: 'Popular'  },
  { id: 'nova',   name: 'Nova',    desc: 'Bold header · Cyan highlights',  color: '#06b6d4', accent: '#67e8f9'                     },
  { id: 'orbit',  name: 'Orbit',   desc: 'Minimal · ATS-friendly',         color: '#10b981', accent: '#6ee7b7', badge: 'ATS Best' },
  { id: 'pulsar', name: 'Pulsar',  desc: 'Creative sidebar · Amber stripe', color: '#f59e0b', accent: '#fde68a'                    },
]

// ── Thumbnail renderers ───────────────────────────────────────────────────────
function ThumbCosmos() {
  return (
    <div style={{ padding: 8 }}>
      <div style={{ height: 3, background: 'linear-gradient(to right,#7c3aed,#a855f7)', borderRadius: 2, marginBottom: 7 }} />
      <div style={{ height: 6, width: '58%', background: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 3 }} />
      <div style={{ height: 4, width: '36%', background: 'rgba(168,85,247,0.55)', borderRadius: 2, marginBottom: 9 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 5 }}>
        <div>{[40,52,34,44].map((w,i)=><div key={i} style={{height:3,width:`${w}%`,background:'rgba(255,255,255,0.1)',borderRadius:2,marginBottom:4}}/>)}</div>
        <div>{[80,60,72,55,68].map((w,i)=><div key={i} style={{height:3,width:`${w}%`,background:'rgba(255,255,255,0.1)',borderRadius:2,marginBottom:4}}/>)}</div>
      </div>
    </div>
  )
}

function ThumbNova() {
  return (
    <div style={{ padding: 8 }}>
      <div style={{ height: 24, background: 'linear-gradient(135deg,#0e7490,#06b6d4)', borderRadius: 4, marginBottom: 9 }} />
      {[76,55,82,50,66].map((w,i)=><div key={i} style={{height:3,width:`${w}%`,background:'rgba(255,255,255,0.1)',borderRadius:2,marginBottom:4}}/>)}
    </div>
  )
}

function ThumbOrbit() {
  return (
    <div style={{ padding: 8 }}>
      <div style={{ height: 5, width: '48%', background: 'rgba(255,255,255,0.28)', borderRadius: 2, marginBottom: 5 }} />
      <div style={{ height: 1.5, background: 'rgba(16,185,129,0.6)', marginBottom: 8, borderRadius: 1 }} />
      {[92,70,82,58,76,64].map((w,i)=><div key={i} style={{height:3,width:`${w}%`,background:'rgba(255,255,255,0.1)',borderRadius:2,marginBottom:4}}/>)}
    </div>
  )
}

function ThumbPulsar() {
  return (
    <div style={{ padding: 8, display: 'flex', gap: 6 }}>
      <div style={{ width: 16, background: 'linear-gradient(to bottom,#f59e0b,#d97706)', borderRadius: 3 }} />
      <div style={{ flex: 1 }}>
        {[68,50,80,60,74,54].map((w,i)=><div key={i} style={{height:3,width:`${w}%`,background:'rgba(255,255,255,0.1)',borderRadius:2,marginBottom:5}}/>)}
      </div>
    </div>
  )
}

const THUMBS: Record<TemplateId, React.ReactNode> = {
  cosmos: <ThumbCosmos />,
  nova:   <ThumbNova   />,
  orbit:  <ThumbOrbit  />,
  pulsar: <ThumbPulsar />,
}

interface TemplateSelectorProps {
  selected:  TemplateId
  onSelect:  (id: TemplateId) => void
}

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="rs-card rs-card--amber">
      <p className="rs-label">
        <Sparkles size={12} style={{ color: '#f59e0b' }} />
        Choose Template — AI will generate your resume in this style
      </p>
      <div className="rs-templates-grid">
        {TEMPLATES.map(({ id, name, desc, color, accent, badge }) => {
          const active = selected === id
          return (
            <motion.div
              key={id}
              className={`rs-template-card ${active ? 'active' : ''}`}
              style={{
                borderColor:  active ? color : 'rgba(255,255,255,0.07)',
                background:   active ? `${color}12` : 'rgba(255,255,255,0.025)',
                boxShadow:    active ? `0 0 18px ${color}35` : 'none',
              }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(id)}
            >
              <div className="rs-template-thumb">{THUMBS[id]}</div>
              <div className="rs-template-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="rs-template-name" style={{ color: active ? accent : '#e2e8f0' }}>{name}</span>
                  {badge && (
                    <span className="rs-template-badge" style={{ background: `${color}20`, color: accent, border: `1px solid ${color}30` }}>
                      {badge}
                    </span>
                  )}
                </div>
                <p className="rs-template-desc">{desc}</p>
              </div>
              {active && (
                <div className="rs-template-check" style={{ background: color, boxShadow: `0 0 8px ${color}` }}>
                  <Check size={11} color="#fff" strokeWidth={3} />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

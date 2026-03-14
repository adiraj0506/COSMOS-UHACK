'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink, Trophy, Zap } from 'lucide-react'
import {
  TYPE_COLOR, TYPE_LABEL, deadlineLabel, daysLeft,
} from './opportunities.types'
import type { Opportunity } from './opportunities.types'

interface OpportunityCardProps {
  opp:   Opportunity
  index: number
}

export default function OpportunityCard({ opp, index }: OpportunityCardProps) {
  const typeColor = TYPE_COLOR[opp.type]
  const dl        = daysLeft(opp.deadline)
  const isUrgent  = dl >= 0 && dl <= 7

  return (
    <motion.div
      className={`op-opp-card ${opp.featured ? 'featured' : ''}`}
      data-type={opp.type}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      {/* Header */}
      <div className="op-opp-header">
        <div className="op-opp-logo" style={{ background: opp.logoGrad, boxShadow: `0 0 14px ${typeColor}40` }}>
          {opp.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
            <p className="op-opp-title">{opp.title}</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              {opp.isNew && <span className="op-badge op-badge--new">NEW</span>}
            </div>
          </div>
          <p className="op-opp-company">{opp.company}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="op-opp-meta">
        <span className={`op-badge op-badge--${opp.type}`}>
          {TYPE_LABEL[opp.type]}
        </span>
        <span className={`op-badge op-badge--${opp.mode}`}>
          {opp.mode.charAt(0).toUpperCase() + opp.mode.slice(1)}
        </span>
        {opp.prize && (
          <span className="op-badge op-badge--prize">
            <Trophy size={9} /> {opp.prize}
          </span>
        )}
        {isUrgent && (
          <span className="op-badge op-badge--deadline">
            <Clock size={9} /> {deadlineLabel(opp.deadline)}
          </span>
        )}
      </div>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <MapPin size={11} style={{ color: '#475569', flexShrink: 0 }} />
        <span style={{ fontSize: 10.5, color: '#64748b' }}>{opp.location}</span>
      </div>

      {/* Description */}
      <p className="op-opp-desc">{opp.desc}</p>

      {/* Skill tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {opp.tags.map(tag => (
          <span key={tag} style={{
            padding: '2px 8px', borderRadius: 5, fontSize: 9.5, fontWeight: 600,
            background: `${typeColor}14`, color: typeColor,
            border: `1px solid ${typeColor}25`,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="op-opp-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="op-opp-time">Posted {opp.posted}</span>
          {!isUrgent && (
            <>
              <span style={{ color: '#334155' }}>·</span>
              <span className="op-opp-time">Closes {deadlineLabel(opp.deadline)}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* AI match score */}
          <div className="op-match-pill" style={{
            background: opp.match >= 80 ? 'rgba(16,185,129,0.12)' : 'rgba(124,58,237,0.12)',
            border: `1px solid ${opp.match >= 80 ? 'rgba(16,185,129,0.25)' : 'rgba(139,92,246,0.25)'}`,
            color: opp.match >= 80 ? '#6ee7b7' : '#c4b5fd',
          }}>
            <Zap size={10} />
            {opp.match}% match
          </div>
          {/* Apply button */}
          <button
            className="op-apply-btn"
            style={{ background: `linear-gradient(135deg, ${typeColor}, ${typeColor}cc)`, boxShadow: `0 0 12px ${typeColor}45` }}
            onClick={() => window.open(opp.applyUrl, '_blank')}
          >
            Apply <ExternalLink size={10} style={{ display: 'inline', marginLeft: 4 }} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

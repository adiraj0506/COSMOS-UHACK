'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Trophy, Zap, Star } from 'lucide-react'
import type { Opportunity } from './opportunities.types'
import { TYPE_COLOR, TYPE_LABEL, deadlineLabel } from './opportunities.types'

interface FeaturedBannerProps {
  opp: Opportunity
}

export default function FeaturedBanner({ opp }: FeaturedBannerProps) {
  const typeColor = TYPE_COLOR[opp.type]

  return (
    <motion.div
      className="op-featured-banner"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left: info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: typeColor, boxShadow: `0 0 8px ${typeColor}`,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: typeColor,
          }}>
            ✦ Featured {TYPE_LABEL[opp.type]}
          </span>
          <Star size={11} style={{ color: '#f59e0b' }} />
        </div>

        <h2 style={{
          fontSize: 17, fontWeight: 900, color: '#fff',
          marginBottom: 4, letterSpacing: '-0.01em', lineHeight: 1.3,
        }}>
          {opp.title}
        </h2>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>
          {opp.company} · {opp.location}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
          {opp.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: `${typeColor}20`, color: typeColor,
              border: `1px solid ${typeColor}35`,
            }}>
              {tag}
            </span>
          ))}
          {opp.prize && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700,
              background: 'rgba(16,185,129,0.15)', color: '#6ee7b7',
              border: '1px solid rgba(16,185,129,0.28)',
            }}>
              <Trophy size={10} /> {opp.prize}
            </span>
          )}
        </div>
      </div>

      {/* Right: match + CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
        {/* AI match */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 999,
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
        }}>
          <Zap size={12} style={{ color: '#10b981' }} />
          <span style={{ fontSize: 13, fontWeight: 900, color: '#6ee7b7' }}>{opp.match}%</span>
          <span style={{ fontSize: 10, color: '#475569' }}>match</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#475569' }}>
            Closes {deadlineLabel(opp.deadline)}
          </span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.open(opp.applyUrl, '_blank')}
            style={{
              padding: '10px 22px', borderRadius: 12,
              background: `linear-gradient(135deg, ${typeColor}, ${typeColor}cc)`,
              border: 'none', color: '#fff', fontSize: 12, fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: `0 0 20px ${typeColor}50`,
              letterSpacing: '0.04em',
            }}
          >
            Apply Now <ExternalLink size={12} />
          </motion.button>
        </div>
      </div>

      {/* Animated pulse glow */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </motion.div>
  )
}

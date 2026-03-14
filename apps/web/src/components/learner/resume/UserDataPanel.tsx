'use client'

import { motion } from 'framer-motion'
import { Database, CheckCircle2, Clock, User, Briefcase, GraduationCap, Code2, Award, RefreshCw } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DBProfile {
  name:         string
  role:         string
  email:        string
  phone:        string
  linkedin:     string
  github:       string
  summary:      string
  experience:   { title: string; company: string; period: string; desc: string }[]
  education:    { degree: string; school: string; period: string; grade: string  }[]
  skills:       string[]
  achievements: string[]
  projects:     { name: string; tech: string; desc: string }[]
  certifications: string[]
}

// ── Mock data (replace with GET /api/learner/profile) ─────────────────────────
// TODO backend teammate: GET /api/learner/profile → DBProfile
export const MOCK_DB_PROFILE: DBProfile = {
  name:     'Akash Sharma',
  role:     'Backend Developer',
  email:    'akash@example.com',
  phone:    '+91 98765 43210',
  linkedin: 'linkedin.com/in/akashsharma',
  github:   'github.com/akash-dev',
  summary:  'Passionate backend developer with experience building scalable REST APIs and distributed systems.',
  experience: [
    { title: 'Backend Developer Intern', company: 'StartupXYZ',    period: 'Jun 2024 – Present',  desc: 'Built REST APIs with Node.js, integrated PostgreSQL and Redis. Reduced latency by 40%.' },
    { title: 'Freelance Developer',      company: 'Self-employed',  period: 'Jan 2023 – May 2024', desc: 'Delivered 6 web projects for clients using Node.js, React, and MongoDB.' },
  ],
  education: [
    { degree: 'B.Tech Computer Science', school: 'IIT Bombay',   period: '2020 – 2024', grade: '8.2 CGPA' },
  ],
  skills:         ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'REST API', 'Docker', 'Git', 'System Design'],
  achievements:   ['Top 10% on LeetCode (1800+ rating)', 'Open source contributor — 3 merged PRs', 'HackIndia 2023 — Top 50 finalist'],
  projects: [
    { name: 'CosmosAPI', tech: 'Node.js, PostgreSQL, Redis', desc: 'Scalable REST API with rate limiting and caching.' },
    { name: 'DevConnect', tech: 'Next.js, MongoDB, WebSockets', desc: 'Real-time developer networking platform.' },
  ],
  certifications: ['AWS Certified Cloud Practitioner', 'Meta Backend Developer Certificate'],
}

// ── Data completeness calculator ──────────────────────────────────────────────
function calcCompleteness(p: DBProfile): number {
  let score = 0
  if (p.name)                    score += 10
  if (p.role)                    score += 5
  if (p.email)                   score += 5
  if (p.summary.length > 20)     score += 10
  if (p.experience.length >= 1)  score += 20
  if (p.education.length >= 1)   score += 15
  if (p.skills.length >= 5)      score += 15
  if (p.achievements.length >= 1)score += 10
  if (p.projects.length >= 1)    score += 10
  return Math.min(score, 100)
}

// ── Stat row ──────────────────────────────────────────────────────────────────
const DATA_SECTIONS = (p: DBProfile) => [
  { icon: '👤', label: 'Personal Info',   value: `${[p.name, p.email, p.phone].filter(Boolean).length}/3 fields`,     color: '#a855f7', complete: p.name && p.email },
  { icon: '💼', label: 'Experience',      value: `${p.experience.length} entr${p.experience.length !== 1 ? 'ies' : 'y'}`,  color: '#06b6d4', complete: p.experience.length > 0 },
  { icon: '🎓', label: 'Education',       value: `${p.education.length} entr${p.education.length !== 1 ? 'ies' : 'y'}`,    color: '#10b981', complete: p.education.length > 0 },
  { icon: '⚡', label: 'Skills',          value: `${p.skills.length} skills`,                                          color: '#f59e0b', complete: p.skills.length >= 3 },
  { icon: '🚀', label: 'Projects',        value: `${p.projects.length} project${p.projects.length !== 1 ? 's' : ''}`,  color: '#6366f1', complete: p.projects.length > 0 },
  { icon: '🏆', label: 'Achievements',    value: `${p.achievements.length} item${p.achievements.length !== 1 ? 's' : ''}`, color: '#ec4899', complete: p.achievements.length > 0 },
]

interface UserDataPanelProps {
  profile:    DBProfile
  loading:    boolean
  onRefresh:  () => void
}

export default function UserDataPanel({ profile, loading, onRefresh }: UserDataPanelProps) {
  const completeness = calcCompleteness(profile)
  const sections     = DATA_SECTIONS(profile)

  return (
    <div className="rs-card rs-card--indigo h-full">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p className="rs-label" style={{ marginBottom: 0 }}>
          <Database size={12} style={{ color: '#6366f1' }} />
          Your Profile Data
        </p>
        <button
          className="rs-btn rs-btn--secondary rs-btn--sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={11} style={{ animation: loading ? 'rs-spin 0.85s linear infinite' : 'none' }} />
          {loading ? 'Syncing…' : 'Sync DB'}
        </button>
      </div>

      {/* Completeness bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8' }}>Profile Completeness</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: completeness >= 80 ? '#10b981' : '#f59e0b' }}>
            {completeness}%
          </span>
        </div>
        <div className="rs-score-bar rs-score-bar--lg">
          <motion.div
            className="rs-score-bar__fill rs-score-bar__fill--grad"
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 1, ease: [0.22,1,0.36,1], delay: 0.2 }}
          />
        </div>
        {completeness < 80 && (
          <p style={{ fontSize: 9.5, color: '#475569', marginTop: 5 }}>
            Complete your COSMOS profile for a richer AI-generated resume.
          </p>
        )}
      </div>

      {/* Section rows */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {sections.map(({ icon, label, value, color, complete }, i) => (
          <motion.div
            key={label}
            className="rs-profile-stat"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
          >
            <span className="rs-profile-stat__icon">{icon}</span>
            <div style={{ flex: 1 }}>
              <p className="rs-profile-stat__label">{label}</p>
              <p className="rs-profile-stat__value">{value}</p>
            </div>
            {complete
              ? <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0 }} />
              : <Clock        size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
            }
          </motion.div>
        ))}

        {/* Skills preview */}
        {profile.skills.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 7 }}>
              Skills in DB
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {profile.skills.map(s => (
                <span key={s} style={{
                  padding: '3px 9px', borderRadius: 999, fontSize: 9.5,
                  fontWeight: 600, background: 'rgba(124,58,237,0.12)',
                  color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.22)',
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

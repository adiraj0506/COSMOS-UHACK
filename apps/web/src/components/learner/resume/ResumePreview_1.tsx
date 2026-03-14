'use client'

import { motion } from 'framer-motion'
import { Download, Copy, Eye } from 'lucide-react'
import type { DBProfile } from './UserDataPanel'
import type { TemplateId } from './TemplateSelector'

// ── Generated resume content (from AI) ───────────────────────────────────────
export interface GeneratedResume {
  name:         string
  role:         string
  email:        string
  phone:        string
  linkedin:     string
  github:       string
  summary:      string
  experience:   { title: string; company: string; period: string; bullets: string[] }[]
  education:    { degree: string; school: string; period: string; grade: string }[]
  skills:       string[]
  achievements: string[]
  projects:     { name: string; tech: string; desc: string }[]
}

interface ResumePreviewProps {
  resume:   GeneratedResume | null
  template: TemplateId
  loading:  boolean
  progress: number
  steps:    string[]
  activeStep: number
}

// ── Template colour maps ──────────────────────────────────────────────────────
const T_CONFIG: Record<TemplateId, {
  topbar:    string
  nameColor: string
  roleColor: string
  secColor:  string
  compColor: string
  chipBg:    string
  chipColor: string
  chipBorder:string
}> = {
  cosmos: {
    topbar:     'linear-gradient(to right,#7c3aed,#a855f7,#6366f1)',
    nameColor:  '#fff',
    roleColor:  '#a855f7',
    secColor:   '#a855f7',
    compColor:  '#c4b5fd',
    chipBg:     'rgba(124,58,237,0.15)',
    chipColor:  '#c4b5fd',
    chipBorder: 'rgba(139,92,246,0.25)',
  },
  nova: {
    topbar:     'linear-gradient(to right,#0e7490,#06b6d4)',
    nameColor:  '#fff',
    roleColor:  '#06b6d4',
    secColor:   '#06b6d4',
    compColor:  '#67e8f9',
    chipBg:     'rgba(6,182,212,0.12)',
    chipColor:  '#67e8f9',
    chipBorder: 'rgba(6,182,212,0.25)',
  },
  orbit: {
    topbar:     '#10b981',
    nameColor:  '#fff',
    roleColor:  '#10b981',
    secColor:   '#10b981',
    compColor:  '#6ee7b7',
    chipBg:     'rgba(16,185,129,0.12)',
    chipColor:  '#6ee7b7',
    chipBorder: 'rgba(16,185,129,0.25)',
  },
  pulsar: {
    topbar:     'linear-gradient(to right,#f59e0b,#d97706)',
    nameColor:  '#fff',
    roleColor:  '#f59e0b',
    secColor:   '#f59e0b',
    compColor:  '#fde68a',
    chipBg:     'rgba(245,158,11,0.12)',
    chipColor:  '#fde68a',
    chipBorder: 'rgba(245,158,11,0.25)',
  },
}

// ── Loading overlay ───────────────────────────────────────────────────────────
function GeneratingOverlay({ progress, steps, activeStep }: { progress: number; steps: string[]; activeStep: number }) {
  return (
    <div className="rs-gen-progress">
      <div className="rs-gen-spinner" />
      <div style={{ textAlign: 'center' }}>
        {steps.map((step, i) => (
          <motion.p
            key={step}
            className="rs-gen-step"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: i <= activeStep ? 1 : 0.25, y: 0 }}
            transition={{ delay: i * 0.3 }}
            style={{ fontWeight: i === activeStep ? 700 : 400, color: i === activeStep ? '#c4b5fd' : undefined }}
          >
            {i < activeStep  ? '✓ ' : i === activeStep ? '⚡ ' : '○ '}
            <span>{step}</span>
          </motion.p>
        ))}
      </div>
      <div className="rs-gen-bar-track">
        <div className="rs-gen-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p style={{ fontSize: 10, color: '#475569' }}>{progress}% complete</p>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: 0.3, gap: 10, padding: '40px 0',
    }}>
      <span style={{ fontSize: 40 }}>📄</span>
      <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', lineHeight: 1.6 }}>
        Select a template and click<br /><strong style={{ color: '#a855f7' }}>Generate Resume</strong><br />to build your AI resume
      </p>
    </div>
  )
}

// ── Main preview ──────────────────────────────────────────────────────────────
export default function ResumePreview({ resume, template, loading, progress, steps, activeStep }: ResumePreviewProps) {
  const tc = T_CONFIG[template]

  return (
    <div className="rs-card h-full flex flex-col overflow-hidden">

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
        <p className="rs-label" style={{ marginBottom: 0 }}>
          <Eye size={12} style={{ color: tc.roleColor }} />
          Live Preview
        </p>
        {resume && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="rs-btn rs-btn--secondary rs-btn--sm"><Copy size={11} /> Copy</button>
            <button className="rs-btn rs-btn--primary rs-btn--sm"><Download size={11} /> Export PDF</button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="rs-preview-wrap">
        {loading ? (
          <GeneratingOverlay progress={progress} steps={steps} activeStep={activeStep} />
        ) : !resume ? (
          <EmptyState />
        ) : (
          <motion.div
            className="rs-preview-paper"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top accent bar */}
            <div className="rs-preview-topbar" style={{ background: tc.topbar }} />

            {/* Name + role + contacts */}
            <p className="rs-preview-name"  style={{ color: tc.nameColor }}>{resume.name}</p>
            <p className="rs-preview-role"  style={{ color: tc.roleColor }}>{resume.role}</p>
            <div className="rs-preview-contacts">
              {resume.email    && <span>✉ {resume.email}</span>}
              {resume.phone    && <span>📱 {resume.phone}</span>}
              {resume.linkedin && <span>🔗 {resume.linkedin}</span>}
              {resume.github   && <span>⚡ {resume.github}</span>}
            </div>

            {/* Summary */}
            {resume.summary && (
              <>
                <div className="rs-preview-divider" />
                <p className="rs-preview-section-title" style={{ color: tc.secColor }}>Summary</p>
                <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7, fontFamily: 'system-ui' }}>{resume.summary}</p>
              </>
            )}

            {/* Experience */}
            {resume.experience.length > 0 && (
              <>
                <div className="rs-preview-divider" />
                <p className="rs-preview-section-title" style={{ color: tc.secColor }}>Experience</p>
                {resume.experience.map((exp, i) => (
                  <div key={i} className="rs-preview-item">
                    <div className="rs-preview-item-head">
                      <span className="rs-preview-item-title">{exp.title}</span>
                      <span className="rs-preview-item-period">{exp.period}</span>
                    </div>
                    <p className="rs-preview-item-company" style={{ color: tc.compColor }}>{exp.company}</p>
                    {exp.bullets.map((b, j) => (
                      <p key={j} className="rs-preview-item-desc" style={{ paddingLeft: 10 }}>• {b}</p>
                    ))}
                  </div>
                ))}
              </>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
              <>
                <div className="rs-preview-divider" />
                <p className="rs-preview-section-title" style={{ color: tc.secColor }}>Projects</p>
                {resume.projects.map((p, i) => (
                  <div key={i} className="rs-preview-item">
                    <div className="rs-preview-item-head">
                      <span className="rs-preview-item-title">{p.name}</span>
                      <span className="rs-preview-item-period" style={{ color: tc.compColor, fontSize: 9.5 }}>{p.tech}</span>
                    </div>
                    <p className="rs-preview-item-desc">{p.desc}</p>
                  </div>
                ))}
              </>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <>
                <div className="rs-preview-divider" />
                <p className="rs-preview-section-title" style={{ color: tc.secColor }}>Education</p>
                {resume.education.map((edu, i) => (
                  <div key={i} className="rs-preview-item">
                    <div className="rs-preview-item-head">
                      <span className="rs-preview-item-title">{edu.degree}</span>
                      <span className="rs-preview-item-period">{edu.period}</span>
                    </div>
                    <p className="rs-preview-item-company" style={{ color: tc.compColor }}>{edu.school}</p>
                    {edu.grade && <p style={{ fontSize: 10, color: '#10b981', fontFamily: 'system-ui' }}>{edu.grade}</p>}
                  </div>
                ))}
              </>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <>
                <div className="rs-preview-divider" />
                <p className="rs-preview-section-title" style={{ color: tc.secColor }}>Skills</p>
                <div className="rs-preview-skills-wrap">
                  {resume.skills.map(s => (
                    <span key={s} className="rs-preview-skill-chip"
                      style={{ background: tc.chipBg, color: tc.chipColor, border: `1px solid ${tc.chipBorder}` }}>
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Achievements */}
            {resume.achievements.length > 0 && (
              <>
                <div className="rs-preview-divider" />
                <p className="rs-preview-section-title" style={{ color: tc.secColor }}>Achievements</p>
                <ul style={{ paddingLeft: 14, margin: 0 }}>
                  {resume.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7, fontFamily: 'system-ui' }}>{a}</li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

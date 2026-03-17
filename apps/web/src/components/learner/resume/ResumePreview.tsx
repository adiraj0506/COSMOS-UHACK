'use client'

import { motion } from 'framer-motion'
import { Download, Copy, Eye } from 'lucide-react'
import type { TemplateId } from './TemplateSelector'

// ── Generated resume content ──────────────────────────────────────────────────
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
  resume:     GeneratedResume | null
  template:   TemplateId
  loading:    boolean
  progress:   number
  steps:      string[]
  activeStep: number
  /** Forwarded ref attached to the rendered resume DOM node — used by the PDF exporter */
  resumeRef?: React.RefObject<HTMLDivElement | null>
}

// ── Loading overlay ───────────────────────────────────────────────────────────
function GeneratingOverlay({
  progress, steps, activeStep,
}: {
  progress: number; steps: string[]; activeStep: number
}) {
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
            style={{
              fontWeight: i === activeStep ? 700 : 400,
              color: i === activeStep ? '#c4b5fd' : undefined,
            }}
          >
            {i < activeStep ? '✓ ' : i === activeStep ? '⚡ ' : '○ '}
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
        Select a template and click<br />
        <strong style={{ color: '#a855f7' }}>Generate Resume</strong><br />
        to build your AI resume
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE: COSMOS  (dual-column · violet)
// ═══════════════════════════════════════════════════════════════
function TemplateCosmos({ r }: { r: GeneratedResume }) {
  const accent   = '#7c3aed'
  const accentLt = '#c4b5fd'
  const border   = 'rgba(139,92,246,0.18)'

  return (
    <div style={{
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      background: '#0f0a1e',
      borderRadius: 6,
      overflow: 'hidden',
      border: `1px solid ${border}`,
    }}>
      {/* Top gradient bar */}
      <div style={{ height: 4, background: 'linear-gradient(to right,#7c3aed,#a855f7,#6366f1)' }} />

      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        background: 'linear-gradient(135deg,rgba(124,58,237,0.22),rgba(99,102,241,0.1))',
        borderBottom: `1px solid ${border}`,
      }}>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>{r.name}</p>
        <p style={{ margin: '3px 0 8px', fontSize: 12, color: accentLt, fontWeight: 600 }}>{r.role}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
          {[r.email, r.phone, r.linkedin, r.github].filter(Boolean).map(c => (
            <span key={c} style={{ fontSize: 9.5, color: '#94a3b8' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Body: two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', minHeight: 320 }}>

        {/* Left sidebar */}
        <div style={{ padding: '14px 12px', borderRight: `1px solid ${border}`, background: 'rgba(124,58,237,0.05)' }}>

          {/* Skills */}
          {r.skills.length > 0 && (
            <section style={{ marginBottom: 14 }}>
              <SectionTitle label="Skills" color={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {r.skills.map(s => (
                  <span key={s} style={{
                    fontSize: 9.5, padding: '3px 8px', borderRadius: 20,
                    background: 'rgba(124,58,237,0.14)',
                    border: `1px solid rgba(139,92,246,0.22)`,
                    color: accentLt,
                  }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {r.education.length > 0 && (
            <section style={{ marginBottom: 14 }}>
              <SectionTitle label="Education" color={accent} />
              {r.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{e.degree}</p>
                  <p style={{ margin: '1px 0', fontSize: 9.5, color: accentLt }}>{e.school}</p>
                  <p style={{ margin: 0, fontSize: 9, color: '#64748b' }}>{e.period}</p>
                  {e.grade && <p style={{ margin: '1px 0', fontSize: 9, color: '#10b981' }}>{e.grade}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Achievements */}
          {r.achievements.length > 0 && (
            <section>
              <SectionTitle label="Highlights" color={accent} />
              {r.achievements.map((a, i) => (
                <p key={i} style={{ margin: '0 0 4px', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.5 }}>
                  ◆ {a}
                </p>
              ))}
            </section>
          )}
        </div>

        {/* Right main */}
        <div style={{ padding: '14px 16px' }}>

          {/* Summary */}
          {r.summary && (
            <section style={{ marginBottom: 14 }}>
              <SectionTitle label="Summary" color={accent} />
              <p style={{ margin: 0, fontSize: 10.5, color: '#94a3b8', lineHeight: 1.7 }}>{r.summary}</p>
            </section>
          )}

          {/* Experience */}
          {r.experience.length > 0 && (
            <section style={{ marginBottom: 14 }}>
              <SectionTitle label="Experience" color={accent} />
              {r.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{e.title}</p>
                    <p style={{ margin: 0, fontSize: 9, color: '#475569' }}>{e.period}</p>
                  </div>
                  <p style={{ margin: '1px 0 4px', fontSize: 9.5, color: accentLt }}>{e.company}</p>
                  {e.bullets.map((b, j) => (
                    <p key={j} style={{ margin: '0 0 2px', fontSize: 9.5, color: '#94a3b8', paddingLeft: 10, lineHeight: 1.5 }}>• {b}</p>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {r.projects.length > 0 && (
            <section>
              <SectionTitle label="Projects" color={accent} />
              {r.projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: '#e2e8f0' }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: 9, color: accentLt }}>{p.tech}</p>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE: NOVA  (bold full-width cyan header)
// ═══════════════════════════════════════════════════════════════
function TemplateNova({ r }: { r: GeneratedResume }) {
  const accent   = '#06b6d4'
  const accentLt = '#67e8f9'
  const border   = 'rgba(6,182,212,0.15)'

  return (
    <div style={{
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      background: '#070e14',
      borderRadius: 6,
      overflow: 'hidden',
      border: `1px solid ${border}`,
    }}>
      {/* Bold header block */}
      <div style={{
        background: 'linear-gradient(135deg,#0e7490 0%,#06b6d4 60%,#0891b2 100%)',
        padding: '22px 22px 18px',
      }}>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{r.name}</p>
        <p style={{ margin: '4px 0 10px', fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{r.role}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
          {[r.email, r.phone, r.linkedin, r.github].filter(Boolean).map(c => (
            <span key={c} style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.7)' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Skills strip */}
      {r.skills.length > 0 && (
        <div style={{
          padding: '8px 20px',
          background: 'rgba(6,182,212,0.08)',
          borderBottom: `1px solid ${border}`,
          display: 'flex', flexWrap: 'wrap', gap: 5,
        }}>
          {r.skills.map(s => (
            <span key={s} style={{
              fontSize: 9, padding: '2px 8px', borderRadius: 20,
              background: 'rgba(6,182,212,0.12)',
              border: `1px solid rgba(6,182,212,0.22)`,
              color: accentLt,
            }}>{s}</span>
          ))}
        </div>
      )}

      {/* Body — single column */}
      <div style={{ padding: '16px 22px' }}>

        {r.summary && (
          <section style={{ marginBottom: 14 }}>
            <SectionTitle label="About" color={accent} style={{ borderBottomColor: accent }} />
            <p style={{ margin: 0, fontSize: 10.5, color: '#94a3b8', lineHeight: 1.7 }}>{r.summary}</p>
          </section>
        )}

        {r.experience.length > 0 && (
          <section style={{ marginBottom: 14 }}>
            <SectionTitle label="Work Experience" color={accent} />
            {r.experience.map((e, i) => (
              <div key={i} style={{
                marginBottom: 10, paddingLeft: 10,
                borderLeft: `2px solid ${accent}40`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{e.title}</p>
                  <p style={{ margin: 0, fontSize: 9, color: '#475569' }}>{e.period}</p>
                </div>
                <p style={{ margin: '1px 0 4px', fontSize: 9.5, color: accentLt }}>{e.company}</p>
                {e.bullets.map((b, j) => (
                  <p key={j} style={{ margin: '0 0 2px', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.5 }}>› {b}</p>
                ))}
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {r.education.length > 0 && (
            <section>
              <SectionTitle label="Education" color={accent} />
              {r.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{e.degree}</p>
                  <p style={{ margin: '1px 0', fontSize: 9.5, color: accentLt }}>{e.school}</p>
                  <p style={{ margin: 0, fontSize: 9, color: '#475569' }}>{e.period}</p>
                </div>
              ))}
            </section>
          )}

          {r.achievements.length > 0 && (
            <section>
              <SectionTitle label="Achievements" color={accent} />
              {r.achievements.map((a, i) => (
                <p key={i} style={{ margin: '0 0 4px', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.5 }}>
                  ▸ {a}
                </p>
              ))}
            </section>
          )}
        </div>

        {r.projects.length > 0 && (
          <section style={{ marginTop: 14 }}>
            <SectionTitle label="Projects" color={accent} />
            {r.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: '#e2e8f0' }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 9, color: accentLt }}>{p.tech}</p>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE: ORBIT  (minimal · clean · ATS-friendly)
// ═══════════════════════════════════════════════════════════════
function TemplateOrbit({ r }: { r: GeneratedResume }) {
  const accent   = '#10b981'
  const accentLt = '#6ee7b7'
  const border   = 'rgba(16,185,129,0.15)'

  return (
    <div style={{
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      background: '#080f0c',
      borderRadius: 6,
      overflow: 'hidden',
      border: `1px solid ${border}`,
      padding: '20px 24px',
    }}>
      {/* Minimal header */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 21, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>{r.name}</p>
        <p style={{ margin: '2px 0 6px', fontSize: 11.5, color: accent, fontWeight: 600 }}>{r.role}</p>
        {/* Green rule */}
        <div style={{ height: 1.5, background: `linear-gradient(to right, ${accent}, transparent)`, margin: '6px 0' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px' }}>
          {[r.email, r.phone, r.linkedin, r.github].filter(Boolean).map(c => (
            <span key={c} style={{ fontSize: 9.5, color: '#64748b' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {r.summary && (
        <section style={{ marginBottom: 12 }}>
          <OrbitSectionTitle label="Professional Summary" color={accent} />
          <p style={{ margin: 0, fontSize: 10.5, color: '#94a3b8', lineHeight: 1.75 }}>{r.summary}</p>
        </section>
      )}

      {/* Experience */}
      {r.experience.length > 0 && (
        <section style={{ marginBottom: 12 }}>
          <OrbitSectionTitle label="Experience" color={accent} />
          {r.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>{e.title}</p>
                <p style={{ margin: 0, fontSize: 9, color: '#475569', whiteSpace: 'nowrap' }}>{e.period}</p>
              </div>
              <p style={{ margin: '1px 0 4px', fontSize: 9.5, color: accentLt, fontWeight: 500 }}>{e.company}</p>
              {e.bullets.map((b, j) => (
                <p key={j} style={{ margin: '0 0 2px', fontSize: 9.5, color: '#94a3b8', paddingLeft: 12, lineHeight: 1.55 }}>• {b}</p>
              ))}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {r.skills.length > 0 && (
        <section style={{ marginBottom: 12 }}>
          <OrbitSectionTitle label="Technical Skills" color={accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {r.skills.map(s => (
              <span key={s} style={{
                fontSize: 9.5, padding: '2px 8px', borderRadius: 3,
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.2)',
                color: accentLt,
              }}>{s}</span>
            ))}
          </div>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Education */}
        {r.education.length > 0 && (
          <section>
            <OrbitSectionTitle label="Education" color={accent} />
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{e.degree}</p>
                <p style={{ margin: '1px 0', fontSize: 9.5, color: accentLt }}>{e.school}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0, fontSize: 9, color: '#475569' }}>{e.period}</p>
                  {e.grade && <p style={{ margin: 0, fontSize: 9, color: '#10b981' }}>{e.grade}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {r.projects.length > 0 && (
          <section>
            <OrbitSectionTitle label="Projects" color={accent} />
            {r.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{p.name}</p>
                <p style={{ margin: '1px 0', fontSize: 9, color: accentLt }}>{p.tech}</p>
                <p style={{ margin: 0, fontSize: 9, color: '#64748b', lineHeight: 1.4 }}>{p.desc}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Achievements */}
      {r.achievements.length > 0 && (
        <section style={{ marginTop: 12 }}>
          <OrbitSectionTitle label="Achievements" color={accent} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' }}>
            {r.achievements.map((a, i) => (
              <p key={i} style={{ margin: '0 0 3px', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.5 }}>
                ✓ {a}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE: PULSAR  (creative sidebar · amber stripe)
// ═══════════════════════════════════════════════════════════════
function TemplatePulsar({ r }: { r: GeneratedResume }) {
  const accent   = '#f59e0b'
  const accentLt = '#fde68a'
  const border   = 'rgba(245,158,11,0.15)'

  return (
    <div style={{
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      background: '#0e0b04',
      borderRadius: 6,
      overflow: 'hidden',
      border: `1px solid ${border}`,
      display: 'grid',
      gridTemplateColumns: '80px 1fr',
      minHeight: 420,
    }}>
      {/* Amber left sidebar */}
      <div style={{
        background: 'linear-gradient(to bottom,#f59e0b,#d97706)',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Initials circle */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 900, color: '#fff',
        }}>
          {r.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </div>

        {/* Vertical label */}
        <p style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          fontSize: 8, fontWeight: 800,
          color: 'rgba(0,0,0,0.4)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>{r.role}</p>

        {/* Dot decorations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 'auto', paddingBottom: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: `rgba(0,0,0,${0.15 + i * 0.05})`,
            }} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '18px 18px 18px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>{r.name}</p>
          <p style={{ margin: '3px 0 6px', fontSize: 10.5, color: accent, fontWeight: 600 }}>{r.role}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
            {[r.email, r.phone, r.linkedin, r.github].filter(Boolean).map(c => (
              <span key={c} style={{ fontSize: 9, color: '#64748b' }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Summary */}
        {r.summary && (
          <section style={{ marginBottom: 12 }}>
            <PulsarSectionTitle label="Profile" color={accent} />
            <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', lineHeight: 1.7 }}>{r.summary}</p>
          </section>
        )}

        {/* Experience */}
        {r.experience.length > 0 && (
          <section style={{ marginBottom: 12 }}>
            <PulsarSectionTitle label="Experience" color={accent} />
            {r.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: '#f1f5f9' }}>{e.title}</p>
                  <p style={{ margin: 0, fontSize: 9, color: '#475569' }}>{e.period}</p>
                </div>
                <p style={{ margin: '1px 0 3px', fontSize: 9.5, color: accentLt }}>{e.company}</p>
                {e.bullets.map((b, j) => (
                  <p key={j} style={{ margin: '0 0 2px', fontSize: 9, color: '#94a3b8', paddingLeft: 10, lineHeight: 1.5 }}>◦ {b}</p>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {r.skills.length > 0 && (
          <section style={{ marginBottom: 12 }}>
            <PulsarSectionTitle label="Skills" color={accent} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {r.skills.map(s => (
                <span key={s} style={{
                  fontSize: 9, padding: '2px 7px', borderRadius: 3,
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.22)',
                  color: accentLt,
                }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Education */}
          {r.education.length > 0 && (
            <section>
              <PulsarSectionTitle label="Education" color={accent} />
              {r.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, color: '#e2e8f0' }}>{e.degree}</p>
                  <p style={{ margin: '1px 0', fontSize: 9, color: accentLt }}>{e.school}</p>
                  <p style={{ margin: 0, fontSize: 8.5, color: '#475569' }}>{e.period}</p>
                </div>
              ))}
            </section>
          )}

          {/* Achievements */}
          {r.achievements.length > 0 && (
            <section>
              <PulsarSectionTitle label="Achievements" color={accent} />
              {r.achievements.map((a, i) => (
                <p key={i} style={{ margin: '0 0 3px', fontSize: 9, color: '#94a3b8', lineHeight: 1.5 }}>
                  ★ {a}
                </p>
              ))}
            </section>
          )}
        </div>

        {/* Projects */}
        {r.projects.length > 0 && (
          <section style={{ marginTop: 10 }}>
            <PulsarSectionTitle label="Projects" color={accent} />
            {r.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 8.5, color: accentLt }}>{p.tech}</p>
                </div>
                <p style={{ margin: '1px 0 0', fontSize: 9, color: '#64748b', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

// ── Shared section title helpers ──────────────────────────────────────────────
function SectionTitle({ label, color, style: extraStyle }: { label: string; color: string; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, ...extraStyle }}>
      <p style={{ margin: 0, fontSize: 9.5, fontWeight: 800, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </p>
      <div style={{ flex: 1, height: 1, background: `${color}28` }} />
    </div>
  )
}

function OrbitSectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
      <div style={{ width: 3, height: 12, background: color, borderRadius: 2, flexShrink: 0 }} />
      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{label}</p>
      <div style={{ flex: 1, height: '0.5px', background: `${color}20` }} />
    </div>
  )
}

function PulsarSectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </p>
      <div style={{ height: 1, background: `${color}25`, marginTop: 3 }} />
    </div>
  )
}

// ── Template dispatcher ───────────────────────────────────────────────────────
function ResumeDocument({ resume, template }: { resume: GeneratedResume; template: TemplateId }) {
  switch (template) {
    case 'cosmos': return <TemplateCosmos r={resume} />
    case 'nova':   return <TemplateNova   r={resume} />
    case 'orbit':  return <TemplateOrbit  r={resume} />
    case 'pulsar': return <TemplatePulsar r={resume} />
  }
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ResumePreview({
  resume, template, loading, progress, steps, activeStep, resumeRef,
}: ResumePreviewProps) {

  // Accent colour for the header "Live Preview" label driven by active template
  const accentMap: Record<TemplateId, string> = {
    cosmos: '#a855f7',
    nova:   '#06b6d4',
    orbit:  '#10b981',
    pulsar: '#f59e0b',
  }
  const accent = accentMap[template]

  return (
    <div className="rs-card h-full flex flex-col overflow-hidden">

      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
        <p className="rs-label" style={{ marginBottom: 0 }}>
          <Eye size={12} style={{ color: accent }} />
          Live Preview
          <span style={{
            marginLeft: 6, fontSize: 9, padding: '1px 7px', borderRadius: 20,
            background: `${accent}15`, color: accent,
            border: `1px solid ${accent}25`, fontWeight: 700,
            textTransform: 'capitalize',
          }}>{template}</span>
        </p>
        {resume && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="rs-btn rs-btn--secondary rs-btn--sm"><Copy size={11} /> Copy</button>
            <button className="rs-btn rs-btn--primary rs-btn--sm"><Download size={11} /> Export PDF</button>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="rs-preview-wrap">
        {loading ? (
          <GeneratingOverlay progress={progress} steps={steps} activeStep={activeStep} />
        ) : !resume ? (
          <EmptyState />
        ) : (
          <motion.div
            key={template}                   /* re-animate on template switch */
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* resumeRef captures this node for html2canvas PDF export */}
            <div ref={resumeRef}>
              <ResumeDocument resume={resume} template={template} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

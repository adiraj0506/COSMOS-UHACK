'use client'

import { motion } from 'framer-motion'
import { Download, Eye } from 'lucide-react'
import type { ResumeData } from './ResumeEditor'

interface ResumePreviewProps {
  data: ResumeData
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const hasData = data.name || data.summary || data.experience.length > 0

  return (
    <div className="rs-card h-full flex flex-col">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p className="rs-label" style={{ marginBottom: 0 }}>
          <Eye size={12} style={{ color: '#06b6d4' }} />
          Live Preview
        </p>
        <button className="rs-btn rs-btn--cyan rs-btn--sm">
          <Download size={11} /> Export PDF
        </button>
      </div>

      <div className="rs-preview flex-1 overflow-y-auto">
        {!hasData ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', opacity: 0.3,
          }}>
            <span style={{ fontSize: 32, marginBottom: 10 }}>📄</span>
            <p style={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>
              Start filling in the editor<br />to see your resume take shape
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            {data.name && <p className="rs-preview__name">{data.name}</p>}
            {data.role && <p className="rs-preview__role">{data.role}</p>}
            {(data.email || data.phone || data.linkedin || data.github) && (
              <div className="rs-preview__contact">
                {data.email    && <span>✉ {data.email}</span>}
                {data.phone    && <span>📱 {data.phone}</span>}
                {data.linkedin && <span>🔗 {data.linkedin}</span>}
                {data.github   && <span>⚡ {data.github}</span>}
              </div>
            )}

            {/* Summary */}
            {data.summary && (
              <>
                <div className="rs-preview__divider" />
                <p className="rs-preview__section-title">Summary</p>
                <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>{data.summary}</p>
              </>
            )}

            {/* Experience */}
            {data.experience.filter(e => e.title || e.company).length > 0 && (
              <>
                <div className="rs-preview__divider" />
                <p className="rs-preview__section-title">Experience</p>
                {data.experience.filter(e => e.title || e.company).map(exp => (
                  <div key={exp.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p className="rs-preview__item-title">{exp.title}</p>
                        {exp.company && <p className="rs-preview__item-company">{exp.company}</p>}
                      </div>
                      {exp.period && <span className="rs-preview__item-period">{exp.period}</span>}
                    </div>
                    {exp.desc && <p className="rs-preview__item-desc">{exp.desc}</p>}
                  </div>
                ))}
              </>
            )}

            {/* Education */}
            {data.education.filter(e => e.degree || e.school).length > 0 && (
              <>
                <div className="rs-preview__divider" />
                <p className="rs-preview__section-title">Education</p>
                {data.education.filter(e => e.degree || e.school).map(edu => (
                  <div key={edu.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p className="rs-preview__item-title">{edu.degree}</p>
                        {edu.school && <p className="rs-preview__item-company">{edu.school}</p>}
                        {edu.grade  && <p style={{ fontSize: 10, color: '#10b981', fontFamily: 'system-ui' }}>{edu.grade}</p>}
                      </div>
                      {edu.period && <span className="rs-preview__item-period">{edu.period}</span>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <>
                <div className="rs-preview__divider" />
                <p className="rs-preview__section-title">Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {data.skills.map(skill => (
                    <span key={skill} style={{
                      padding: '2px 8px', borderRadius: 5,
                      fontSize: 10, fontFamily: 'system-ui',
                      background: 'rgba(124,58,237,0.15)',
                      color: '#c4b5fd',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Achievements */}
            {data.achievements.filter(Boolean).length > 0 && (
              <>
                <div className="rs-preview__divider" />
                <p className="rs-preview__section-title">Achievements</p>
                <ul style={{ paddingLeft: 14, margin: 0 }}>
                  {data.achievements.filter(Boolean).map((ach, i) => (
                    <li key={i} style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7, fontFamily: 'system-ui' }}>
                      {ach}
                    </li>
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

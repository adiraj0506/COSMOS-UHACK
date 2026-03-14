'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  ChevronDown,
  Plus,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react'

/* ───────────────── TYPES ───────────────── */

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  desc: string
}

export interface Education {
  id: string
  degree: string
  school: string
  period: string
  grade: string
}

export interface ResumeData {
  name: string
  role: string
  email: string
  phone: string
  linkedin: string
  github: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  achievements: string[]
}

interface ResumeEditorProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

/* ───────────────── SECTION WRAPPER ───────────────── */

function Section({
  icon: Icon,
  title,
  badge,
  color,
  children,
}: {
  icon: React.ElementType
  title: string
  badge?: number
  color: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-3">
      <div className="rs-accordion-header" onClick={() => setOpen(!open)}>
        <div className="rs-accordion-header__title">
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: `${color}18`,
              border: `1px solid ${color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={13} style={{ color }} />
          </div>

          {title}

          {badge !== undefined && (
            <span className="rs-accordion-header__badge">{badge}</span>
          )}
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={14} style={{ color: '#475569' }} />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: 4 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────── MAIN EDITOR ───────────────── */

export default function ResumeEditor({ data, onChange }: ResumeEditorProps) {
  function updateField<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    onChange({ ...data, [key]: value })
  }

  /* ───── EXPERIENCE ───── */

  function addExp() {
    updateField('experience', [
      ...data.experience,
      {
        id: crypto.randomUUID(),
        title: '',
        company: '',
        period: '',
        desc: '',
      },
    ])
  }

  function updateExp(id: string, field: keyof Experience, value: string) {
    updateField(
      'experience',
      data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    )
  }

  function removeExp(id: string) {
    updateField(
      'experience',
      data.experience.filter((exp) => exp.id !== id)
    )
  }

  /* ───── EDUCATION ───── */

  function addEdu() {
    updateField('education', [
      ...data.education,
      {
        id: crypto.randomUUID(),
        degree: '',
        school: '',
        period: '',
        grade: '',
      },
    ])
  }

  function updateEdu(id: string, field: keyof Education, value: string) {
    updateField(
      'education',
      data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    )
  }

  function removeEdu(id: string) {
    updateField(
      'education',
      data.education.filter((edu) => edu.id !== id)
    )
  }

  /* ───── SKILLS ───── */

  function addSkill(skill: string) {
    if (!skill || data.skills.includes(skill)) return
    updateField('skills', [...data.skills, skill])
  }

  function removeSkill(skill: string) {
    updateField(
      'skills',
      data.skills.filter((s) => s !== skill)
    )
  }

  /* ───────────────── UI ───────────────── */

  return (
    <div className="rs-card rs-card--violet h-full overflow-y-auto">

      <p className="rs-label mb-4 flex items-center gap-2">
        <User size={12} style={{ color: '#a855f7' }} />
        Resume Editor
      </p>

      {/* PERSONAL INFO */}

      <Section icon={User} title="Personal Info" color="#a855f7">
        <div className="grid grid-cols-2 gap-2">

          {[
            { key: 'name', label: 'Full Name', ph: 'Akash Mishra' },
            { key: 'role', label: 'Job Title', ph: 'Frontend Developer' },
            { key: 'email', label: 'Email', ph: 'akash@example.com' },
            { key: 'phone', label: 'Phone', ph: '+91 XXXXX XXXXX' },
          ].map(({ key, label, ph }) => (
            <div key={key} className="rs-field">
              <label className="rs-field__label">{label}</label>

              <input
                className="rs-input"
                placeholder={ph}
                value={data[key as keyof ResumeData] as string}
                onChange={(e) =>
                  updateField(
                    key as keyof ResumeData,
                    e.target.value as any
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* SUMMARY */}

        <div className="rs-field mt-3">
          <label className="rs-field__label">Professional Summary</label>

          <textarea
            className="rs-input rs-textarea"
            rows={3}
            placeholder="Short introduction about your career"
            value={data.summary}
            onChange={(e) => updateField('summary', e.target.value)}
          />
        </div>
      </Section>

      {/* EXPERIENCE */}

      <Section
        icon={Briefcase}
        title="Experience"
        badge={data.experience.length}
        color="#06b6d4"
      >
        {data.experience.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rs-exp-card"
          >
            <div className="flex justify-between mb-2">

              <span className="text-xs font-bold text-cyan-500">
                #{i + 1}
              </span>

              <button onClick={() => removeExp(exp.id)}>
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">

              <input
                className="rs-input"
                placeholder="Role"
                value={exp.title}
                onChange={(e) =>
                  updateExp(exp.id, 'title', e.target.value)
                }
              />

              <input
                className="rs-input"
                placeholder="Company"
                value={exp.company}
                onChange={(e) =>
                  updateExp(exp.id, 'company', e.target.value)
                }
              />

              <input
                className="rs-input"
                placeholder="Duration"
                value={exp.period}
                onChange={(e) =>
                  updateExp(exp.id, 'period', e.target.value)
                }
              />
            </div>

            <textarea
              className="rs-input rs-textarea mt-2"
              rows={2}
              placeholder="Achievements..."
              value={exp.desc}
              onChange={(e) =>
                updateExp(exp.id, 'desc', e.target.value)
              }
            />
          </motion.div>
        ))}

        <button className="rs-btn rs-btn--secondary w-full mt-2" onClick={addExp}>
          <Plus size={14} /> Add Experience
        </button>
      </Section>

      {/* EDUCATION */}

      <Section
        icon={GraduationCap}
        title="Education"
        badge={data.education.length}
        color="#10b981"
      >
        {data.education.map((edu, i) => (
          <div key={edu.id} className="rs-exp-card">

            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-emerald-500">
                #{i + 1}
              </span>

              <button onClick={() => removeEdu(edu.id)}>
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">

              <input
                className="rs-input"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateEdu(edu.id, 'degree', e.target.value)
                }
              />

              <input
                className="rs-input"
                placeholder="Institute"
                value={edu.school}
                onChange={(e) =>
                  updateEdu(edu.id, 'school', e.target.value)
                }
              />

              <input
                className="rs-input"
                placeholder="Duration"
                value={edu.period}
                onChange={(e) =>
                  updateEdu(edu.id, 'period', e.target.value)
                }
              />

              <input
                className="rs-input"
                placeholder="CGPA / Percentage"
                value={edu.grade}
                onChange={(e) =>
                  updateEdu(edu.id, 'grade', e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <button className="rs-btn rs-btn--secondary w-full mt-2" onClick={addEdu}>
          <Plus size={14} /> Add Education
        </button>
      </Section>

      {/* SKILLS */}

      <Section icon={Code2} title="Skills" badge={data.skills.length} color="#a855f7">
        <div className="rs-tags">

          {data.skills.map((skill) => (
            <span
              key={skill}
              className="rs-tag rs-tag--violet"
              onClick={() => removeSkill(skill)}
            >
              {skill} ×
            </span>
          ))}

          <SkillInput onAdd={addSkill} />
        </div>
      </Section>

      {/* ACHIEVEMENTS */}

      <Section icon={Award} title="Achievements" color="#f59e0b">
        {data.achievements.map((ach, i) => (
          <div key={i} className="flex gap-2 mb-2">

            <input
              className="rs-input flex-1"
              value={ach}
              placeholder="Achievement"
              onChange={(e) => {
                const updated = [...data.achievements]
                updated[i] = e.target.value
                updateField('achievements', updated)
              }}
            />

            <button
              onClick={() =>
                updateField(
                  'achievements',
                  data.achievements.filter((_, j) => j !== i)
                )
              }
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button
          className="rs-btn rs-btn--secondary w-full"
          onClick={() =>
            updateField('achievements', [...data.achievements, ''])
          }
        >
          <Plus size={14} /> Add Achievement
        </button>
      </Section>
    </div>
  )
}

/* ───────────────── SKILL INPUT ───────────────── */

function SkillInput({ onAdd }: { onAdd: (skill: string) => void }) {
  const [value, setValue] = useState('')

  function submit() {
    const skill = value.trim()
    if (!skill) return

    onAdd(skill)
    setValue('')
  }

  return (
    <input
      className="rs-tag rs-tag--add"
      placeholder="+ add skill"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault()
          submit()
        }
      }}
      onBlur={submit}
    />
  )
}
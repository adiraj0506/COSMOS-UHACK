'use client'

import './resume.css'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Database,
  Award,
  FileText,
  TrendingUp,
  RotateCcw,
  Download
} from 'lucide-react'

import DashboardShell from '@/components/learner/dashboard/DashboardShell'
import TemplateSelector from '@/components/learner/resume/TemplateSelector'
import UserDataPanel from '@/components/learner/resume/UserDataPanel'
import ResumePreview from '@/components/learner/resume/ResumePreview_1'
import ResumeAnalyser from '@/components/learner/resume/ResumeAnalyser_1'

import { MOCK_DB_PROFILE } from '@/components/learner/resume/UserDataPanel'

import type { TemplateId } from '@/components/learner/resume/TemplateSelector'
import type { GeneratedResume } from '@/components/learner/resume/ResumePreview_1'
import type { DBProfile } from '@/components/learner/resume/UserDataPanel'

/* ───────────────── AI STEPS ───────────────── */

const GEN_STEPS = [
  'Reading your COSMOS profile from database…',
  'Analysing skills and experience data…',
  'Crafting professional summary with AI…',
  'Generating impact-driven bullet points…',
  'Tailoring content to your target role…',
  'Applying template and formatting…',
]

/* ───────────────── MOCK GENERATOR ───────────────── */

function mockGenerateResume(profile: DBProfile): GeneratedResume {
  return {
    name: profile.name,
    role: profile.role,
    email: profile.email,
    phone: profile.phone,
    linkedin: profile.linkedin,
    github: profile.github,

    summary: `Results-driven ${profile.role} with hands-on experience building scalable systems and delivering production-ready solutions.`,

    experience: profile.experience.map(e => ({
      title: e.title,
      company: e.company,
      period: e.period,
      bullets: [
        e.desc,
        'Collaborated with cross-functional teams to deliver features on time.',
        'Improved reliability and reduced system errors by 30%.',
      ],
    })),

    education: profile.education,
    skills: profile.skills,
    achievements: profile.achievements,
    projects: profile.projects,
  }
}

/* ───────────────── KPI CARD ───────────────── */

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaGood,
  iconColor,
  glow
}: any) {
  return (
    <div
      className="rs-kpi-card"
      style={{
        boxShadow: `inset 0 0 48px ${glow},0 4px 24px rgba(0,0,0,0.35)`
      }}
    >
      <div className="rs-kpi-top">

        <div
          className="rs-kpi-icon"
          style={{
            background: `${iconColor}18`,
            border: `1px solid ${iconColor}30`
          }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </div>

        <span className={`rs-kpi-delta ${deltaGood ? 'good' : 'warn'}`}>
          {delta}
        </span>

      </div>

      <p className="rs-kpi-value">{value}</p>
      <p className="rs-kpi-label">{label}</p>
    </div>
  )
}

/* ───────────────── PAGE ───────────────── */

export default function ResumeBuilderPage() {

  const [profile, setProfile] = useState<DBProfile>(MOCK_DB_PROFILE)
  const [template, setTemplate] = useState<TemplateId>('cosmos')

  const [generated, setGenerated] = useState<GeneratedResume | null>(null)

  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const [dbLoading, setDbLoading] = useState(false)

  /* ───────────────── GENERATE RESUME ───────────────── */

  const generateResume = useCallback(async () => {

    if (generating) return

    setGenerating(true)
    setGenerated(null)
    setProgress(0)

    for (let i = 0; i < GEN_STEPS.length; i++) {

      setActiveStep(i)

      const start = (i / GEN_STEPS.length) * 100
      const end = ((i + 1) / GEN_STEPS.length) * 100

      for (let p = start; p <= end; p += 4) {
        setProgress(Math.round(p))
        await new Promise(r => setTimeout(r, 50))
      }
    }

    const result = mockGenerateResume(profile)

    setGenerated(result)
    setGenerating(false)
    setProgress(100)

  }, [profile, generating])

  /* ───────────────── SYNC PROFILE ───────────────── */

  const syncDB = useCallback(async () => {

    setDbLoading(true)

    try {
      await new Promise(r => setTimeout(r, 1000))
      setProfile(MOCK_DB_PROFILE)
    }
    finally {
      setDbLoading(false)
    }

  }, [])

  /* ───────────────── PROFILE SCORE ───────────────── */

  const profileScore = useMemo(() => {

    let score = 0

    if (profile.name) score += 10
    if (profile.email) score += 10
    if (profile.summary) score += 10

    if (profile.experience.length > 0) score += 25
    if (profile.education.length > 0) score += 20

    score += Math.min(profile.skills.length * 5, 25)

    return score

  }, [profile])

  /* ───────────────── EXPORT PDF ───────────────── */

  const exportPDF = () => {

    // TODO
    // integrate react-to-pdf / puppeteer backend

    alert('PDF export will be connected to backend')
  }

  /* ───────────────── UI ───────────────── */

  return (
    <DashboardShell activeHref="/learner/resume">

      {/* HEADER */}

      <div className="rs-page-header">

        <div>
          <h1 className="rs-title">
            📄 AI Resume Builder
          </h1>

          <p className="rs-subtitle">
            AI reads your COSMOS profile · Pick template · Generate instantly
          </p>
        </div>

        <div className="rs-header-actions">

          {generated && (
            <button
              className="rs-btn rs-btn--secondary"
              onClick={() => setGenerated(null)}
            >
              <RotateCcw size={14} />
              Regenerate
            </button>
          )}

          {generated && (
            <button
              className="rs-btn rs-btn--primary"
              onClick={exportPDF}
            >
              <Download size={14} />
              Export PDF
            </button>
          )}

        </div>

      </div>

      {/* KPI STRIP */}

      <div className="rs-kpi-strip">

        <KpiCard
          icon={Database}
          label="Profile Data"
          value={`${profileScore}%`}
          delta="Complete"
          deltaGood={profileScore > 70}
          iconColor="#6366f1"
          glow="rgba(99,102,241,0.07)"
        />

        <KpiCard
          icon={FileText}
          label="Sections"
          value={`${profile.experience.length + profile.education.length}`}
          delta="Available"
          deltaGood
          iconColor="#a855f7"
          glow="rgba(124,58,237,0.07)"
        />

        <KpiCard
          icon={Award}
          label="Skills"
          value={String(profile.skills.length)}
          delta={profile.skills.length > 6 ? 'Great coverage' : 'Add more'}
          deltaGood={profile.skills.length > 6}
          iconColor="#10b981"
          glow="rgba(16,185,129,0.07)"
        />

        <KpiCard
          icon={TrendingUp}
          label="AI Status"
          value={generating ? 'Generating...' : generated ? 'Generated' : 'Ready'}
          delta={generated ? 'Download ready' : 'Generate resume'}
          deltaGood={!!generated}
          iconColor="#f59e0b"
          glow="rgba(245,158,11,0.06)"
        />

      </div>

      {/* TEMPLATE */}

      <div className="rs-section">
        <p className="rs-section-title">✦ Step 1 — Choose Template</p>

        <TemplateSelector
          selected={template}
          onSelect={setTemplate}
        />
      </div>

      {/* GENERATE */}

      <div className="rs-section">

        <p className="rs-section-title">✦ Step 2 — Generate with AI</p>

        <button
          className="rs-generate-btn"
          onClick={generateResume}
          disabled={generating}
        >

          {generating
            ? 'Generating Resume...'
            : generated
            ? 'Regenerate Resume'
            : 'Generate Resume with AI'
          }

          <Sparkles size={16} />

        </button>

        {generating && (
          <div className="rs-progress">

            <p>{GEN_STEPS[activeStep]}</p>

            <div className="rs-score-bar">
              <div
                className="rs-score-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>
        )}

      </div>

      {/* GRID */}

      <div className="rs-grid">

        {/* LEFT PANEL */}

        <UserDataPanel
          profile={profile}
          loading={dbLoading}
          onRefresh={syncDB}
        />

        {/* PREVIEW */}

        <ResumePreview
          resume={generated}
          template={template}
          loading={generating}
          progress={progress}
          steps={GEN_STEPS}
          activeStep={activeStep}
        />

        {/* ANALYSER */}

        <ResumeAnalyser resume={generated} />

      </div>

    </DashboardShell>
  )
}
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Upload, ChevronDown, RefreshCw, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import ResumeScoreRing from './ResumeScoreRing'
import type { ResumeData } from './ResumeEditor'

// ── Types ─────────────────────────────────────────────────────────────────────
interface AnalysisResult {
  overall:     number
  dimensions:  { label: string; score: number; fillClass: string; color: string }[]
  suggestions: { type: 'critical' | 'warning' | 'tip' | 'good'; icon: string; title: string; body: string }[]
  keywords:    { word: string; status: 'found' | 'missing' | 'partial' }[]
  jdMatch:     number
  jdText:      string
}

interface ResumeAnalyserProps {
  resumeData: ResumeData
}

// ── Mock analysis (replace with real AI API call) ─────────────────────────────
// TODO backend teammate: POST /api/resume/analyse { resume: ResumeData, jd?: string }
function mockAnalyse(data: ResumeData, jd: string): AnalysisResult {
  const hasExp   = data.experience.filter(e => e.title).length > 0
  const hasSkills = data.skills.length >= 3
  const hasSummary = data.summary.length > 30
  const base = 38 + (hasExp ? 20 : 0) + (hasSkills ? 15 : 0) + (hasSummary ? 10 : 0)

  return {
    overall: Math.min(base, 92),
    dimensions: [
      { label: 'Content Quality',   score: hasSummary ? 72 : 30, fillClass: 'rs-score-bar__fill--violet',  color: '#a855f7' },
      { label: 'ATS Compatibility', score: hasSkills  ? 68 : 25, fillClass: 'rs-score-bar__fill--cyan',    color: '#06b6d4' },
      { label: 'Impact & Metrics',  score: hasExp     ? 55 : 15, fillClass: 'rs-score-bar__fill--amber',   color: '#f59e0b' },
      { label: 'Keyword Match',     score: jd.length > 20 ? 61 : 40, fillClass: 'rs-score-bar__fill--emerald', color: '#10b981' },
      { label: 'Formatting',        score: 78,                   fillClass: 'rs-score-bar__fill--indigo',  color: '#6366f1' },
    ],
    suggestions: [
      !hasSummary
        ? { type: 'critical', icon: '🚨', title: 'Missing Summary', body: 'Add a 2–3 sentence professional summary. This is the first thing recruiters read.' }
        : { type: 'good',     icon: '✅', title: 'Great Summary',   body: 'Your summary is well-written. It clearly communicates your background and goals.' },
      !hasSkills
        ? { type: 'critical', icon: '🚨', title: 'Add Technical Skills', body: 'List at least 6–10 skills. Backend roles need: Node.js, PostgreSQL, REST APIs, Docker.' }
        : { type: 'tip', icon: '💡', title: 'Expand Skills Section', body: 'Add cloud skills (AWS/GCP) and tools (Docker, CI/CD) to match senior backend requirements.' },
      { type: 'warning', icon: '⚠️', title: 'Quantify Achievements', body: 'Replace vague phrases with numbers: "Reduced API latency by 40%", "Scaled service to 1M RPS".' },
      { type: 'tip',     icon: '💡', title: 'Add GitHub Profile',    body: 'Recruiters actively look for GitHub links. Add it to show real project work.' },
      { type: 'warning', icon: '⚠️', title: 'Action Verbs',         body: 'Start each bullet with strong verbs: Built, Designed, Optimised, Architected, Led.' },
    ],
    keywords: [
      { word: 'Node.js',      status: data.skills.includes('Node.js')       ? 'found' : 'missing' },
      { word: 'REST API',     status: data.skills.includes('REST API')       ? 'found' : 'partial' },
      { word: 'PostgreSQL',   status: data.skills.includes('PostgreSQL')     ? 'found' : 'missing' },
      { word: 'Docker',       status: data.skills.includes('Docker')         ? 'found' : 'missing' },
      { word: 'TypeScript',   status: data.skills.includes('TypeScript')     ? 'found' : 'partial' },
      { word: 'System Design',status: data.skills.includes('System Design')  ? 'found' : 'missing' },
      { word: 'Git',          status: data.skills.includes('Git')            ? 'found' : 'found'   },
      { word: 'Agile',        status: 'partial' },
    ],
    jdMatch: jd.length > 20 ? 61 : 0,
    jdText: jd,
  }
}

const SUGGESTION_ICON: Record<string, React.ElementType> = {
  critical: AlertCircle,
  warning:  AlertCircle,
  good:     CheckCircle2,
  tip:      Info,
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ResumeAnalyser({ resumeData }: ResumeAnalyserProps) {
  const [jd,         setJd]         = useState('')
  const [analysing,  setAnalysing]  = useState(false)
  const [result,     setResult]     = useState<AnalysisResult | null>(null)
  const [activeTab,  setActiveTab]  = useState<'score' | 'suggestions' | 'ats' | 'jd'>('score')

  async function runAnalysis() {
    setAnalysing(true)
    // Simulate API latency — TODO replace with real POST /api/resume/analyse
    await new Promise(r => setTimeout(r, 1400))
    setResult(mockAnalyse(resumeData, jd))
    setAnalysing(false)
    setActiveTab('score')
  }

  return (
    <div className="rs-card rs-card--cyan h-full flex flex-col overflow-hidden">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p className="rs-label" style={{ marginBottom: 0 }}>
          <Sparkles size={12} style={{ color: '#06b6d4' }} />
          AI Analyser
        </p>
        <button
          className="rs-btn rs-btn--cyan rs-btn--sm"
          onClick={runAnalysis}
          disabled={analysing}
          style={{ opacity: analysing ? 0.6 : 1 }}
        >
          {analysing
            ? <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…</>
            : <><Sparkles size={11} /> Analyse Resume</>
          }
        </button>
      </div>

      {/* JD input */}
      <div style={{ marginBottom: 12 }}>
        <label className="rs-field__label" style={{ display: 'block', marginBottom: 5 }}>
          📋 Paste Job Description (optional — improves match score)
        </label>
        <textarea
          className="rs-input rs-textarea"
          style={{ minHeight: 56, fontSize: 11 }}
          placeholder="Paste the job description here to get a keyword match score and tailored suggestions…"
          value={jd}
          onChange={e => setJd(e.target.value)}
          rows={3}
        />
      </div>

      {!result && !analysing && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', opacity: 0.35, gap: 8,
        }}>
          <span style={{ fontSize: 36 }}>🤖</span>
          <p style={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>
            Click "Analyse Resume" to get<br />AI-powered feedback
          </p>
        </div>
      )}

      {analysing && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(6,182,212,0.2)',
            borderTopColor: '#06b6d4',
            animation: 'spin 0.9s linear infinite',
          }} />
          {['Scanning content structure…', 'Matching ATS keywords…', 'Generating AI insights…'].map((t, i) => (
            <motion.p key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.4 }}
              style={{ fontSize: 11, color: '#475569', textAlign: 'center' }}
            >
              {t}
            </motion.p>
          ))}
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {result && !analysing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Tabs */}
          <div className="rs-tabs">
            {[
              { id: 'score',       label: '📊 Score'      },
              { id: 'suggestions', label: '💡 Suggestions' },
              { id: 'ats',         label: '🔑 Keywords'    },
              { id: 'jd',          label: '🎯 JD Match'    },
            ].map(t => (
              <button key={t.id}
                className={`rs-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* Score tab */}
              {activeTab === 'score' && (
                <motion.div key="score"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                >
                  <ResumeScoreRing score={result.overall} dimensions={result.dimensions} />

                  {/* Mini stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 14 }}>
                    {[
                      { v: result.keywords.filter(k => k.status === 'found').length, l: 'Keywords Found', c: '#10b981' },
                      { v: result.suggestions.filter(s => s.type === 'critical' || s.type === 'warning').length, l: 'Issues Found', c: '#f59e0b' },
                      { v: `${result.jdMatch || '—'}%`, l: 'JD Match', c: '#a855f7' },
                    ].map(({ v, l, c }) => (
                      <div key={l} className="rs-stat-mini">
                        <span className="rs-stat-mini__value" style={{ color: c, fontSize: 18 }}>{v}</span>
                        <span className="rs-stat-mini__label">{l}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestions tab */}
              {activeTab === 'suggestions' && (
                <motion.div key="suggestions"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                >
                  {result.suggestions.map((s, i) => (
                    <motion.div key={s.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rs-suggestion rs-suggestion--${s.type}`}
                    >
                      <span className="rs-suggestion__icon">{s.icon}</span>
                      <div>
                        <p className="rs-suggestion__title">{s.title}</p>
                        <p className="rs-suggestion__body">{s.body}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ATS Keywords tab */}
              {activeTab === 'ats' && (
                <motion.div key="ats"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                >
                  <p style={{ fontSize: 10, color: '#475569', marginBottom: 10 }}>
                    Keywords detected from your target role. Add missing ones to improve ATS pass rate.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.keywords.map(({ word, status }) => (
                      <span key={word} className={`rs-ats-chip rs-ats-chip--${status}`}>
                        {status === 'found' ? '✓' : status === 'partial' ? '~' : '✗'} {word}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                    {[
                      { label: '✓ Found',   cls: 'rs-ats-chip--found',   count: result.keywords.filter(k => k.status === 'found').length },
                      { label: '~ Partial', cls: 'rs-ats-chip--partial', count: result.keywords.filter(k => k.status === 'partial').length },
                      { label: '✗ Missing', cls: 'rs-ats-chip--missing', count: result.keywords.filter(k => k.status === 'missing').length },
                    ].map(({ label, cls, count }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span className={`rs-ats-chip ${cls}`}>{label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* JD Match tab */}
              {activeTab === 'jd' && (
                <motion.div key="jd"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                >
                  {result.jdMatch > 0 ? (
                    <>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>Overall Match</span>
                          <span style={{ fontSize: 13, fontWeight: 900, color: '#a855f7' }}>{result.jdMatch}%</span>
                        </div>
                        <div className="rs-match-meter">
                          <motion.div className="rs-match-meter__fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${result.jdMatch}%` }}
                            transition={{ duration: 1, ease: [0.22,1,0.36,1], delay: 0.2 }}
                          />
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: '#475569' }}>
                        Your resume matches {result.jdMatch}% of the requirements in this job description.
                        Focus on adding the missing keywords in the ATS tab to improve your match score.
                      </p>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', opacity: 0.4 }}>
                      <p style={{ fontSize: 13, marginBottom: 6 }}>📋</p>
                      <p style={{ fontSize: 11, color: '#475569' }}>
                        Paste a job description above and re-run the analysis to see your match score.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}

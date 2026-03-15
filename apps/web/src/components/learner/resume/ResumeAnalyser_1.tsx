'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, Info, Upload, FileText, X } from 'lucide-react'
import type { GeneratedResume } from './ResumePreview_1'

// ── Types ─────────────────────────────────────────────────────────────────────
interface AnalysisResult {
  overall:     number
  dimensions:  { label: string; score: number; fillClass: string; color: string }[]
  suggestions: { type: 'critical'|'warning'|'tip'|'good'; icon: string; title: string; body: string }[]
  keywords:    { word: string; status: 'found'|'missing'|'partial' }[]
  jdMatch:     number
}

interface ResumeAnalyserProps {
  resume: GeneratedResume | null
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r  = 50, cx = 62, cy = 62
  const c  = 2 * Math.PI * r
  const offset = c * (1 - score / 100)
  const color  = score >= 80 ? '#10b981' : score >= 60 ? '#a855f7' : score >= 40 ? '#f59e0b' : '#f43f5e'
  return (
    <div className="rs-score-ring-wrap" style={{ width: 124, height: 124 }}>
      <svg width="124" height="124" viewBox="0 0 124 124">
        <defs>
          <linearGradient id="ar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
        <motion.circle cx={cx} cy={cy} r={r}
          fill="none" stroke="url(#ar-grad)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22,1,0.36,1], delay: 0.2 }}
          style={{ transformOrigin:'center', transform:'rotate(-90deg)', filter:`drop-shadow(0 0 6px ${color})` }}
        />
        <circle cx={cx} cy={cy} r={36} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
      </svg>
      <div className="rs-score-ring-label">
        <motion.span className="rs-score-ring-value"
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:0.5 }} style={{ color }}>
          {score}
        </motion.span>
        <span className="rs-score-ring-sub">/ 100</span>
      </div>
    </div>
  )
}

// ── Mock analyser ─────────────────────────────────────────────────────────────
// TODO backend teammate: POST /api/resume/analyse { resume, jd }
function mockAnalyse(resume: GeneratedResume, jd: string): AnalysisResult {
  const hasProjects = resume.projects.length > 0
  const goodSkills  = resume.skills.length >= 6
  return {
    overall: goodSkills && hasProjects ? 78 : 55,
    dimensions: [
      { label: 'Content Quality',   score: 72, fillClass: 'rs-score-bar__fill--violet',  color: '#a855f7' },
      { label: 'ATS Compatibility', score: goodSkills ? 68 : 32, fillClass: 'rs-score-bar__fill--cyan',    color: '#06b6d4' },
      { label: 'Impact & Metrics',  score: hasProjects ? 60 : 20, fillClass: 'rs-score-bar__fill--amber',  color: '#f59e0b' },
      { label: 'Keyword Match',     score: jd.length > 20 ? 65 : 44, fillClass: 'rs-score-bar__fill--emerald', color: '#10b981' },
      { label: 'Formatting',        score: 82, fillClass: 'rs-score-bar__fill--indigo',  color: '#6366f1' },
    ],
    suggestions: [
      { type: 'good',    icon: '✅', title: 'Strong Summary',         body: 'Your summary clearly communicates your background and career goal.' },
      { type: 'warning', icon: '⚠️', title: 'Quantify Impact',        body: 'Add numbers to bullets: "Reduced latency by 40%", "Handled 10K RPS".' },
      { type: 'tip',     icon: '💡', title: 'Add Cloud Skills',        body: 'AWS / GCP certifications significantly boost backend developer profiles.' },
      { type: 'warning', icon: '⚠️', title: 'Use Action Verbs',       body: 'Start bullets with: Built, Designed, Optimised, Architected, Deployed.' },
      { type: goodSkills ? 'good' : 'critical', icon: goodSkills ? '✅' : '🚨', title: goodSkills ? 'Good Skills Coverage' : 'Expand Skills Section', body: goodSkills ? 'Your skills section covers the key backend technologies.' : 'Add at least 6 technical skills relevant to your target role.' },
    ],
    keywords: [
      { word: 'Node.js',       status: resume.skills.includes('Node.js')       ? 'found' : 'missing' },
      { word: 'TypeScript',    status: resume.skills.includes('TypeScript')     ? 'found' : 'partial' },
      { word: 'PostgreSQL',    status: resume.skills.includes('PostgreSQL')     ? 'found' : 'missing' },
      { word: 'Docker',        status: resume.skills.includes('Docker')         ? 'found' : 'missing' },
      { word: 'REST API',      status: resume.skills.includes('REST API')       ? 'found' : 'partial' },
      { word: 'System Design', status: resume.skills.includes('System Design')  ? 'found' : 'missing' },
      { word: 'Git',           status: resume.skills.includes('Git')            ? 'found' : 'found'   },
      { word: 'Redis',         status: resume.skills.includes('Redis')          ? 'found' : 'missing' },
    ],
    jdMatch: jd.length > 20 ? 64 : 0,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ResumeAnalyser({ resume }: ResumeAnalyserProps) {
  const [jd,        setJd]        = useState('')
  const [analysing, setAnalysing] = useState(false)
  const [result,    setResult]    = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState<'score'|'suggestions'|'ats'|'jd'|'upload'>('score')
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function runAnalysis() {
    if (!resume) return
    setAnalysing(true)
    await new Promise(r => setTimeout(r, 1500))
    setResult(mockAnalyse(resume, jd))
    setAnalysing(false)
    setActiveTab('score')
  }

  const handleFile = useCallback((f: File) => {
    if (!['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'].includes(f.type)) return
    const kb = f.size / 1024
    setUploadedFile({ name: f.name, size: kb > 1024 ? `${(kb/1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB` })
    // TODO backend teammate: POST /api/resume/parse (multipart/form-data) → parsed resume text
  }, [])

  const TABS = [
    { id: 'upload',      label: '📤 Upload'      },
    { id: 'score',       label: '📊 Score'        },
    { id: 'suggestions', label: '💡 Suggestions'  },
    { id: 'ats',         label: '🔑 Keywords'     },
    { id: 'jd',          label: '🎯 JD Match'     },
  ]

  return (
    <div className="rs-card rs-card--cyan h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p className="rs-label" style={{ marginBottom: 0 }}>
          <Sparkles size={12} style={{ color: '#06b6d4' }} />
          AI Analyser
        </p>
        <button className="rs-btn rs-btn--cyan rs-btn--sm"
          onClick={runAnalysis}
          disabled={analysing || !resume}
          style={{ opacity: !resume ? 0.4 : analysing ? 0.6 : 1 }}
        >
          {analysing
            ? <><RefreshCw size={11} style={{ animation: 'rs-spin 0.85s linear infinite' }} /> Analysing…</>
            : <><Sparkles size={11} /> Analyse</>
          }
        </button>
      </div>

      {/* Tabs */}
      <div className="rs-tabs" style={{ flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} className={`rs-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id as typeof activeTab)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">

          {/* ── Upload tab ── */}
          {activeTab === 'upload' && (
            <motion.div key="upload"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.18 }}
            >
              <p style={{ fontSize: 10, color: '#475569', marginBottom: 10 }}>
                Upload an existing resume to analyse it or extract data into your COSMOS profile.
              </p>

              {/* Drop zone */}
              <div
                className={`rs-upload-zone ${isDragging ? 'rs-upload-zone--drag' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                style={{ marginBottom: 10 }}
              >
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

                {uploadedFile ? (
                  <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                    <FileText size={22} style={{ color: '#a855f7' }} />
                    <div style={{ textAlign:'left' }}>
                      <p style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{uploadedFile.name}</p>
                      <p style={{ fontSize:10, color:'#475569' }}>{uploadedFile.size} · Click to replace</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setUploadedFile(null) }}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'#475569' }}>
                      <X size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <Upload size={26} style={{ color: '#475569', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600, marginBottom: 3 }}>
                      Drop your resume here
                    </p>
                    <p style={{ fontSize: 10, color: '#475569' }}>PDF, DOCX, or TXT · Max 5 MB</p>
                  </>
                )}
              </div>

              {uploadedFile && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <button className="rs-btn rs-btn--primary rs-btn--full"
                    onClick={runAnalysis}>
                    <Sparkles size={12} /> Analyse Uploaded Resume
                  </button>
                  <button className="rs-btn rs-btn--secondary rs-btn--full">
                    <FileText size={12} /> Import to Profile
                  </button>
                </motion.div>
              )}

              {/* JD input */}
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 6 }}>
                  📋 Job Description (optional)
                </p>
                <textarea className="rs-input rs-textarea"
                  style={{ minHeight: 64, fontSize: 11 }}
                  placeholder="Paste JD for a keyword match score…"
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* ── Score tab ── */}
          {activeTab === 'score' && (
            <motion.div key="score"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.18 }}
            >
              {!result ? (
                <div style={{ textAlign:'center', padding:'20px 0', opacity:0.35 }}>
                  <p style={{ fontSize:28, marginBottom:8 }}>🤖</p>
                  <p style={{ fontSize:11, color:'#475569' }}>Click "Analyse" to get AI-powered feedback</p>
                </div>
              ) : (
                <>
                  <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:14 }}>
                    <ScoreRing score={result.overall} />
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                      {result.dimensions.map(({ label, score, fillClass, color }, i) => (
                        <motion.div key={label}
                          initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay:0.1+i*0.06 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                            <span style={{ fontSize:9.5, color:'#94a3b8', fontWeight:600 }}>{label}</span>
                            <span style={{ fontSize:9.5, fontWeight:800, color }}>{score}%</span>
                          </div>
                          <div className="rs-score-bar">
                            <motion.div className={`rs-score-bar__fill ${fillClass}`}
                              initial={{ width:0 }} animate={{ width:`${score}%` }}
                              transition={{ duration:0.8, ease:[0.22,1,0.36,1], delay:0.15+i*0.06 }} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Mini stats */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                    {[
                      { v: result.keywords.filter(k=>k.status==='found').length,   l:'Found',   c:'#10b981' },
                      { v: result.suggestions.filter(s=>s.type==='critical'||s.type==='warning').length, l:'Issues', c:'#f59e0b' },
                      { v: result.jdMatch ? `${result.jdMatch}%` : '—',            l:'JD Match', c:'#a855f7' },
                    ].map(({ v, l, c }) => (
                      <div key={l} style={{ padding:'8px 10px', borderRadius:11, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                        <p style={{ fontSize:18, fontWeight:900, color:c, lineHeight:1 }}>{v}</p>
                        <p style={{ fontSize:8.5, color:'#475569', marginTop:2, textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── Suggestions tab ── */}
          {activeTab === 'suggestions' && (
            <motion.div key="suggestions"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.18 }}
            >
              {!result ? <p style={{ fontSize:11, color:'#475569', textAlign:'center', padding:'20px 0' }}>Run analysis first</p>
              : result.suggestions.map((s, i) => (
                <motion.div key={s.title}
                  initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.05 }}
                  className={`rs-suggestion rs-suggestion--${s.type}`}>
                  <span className="rs-suggestion__icon">{s.icon}</span>
                  <div>
                    <p className="rs-suggestion__title">{s.title}</p>
                    <p className="rs-suggestion__body">{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── ATS tab ── */}
          {activeTab === 'ats' && (
            <motion.div key="ats"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.18 }}
            >
              {!result ? <p style={{ fontSize:11, color:'#475569', textAlign:'center', padding:'20px 0' }}>Run analysis first</p>
              : <>
                <p style={{ fontSize:10, color:'#475569', marginBottom:10 }}>
                  Keywords matched against your target Backend Developer role.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                  {result.keywords.map(({ word, status }) => (
                    <span key={word} className={`rs-ats-chip rs-ats-chip--${status}`}>
                      {status==='found'?'✓':status==='partial'?'~':'✗'} {word}
                    </span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {[
                    { l:'Found',   cls:'rs-ats-chip--found',   n:result.keywords.filter(k=>k.status==='found').length   },
                    { l:'Partial', cls:'rs-ats-chip--partial', n:result.keywords.filter(k=>k.status==='partial').length },
                    { l:'Missing', cls:'rs-ats-chip--missing', n:result.keywords.filter(k=>k.status==='missing').length },
                  ].map(({ l, cls, n }) => (
                    <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <span className={`rs-ats-chip ${cls}`}>{l}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{n}</span>
                    </div>
                  ))}
                </div>
              </>}
            </motion.div>
          )}

          {/* ── JD Match tab ── */}
          {activeTab === 'jd' && (
            <motion.div key="jd"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.18 }}
            >
              {!result || !result.jdMatch ? (
                <div style={{ textAlign:'center', padding:'20px 0', opacity:0.4 }}>
                  <p style={{ fontSize:11, color:'#475569', lineHeight:1.7 }}>
                    Paste a job description in the Upload tab and run analysis to see your match score.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:'#e2e8f0' }}>Overall Match</span>
                      <span style={{ fontSize:14, fontWeight:900, color:'#a855f7' }}>{result.jdMatch}%</span>
                    </div>
                    <div className="rs-match-meter">
                      <motion.div className="rs-match-meter__fill"
                        initial={{ width:0 }}
                        animate={{ width:`${result.jdMatch}%` }}
                        transition={{ duration:1, ease:[0.22,1,0.36,1], delay:0.2 }} />
                    </div>
                  </div>
                  <p style={{ fontSize:11, color:'#475569', lineHeight:1.65 }}>
                    Your resume matches <span style={{ color:'#a855f7', fontWeight:700 }}>{result.jdMatch}%</span> of this JD.
                    Add missing keywords from the ATS tab to improve your match score.
                  </p>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

'use client'

import '../recruiter.css'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, Zap, Filter, X, CheckCircle2, Clock, Circle, MessageSquare } from 'lucide-react'
import RecruiterShell from '@/components/recruiter/dashboard/RecruiterShell'
import MailModal      from '@/components/recruiter/dashboard/MailModal'
import {
  MOCK_TALENT, MOCK_JOBS,
  matchColor, matchBg, contactBadge,
} from '@/components/recruiter/dashboard/recruiter.types'
import type { TalentMatch, MatchLevel } from '@/components/recruiter/dashboard/recruiter.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.35,delay:i*0.05,ease:[0.22,1,0.36,1] as const},
})

export default function TalentPage() {
  const [jobKeyword,    setJobKeyword]   = useState('')
  const [resumeKeyword, setResumeKeyword]= useState('')
  const [jobFilter,     setJobFilter]    = useState<string>('all')
  const [matchFilter,   setMatchFilter]  = useState<'all'|MatchLevel>('all')
  const [mailTarget,    setMailTarget]   = useState<TalentMatch|null>(null)
  const [selected,      setSelected]     = useState<TalentMatch|null>(null)
  const [contactedIds,  setContactedIds] = useState<Set<string>>(new Set(MOCK_TALENT.filter(t=>t.contactStatus!=='not-contacted').map(t=>t.id)))

  const filtered = useMemo(()=>{
    let list = MOCK_TALENT
    if (jobKeyword.trim()) {
      const q = jobKeyword.toLowerCase()
      list = list.filter(t=>t.targetRole.toLowerCase().includes(q)||t.skills.some(s=>s.toLowerCase().includes(q)))
    }
    if (resumeKeyword.trim()) {
      const q = resumeKeyword.toLowerCase()
      list = list.filter(t=>t.skills.some(s=>s.toLowerCase().includes(q))||t.name.toLowerCase().includes(q)||t.college.toLowerCase().includes(q))
    }
    if (jobFilter!=='all') {
      const job = MOCK_JOBS.find(j=>j.id===jobFilter)
      if (job) list = list.filter(t=>job.skills.some(s=>t.skills.includes(s)))
    }
    if (matchFilter!=='all') list = list.filter(t=>t.matchLevel===matchFilter)
    return [...list].sort((a,b)=>b.matchScore-a.matchScore)
  },[jobKeyword,resumeKeyword,jobFilter,matchFilter])

  function markContacted(id:string) {
    setContactedIds(prev=>new Set([...prev,id]))
  }

  return (
    <RecruiterShell activeHref="/recruiter/talent">

      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:900, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ filter:'drop-shadow(0 0 8px #a855f7)' }}>⚡</span> Talent Pool
          </h1>
          <p style={{ fontSize:10.5, color:'#475569', marginTop:2 }}>
            Search by job profile keyword · Resume skill keyword · AI match score
          </p>
        </div>
      </motion.div>

      {/* Dual search */}
      <motion.div {...fadeUp(1)}
        style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14,
          padding:'18px 20px', borderRadius:18, background:'rgba(124,58,237,0.06)',
          border:'1px solid rgba(139,92,246,0.18)' }}>
        <div>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#64748b', marginBottom:6 }}>
            🎯 Filter by Job Profile / Role
          </p>
          <div className="rr-search-wrap">
            <Search size={12} className="rr-search-icon"/>
            <input className="rr-input rr-search" placeholder="e.g. Backend Developer, ML Engineer…"
              value={jobKeyword} onChange={e=>setJobKeyword(e.target.value)}/>
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:7 }}>
            {['Backend','Frontend','ML Engineer','DevOps','Full Stack'].map(s=>(
              <button key={s} onClick={()=>setJobKeyword(s)}
                style={{ padding:'2px 9px', borderRadius:999, fontSize:9.5, fontWeight:600, cursor:'pointer', background: jobKeyword===s?'rgba(245,158,11,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${jobKeyword===s?'rgba(245,158,11,0.4)':'rgba(255,255,255,0.08)'}`, color: jobKeyword===s?'#fde68a':'#475569', transition:'all 0.12s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#64748b', marginBottom:6 }}>
            📄 Filter by Resume Keyword / Skill
          </p>
          <div className="rr-search-wrap">
            <Search size={12} className="rr-search-icon"/>
            <input className="rr-input rr-search" placeholder="e.g. Node.js, PostgreSQL, Docker…"
              value={resumeKeyword} onChange={e=>setResumeKeyword(e.target.value)}/>
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:7 }}>
            {['Node.js','Python','React','PostgreSQL','Docker','TensorFlow'].map(s=>(
              <button key={s} onClick={()=>setResumeKeyword(s)}
                style={{ padding:'2px 9px', borderRadius:999, fontSize:9.5, fontWeight:600, cursor:'pointer', background: resumeKeyword===s?'rgba(168,85,247,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${resumeKeyword===s?'rgba(168,85,247,0.4)':'rgba(255,255,255,0.08)'}`, color: resumeKeyword===s?'#c4b5fd':'#475569', transition:'all 0.12s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Secondary filters + result count */}
      <motion.div {...fadeUp(2)} style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:12 }}>
        {/* Filter by job posting */}
        <select className="rr-input" style={{ width:'auto', padding:'6px 12px', fontSize:11, borderRadius:10, appearance:'none' }}
          value={jobFilter} onChange={e=>setJobFilter(e.target.value)}>
          <option value="all">All Jobs</option>
          {MOCK_JOBS.filter(j=>j.status==='active').map(j=>(
            <option key={j.id} value={j.id}>{j.title.split('—')[0].trim()}</option>
          ))}
        </select>
        {(['all','strong','good','moderate','low'] as const).map(m=>(
          <button key={m} className={`rr-pill ${matchFilter===m?'active':''}`} onClick={()=>setMatchFilter(m)}>
            {m==='all'?'All Matches':m.charAt(0).toUpperCase()+m.slice(1)}
          </button>
        ))}
        {(jobKeyword||resumeKeyword||matchFilter!=='all'||jobFilter!=='all')&&(
          <button className="rr-btn rr-btn--ghost rr-btn--sm" onClick={()=>{setJobKeyword('');setResumeKeyword('');setMatchFilter('all');setJobFilter('all')}}>
            <X size={11}/> Clear
          </button>
        )}
        <span style={{ marginLeft:'auto', fontSize:10, color:'#475569' }}>
          {filtered.length} student{filtered.length!==1?'s':''} found
        </span>
      </motion.div>

      {/* Talent grid + detail */}
      <motion.div {...fadeUp(3)} style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:12 }}>

        {/* Cards grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, alignContent:'start' }}>
          {filtered.length===0 && (
            <div className="rr-empty" style={{ gridColumn:'1/-1' }}>
              <span className="rr-empty__icon">🔍</span>
              <p className="rr-empty__title">No talent matches</p>
              <p className="rr-empty__sub">Try different keywords or clear filters</p>
            </div>
          )}
          {filtered.map((t,i)=>{
            const mc = matchColor(t.matchLevel)
            const mb = matchBg(t.matchLevel)
            const cb = contactBadge(t.contactStatus)
            const isContacted = contactedIds.has(t.id)
            return (
              <motion.div key={t.id} {...fadeUp(i)} className="rr-talent-card"
                style={{ cursor:'pointer', border:`1px solid ${selected?.id===t.id?'rgba(245,158,11,0.35)':'rgba(255,255,255,0.072)'}`, background: selected?.id===t.id?'rgba(245,158,11,0.04)':'rgba(255,255,255,0.032)' }}
                onClick={()=>setSelected(t)}>
                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="rr-avatar" style={{ background:`${mc}20`, border:`1px solid ${mc}30`, color:mc, width:36, height:36 }}>{t.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12.5, fontWeight:700, color:'#f1f5f9', marginBottom:1 }}>{t.name}</p>
                    <p style={{ fontSize:9.5, color:'#475569' }}>{t.college} · {t.branch}</p>
                  </div>
                  <div style={{ padding:'4px 9px', borderRadius:8, background:mb, border:`1px solid ${mc}30`, fontSize:11, fontWeight:900, color:mc, flexShrink:0 }}>
                    {t.matchScore}%
                  </div>
                </div>
                {/* Match bar */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontSize:9, color:'#475569' }}>Match Score</span>
                    <span style={{ fontSize:9, color:mc, fontWeight:700 }}>{t.matchLevel}</span>
                  </div>
                  <div className="rr-bar">
                    <motion.div className="rr-bar__fill" style={{ background:mc, width:`${t.matchScore}%` }}
                      initial={{ width:0 }} animate={{ width:`${t.matchScore}%` }} transition={{ duration:0.7, delay:i*0.05 }}/>
                  </div>
                </div>
                {/* Skills */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {t.matchedSkills.slice(0,3).map(s=>(
                    <span key={s} style={{ padding:'2px 7px', borderRadius:5, fontSize:9, fontWeight:600, background:'rgba(16,185,129,0.1)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,0.2)' }}>✓ {s}</span>
                  ))}
                  {t.missingSkills.slice(0,1).map(s=>(
                    <span key={s} style={{ padding:'2px 7px', borderRadius:5, fontSize:9, fontWeight:600, background:'rgba(244,63,94,0.08)', color:'#fda4af', border:'1px solid rgba(244,63,94,0.18)' }}>✗ {s}</span>
                  ))}
                </div>
                {/* Footer */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                  <span className="rr-badge" style={{ fontSize:8.5, padding:'2px 7px', background:isContacted?'rgba(16,185,129,0.1)':cb.bg, color:isContacted?'#6ee7b7':cb.color, border:`1px solid ${isContacted?'rgba(16,185,129,0.2)':cb.color+'30'}` }}>
                    {isContacted?'Contacted':cb.label}
                  </span>
                  <button className="rr-btn rr-btn--amber rr-btn--sm" style={{ padding:'4px 10px', fontSize:9.5 }}
                    onClick={e=>{e.stopPropagation();setMailTarget(t);markContacted(t.id)}}>
                    <Send size={10}/> Mail
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div style={{ position:'sticky', top:0 }}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} className="rr-card"
                initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(167,139,250,0.7)' }}>Talent Detail</p>
                  <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#475569' }}><X size={13}/></button>
                </div>
                {/* Ring */}
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                  <div className="rr-ring-wrap" style={{ width:70, height:70 }}>
                    <svg width="70" height="70" viewBox="0 0 70 70">
                      <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
                      <motion.circle cx="35" cy="35" r="28" fill="none" stroke={matchColor(selected.matchLevel)} strokeWidth="6"
                        strokeLinecap="round" strokeDasharray={2*Math.PI*28}
                        initial={{ strokeDashoffset:2*Math.PI*28 }}
                        animate={{ strokeDashoffset:2*Math.PI*28*(1-selected.matchScore/100) }}
                        transition={{ duration:1, ease:[0.22,1,0.36,1] }}
                        style={{ transformOrigin:'center', transform:'rotate(-90deg)', filter:`drop-shadow(0 0 5px ${matchColor(selected.matchLevel)})` }}/>
                    </svg>
                    <div className="rr-ring-label">
                      <span className="rr-ring-value" style={{ fontSize:16, color:matchColor(selected.matchLevel) }}>{selected.matchScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:2 }}>{selected.name}</p>
                    <p style={{ fontSize:10, color:'#475569', marginBottom:2 }}>{selected.college} · {selected.branch} · {selected.batch}</p>
                    <p style={{ fontSize:10, color:'#94a3b8' }}>{selected.targetRole}</p>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:12 }}>
                  {[
                    { l:'Readiness', v:`${selected.readinessScore}%`, c:'#a855f7' },
                    { l:'Resume',    v:`${selected.resumeScore}%`,    c:'#06b6d4' },
                    { l:'Streak',    v:`🔥 ${selected.streakDays}d`,  c:'#f59e0b' },
                    { l:'Match',     v:selected.matchLevel,           c:matchColor(selected.matchLevel) },
                  ].map(({ l, v, c })=>(
                    <div key={l} style={{ padding:'8px 10px', borderRadius:10, background:`${c}0d`, border:`1px solid ${c}18` }}>
                      <p style={{ fontSize:13, fontWeight:800, color:c, lineHeight:1 }}>{v}</p>
                      <p style={{ fontSize:8.5, color:'#475569', marginTop:2, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>{l}</p>
                    </div>
                  ))}
                </div>
                {/* Matched skills */}
                <p style={{ fontSize:9, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Matched Skills</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:10 }}>
                  {selected.matchedSkills.map(s=>(
                    <span key={s} style={{ padding:'2px 8px', borderRadius:5, fontSize:9.5, fontWeight:600, background:'rgba(16,185,129,0.1)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,0.2)' }}>✓ {s}</span>
                  ))}
                </div>
                {selected.missingSkills.length>0 && (
                  <>
                    <p style={{ fontSize:9, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Missing Skills</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:14 }}>
                      {selected.missingSkills.map(s=>(
                        <span key={s} style={{ padding:'2px 8px', borderRadius:5, fontSize:9.5, fontWeight:600, background:'rgba(244,63,94,0.08)', color:'#fda4af', border:'1px solid rgba(244,63,94,0.18)' }}>✗ {s}</span>
                      ))}
                    </div>
                  </>
                )}
                <hr className="rr-divider"/>
                <button className="rr-btn rr-btn--amber rr-btn--full"
                  onClick={()=>{ setMailTarget(selected); markContacted(selected.id) }}>
                  <Send size={13}/> Send Mail to {selected.name.split(' ')[0]}
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" className="rr-empty" style={{ opacity:0.3 }} initial={{ opacity:0 }} animate={{ opacity:0.3 }}>
                <span className="rr-empty__icon">👤</span>
                <p className="rr-empty__title">Select a student</p>
                <p className="rr-empty__sub">Click any card for details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {mailTarget && (
          <MailModal
            target={{ type:'student', name:mailTarget.name, email:mailTarget.email, role:mailTarget.targetRole, skills:mailTarget.skills, college:mailTarget.college }}
            onClose={()=>setMailTarget(null)}
            onSent={()=>setMailTarget(null)}
          />
        )}
      </AnimatePresence>

      <div style={{ height:20 }}/>
    </RecruiterShell>
  )
}

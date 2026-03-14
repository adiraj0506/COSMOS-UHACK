'use client'

import '../recruiter.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Users, Building2, Send, Plus, TrendingUp, Zap, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import RecruiterShell from '@/components/recruiter/dashboard/RecruiterShell'
import MailModal      from '@/components/recruiter/dashboard/MailModal'
import JobModal       from '@/components/recruiter/dashboard/JobModal'
import {
  MOCK_JOBS, MOCK_TALENT, MOCK_COLLEGES, MOCK_RECRUITER,
  matchColor, matchBg, contactBadge,
} from '@/components/recruiter/dashboard/recruiter.types'
import type { JobPosting, TalentMatch } from '@/components/recruiter/dashboard/recruiter.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.36,delay:i*0.06,ease:[0.22,1,0.36,1] as const},
})

const TT = {
  contentStyle:{background:'rgba(6,2,18,0.97)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:10,fontSize:11,color:'#e5e7eb'},
  cursor:{stroke:'rgba(245,158,11,0.15)',strokeWidth:1},
}

function SectionTitle({ children }:{ children:React.ReactNode }) {
  return (
    <div className="rr-section-title">{children}</div>
  )
}

export default function RecruiterDashboard() {
  const [mailTarget, setMailTarget] = useState<TalentMatch|null>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const [jobs, setJobs] = useState(MOCK_JOBS)

  const activeJobs  = jobs.filter(j=>j.status==='active').length
  const totalMatch  = jobs.reduce((a,j)=>a+j.matches,0)
  const contacted   = MOCK_TALENT.filter(t=>t.contactStatus!=='not-contacted').length
  const topCollege  = MOCK_COLLEGES.sort((a,b)=>b.avgReadiness-a.avgReadiness)[0]

  // pipeline chart
  const pipelineData = jobs.filter(j=>j.status!=='draft').map(j=>({
    name: j.title.split(' — ')[0].slice(0,14),
    applicants: j.applicants,
    matches: j.matches,
  }))

  return (
    <RecruiterShell activeHref="/recruiter/dashboard">

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:900, color:'#fff', letterSpacing:'-0.01em', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ filter:'drop-shadow(0 0 8px #f59e0b)' }}>🎯</span>
            Recruiter Dashboard
          </h1>
          <p style={{ fontSize:10.5, color:'#475569', marginTop:2 }}>
            {MOCK_RECRUITER.company} · {MOCK_RECRUITER.name} · {MOCK_RECRUITER.role}
          </p>
        </div>
        <button className="rr-btn rr-btn--amber rr-btn--sm" onClick={()=>setShowJobModal(true)}>
          <Plus size={12}/> Post New Job
        </button>
      </motion.div>

      {/* KPIs */}
      <motion.div {...fadeUp(1)} className="rr-kpi-strip rr-kpi-strip--4">
        {[
          { icon:Briefcase, label:'Active Postings',  value:activeJobs,   delta:`${jobs.length} total`,        good:true,  color:'#f59e0b' },
          { icon:Zap,       label:'AI Matches Found', value:totalMatch,   delta:'Across all jobs',             good:true,  color:'#a855f7' },
          { icon:Users,     label:'Talents Contacted',value:contacted,    delta:`${MOCK_TALENT.length} in pool`,good:true, color:'#06b6d4' },
          { icon:Building2, label:'Top College',      value:topCollege.avgReadiness+'%', delta:`${topCollege.name.split(' ')[0]} readiness`, good:true, color:'#10b981' },
        ].map(({ icon:Icon, label, value, delta, good, color },i)=>(
          <motion.div key={label} {...fadeUp(i)} className="rr-kpi"
            style={{ boxShadow:`inset 0 0 40px ${color}09,0 4px 20px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.05)` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div className="rr-kpi__icon" style={{ background:`${color}18`, border:`1px solid ${color}28`, boxShadow:`0 0 10px ${color}22` }}>
                <Icon size={14} style={{ color }}/>
              </div>
              <span className={`rr-kpi__delta ${good?'rr-kpi__delta--good':'rr-kpi__delta--warn'}`}>{delta}</span>
            </div>
            <p className="rr-kpi__value">{value}</p>
            <p className="rr-kpi__label">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pipeline + Top talent */}
      <motion.div {...fadeUp(2)}>
        <SectionTitle>✦ Job Pipeline</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:12, marginBottom:16 }}>

          {/* Bar chart */}
          <div className="rr-card rr-card--amber">
            <div className="rr-card-header">
              <p className="rr-label">Applicants vs AI Matches</p>
              <div style={{ display:'flex', gap:10 }}>
                {[{l:'Applicants',c:'rgba(245,158,11,0.5)'},{l:'Matches',c:'#a855f7'}].map(({l,c})=>(
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <div style={{ width:8, height:3, borderRadius:999, background:c }}/>
                    <span style={{ fontSize:9, color:'#475569' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={pipelineData} margin={{ top:4, right:4, bottom:0, left:-20 }} barGap={4}>
                <XAxis dataKey="name" tick={{ fill:'#475569', fontSize:9 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#475569', fontSize:9 }} axisLine={false} tickLine={false}/>
                <Tooltip {...TT}/>
                <Bar dataKey="applicants" fill="rgba(245,158,11,0.45)" radius={[4,4,0,0]}/>
                <Bar dataKey="matches"    fill="#a855f7" opacity={0.8} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Active jobs list */}
          <div className="rr-card">
            <div className="rr-card-header">
              <p className="rr-label">Active Jobs</p>
              <a href="/recruiter/opportunities" style={{ fontSize:10, color:'#f59e0b', fontWeight:700, textDecoration:'none' }}>View all →</a>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {jobs.filter(j=>j.status==='active').slice(0,4).map((j,i)=>(
                <motion.div key={j.id} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:11, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.065)', cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(245,158,11,0.05)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='rgba(255,255,255,0.03)')}>
                  <Briefcase size={13} style={{ color:'#f59e0b', flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:11.5, fontWeight:700, color:'#f1f5f9', truncate:true }}>{j.title.split('—')[0].trim()}</p>
                    <p style={{ fontSize:9.5, color:'#475569' }}>{j.applicants} applicants · <span style={{ color:'#a855f7' }}>{j.matches} matches</span></p>
                  </div>
                  <span className="rr-badge rr-badge--amber">{j.type}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top talent */}
      <motion.div {...fadeUp(3)}>
        <SectionTitle>✦ Top Talent Matches</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
          {MOCK_TALENT.slice(0,4).map((t,i)=>{
            const mc = matchColor(t.matchLevel)
            const mb = matchBg(t.matchLevel)
            const cb = contactBadge(t.contactStatus)
            return (
              <motion.div key={t.id} {...fadeUp(i)} className="rr-talent-card">
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="rr-avatar" style={{ background:`${mc}20`, border:`1px solid ${mc}30`, color:mc }}>
                    {t.avatar}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'#f1f5f9', marginBottom:1 }}>{t.name}</p>
                    <p style={{ fontSize:9.5, color:'#475569' }}>{t.college}</p>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:9, color:'#475569' }}>AI Match</span>
                  <span style={{ fontSize:14, fontWeight:900, color:mc }}>{t.matchScore}%</span>
                </div>
                <div className="rr-bar">
                  <motion.div className="rr-bar__fill" style={{ background:mc, width:`${t.matchScore}%` }}
                    initial={{ width:0 }} animate={{ width:`${t.matchScore}%` }} transition={{ duration:0.7, delay:i*0.07 }}/>
                </div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {t.matchedSkills.slice(0,2).map(s=>(
                    <span key={s} style={{ padding:'2px 7px', borderRadius:5, fontSize:9, fontWeight:600, background:'rgba(245,158,11,0.12)', color:'#fde68a', border:'1px solid rgba(245,158,11,0.2)' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:6, marginTop:'auto' }}>
                  <span className="rr-badge" style={{ fontSize:8.5, padding:'2px 7px', background:cb.bg, color:cb.color, border:`1px solid ${cb.color}30` }}>{cb.label}</span>
                  <button className="rr-btn rr-btn--amber rr-btn--sm" style={{ marginLeft:'auto', padding:'4px 10px', fontSize:9.5 }}
                    onClick={()=>setMailTarget(t)}>
                    <Send size={10}/> Mail
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* College snapshot */}
      <motion.div {...fadeUp(4)}>
        <SectionTitle>✦ College Snapshot</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
          {MOCK_COLLEGES.slice(0,3).map((c,i)=>{
            const cb = contactBadge(c.contactStatus)
            return (
              <motion.div key={c.id} {...fadeUp(i)} className="rr-college-card">
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:11, flexShrink:0, background:`${c.color}18`, border:`1px solid ${c.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:c.color }}>
                    {c.logo}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'#f1f5f9', marginBottom:1 }}>{c.name}</p>
                    <p style={{ fontSize:9.5, color:'#475569' }}>{c.city} · {c.totalStudents} students</p>
                  </div>
                  <span className={`rr-badge rr-badge ${c.tier==='Tier 1'?'rr-tier-1':c.tier==='Tier 2'?'rr-tier-2':'rr-tier-3'}`}>{c.tier}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                  {[
                    { l:'Readiness', v:`${c.avgReadiness}%`, col:'#a855f7' },
                    { l:'Avg Pkg',   v:`${c.avgPackage}L`,   col:'#10b981' },
                    { l:'Placed',   v:`${c.placementRate}%`, col:'#06b6d4' },
                  ].map(({ l, v, col })=>(
                    <div key={l} style={{ padding:'7px 8px', borderRadius:9, textAlign:'center', background:`${col}0d`, border:`1px solid ${col}18` }}>
                      <p style={{ fontSize:13, fontWeight:900, color:col, lineHeight:1 }}>{v}</p>
                      <p style={{ fontSize:8, color:'#475569', marginTop:2, textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:600 }}>{l}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span className="rr-badge" style={{ fontSize:8.5, padding:'2px 7px', background:cb.bg, color:cb.color, border:`1px solid ${cb.color}30` }}>{cb.label}</span>
                  <a href="/recruiter/colleges" style={{ fontSize:10, color:'#f59e0b', fontWeight:700, textDecoration:'none' }}>View →</a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {mailTarget && (
          <MailModal
            target={{ type:'student', name:mailTarget.name, email:mailTarget.email, role:mailTarget.targetRole, skills:mailTarget.skills, college:mailTarget.college }}
            onClose={()=>setMailTarget(null)}
            onSent={()=>setMailTarget(null)}
          />
        )}
        {showJobModal && (
          <JobModal onClose={()=>setShowJobModal(false)} onSave={j=>{ setJobs(prev=>[{...j,id:`j${Date.now()}`,applicants:0,matches:0,postedDate:'Today',deadline:'—'} as JobPosting,...prev]); setShowJobModal(false) }}/>
        )}
      </AnimatePresence>

      <div style={{ height:20 }}/>
    </RecruiterShell>
  )
}

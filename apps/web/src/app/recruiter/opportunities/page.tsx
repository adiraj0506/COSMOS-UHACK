'use client'

import '../recruiter.css'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Briefcase, Search, Edit2, Pause, Trash2, Users, Zap, Eye, Play } from 'lucide-react'
import RecruiterShell from '@/components/recruiter/dashboard/RecruiterShell'
import JobModal       from '@/components/recruiter/dashboard/JobModal'
import { MOCK_JOBS }  from '@/components/recruiter/dashboard/recruiter.types'
import type { JobPosting, JobStatus, JobType } from '@/components/recruiter/dashboard/recruiter.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.36,delay:i*0.05,ease:[0.22,1,0.36,1] as const},
})

const STATUS_BADGE: Record<JobStatus,string> = {
  active:'rr-badge--active', paused:'rr-badge--paused', closed:'rr-badge--closed', draft:'rr-badge--draft',
}
const TYPE_COLOR: Record<JobType,string> = { 'full-time':'#a855f7', internship:'#06b6d4', contract:'#f59e0b' }
const MODE_COLOR = { remote:'#10b981', onsite:'#f59e0b', hybrid:'#6366f1' }

export default function OpportunitiesPage() {
  const [jobs,       setJobs]      = useState<JobPosting[]>(MOCK_JOBS)
  const [search,     setSearch]    = useState('')
  const [typeFilter, setType]      = useState<'all'|JobType>('all')
  const [statusFil,  setStatus]    = useState<'all'|JobStatus>('all')
  const [editJob,    setEditJob]   = useState<JobPosting|null>(null)
  const [newJob,     setNewJob]    = useState(false)
  const [selected,   setSelected]  = useState<JobPosting|null>(null)

  const filtered = useMemo(()=>{
    let list = jobs
    if (search.trim()) { const q=search.toLowerCase(); list=list.filter(j=>j.title.toLowerCase().includes(q)||j.skills.some(s=>s.toLowerCase().includes(q))||j.department.toLowerCase().includes(q)) }
    if (typeFilter!=='all') list=list.filter(j=>j.type===typeFilter)
    if (statusFil!=='all')  list=list.filter(j=>j.status===statusFil)
    return list
  },[jobs,search,typeFilter,statusFil])

  function updateStatus(id:string, status:JobStatus) {
    setJobs(j=>j.map(job=>job.id===id?{...job,status}:job))
  }
  function deleteJob(id:string) {
    setJobs(j=>j.filter(job=>job.id!==id))
    if (selected?.id===id) setSelected(null)
  }
  function saveJob(data: Partial<JobPosting>) {
    if (editJob) {
      setJobs(j=>j.map(job=>job.id===editJob.id?{...job,...data}:job))
    } else {
      const newJ:JobPosting = { id:`j${Date.now()}`, applicants:0, matches:0, postedDate:'Today', ...data } as JobPosting
      setJobs(j=>[newJ,...j])
    }
    setEditJob(null); setNewJob(false)
  }

  return (
    <RecruiterShell activeHref="/recruiter/opportunities">

      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:900, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ filter:'drop-shadow(0 0 8px #f59e0b)' }}>💼</span> Opportunities
          </h1>
          <p style={{ fontSize:10.5, color:'#475569', marginTop:2 }}>Create and manage job postings · AI matches students automatically</p>
        </div>
        <button className="rr-btn rr-btn--amber rr-btn--sm" onClick={()=>setNewJob(true)}>
          <Plus size={12}/> Create Posting
        </button>
      </motion.div>

      {/* KPIs */}
      <motion.div {...fadeUp(1)} className="rr-kpi-strip rr-kpi-strip--4" style={{ marginBottom:14 }}>
        {[
          { label:'Total Jobs',    value:jobs.length,                               delta:'All postings',         good:true,  color:'#f59e0b' },
          { label:'Active',        value:jobs.filter(j=>j.status==='active').length, delta:'Currently recruiting', good:true,  color:'#10b981' },
          { label:'Total Matches', value:jobs.reduce((a,j)=>a+j.matches,0),         delta:'AI matched students',  good:true,  color:'#a855f7' },
          { label:'Applicants',    value:jobs.reduce((a,j)=>a+j.applicants,0),       delta:'Across all jobs',      good:true,  color:'#06b6d4' },
        ].map(({ label, value, delta, good, color },i)=>(
          <motion.div key={label} {...fadeUp(i)} className="rr-kpi"
            style={{ boxShadow:`inset 0 0 40px ${color}09,0 4px 20px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.05)` }}>
            <span className={`rr-kpi__delta ${good?'rr-kpi__delta--good':'rr-kpi__delta--warn'}`}>{delta}</span>
            <p className="rr-kpi__value">{value}</p>
            <p className="rr-kpi__label">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp(2)} style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:12 }}>
        <div className="rr-search-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={12} className="rr-search-icon"/>
          <input className="rr-input rr-search" placeholder="Search jobs, skills, departments…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {(['all','full-time','internship','contract'] as const).map(t=>(
          <button key={t} className={`rr-pill ${typeFilter===t?'active':''}`} onClick={()=>setType(t)}>
            {t==='all'?'All Types':t}
          </button>
        ))}
        {(['all','active','paused','draft','closed'] as const).map(s=>(
          <button key={s} className={`rr-pill ${statusFil===s?'active':''}`} onClick={()=>setStatus(s)}>
            {s==='all'?'All Status':s}
          </button>
        ))}
      </motion.div>

      {/* 2-col layout: job list + detail */}
      <motion.div {...fadeUp(3)} style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:12 }}>

        {/* Job list */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.length===0 && (
            <div className="rr-empty"><span className="rr-empty__icon">📭</span><p className="rr-empty__title">No jobs found</p></div>
          )}
          {filtered.map((j,i)=>(
            <motion.div key={j.id} {...fadeUp(i)}
              className={`rr-job-card ${selected?.id===j.id?'selected':''}`}
              onClick={()=>setSelected(j)}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#f1f5f9', marginBottom:3 }}>{j.title}</p>
                  <p style={{ fontSize:10, color:'#475569' }}>{j.department} · {j.location}</p>
                </div>
                <span className={`rr-badge ${STATUS_BADGE[j.status]}`} style={{ marginLeft:8, flexShrink:0 }}>{j.status}</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
                <span className="rr-badge" style={{ background:`${TYPE_COLOR[j.type]}18`, color:TYPE_COLOR[j.type], border:`1px solid ${TYPE_COLOR[j.type]}28` }}>{j.type}</span>
                <span className="rr-badge" style={{ background:`${MODE_COLOR[j.mode]}14`, color:MODE_COLOR[j.mode], border:`1px solid ${MODE_COLOR[j.mode]}22` }}>{j.mode}</span>
                <span className="rr-badge rr-badge--amber">{j.package}</span>
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
                {j.skills.slice(0,4).map(s=>(
                  <span key={s} style={{ padding:'2px 7px', borderRadius:5, fontSize:9.5, fontWeight:600, background:'rgba(255,255,255,0.04)', color:'#64748b', border:'1px solid rgba(255,255,255,0.07)' }}>{s}</span>
                ))}
                {j.skills.length>4&&<span style={{ fontSize:9.5, color:'#475569' }}>+{j.skills.length-4}</span>}
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', gap:12 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, color:'#475569' }}><Users size={11}/> {j.applicants}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, color:'#a855f7' }}><Zap size={11}/> {j.matches} matches</span>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button className="rr-btn rr-btn--ghost rr-btn--sm" style={{ padding:'4px 8px' }} onClick={e=>{e.stopPropagation();setEditJob(j)}}>
                    <Edit2 size={11}/>
                  </button>
                  {j.status==='active'
                    ? <button className="rr-btn rr-btn--ghost rr-btn--sm" style={{ padding:'4px 8px' }} onClick={e=>{e.stopPropagation();updateStatus(j.id,'paused')}}><Pause size={11}/></button>
                    : <button className="rr-btn rr-btn--ghost rr-btn--sm" style={{ padding:'4px 8px' }} onClick={e=>{e.stopPropagation();updateStatus(j.id,'active')}}><Play size={11}/></button>
                  }
                  <button className="rr-btn rr-btn--danger rr-btn--sm" style={{ padding:'4px 8px' }} onClick={e=>{e.stopPropagation();deleteJob(j.id)}}><Trash2 size={11}/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Job detail */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={{ duration:0.22 }}
              className="rr-card" style={{ position:'sticky', top:0, height:'fit-content' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                <div>
                  <p style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:3 }}>{selected.title}</p>
                  <p style={{ fontSize:10, color:'#475569' }}>{selected.department} · Posted {selected.postedDate} · Closes {selected.deadline}</p>
                </div>
                <button className="rr-btn rr-btn--amber rr-btn--sm" onClick={()=>setEditJob(selected)}><Edit2 size={11}/> Edit</button>
              </div>

              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
                <span className={`rr-badge ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>
                <span className="rr-badge" style={{ background:`${TYPE_COLOR[selected.type]}18`, color:TYPE_COLOR[selected.type], border:`1px solid ${TYPE_COLOR[selected.type]}28` }}>{selected.type}</span>
                <span className="rr-badge rr-badge--amber">{selected.package}</span>
                <span className="rr-badge" style={{ background:`${MODE_COLOR[selected.mode]}14`, color:MODE_COLOR[selected.mode], border:`1px solid ${MODE_COLOR[selected.mode]}22` }}>{selected.mode}</span>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                {[
                  { l:'Applicants', v:selected.applicants, c:'#06b6d4' },
                  { l:'AI Matches', v:selected.matches,    c:'#a855f7' },
                ].map(({ l, v, c })=>(
                  <div key={l} style={{ padding:'10px 12px', borderRadius:12, textAlign:'center', background:`${c}0d`, border:`1px solid ${c}18` }}>
                    <p style={{ fontSize:20, fontWeight:900, color:c, lineHeight:1 }}>{v}</p>
                    <p style={{ fontSize:9, color:'#475569', marginTop:3, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>{l}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#475569', marginBottom:7 }}>Description</p>
              <p style={{ fontSize:11.5, color:'#94a3b8', lineHeight:1.7, marginBottom:14 }}>{selected.description}</p>

              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#475569', marginBottom:7 }}>Required Skills</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                {selected.skills.map(s=>(
                  <span key={s} style={{ padding:'3px 9px', borderRadius:6, fontSize:10, fontWeight:600, background:'rgba(245,158,11,0.12)', color:'#fde68a', border:'1px solid rgba(245,158,11,0.22)' }}>{s}</span>
                ))}
              </div>

              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#475569', marginBottom:7 }}>Requirements</p>
              <ul style={{ paddingLeft:14, margin:0 }}>
                {selected.requirements.map((r,i)=>(
                  <li key={i} style={{ fontSize:11, color:'#94a3b8', lineHeight:1.7 }}>{r}</li>
                ))}
              </ul>

              <hr className="rr-divider"/>
              <a href="/recruiter/talent" style={{ textDecoration:'none' }}>
                <button className="rr-btn rr-btn--primary rr-btn--full"><Zap size={12}/> Find Matching Talent</button>
              </a>
            </motion.div>
          ) : (
            <motion.div key="empty" className="rr-empty" initial={{ opacity:0 }} animate={{ opacity:0.35 }}>
              <span className="rr-empty__icon">📋</span>
              <p className="rr-empty__title">Select a job</p>
              <p className="rr-empty__sub">Click any posting to see details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {(newJob || editJob) && (
          <JobModal job={editJob??undefined} onClose={()=>{setEditJob(null);setNewJob(false)}} onSave={saveJob}/>
        )}
      </AnimatePresence>

      <div style={{ height:20 }}/>
    </RecruiterShell>
  )
}

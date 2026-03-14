'use client'

import '../college.css'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Clock, Circle, X, ExternalLink,
  Mail, Users, Filter,
} from 'lucide-react'
import CollegeShell from '@/components/college/dashboard/CollegeShell'
import {
  MOCK_STUDENTS,
  readinessColor,
  Branch, PlacementStatus,
} from '@/components/college/dashboard/college.types'
import type { Student } from '@/components/college/dashboard/college.types'

const STATUS_CFG: Record<PlacementStatus, { label:string; color:string; cls:string; icon:React.ElementType }> = {
  placed:        { label:'Placed',       color:'#10b981', cls:'cl-badge--emerald', icon: CheckCircle2 },
  'in-process':  { label:'In Process',   color:'#f59e0b', cls:'cl-badge--amber',   icon: Clock        },
  'not-started': { label:'Not Started',  color:'#64748b', cls:'cl-badge--dim',     icon: Circle       },
}

const BRANCHES: ('all' | Branch)[] = ['all','CSE','IT','ECE','MECH','CIVIL','EEE']
type SortKey = 'name' | 'readinessScore' | 'roadmapProgress' | 'streakDays' | 'resumeScore'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:10}, animate:{opacity:1,y:0},
  transition:{duration:0.35,delay:i*0.04,ease:[0.22,1,0.36,1] as const},
})

// ── Student detail drawer ─────────────────────────────────────────────────────
function StudentDrawer({ student, onClose }: { student: Student; onClose:()=>void }) {
  const rc = readinessColor(student.readinessScore)
  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
      style={{
        position:'fixed', right:0, top:0, bottom:0, width:360, zIndex:100,
        background:'rgba(6,2,18,0.97)', backdropFilter:'blur(24px)',
        borderLeft:'1px solid rgba(139,92,246,0.2)',
        boxShadow:'-20px 0 60px rgba(0,0,0,0.5)',
        overflowY:'auto', padding:24,
      }}
    >
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <p style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(167,139,250,0.7)'}}>Student Profile</p>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#475569',display:'flex'}}
          onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='#475569')}>
          <X size={16}/>
        </button>
      </div>

      {/* Avatar + name */}
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
        <div style={{
          width:52,height:52,borderRadius:14,flexShrink:0,
          background:`linear-gradient(135deg,${rc}30,${rc}18)`,
          border:`1.5px solid ${rc}40`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:14,fontWeight:900,color:rc,
        }}>{student.avatar}</div>
        <div>
          <p style={{fontSize:15,fontWeight:800,color:'#fff',marginBottom:2}}>{student.name}</p>
          <p style={{fontSize:10,color:'#475569'}}>{student.cosmosId}</p>
          <p style={{fontSize:10,color:'#94a3b8',marginTop:1}}>{student.email}</p>
        </div>
      </div>

      {/* Readiness ring */}
      <div style={{display:'flex',alignItems:'center',gap:16,padding:'14px',borderRadius:14,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',marginBottom:16}}>
        <div className="cl-ring-wrap" style={{width:70,height:70}}>
          <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
            <motion.circle cx="35" cy="35" r="28" fill="none" stroke={rc} strokeWidth="6"
              strokeLinecap="round" strokeDasharray={2*Math.PI*28}
              initial={{strokeDashoffset:2*Math.PI*28}}
              animate={{strokeDashoffset:2*Math.PI*28*(1-student.readinessScore/100)}}
              transition={{duration:1,ease:[0.22,1,0.36,1]}}
              style={{transformOrigin:'center',transform:'rotate(-90deg)',filter:`drop-shadow(0 0 5px ${rc})`}}
            />
          </svg>
          <div className="cl-ring-label">
            <span className="cl-ring-value" style={{fontSize:18,color:rc}}>{student.readinessScore}</span>
            <span className="cl-ring-sub">%</span>
          </div>
        </div>
        <div style={{flex:1}}>
          <p style={{fontSize:10,color:'#475569',marginBottom:6}}>Readiness Score</p>
          {[
            {l:'Roadmap',v:student.roadmapProgress,c:'#6366f1',cls:'cl-bar__fill--indigo'},
            {l:'Resume', v:student.resumeScore,     c:'#a855f7',cls:'cl-bar__fill--violet'},
          ].map(({l,v,c,cls})=>(
            <div key={l} style={{marginBottom:6}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{fontSize:9.5,color:'#475569'}}>{l}</span>
                <span style={{fontSize:9.5,fontWeight:700,color:c}}>{v}%</span>
              </div>
              <div className="cl-bar"><div className={`cl-bar__fill ${cls}`} style={{width:`${v}%`}}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Info grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
        {[
          {l:'Branch',    v:student.branch},
          {l:'Batch',     v:student.batch},
          {l:'Target Role',v:student.targetRole},
          {l:'Streak',    v:student.streakDays>0?`🔥 ${student.streakDays}d`:'—'},
          {l:'Assessments',v:student.assessmentsDone},
          {l:'Last Active',v:student.lastActive},
        ].map(({l,v})=>(
          <div key={l} style={{padding:'9px 11px',borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.065)'}}>
            <p style={{fontSize:9,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,marginBottom:3}}>{l}</p>
            <p style={{fontSize:11.5,fontWeight:700,color:'#e2e8f0'}}>{v}</p>
          </div>
        ))}
      </div>

      {/* Status */}
      <div style={{marginBottom:16}}>
        <p style={{fontSize:9,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,marginBottom:7}}>Placement Status</p>
        {(() => {
          const sc = STATUS_CFG[student.placementStatus]
          return (
            <span className={`cl-badge ${sc.cls}`} style={{fontSize:11}}>
              <sc.icon size={11}/> {sc.label}
            </span>
          )
        })()}
      </div>

      {/* Skills */}
      <div style={{marginBottom:20}}>
        <p style={{fontSize:9,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,marginBottom:7}}>Skills</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {student.skills.map(sk=>(
            <span key={sk} className="cl-badge cl-badge--indigo">{sk}</span>
          ))}
        </div>
      </div>

      {/* At-risk alert */}
      {student.isAtRisk && (
        <div className="cl-banner cl-banner--rose" style={{marginBottom:16}}>
          <AlertTriangle size={14} style={{color:'#f43f5e',flexShrink:0,marginTop:1}}/>
          <div>
            <p className="cl-banner__title">At-Risk Student</p>
            <p className="cl-banner__body">Readiness below 40%. Consider scheduling a mentoring session.</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <button className="cl-btn cl-btn--primary cl-btn--full"><Mail size={13}/> Send Nudge</button>
        <button className="cl-btn cl-btn--ghost cl-btn--full"><ExternalLink size={13}/> View Full COSMOS Profile</button>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [search,   setSearch]   = useState('')
  const [branch,   setBranch]   = useState<'all'|Branch>('all')
  const [status,   setStatus]   = useState<'all'|PlacementStatus>('all')
  const [riskOnly, setRiskOnly] = useState(false)
  const [sortKey,  setSortKey]  = useState<SortKey>('readinessScore')
  const [sortAsc,  setSortAsc]  = useState(false)
  const [selected, setSelected] = useState<Student|null>(null)

  function toggleSort(k: SortKey) {
    if (sortKey===k) setSortAsc(a=>!a)
    else { setSortKey(k); setSortAsc(false) }
  }

  const filtered = useMemo(()=>{
    let list = MOCK_STUDENTS
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s=>s.name.toLowerCase().includes(q)||s.cosmosId.toLowerCase().includes(q)||s.targetRole.toLowerCase().includes(q)||s.skills.some(sk=>sk.toLowerCase().includes(q)))
    }
    if (branch!=='all')  list = list.filter(s=>s.branch===branch)
    if (status!=='all')  list = list.filter(s=>s.placementStatus===status)
    if (riskOnly)        list = list.filter(s=>s.isAtRisk)
    return [...list].sort((a,b)=>{
      const va=a[sortKey],vb=b[sortKey]
      if (typeof va==='string') return sortAsc?va.localeCompare(vb as string):(vb as string).localeCompare(va)
      return sortAsc?(va as number)-(vb as number):(vb as number)-(va as number)
    })
  },[search,branch,status,riskOnly,sortKey,sortAsc])

  function SortIcon({k}:{k:SortKey}) {
    if (sortKey!==k) return <ChevronDown size={10} style={{opacity:0.3}}/>
    return sortAsc?<ChevronUp size={10} style={{color:'#a855f7'}}/> : <ChevronDown size={10} style={{color:'#a855f7'}}/>
  }

  const COLS: {label:string;key?:SortKey;w?:string}[] = [
    {label:'Student',  key:'name'},
    {label:'Branch'},
    {label:'Target Role'},
    {label:'Readiness', key:'readinessScore'},
    {label:'Roadmap',   key:'roadmapProgress'},
    {label:'Streak',    key:'streakDays'},
    {label:'Resume',    key:'resumeScore'},
    {label:'Status'},
  ]

  return (
    <CollegeShell activeHref="/college/students">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="cl-page-header">
        <div>
          <h1 className="cl-page-title"><span style={{filter:'drop-shadow(0 0 8px #a855f7)'}}>👥</span> Students</h1>
          <p className="cl-page-sub">{MOCK_STUDENTS.length} students registered · Batch 2025 · Filter, search and export</p>
        </div>
        <button className="cl-btn cl-btn--primary cl-btn--sm"><Mail size={12}/> Bulk Nudge</button>
      </motion.div>

      {/* KPI strip */}
      <motion.div {...fadeUp(1)} className="cl-kpi-strip cl-kpi-strip--4" style={{marginBottom:14}}>
        {[
          {label:'Total',      value:MOCK_STUDENTS.length,                                       delta:'All branches', good:true,  color:'#6366f1'},
          {label:'High Ready', value:MOCK_STUDENTS.filter(s=>s.readinessScore>=75).length,        delta:'Score ≥ 75%',  good:true,  color:'#10b981'},
          {label:'At Risk',    value:MOCK_STUDENTS.filter(s=>s.isAtRisk).length,                  delta:'Need support', good:false, color:'#f43f5e'},
          {label:'Placed',     value:MOCK_STUDENTS.filter(s=>s.placementStatus==='placed').length, delta:'This batch',  good:true,  color:'#a855f7'},
        ].map(({label,value,delta,good,color},i)=>(
          <motion.div key={label} {...fadeUp(i)} className="cl-kpi"
            style={{boxShadow:`inset 0 0 40px ${color}09,0 4px 20px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.05)`}}>
            <span className={`cl-kpi__delta ${good?'cl-kpi__delta--good':'cl-kpi__delta--warn'}`}>{delta}</span>
            <p className="cl-kpi__value">{value}</p>
            <p className="cl-kpi__label">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp(2)} style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:12,alignItems:'center'}}>
        <div className="cl-search-wrap" style={{minWidth:200,flex:1}}>
          <Search size={13} className="cl-search-icon"/>
          <input className="cl-input cl-search" placeholder="Search name, role, skills…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {BRANCHES.map(b=>(
          <button key={b} className={`cl-pill ${branch===b?'active':''}`} onClick={()=>setBranch(b)}>
            {b==='all'?'All Branches':b}
          </button>
        ))}
        <button className={`cl-pill ${riskOnly?'cl-pill--danger active':''}`} onClick={()=>setRiskOnly(r=>!r)}>
          <AlertTriangle size={10}/> At Risk
        </button>
        {(search||branch!=='all'||riskOnly||status!=='all')&&(
          <button className="cl-btn cl-btn--ghost cl-btn--sm" onClick={()=>{setSearch('');setBranch('all');setStatus('all');setRiskOnly(false)}}>
            Clear
          </button>
        )}
        <span style={{marginLeft:'auto',fontSize:10,color:'#475569'}}>{filtered.length} result{filtered.length!==1?'s':''}</span>
      </motion.div>

      {/* Table */}
      <motion.div {...fadeUp(3)} className="cl-table-wrap">
        <table className="cl-table">
          <thead>
            <tr>
              {COLS.map(col=>(
                <th key={col.label} onClick={()=>col.key&&toggleSort(col.key)}>
                  <span style={{display:'flex',alignItems:'center',gap:4}}>
                    {col.label}{col.key&&<SortIcon k={col.key}/>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0?(
              <tr><td colSpan={8}>
                <div className="cl-empty"><span className="cl-empty__icon">🔭</span><p className="cl-empty__title">No students match</p></div>
              </td></tr>
            ):filtered.map((s,i)=>{
              const rc = readinessColor(s.readinessScore)
              const sc = STATUS_CFG[s.placementStatus]
              return (
                <motion.tr key={s.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}
                  onClick={()=>setSelected(s)}
                  style={{background:s.isAtRisk?'rgba(244,63,94,0.025)':'transparent'}}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:9}}>
                      <div className="cl-avatar" style={{background:`${rc}20`,border:`1px solid ${rc}30`,color:rc}}>{s.avatar}</div>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:5}}>
                          <p style={{fontSize:12,fontWeight:700,color:'#f1f5f9'}}>{s.name}</p>
                          {s.isAtRisk&&<AlertTriangle size={10} style={{color:'#f43f5e'}}/>}
                        </div>
                        <p style={{fontSize:9.5,color:'#475569'}}>{s.cosmosId}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="cl-badge cl-badge--cyan">{s.branch}</span></td>
                  <td><p style={{fontSize:11,color:'#94a3b8'}}>{s.targetRole}</p></td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div className="cl-bar" style={{width:56}}>
                        <motion.div className="cl-bar__fill" style={{width:`${s.readinessScore}%`,background:rc,boxShadow:`0 0 5px ${rc}`}}
                          initial={{width:0}} animate={{width:`${s.readinessScore}%`}} transition={{duration:0.7,delay:i*0.02}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:800,color:rc}}>{s.readinessScore}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div className="cl-bar" style={{width:44}}>
                        <div className="cl-bar__fill cl-bar__fill--indigo" style={{width:`${s.roadmapProgress}%`}}/>
                      </div>
                      <span style={{fontSize:11,color:'#6366f1',fontWeight:700}}>{s.roadmapProgress}%</span>
                    </div>
                  </td>
                  <td><span style={{fontSize:11,fontWeight:700,color:s.streakDays>=30?'#f59e0b':'#475569'}}>{s.streakDays>0?`🔥 ${s.streakDays}d`:'—'}</span></td>
                  <td><span style={{fontSize:11,fontWeight:700,color:'#a855f7'}}>{s.resumeScore}%</span></td>
                  <td>
                    <span className={`cl-badge ${sc.cls}`}>
                      <sc.icon size={10}/> {sc.label}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Drawer */}
      <AnimatePresence>
        {selected&&(
          <>
            <motion.div key="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={()=>setSelected(null)}
              style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:99,backdropFilter:'blur(2px)'}}/>
            <StudentDrawer key="drawer" student={selected} onClose={()=>setSelected(null)}/>
          </>
        )}
      </AnimatePresence>
    </CollegeShell>
  )
}

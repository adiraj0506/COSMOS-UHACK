'use client'

import '../recruiter.css'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, TrendingUp, Building2, Users, Award, Mail } from 'lucide-react'
import RecruiterShell from '@/components/recruiter/dashboard/RecruiterShell'
import MailModal      from '@/components/recruiter/dashboard/MailModal'
import { MOCK_COLLEGES, contactBadge } from '@/components/recruiter/dashboard/recruiter.types'
import type { CollegeListing } from '@/components/recruiter/dashboard/recruiter.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.36,delay:i*0.05,ease:[0.22,1,0.36,1] as const},
})

type SortKey = 'avgReadiness' | 'avgPackage' | 'placementRate' | 'totalStudents'
type TierFilter = 'all' | 'Tier 1' | 'Tier 2' | 'Tier 3'

export default function CollegesPage() {
  const [search,     setSearch]    = useState('')
  const [tierFilter, setTier]      = useState<TierFilter>('all')
  const [sortKey,    setSortKey]   = useState<SortKey>('avgReadiness')
  const [selected,   setSelected]  = useState<CollegeListing|null>(null)
  const [mailTarget, setMailTarget]= useState<CollegeListing|null>(null)

  const sorted = useMemo(()=>{
    let list = MOCK_COLLEGES
    if (search.trim()) { const q=search.toLowerCase(); list=list.filter(c=>c.name.toLowerCase().includes(q)||c.city.toLowerCase().includes(q)) }
    if (tierFilter!=='all') list=list.filter(c=>c.tier===tierFilter)
    return [...list].sort((a,b)=>(b[sortKey] as number)-(a[sortKey] as number))
  },[search,tierFilter,sortKey])

  return (
    <RecruiterShell activeHref="/recruiter/colleges">

      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:900, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ filter:'drop-shadow(0 0 8px #10b981)' }}>🏫</span> Colleges
          </h1>
          <p style={{ fontSize:10.5, color:'#475569', marginTop:2 }}>
            Ranked by readiness · avg package · placement rate · contact for recruitment drives
          </p>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div {...fadeUp(1)} className="rr-kpi-strip rr-kpi-strip--4" style={{ marginBottom:14 }}>
        {[
          { label:'Partner Colleges',  value:MOCK_COLLEGES.length, delta:'On COSMOS', good:true, color:'#10b981' },
          { label:'Total Students',    value:MOCK_COLLEGES.reduce((a,c)=>a+c.totalStudents,0), delta:'Across all colleges', good:true, color:'#06b6d4' },
          { label:'Avg Readiness',     value:`${Math.round(MOCK_COLLEGES.reduce((a,c)=>a+c.avgReadiness,0)/MOCK_COLLEGES.length)}%`, delta:'Platform average', good:true, color:'#a855f7' },
          { label:'Contacted',         value:MOCK_COLLEGES.filter(c=>c.contactStatus!=='not-contacted').length, delta:`${MOCK_COLLEGES.length} total`, good:true, color:'#f59e0b' },
        ].map(({ label, value, delta, good, color },i)=>(
          <motion.div key={label} {...fadeUp(i)} className="rr-kpi"
            style={{ boxShadow:`inset 0 0 40px ${color}09,0 4px 20px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.05)` }}>
            <span className={`rr-kpi__delta ${good?'rr-kpi__delta--good':'rr-kpi__delta--warn'}`}>{delta}</span>
            <p className="rr-kpi__value">{value}</p>
            <p className="rr-kpi__label">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters + sort */}
      <motion.div {...fadeUp(2)} style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:12 }}>
        <div className="rr-search-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={12} className="rr-search-icon"/>
          <input className="rr-input rr-search" placeholder="Search college name or city…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {(['all','Tier 1','Tier 2','Tier 3'] as TierFilter[]).map(t=>(
          <button key={t} className={`rr-pill ${tierFilter===t?'active':''}`} onClick={()=>setTier(t)}>{t==='all'?'All Tiers':t}</button>
        ))}
        <select className="rr-input" style={{ width:'auto', padding:'6px 12px', fontSize:11, borderRadius:10, appearance:'none', color:'#94a3b8' }}
          value={sortKey} onChange={e=>setSortKey(e.target.value as SortKey)}>
          <option value="avgReadiness">Sort: Readiness</option>
          <option value="avgPackage">Sort: Avg Package</option>
          <option value="placementRate">Sort: Placement Rate</option>
          <option value="totalStudents">Sort: Students</option>
        </select>
      </motion.div>

      {/* 2-col: cards + detail */}
      <motion.div {...fadeUp(3)} style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:12 }}>

        {/* College cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {sorted.map((c,i)=>{
            const cb = contactBadge(c.contactStatus)
            const tierCls = c.tier==='Tier 1'?'rr-tier-1':c.tier==='Tier 2'?'rr-tier-2':'rr-tier-3'
            return (
              <motion.div key={c.id} {...fadeUp(i)} className="rr-college-card"
                style={{ cursor:'pointer', border:`1px solid ${selected?.id===c.id?c.color+'45':'rgba(255,255,255,0.072)'}`, background:selected?.id===c.id?`${c.color}06`:'rgba(255,255,255,0.032)' }}
                onClick={()=>setSelected(c)}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  {/* Rank badge */}
                  <div style={{ width:24, height:24, borderRadius:7, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fde68a', flexShrink:0 }}>
                    {i+1}
                  </div>
                  {/* Logo */}
                  <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, background:`${c.color}18`, border:`1px solid ${c.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:c.color }}>
                    {c.logo}
                  </div>
                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>{c.name}</p>
                      <span className={`rr-badge ${tierCls}`} style={{ fontSize:8.5 }}>{c.tier}</span>
                    </div>
                    <p style={{ fontSize:10, color:'#475569' }}>{c.city}, {c.state} · {c.totalStudents} students</p>
                  </div>
                </div>

                {/* Stats bar */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  {[
                    { l:'Avg Readiness', v:`${c.avgReadiness}%`, c:'#a855f7', bar:c.avgReadiness },
                    { l:'Avg Package',   v:`₹${c.avgPackage}L`,  c:'#10b981', bar:Math.min(c.avgPackage*2,100) },
                    { l:'Placement',     v:`${c.placementRate}%`,c:'#06b6d4', bar:c.placementRate },
                  ].map(({ l, v, c:col, bar })=>(
                    <div key={l}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                        <span style={{ fontSize:9, color:'#475569' }}>{l}</span>
                        <span style={{ fontSize:10, fontWeight:800, color:col }}>{v}</span>
                      </div>
                      <div className="rr-bar">
                        <motion.div className="rr-bar__fill" style={{ background:col, width:`${bar}%` }}
                          initial={{ width:0 }} animate={{ width:`${bar}%` }} transition={{ duration:0.8, delay:0.1+i*0.04 }}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills + contact */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    {c.topSkills.slice(0,3).map(s=>(
                      <span key={s} style={{ padding:'2px 7px', borderRadius:5, fontSize:9, fontWeight:600, background:`${c.color}12`, color:c.color, border:`1px solid ${c.color}22` }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    <span className="rr-badge" style={{ fontSize:8.5, padding:'2px 7px', background:cb.bg, color:cb.color, border:`1px solid ${cb.color}30` }}>{cb.label}</span>
                    <button className="rr-btn rr-btn--emerald rr-btn--sm" style={{ padding:'5px 11px', fontSize:9.5 }}
                      onClick={e=>{e.stopPropagation();setMailTarget(c)}}>
                      <Mail size={10}/> Contact
                    </button>
                  </div>
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
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(167,139,250,0.7)', marginBottom:14 }}>College Detail</p>

                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ width:52, height:52, borderRadius:14, flexShrink:0, background:`${selected.color}18`, border:`1px solid ${selected.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:selected.color }}>
                    {selected.logo}
                  </div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:800, color:'#fff', marginBottom:3 }}>{selected.name}</p>
                    <p style={{ fontSize:10, color:'#475569' }}>{selected.city}, {selected.state}</p>
                    <span className={`rr-badge ${selected.tier==='Tier 1'?'rr-tier-1':selected.tier==='Tier 2'?'rr-tier-2':'rr-tier-3'}`} style={{ fontSize:8.5, marginTop:4 }}>{selected.tier}</span>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                  {[
                    { l:'Students',   v:selected.totalStudents, c:'#06b6d4' },
                    { l:'Readiness',  v:`${selected.avgReadiness}%`, c:'#a855f7' },
                    { l:'Avg Package',v:`₹${selected.avgPackage}L`, c:'#10b981' },
                    { l:'Placed',     v:`${selected.placementRate}%`,c:'#f59e0b' },
                  ].map(({ l, v, c })=>(
                    <div key={l} style={{ padding:'10px 12px', borderRadius:12, textAlign:'center', background:`${c}0d`, border:`1px solid ${c}18` }}>
                      <p style={{ fontSize:16, fontWeight:900, color:c, lineHeight:1 }}>{v}</p>
                      <p style={{ fontSize:8.5, color:'#475569', marginTop:2, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>{l}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize:9, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:7 }}>Top Skills</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                  {selected.topSkills.map(s=>(
                    <span key={s} style={{ padding:'3px 9px', borderRadius:6, fontSize:10, fontWeight:600, background:`${selected.color}14`, color:selected.color, border:`1px solid ${selected.color}25` }}>{s}</span>
                  ))}
                </div>

                <p style={{ fontSize:9, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:7 }}>Contact Person</p>
                <div style={{ padding:'10px 13px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:14 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'#f1f5f9', marginBottom:2 }}>{selected.contactPerson}</p>
                  <p style={{ fontSize:10, color:'#475569' }}>{selected.contactEmail}</p>
                </div>

                <hr className="rr-divider"/>
                <button className="rr-btn rr-btn--emerald rr-btn--full"
                  onClick={()=>setMailTarget(selected)}>
                  <Mail size={13}/> Contact for Campus Drive
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" className="rr-empty" style={{ opacity:0.3 }} initial={{ opacity:0 }} animate={{ opacity:0.3 }}>
                <span className="rr-empty__icon">🏫</span>
                <p className="rr-empty__title">Select a college</p>
                <p className="rr-empty__sub">Click any card for details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {mailTarget && (
          <MailModal
            target={{ type:'college', name:mailTarget.contactPerson, email:mailTarget.contactEmail, college:mailTarget.name }}
            onClose={()=>setMailTarget(null)}
            onSent={()=>setMailTarget(null)}
          />
        )}
      </AnimatePresence>

      <div style={{ height:20 }}/>
    </RecruiterShell>
  )
}

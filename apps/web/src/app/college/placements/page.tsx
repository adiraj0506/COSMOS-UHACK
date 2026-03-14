'use client'

import '../college.css'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy, Building2, TrendingUp, Search,
  ExternalLink, Plus, Filter,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import CollegeShell from '@/components/college/dashboard/CollegeShell'
import {
  MOCK_PLACEMENTS, MOCK_STUDENTS, MOCK_BRANCH_STATS,
} from '@/components/college/dashboard/college.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.36,delay:i*0.06,ease:[0.22,1,0.36,1] as const},
})

const TT = {
  contentStyle:{background:'rgba(6,2,18,0.97)',border:'1px solid rgba(139,92,246,0.22)',borderRadius:10,fontSize:11,color:'#e5e7eb'},
  cursor:{stroke:'rgba(139,92,246,0.2)',strokeWidth:1},
}

// Extended mock placements for the table
const ALL_PLACEMENTS = [
  ...MOCK_PLACEMENTS,
  { id:'p5', studentId:'s4', student:'Sneha Iyer',   company:'Amazon',   role:'Data Engineer',  package:'38 LPA', date:'Mar 2025', branch:'CSE' as const, logoColor:'#f59e0b' },
  { id:'p6', studentId:'s1', student:'Akash Sharma',  company:'Flipkart', role:'Backend Dev',    package:'24 LPA', date:'Feb 2025', branch:'CSE' as const, logoColor:'#2563eb' },
  { id:'p7', studentId:'s11',student:'Nikhil Verma',  company:'Swiggy',   role:'Backend Dev',    package:'22 LPA', date:'Jan 2025', branch:'IT'  as const, logoColor:'#f97316' },
]

const COMPANY_STATS = [
  { company:'Google',   count:1, avgPkg:45, color:'#4285f4' },
  { company:'OpenAI',   count:1, avgPkg:80, color:'#10b981' },
  { company:'Amazon',   count:1, avgPkg:38, color:'#f59e0b' },
  { company:'Flipkart', count:1, avgPkg:24, color:'#2563eb' },
  { company:'Razorpay', count:1, avgPkg:28, color:'#6366f1' },
  { company:'Swiggy',   count:1, avgPkg:22, color:'#f97316' },
  { company:'Zepto',    count:1, avgPkg:22, color:'#7c3aed' },
]

export default function PlacementsPage() {
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState<'all'|string>('all')

  const filtered = useMemo(()=>{
    let list = ALL_PLACEMENTS
    if (search.trim()) { const q=search.toLowerCase(); list=list.filter(p=>p.student.toLowerCase().includes(q)||p.company.toLowerCase().includes(q)||p.role.toLowerCase().includes(q)) }
    if (branch!=='all') list=list.filter(p=>p.branch===branch)
    return list
  },[search,branch])

  const totalPlaced = ALL_PLACEMENTS.length
  const avgPkg = Math.round(ALL_PLACEMENTS.reduce((a,p)=>a+parseInt(p.package),0)/totalPlaced)
  const highestPkg = Math.max(...ALL_PLACEMENTS.map(p=>parseInt(p.package)))
  const placePct = Math.round((totalPlaced/MOCK_STUDENTS.length)*100)

  return (
    <CollegeShell activeHref="/college/placements">

      <motion.div {...fadeUp(0)} className="cl-page-header">
        <div>
          <h1 className="cl-page-title"><span style={{filter:'drop-shadow(0 0 8px #10b981)'}}>🏆</span> Placements</h1>
          <p className="cl-page-sub">Track placement records, company stats and package distribution for Batch 2025</p>
        </div>
        <button className="cl-btn cl-btn--emerald cl-btn--sm"><Plus size={12}/> Add Record</button>
      </motion.div>

      {/* KPIs */}
      <motion.div {...fadeUp(1)} className="cl-kpi-strip cl-kpi-strip--4" style={{marginBottom:16}}>
        {[
          {label:'Total Placed',    value:totalPlaced,    delta:`${placePct}% rate`,    good:placePct>=30, color:'#10b981'},
          {label:'Avg Package',     value:`${avgPkg} LPA`,delta:'Across all offers',    good:true,         color:'#a855f7'},
          {label:'Highest Package', value:`${highestPkg} LPA`,delta:'OpenAI · ML Eng', good:true,         color:'#f59e0b'},
          {label:'Companies',       value:COMPANY_STATS.length,delta:'Recruited from campus',good:true,   color:'#06b6d4'},
        ].map(({label,value,delta,good,color},i)=>(
          <motion.div key={label} {...fadeUp(i)} className="cl-kpi"
            style={{boxShadow:`inset 0 0 40px ${color}09,0 4px 20px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.05)`}}>
            <span className={`cl-kpi__delta ${good?'cl-kpi__delta--good':'cl-kpi__delta--warn'}`}>{delta}</span>
            <p className="cl-kpi__value" style={{fontSize:20}}>{value}</p>
            <p className="cl-kpi__label">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <motion.div {...fadeUp(2)}>
        <p className="cl-section-title">✦ Company & Branch Stats</p>
        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:12,marginBottom:16}}>

          {/* Package by company */}
          <div className="cl-card cl-card--emerald">
            <p className="cl-label">Average Package by Company (LPA)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={COMPANY_STATS} layout="vertical" margin={{top:4,right:16,bottom:4,left:60}}>
                <XAxis type="number" tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="company" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false} width={58}/>
                <Tooltip {...TT} formatter={(v: number) => [`${v} LPA`, "Package"]} />

                  <Bar dataKey="avgPkg" radius={[0, 4, 4, 0]}>
                    {COMPANY_STATS.map((c, i) => (
                    <Cell key={i} fill={c.color} opacity={0.8} />
                 ))}
              </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Placement by branch */}
          <div className="cl-card">
            <p className="cl-label">Placement % by Branch</p>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
              {MOCK_BRANCH_STATS.filter(b=>b.placed>0).map(b=>(
                <div key={b.branch}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{width:8,height:8,borderRadius:2,background:b.color,boxShadow:`0 0 4px ${b.color}`}}/>
                      <span style={{fontSize:11,fontWeight:600,color:'#94a3b8'}}>{b.branch}</span>
                    </div>
                    <div style={{display:'flex',gap:10}}>
                      <span style={{fontSize:10,color:'#475569'}}>{b.placed}/{b.total}</span>
                      <span style={{fontSize:11,fontWeight:800,color:b.color}}>{Math.round(b.placed/b.total*100)}%</span>
                    </div>
                  </div>
                  <div className="cl-bar cl-bar--md">
                    <motion.div className="cl-bar__fill" style={{background:b.color,width:`${Math.round(b.placed/b.total*100)}%`}}
                      initial={{width:0}} animate={{width:`${Math.round(b.placed/b.total*100)}%`}} transition={{duration:0.8,ease:[0.22,1,0.36,1]}}/>
                  </div>
                </div>
              ))}
            </div>

            <div className="cl-banner cl-banner--cyan" style={{marginTop:14,marginBottom:0}}>
              <span style={{fontSize:14}}>🎯</span>
              <div>
                <p className="cl-banner__title">Target: 60% Placement Rate</p>
                <p className="cl-banner__body">Currently at {placePct}%. Focus on at-risk students to close the gap.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Placement table */}
      <motion.div {...fadeUp(3)}>
        <p className="cl-section-title">✦ All Placement Records</p>
        <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
          <div className="cl-search-wrap" style={{flex:1,minWidth:200}}>
            <Search size={12} className="cl-search-icon"/>
            <input className="cl-input cl-search" placeholder="Search student, company, role…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {['all','CSE','IT','ECE'].map(b=>(
            <button key={b} className={`cl-pill ${branch===b?'active':''}`} onClick={()=>setBranch(b)}>
              {b==='all'?'All Branches':b}
            </button>
          ))}
        </div>

        <div className="cl-table-wrap">
          <table className="cl-table">
            <thead>
              <tr>
                {['Student','Branch','Company','Role','Package','Date',''].map(h=><th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0?(
                <tr><td colSpan={7}><div className="cl-empty"><span className="cl-empty__icon">🏆</span><p className="cl-empty__title">No records found</p></div></td></tr>
              ):filtered.map((p,i)=>(
                <motion.tr key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:9}}>
                      <div className="cl-avatar" style={{background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.25)',color:'#10b981',fontSize:10}}>
                        {p.student.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <p style={{fontSize:12,fontWeight:700,color:'#f1f5f9'}}>{p.student}</p>
                    </div>
                  </td>
                  <td><span className="cl-badge cl-badge--cyan">{p.branch}</span></td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:26,height:26,borderRadius:7,background:`${p.logoColor}20`,border:`1px solid ${p.logoColor}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:p.logoColor}}>
                        {p.company[0]}
                      </div>
                      <span style={{fontSize:12,fontWeight:600,color:'#f1f5f9'}}>{p.company}</span>
                    </div>
                  </td>
                  <td><p style={{fontSize:11,color:'#94a3b8'}}>{p.role}</p></td>
                  <td><p style={{fontSize:13,fontWeight:900,color:'#10b981'}}>{p.package}</p></td>
                  <td><p style={{fontSize:10,color:'#475569'}}>{p.date}</p></td>
                  <td>
                    <button className="cl-btn cl-btn--ghost cl-btn--sm"><ExternalLink size={10}/></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div style={{height:20}}/>
    </CollegeShell>
  )
}

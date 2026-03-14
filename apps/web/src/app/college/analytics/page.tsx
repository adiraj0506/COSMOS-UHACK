'use client'

import '../college.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'
import CollegeShell from '@/components/college/dashboard/CollegeShell'
import {
  MOCK_STUDENTS, MOCK_BRANCH_STATS, MOCK_TREND, MOCK_SKILL_GAPS,
} from '@/components/college/dashboard/college.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.36,delay:i*0.07,ease:[0.22,1,0.36,1] as const},
})

const TT = {
  contentStyle:{background:'rgba(6,2,18,0.97)',border:'1px solid rgba(139,92,246,0.22)',borderRadius:10,fontSize:11,color:'#e5e7eb'},
  cursor:{stroke:'rgba(139,92,246,0.2)',strokeWidth:1},
}

// ── Radar data ────────────────────────────────────────────────────────────────
const RADAR_DATA = [
  {subject:'DSA',        A:68},
  {subject:'Web Dev',    A:74},
  {subject:'System Design',A:42},
  {subject:'Cloud',      A:55},
  {subject:'Databases',  A:71},
  {subject:'DevOps',     A:49},
]

// ── Engagement data ───────────────────────────────────────────────────────────
const ENGAGEMENT = [
  {day:'Mon', logins:142, assessments:38, roadmap:55},
  {day:'Tue', logins:168, assessments:52, roadmap:71},
  {day:'Wed', logins:155, assessments:44, roadmap:63},
  {day:'Thu', logins:178, assessments:61, roadmap:82},
  {day:'Fri', logins:191, assessments:67, roadmap:88},
  {day:'Sat', logins:98,  assessments:29, roadmap:41},
  {day:'Sun', logins:72,  assessments:18, roadmap:30},
]

export default function AnalyticsPage() {
  const [activeBranch, setActiveBranch] = useState<string|null>(null)

  const avgReady   = Math.round(MOCK_STUDENTS.reduce((a,s)=>a+s.readinessScore,0)/MOCK_STUDENTS.length)
  const avgRoadmap = Math.round(MOCK_STUDENTS.reduce((a,s)=>a+s.roadmapProgress,0)/MOCK_STUDENTS.length)
  const avgResume  = Math.round(MOCK_STUDENTS.reduce((a,s)=>a+s.resumeScore,0)/MOCK_STUDENTS.length)
  const avgStreak  = Math.round(MOCK_STUDENTS.reduce((a,s)=>a+s.streakDays,0)/MOCK_STUDENTS.length)

  return (
    <CollegeShell activeHref="/college/analytics">

      <motion.div {...fadeUp(0)} className="cl-page-header">
        <div>
          <h1 className="cl-page-title"><span style={{filter:'drop-shadow(0 0 8px #a855f7)'}}>📊</span> Analytics</h1>
          <p className="cl-page-sub">Deep insights across readiness, engagement, skill gaps and batch progress</p>
        </div>
      </motion.div>

      {/* Summary KPIs */}
      <motion.div {...fadeUp(1)} className="cl-kpi-strip cl-kpi-strip--4" style={{marginBottom:16}}>
        {[
          {label:'Avg Readiness',    value:`${avgReady}%`,   delta:'+8% vs last month', good:true,  color:'#a855f7'},
          {label:'Avg Roadmap',      value:`${avgRoadmap}%`, delta:'On track',          good:true,  color:'#6366f1'},
          {label:'Avg Resume Score', value:`${avgResume}%`,  delta:'Needs work',        good:false, color:'#06b6d4'},
          {label:'Avg Streak',       value:`${avgStreak}d`,  delta:'Daily activity',    good:true,  color:'#f59e0b'},
        ].map(({label,value,delta,good,color},i)=>(
          <motion.div key={label} {...fadeUp(i)} className="cl-kpi"
            style={{boxShadow:`inset 0 0 40px ${color}09,0 4px 20px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.05)`}}>
            <span className={`cl-kpi__delta ${good?'cl-kpi__delta--good':'cl-kpi__delta--warn'}`}>{delta}</span>
            <p className="cl-kpi__value" style={{fontSize:20}}>{value}</p>
            <p className="cl-kpi__label">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Row 1: Readiness Trend + Engagement */}
      <motion.div {...fadeUp(2)}>
        <p className="cl-section-title">✦ Readiness Trend & Daily Engagement</p>
        <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:12,marginBottom:14}}>

          {/* Readiness trend */}
          <div className="cl-card cl-card--violet">
            <div className="cl-card-header">
              <p className="cl-label" style={{marginBottom:0}}>Readiness Over Time</p>
              <div style={{display:'flex',gap:10}}>
                {[{l:'High',c:'#10b981'},{l:'Avg',c:'#a855f7'},{l:'Low',c:'#f43f5e'}].map(({l,c})=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:4}}>
                    <div style={{width:8,height:3,borderRadius:999,background:c}}/>
                    <span style={{fontSize:9,color:'#475569'}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MOCK_TREND} margin={{top:4,right:4,bottom:0,left:-24}}>
                <defs>
                  <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gAvg"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a855f7" stopOpacity={0.25}/><stop offset="100%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                <Tooltip {...TT}/>
                <Area type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1.5} fill="url(#gHigh)" dot={false} activeDot={{r:3,fill:'#10b981',stroke:'#040a1c',strokeWidth:2}}/>
                <Area type="monotone" dataKey="avg"  stroke="#a855f7" strokeWidth={2}   fill="url(#gAvg)"  dot={false} activeDot={{r:4,fill:'#a855f7',stroke:'#040a1c',strokeWidth:2}}/>
                <Area type="monotone" dataKey="low"  stroke="#f43f5e" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:12}}>
              {[
                {l:'Current Avg',v:`${MOCK_TREND[MOCK_TREND.length-1].avg}%`,c:'#a855f7'},
                {l:'Peak High',  v:`${Math.max(...MOCK_TREND.map(t=>t.high))}%`,c:'#10b981'},
                {l:'6mo Gain',   v:`+${MOCK_TREND[MOCK_TREND.length-1].avg-MOCK_TREND[0].avg}%`,c:'#06b6d4'},
              ].map(({l,v,c})=>(
                <div key={l} style={{padding:'8px 10px',borderRadius:10,textAlign:'center',background:`${c}10`,border:`1px solid ${c}20`}}>
                  <p style={{fontSize:14,fontWeight:900,color:c,lineHeight:1}}>{v}</p>
                  <p style={{fontSize:8.5,color:'#475569',marginTop:2,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600}}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly engagement */}
          <div className="cl-card cl-card--indigo">
            <p className="cl-label">Weekly Platform Engagement</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ENGAGEMENT} margin={{top:4,right:4,bottom:0,left:-24}} barGap={2}>
                <XAxis dataKey="day" tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                <Tooltip {...TT}/>
                <Legend wrapperStyle={{fontSize:9,color:'#475569'}}/>
                <Bar dataKey="logins"      name="Logins"      fill="#6366f1" opacity={0.8} radius={[3,3,0,0]}/>
                <Bar dataKey="assessments" name="Assessments" fill="#a855f7" opacity={0.8} radius={[3,3,0,0]}/>
                <Bar dataKey="roadmap"     name="Roadmap"     fill="#06b6d4" opacity={0.7} radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Row 2: Branch stats + Skill radar + Skill gaps */}
      <motion.div {...fadeUp(3)}>
        <p className="cl-section-title">✦ Branch Performance & Skill Coverage</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:14}}>

          {/* Branch breakdown */}
          <div className="cl-card cl-card--cyan">
            <p className="cl-label">Branch Breakdown</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {MOCK_BRANCH_STATS.map(b=>(
                <div key={b.branch}
                  style={{padding:'10px 12px',borderRadius:12,cursor:'pointer',transition:'all 0.15s',
                    background:activeBranch===b.branch?`${b.color}12`:'rgba(255,255,255,0.02)',
                    border:`1px solid ${activeBranch===b.branch?b.color+'35':'rgba(255,255,255,0.06)'}`}}
                  onClick={()=>setActiveBranch(activeBranch===b.branch?null:b.branch)}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{width:9,height:9,borderRadius:2,background:b.color,boxShadow:`0 0 4px ${b.color}`}}/>
                      <span style={{fontSize:12,fontWeight:700,color:'#f1f5f9'}}>{b.branch}</span>
                      <span style={{fontSize:10,color:'#475569'}}>{b.total} students</span>
                    </div>
                    <span style={{fontSize:12,fontWeight:800,color:b.color}}>{b.avgReadiness}%</span>
                  </div>
                  <div className="cl-bar cl-bar--md">
                    <motion.div className="cl-bar__fill" style={{background:b.color,boxShadow:`0 0 5px ${b.color}`,width:`${b.avgReadiness}%`}}
                      initial={{width:0}} animate={{width:`${b.avgReadiness}%`}} transition={{duration:0.8,ease:[0.22,1,0.36,1]}}/>
                  </div>
                  {activeBranch===b.branch&&(
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} transition={{duration:0.2}}
                      style={{marginTop:8,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
                      {[{l:'Placed',v:b.placed,c:'#10b981'},{l:'At Risk',v:b.atRisk,c:'#f43f5e'},{l:'Total',v:b.total,c:'#94a3b8'}].map(({l,v,c})=>(
                        <div key={l} style={{textAlign:'center'}}>
                          <p style={{fontSize:14,fontWeight:900,color:c}}>{v}</p>
                          <p style={{fontSize:8.5,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em'}}>{l}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skill radar */}
          <div className="cl-card">
            <p className="cl-label">Skill Coverage Radar</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={RADAR_DATA} margin={{top:10,right:20,bottom:10,left:20}}>
                <PolarGrid stroke="rgba(255,255,255,0.07)"/>
                <PolarAngleAxis dataKey="subject" tick={{fill:'#475569',fontSize:9}}/>
                <Radar name="Avg Coverage" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.18}
                  dot={{fill:'#a855f7',r:3}} activeDot={{r:5,fill:'#a855f7',stroke:'#040a1c',strokeWidth:2}}/>
                <Tooltip {...TT}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill gaps */}
          <div className="cl-card cl-card--rose">
            <p className="cl-label">Top Skill Gaps</p>
            <p style={{fontSize:10,color:'#334155',marginBottom:12,lineHeight:1.5}}>Skills most students haven't yet mastered.</p>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {MOCK_SKILL_GAPS.map((sg,i)=>(
                <motion.div key={sg.skill} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.06}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{width:7,height:7,borderRadius:2,background:sg.color,boxShadow:`0 0 4px ${sg.color}`}}/>
                      <span style={{fontSize:11,fontWeight:600,color:'#94a3b8'}}>{sg.skill}</span>
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:10,color:'#475569'}}>{sg.students}</span>
                      <span style={{fontSize:11,fontWeight:800,color:sg.color}}>{sg.pct}%</span>
                    </div>
                  </div>
                  <div className="cl-bar cl-bar--md">
                    <motion.div className="cl-bar__fill" style={{background:sg.color,boxShadow:`0 0 5px ${sg.color}`,width:`${sg.pct}%`}}
                      initial={{width:0}} animate={{width:`${sg.pct}%`}} transition={{duration:0.9,ease:[0.22,1,0.36,1],delay:0.3+i*0.06}}/>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="cl-banner cl-banner--violet" style={{marginTop:14,marginBottom:0}}>
              <span style={{fontSize:14}}>💡</span>
              <div><p className="cl-banner__title">Recommendation</p>
              <p className="cl-banner__body">Organise a System Design workshop — top gap affecting 58% of students.</p></div>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{height:20}}/>
    </CollegeShell>
  )
}

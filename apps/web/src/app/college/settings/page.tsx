'use client'

import '../college.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Bell, Shield, Link2, Save,
  ChevronRight, Check, AlertTriangle, RefreshCw,
} from 'lucide-react'
import CollegeShell from '@/components/college/dashboard/CollegeShell'
import { MOCK_COLLEGE } from '@/components/college/dashboard/college.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.36,delay:i*0.06,ease:[0.22,1,0.36,1] as const},
})

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button className={`cl-toggle ${on?'cl-toggle--on':'cl-toggle--off'}`} onClick={()=>onChange(!on)}>
      <div className="cl-toggle__thumb"/>
    </button>
  )
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({ label, sub, children }: { label:string; sub?:string; children:React.ReactNode }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
      <div>
        <p style={{fontSize:12,fontWeight:600,color:'#f1f5f9',marginBottom:sub?2:0}}>{label}</p>
        {sub&&<p style={{fontSize:10,color:'#475569'}}>{sub}</p>}
      </div>
      {children}
    </div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────
function SettingCard({ icon: Icon, title, color, children }: {
  icon: React.ElementType; title:string; color:string; children:React.ReactNode
}) {
  return (
    <div className="cl-card">
      <div className="cl-card-header">
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:28,height:28,borderRadius:9,background:`${color}18`,border:`1px solid ${color}28`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 8px ${color}22`}}>
            <Icon size={13} style={{color}}/>
          </div>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color}}>{title}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  // College profile
  const [collegeName, setCollegeName] = useState(MOCK_COLLEGE.name)
  const [city,        setCity]        = useState(MOCK_COLLEGE.city)
  const [state,       setState]       = useState(MOCK_COLLEGE.state)
  const [website,     setWebsite]     = useState('https://www.iitb.ac.in')
  const [spoc,        setSpoc]        = useState('Dr. Ramesh Kumar')
  const [spocEmail,   setSpocEmail]   = useState('placement@iitb.ac.in')
  const [saved,       setSaved]       = useState(false)

  // Notifications
  const [notifs, setNotifs] = useState({
    atRiskAlert:    true,
    weeklyReport:   true,
    placementAlert: true,
    loginActivity:  false,
    assessmentDone: true,
    lowStreak:      false,
  })

  // Integrations
  const [integrations, setIntegrations] = useState({
    lms:      false,
    slack:    true,
    email:    true,
    webhook:  false,
  })

  function toggleNotif(k: keyof typeof notifs) {
    setNotifs(n=>({...n,[k]:!n[k]}))
  }
  function toggleInteg(k: keyof typeof integrations) {
    setIntegrations(n=>({...n,[k]:!n[k]}))
  }

  async function handleSave() {
    // TODO backend: PATCH /api/college/profile
    setSaved(true)
    setTimeout(()=>setSaved(false), 2500)
  }

  return (
    <CollegeShell activeHref="/college/settings">

      <motion.div {...fadeUp(0)} className="cl-page-header">
        <div>
          <h1 className="cl-page-title"><span style={{filter:'drop-shadow(0 0 8px #6366f1)'}}>⚙️</span> Settings</h1>
          <p className="cl-page-sub">Manage college profile, notifications, integrations and account preferences</p>
        </div>
        <motion.button
          className={`cl-btn cl-btn--sm ${saved?'cl-btn--emerald':'cl-btn--primary'}`}
          onClick={handleSave}
          whileHover={{scale:1.04}} whileTap={{scale:0.97}}
        >
          <AnimatePresence mode="wait">
            {saved
              ? <motion.span key="saved" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}} style={{display:'flex',alignItems:'center',gap:5}}><Check size={12}/> Saved!</motion.span>
              : <motion.span key="save"  initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}} style={{display:'flex',alignItems:'center',gap:5}}><Save size={12}/> Save Changes</motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>

        {/* ── College Profile ── */}
        <motion.div {...fadeUp(1)}>
          <SettingCard icon={Building2} title="College Profile" color="#06b6d4">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="cl-field" style={{gridColumn:'1/-1'}}>
                <label className="cl-field__label">College Name</label>
                <input className="cl-input" value={collegeName} onChange={e=>setCollegeName(e.target.value)}/>
              </div>
              <div className="cl-field">
                <label className="cl-field__label">City</label>
                <input className="cl-input" value={city} onChange={e=>setCity(e.target.value)}/>
              </div>
              <div className="cl-field">
                <label className="cl-field__label">State</label>
                <input className="cl-input" value={state} onChange={e=>setState(e.target.value)}/>
              </div>
              <div className="cl-field" style={{gridColumn:'1/-1'}}>
                <label className="cl-field__label">Website</label>
                <input className="cl-input" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://"/>
              </div>
              <div className="cl-field">
                <label className="cl-field__label">SPOC Name</label>
                <input className="cl-input" value={spoc} onChange={e=>setSpoc(e.target.value)} placeholder="Placement Officer"/>
              </div>
              <div className="cl-field">
                <label className="cl-field__label">SPOC Email</label>
                <input className="cl-input" value={spocEmail} onChange={e=>setSpocEmail(e.target.value)} placeholder="placement@college.edu"/>
              </div>
            </div>
            <div style={{marginTop:14,padding:'10px 14px',borderRadius:12,background:'rgba(6,182,212,0.07)',border:'1px solid rgba(6,182,212,0.18)'}}>
              <p style={{fontSize:10,color:'#475569'}}>College ID: <span style={{color:'#67e8f9',fontWeight:700}}>{MOCK_COLLEGE.code}</span> · Active Batch: <span style={{color:'#67e8f9',fontWeight:700}}>{MOCK_COLLEGE.activeBatch}</span></p>
            </div>
          </SettingCard>
        </motion.div>

        {/* ── Notifications ── */}
        <motion.div {...fadeUp(2)}>
          <SettingCard icon={Bell} title="Notifications" color="#a855f7">
            <div style={{paddingTop:4}}>
              {[
                {k:'atRiskAlert',    l:'At-Risk Alerts',         s:'Notify when student readiness drops below 40%'},
                {k:'weeklyReport',   l:'Weekly Summary Report',  s:'Receive batch progress digest every Monday'},
                {k:'placementAlert', l:'Placement Notifications',s:'New placement record added by student'},
                {k:'assessmentDone', l:'Assessment Completions', s:'Notify when students complete assessments'},
                {k:'loginActivity',  l:'Login Activity Digest',  s:'Daily active student count summary'},
                {k:'lowStreak',      l:'Low Streak Alerts',      s:'Notify when streak drops to 0 for 3+ days'},
              ].map(({k,l,s})=>(
                <SettingRow key={k} label={l} sub={s}>
                  <Toggle on={notifs[k as keyof typeof notifs]} onChange={()=>toggleNotif(k as keyof typeof notifs)}/>
                </SettingRow>
              ))}
            </div>
          </SettingCard>
        </motion.div>

        {/* ── Integrations ── */}
        <motion.div {...fadeUp(3)}>
          <SettingCard icon={Link2} title="Integrations" color="#10b981">
            {[
              {k:'email',   l:'Email (SMTP)',   s:'Send automated emails via college SMTP',    badge:'Connected',    bc:'cl-badge--emerald'},
              {k:'slack',   l:'Slack',          s:'Push alerts to your placement Slack channel',badge:'Connected',   bc:'cl-badge--emerald'},
              {k:'lms',     l:'LMS Integration',s:'Sync student data with your college LMS',   badge:'Not set up',   bc:'cl-badge--dim'},
              {k:'webhook', l:'Custom Webhook', s:'POST events to your own endpoint',          badge:'Not set up',   bc:'cl-badge--dim'},
            ].map(({k,l,s,badge,bc})=>(
              <SettingRow key={k} label={l} sub={s}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className={`cl-badge ${bc}`}>{badge}</span>
                  <Toggle on={integrations[k as keyof typeof integrations]} onChange={()=>toggleInteg(k as keyof typeof integrations)}/>
                </div>
              </SettingRow>
            ))}

            <div className="cl-banner cl-banner--amber" style={{marginTop:14,marginBottom:0}}>
              <AlertTriangle size={13} style={{color:'#f59e0b',flexShrink:0,marginTop:1}}/>
              <div>
                <p className="cl-banner__title">API Key Required</p>
                <p className="cl-banner__body">Contact your COSMOS admin to generate an API key for LMS and webhook integrations.</p>
              </div>
            </div>
          </SettingCard>
        </motion.div>

        {/* ── Security & Account ── */}
        <motion.div {...fadeUp(4)}>
          <SettingCard icon={Shield} title="Security & Account" color="#f59e0b">
            <div style={{paddingTop:4}}>
              <SettingRow label="Two-Factor Authentication" sub="Secure your admin account with 2FA">
                <button className="cl-btn cl-btn--ghost cl-btn--sm">Enable <ChevronRight size={11}/></button>
              </SettingRow>
              <SettingRow label="Change Password" sub="Last changed 42 days ago">
                <button className="cl-btn cl-btn--ghost cl-btn--sm">Update <ChevronRight size={11}/></button>
              </SettingRow>
              <SettingRow label="Active Sessions" sub="2 active sessions across devices">
                <button className="cl-btn cl-btn--ghost cl-btn--sm">View All <ChevronRight size={11}/></button>
              </SettingRow>
              <SettingRow label="Sync Student Data" sub="Force sync from COSMOS database">
                <button className="cl-btn cl-btn--cyan cl-btn--sm"><RefreshCw size={11}/> Sync Now</button>
              </SettingRow>
            </div>

            <hr className="cl-divider"/>

            <div>
              <p style={{fontSize:10,color:'#475569',marginBottom:10}}>Danger Zone</p>
              <button className="cl-btn cl-btn--danger cl-btn--sm"><AlertTriangle size={11}/> Deactivate College Account</button>
            </div>
          </SettingCard>
        </motion.div>

      </div>

      <div style={{height:24}}/>
    </CollegeShell>
  )
}

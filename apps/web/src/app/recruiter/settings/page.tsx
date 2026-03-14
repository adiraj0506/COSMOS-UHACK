'use client'

import '../recruiter.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Bell, Shield, User, Save, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import RecruiterShell from '@/components/recruiter/dashboard/RecruiterShell'
import { MOCK_RECRUITER } from '@/components/recruiter/dashboard/recruiter.types'

const fadeUp = (i:number) => ({
  initial:{opacity:0,y:12}, animate:{opacity:1,y:0},
  transition:{duration:0.36,delay:i*0.06,ease:[0.22,1,0.36,1] as const},
})

function Toggle({ on, onChange }:{ on:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button className={`rr-toggle ${on?'rr-toggle--on':'rr-toggle--off'}`} onClick={()=>onChange(!on)}>
      <div className="rr-toggle__thumb"/>
    </button>
  )
}

function Row({ label, sub, children }:{ label:string; sub?:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <p style={{ fontSize:12, fontWeight:600, color:'#f1f5f9', marginBottom:sub?2:0 }}>{label}</p>
        {sub&&<p style={{ fontSize:10, color:'#475569' }}>{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function SCard({ icon:Icon, title, color, children }:{ icon:React.ElementType; title:string; color:string; children:React.ReactNode }) {
  return (
    <div className="rr-card">
      <div className="rr-card-header">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:9, background:`${color}18`, border:`1px solid ${color}28`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={13} style={{ color }}/>
          </div>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color }}>{title}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function RecruiterSettingsPage() {
  const [name,      setName]      = useState(MOCK_RECRUITER.name)
  const [company,   setCompany]   = useState(MOCK_RECRUITER.company)
  const [role,      setRole]      = useState(MOCK_RECRUITER.role)
  const [email,     setEmail]     = useState(MOCK_RECRUITER.email)
  const [saved,     setSaved]     = useState(false)

  const [notifs, setNotifs] = useState({
    newMatch:       true,
    applicationAlert:true,
    collegeReply:   true,
    weeklyReport:   true,
    talentUpdate:   false,
  })

  const [prefs, setPrefs] = useState({
    autoMatch:      true,
    publicProfile:  true,
    emailSignature: true,
  })

  async function save() {
    // TODO backend: PATCH /api/recruiter/profile
    setSaved(true)
    setTimeout(()=>setSaved(false), 2500)
  }

  return (
    <RecruiterShell activeHref="/recruiter/settings">

      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:900, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ filter:'drop-shadow(0 0 8px #f59e0b)' }}>⚙️</span> Settings
          </h1>
          <p style={{ fontSize:10.5, color:'#475569', marginTop:2 }}>Manage recruiter profile, notifications and preferences</p>
        </div>
        <motion.button className={`rr-btn rr-btn--sm ${saved?'rr-btn--emerald':'rr-btn--amber'}`}
          onClick={save} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
          <AnimatePresence mode="wait">
            {saved
              ? <motion.span key="saved" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ display:'flex', alignItems:'center', gap:5 }}><Check size={12}/> Saved!</motion.span>
              : <motion.span key="save"  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ display:'flex', alignItems:'center', gap:5 }}><Save size={12}/> Save Changes</motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

        {/* Recruiter Profile */}
        <motion.div {...fadeUp(1)}>
          <SCard icon={User} title="Recruiter Profile" color="#f59e0b">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="rr-field" style={{ gridColumn:'1/-1', marginBottom:0 }}>
                <label className="rr-field__label">Full Name</label>
                <input className="rr-input" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
              <div className="rr-field" style={{ marginBottom:0 }}>
                <label className="rr-field__label">Company</label>
                <input className="rr-input" value={company} onChange={e=>setCompany(e.target.value)}/>
              </div>
              <div className="rr-field" style={{ marginBottom:0 }}>
                <label className="rr-field__label">Role</label>
                <input className="rr-input" value={role} onChange={e=>setRole(e.target.value)}/>
              </div>
              <div className="rr-field" style={{ gridColumn:'1/-1', marginBottom:0 }}>
                <label className="rr-field__label">Work Email</label>
                <input className="rr-input" value={email} onChange={e=>setEmail(e.target.value)}/>
              </div>
            </div>
            <div style={{ marginTop:14, padding:'10px 13px', borderRadius:12, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.18)' }}>
              <p style={{ fontSize:10, color:'#475569' }}>Company Logo: <span style={{ color:'#fde68a', fontWeight:700 }}>{MOCK_RECRUITER.logo}</span> · Accent: <span style={{ color:'#fde68a', fontWeight:700 }}>Amber</span></p>
            </div>
          </SCard>
        </motion.div>

        {/* Notifications */}
        <motion.div {...fadeUp(2)}>
          <SCard icon={Bell} title="Notifications" color="#a855f7">
            <div style={{ paddingTop:4 }}>
              {[
                { k:'newMatch',         l:'New AI Match Found',      s:'Notify when AI finds a new student match for your jobs'    },
                { k:'applicationAlert', l:'Application Updates',     s:'Alerts for new applications and status changes'            },
                { k:'collegeReply',     l:'College Reply',           s:'Notify when a college responds to your outreach'           },
                { k:'weeklyReport',     l:'Weekly Talent Report',    s:'Summary of matches, views and activity every Monday'       },
                { k:'talentUpdate',     l:'Student Profile Updates', s:'Notify when a matched student improves their readiness'    },
              ].map(({ k, l, s })=>(
                <Row key={k} label={l} sub={s}>
                  <Toggle on={notifs[k as keyof typeof notifs]} onChange={v=>setNotifs(n=>({...n,[k]:v}))}/>
                </Row>
              ))}
            </div>
          </SCard>
        </motion.div>

        {/* Preferences */}
        <motion.div {...fadeUp(3)}>
          <SCard icon={Building2} title="Preferences" color="#06b6d4">
            <div style={{ paddingTop:4 }}>
              {[
                { k:'autoMatch',      l:'Auto AI Match',       s:'Automatically run AI matching when a new job is posted' },
                { k:'publicProfile',  l:'Public Company Profile', s:'Allow students to see your company profile on COSMOS' },
                { k:'emailSignature', l:'Auto Email Signature', s:'Append your contact info to all outreach emails'       },
              ].map(({ k, l, s })=>(
                <Row key={k} label={l} sub={s}>
                  <Toggle on={prefs[k as keyof typeof prefs]} onChange={v=>setPrefs(p=>({...p,[k]:v}))}/>
                </Row>
              ))}
            </div>
            <div className="rr-banner rr-banner--amber" style={{ marginTop:14, marginBottom:0 }}>
              <span style={{ fontSize:14 }}>⚡</span>
              <div>
                <p className="rr-banner__title">AI Credits: 450 / 500</p>
                <p className="rr-banner__body">You've used 90% of this month's AI matching credits. Resets on Apr 1.</p>
              </div>
            </div>
          </SCard>
        </motion.div>

        {/* Security */}
        <motion.div {...fadeUp(4)}>
          <SCard icon={Shield} title="Security & Account" color="#10b981">
            <div style={{ paddingTop:4 }}>
              <Row label="Two-Factor Authentication" sub="Secure with 2FA">
                <button className="rr-btn rr-btn--ghost rr-btn--sm">Enable →</button>
              </Row>
              <Row label="Change Password" sub="Last changed 28 days ago">
                <button className="rr-btn rr-btn--ghost rr-btn--sm">Update →</button>
              </Row>
              <Row label="API Access" sub="For integrating with your ATS">
                <button className="rr-btn rr-btn--cyan rr-btn--sm"><RefreshCw size={11}/> Generate Key</button>
              </Row>
            </div>
            <hr className="rr-divider"/>
            <div>
              <p style={{ fontSize:10, color:'#475569', marginBottom:10 }}>Danger Zone</p>
              <button className="rr-btn rr-btn--danger rr-btn--sm"><AlertTriangle size={11}/> Deactivate Account</button>
            </div>
          </SCard>
        </motion.div>

      </div>

      <div style={{ height:24 }}/>
    </RecruiterShell>
  )
}

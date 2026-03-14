'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2, Briefcase, Check } from 'lucide-react'
import type { JobPosting, JobType, JobStatus } from './recruiter.types'

interface JobModalProps {
  job?:      JobPosting       // undefined = new job
  onClose:   () => void
  onSave:    (job: Partial<JobPosting>) => void
}

const SKILL_SUGGESTIONS = ['Node.js','React','TypeScript','Python','PostgreSQL','MongoDB','Docker','Kubernetes','AWS','Redis','Go','Java','System Design','REST API','GraphQL','CI/CD','TensorFlow']

export default function JobModal({ job, onClose, onSave }: JobModalProps) {
  const [title,       setTitle]       = useState(job?.title       ?? '')
  const [type,        setType]        = useState<JobType>(job?.type ?? 'full-time')
  const [dept,        setDept]        = useState(job?.department   ?? '')
  const [location,    setLocation]    = useState(job?.location     ?? '')
  const [mode,        setMode]        = useState(job?.mode         ?? 'hybrid')
  const [pkg,         setPkg]         = useState(job?.package      ?? '')
  const [desc,        setDesc]        = useState(job?.description  ?? '')
  const [skills,      setSkills]      = useState<string[]>(job?.skills ?? [])
  const [reqs,        setReqs]        = useState<string[]>(job?.requirements ?? [''])
  const [skillInput,  setSkillInput]  = useState('')
  const [status,      setStatus]      = useState<JobStatus>(job?.status ?? 'active')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)

  function addSkill(s: string) {
    const t = s.trim()
    if (t && !skills.includes(t)) setSkills(prev => [...prev, t])
    setSkillInput('')
  }

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    onSave({ title, type, department:dept, location, mode, package:pkg, description:desc, skills, requirements:reqs.filter(Boolean), status })
    setSaving(false)
    setSaved(true)
    setTimeout(onClose, 600)
  }

  const isEdit = !!job

  return (
    <motion.div className="rr-modal-overlay"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div className="rr-modal rr-modal--wide"
        initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:16 }} transition={{ duration:0.26, ease:[0.22,1,0.36,1] }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.28)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Briefcase size={15} style={{ color:'#f59e0b' }}/>
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:800, color:'#fff' }}>{isEdit ? 'Edit Job Posting' : 'Create Job Posting'}</p>
              <p style={{ fontSize:10, color:'#475569' }}>Visible to matched COSMOS students</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#475569', display:'flex' }}
            onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='#475569')}>
            <X size={16}/>
          </button>
        </div>

        {/* Form grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          <div className="rr-field" style={{ gridColumn:'1/-1', marginBottom:0 }}>
            <label className="rr-field__label">Job Title *</label>
            <input className="rr-input" placeholder="e.g. Backend Engineer — Node.js" value={title} onChange={e=>setTitle(e.target.value)}/>
          </div>
          <div className="rr-field" style={{ marginBottom:0 }}>
            <label className="rr-field__label">Type</label>
            <select className="rr-input rr-select" value={type} onChange={e=>setType(e.target.value as JobType)}>
              <option value="full-time">Full-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div className="rr-field" style={{ marginBottom:0 }}>
            <label className="rr-field__label">Department</label>
            <input className="rr-input" placeholder="Engineering, Product…" value={dept} onChange={e=>setDept(e.target.value)}/>
          </div>
          <div className="rr-field" style={{ marginBottom:0 }}>
            <label className="rr-field__label">Location</label>
            <input className="rr-input" placeholder="Bangalore, Remote…" value={location} onChange={e=>setLocation(e.target.value)}/>
          </div>
          <div className="rr-field" style={{ marginBottom:0 }}>
            <label className="rr-field__label">Mode</label>
            <select className="rr-input rr-select" value={mode} onChange={e=>setMode(e.target.value as 'remote'|'onsite'|'hybrid')}>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
          <div className="rr-field" style={{ marginBottom:0 }}>
            <label className="rr-field__label">Package / Stipend</label>
            <input className="rr-input" placeholder="18–28 LPA / 80K per month" value={pkg} onChange={e=>setPkg(e.target.value)}/>
          </div>
          <div className="rr-field" style={{ marginBottom:0 }}>
            <label className="rr-field__label">Status</label>
            <select className="rr-input rr-select" value={status} onChange={e=>setStatus(e.target.value as JobStatus)}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="rr-field">
          <label className="rr-field__label">Job Description</label>
          <textarea className="rr-input rr-textarea" rows={3} placeholder="Describe the role and responsibilities…" value={desc} onChange={e=>setDesc(e.target.value)}/>
        </div>

        {/* Skills */}
        <div className="rr-field">
          <label className="rr-field__label">Required Skills</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:7 }}>
            {skills.map(sk => (
              <span key={sk} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:6, fontSize:10, fontWeight:600, background:'rgba(245,158,11,0.14)', color:'#fde68a', border:'1px solid rgba(245,158,11,0.25)', cursor:'pointer' }}
                onClick={() => setSkills(prev => prev.filter(s => s !== sk))}>
                {sk} <X size={9}/>
              </span>
            ))}
            <input
              className="rr-input" style={{ width:120, padding:'3px 9px', fontSize:10, borderRadius:6 }}
              placeholder="+ add skill"
              value={skillInput}
              onChange={e=>setSkillInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'||e.key===','){e.preventDefault();addSkill(skillInput)} }}
              onBlur={()=>addSkill(skillInput)}
            />
          </div>
          {/* Suggestions */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {SKILL_SUGGESTIONS.filter(s=>!skills.includes(s)).slice(0,8).map(s=>(
              <button key={s} onClick={()=>addSkill(s)}
                style={{ padding:'2px 8px', borderRadius:5, fontSize:9.5, fontWeight:600, cursor:'pointer', background:'rgba(255,255,255,0.04)', border:'1px dashed rgba(255,255,255,0.1)', color:'#475569', transition:'all 0.12s' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#fde68a')} onMouseLeave={e=>(e.currentTarget.style.color='#475569')}>
                +{s}
              </button>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="rr-field" style={{ marginBottom:18 }}>
          <label className="rr-field__label">Requirements</label>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {reqs.map((r, i) => (
              <div key={i} style={{ display:'flex', gap:6, alignItems:'center' }}>
                <input className="rr-input" style={{ flex:1, fontSize:11 }} value={r} placeholder={`Requirement ${i+1}…`}
                  onChange={e=>{ const n=[...reqs]; n[i]=e.target.value; setReqs(n) }}/>
                {reqs.length > 1 && (
                  <button onClick={() => setReqs(reqs.filter((_,j)=>j!==i))}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#475569', flexShrink:0 }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#f43f5e')} onMouseLeave={e=>(e.currentTarget.style.color='#475569')}>
                    <Trash2 size={12}/>
                  </button>
                )}
              </div>
            ))}
            <button className="rr-btn rr-btn--ghost rr-btn--sm" onClick={()=>setReqs(r=>[...r,''])} style={{ alignSelf:'flex-start' }}>
              <Plus size={11}/> Add Requirement
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button className="rr-btn rr-btn--ghost rr-btn--sm" onClick={onClose}>Cancel</button>
          <motion.button className="rr-btn rr-btn--amber rr-btn--sm"
            onClick={handleSave} disabled={saving || !title.trim()}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            style={{ opacity:!title.trim()?0.5:1 }}>
            {saved
              ? <><Check size={12}/> Saved!</>
              : saving
              ? <><div style={{ width:12, height:12, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'rr-spin 0.8s linear infinite' }}/> Saving…</>
              : <><Briefcase size={12}/> {isEdit?'Save Changes':'Post Job'}</>
            }
          </motion.button>
        </div>
        <style>{`@keyframes rr-spin{to{transform:rotate(360deg)}}`}</style>
      </motion.div>
    </motion.div>
  )
}

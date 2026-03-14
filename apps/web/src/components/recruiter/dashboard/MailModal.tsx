'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ChevronDown, Sparkles, Mail } from 'lucide-react'
import { MAIL_TEMPLATES, MOCK_RECRUITER } from './recruiter.types'

interface MailTarget {
  type:    'student' | 'college'
  name:    string
  email:   string
  role?:   string       // for students
  skills?: string[]     // for students
  college?:string       // for students
}

interface MailModalProps {
  target:   MailTarget
  onClose:  () => void
  onSent:   () => void
}

function interpolate(text: string, vars: Record<string,string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

export default function MailModal({ target, onClose, onSent }: MailModalProps) {
  const templates = MAIL_TEMPLATES.filter(t => t.type === target.type)
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? '')
  const [subject,    setSubject]    = useState('')
  const [body,       setBody]       = useState('')
  const [sending,    setSending]    = useState(false)
  const [showTpl,    setShowTpl]    = useState(false)

  const vars: Record<string,string> = {
    name:          target.name,
    company:       MOCK_RECRUITER.company,
    role:          target.role ?? '',
    skills:        target.skills?.slice(0,3).join(', ') ?? '',
    college:       target.college ?? target.name,
    contactPerson: target.name,
    recruiterName: MOCK_RECRUITER.name,
    package:       '18–28 LPA',
    batch:         '2025',
    roles:         'Backend Engineer, SDE Intern',
  }

  function applyTemplate(id: string) {
    const t = MAIL_TEMPLATES.find(t => t.id === id)
    if (!t) return
    setTemplateId(id)
    setSubject(interpolate(t.subject, vars))
    setBody(interpolate(t.body, vars))
    setShowTpl(false)
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) return
    setSending(true)
    // TODO backend: POST /api/recruiter/mail { to: target.email, subject, body }
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    onSent()
  }

  return (
    <motion.div className="rr-modal-overlay"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div className="rr-modal rr-modal--wide"
        initial={{ opacity:0, scale:0.95, y:16 }}
        animate={{ opacity:1, scale:1,    y:0  }}
        exit={{ opacity:0, scale:0.95, y:16 }}
        transition={{ duration:0.26, ease:[0.22,1,0.36,1] }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.28)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Mail size={14} style={{ color:'#f59e0b' }}/>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:'#fff' }}>Compose Mail</p>
              <p style={{ fontSize:10, color:'#475569' }}>To: <span style={{ color:'#fde68a' }}>{target.name}</span> · {target.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#475569', display:'flex' }}
            onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='#475569')}>
            <X size={16}/>
          </button>
        </div>

        {/* Template picker */}
        <div style={{ marginBottom:14 }}>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#475569', marginBottom:7 }}>
            Quick Templates
          </p>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {templates.map(t => (
              <button key={t.id}
                onClick={() => applyTemplate(t.id)}
                style={{
                  padding:'5px 13px', borderRadius:8, fontSize:10.5, fontWeight:600, cursor:'pointer',
                  background: templateId===t.id ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${templateId===t.id ? 'rgba(245,158,11,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  color: templateId===t.id ? '#fde68a' : '#64748b',
                  transition:'all 0.15s',
                }}>
                <Sparkles size={9} style={{ display:'inline', marginRight:4, opacity:0.7 }}/>{t.name}
              </button>
            ))}
            <button
              onClick={() => { setSubject(''); setBody(''); setTemplateId('') }}
              style={{ padding:'5px 13px', borderRadius:8, fontSize:10.5, fontWeight:600, cursor:'pointer', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b' }}>
              Blank
            </button>
          </div>
        </div>

        <hr className="rr-divider"/>

        {/* Subject */}
        <div className="rr-field">
          <label className="rr-field__label">Subject</label>
          <input className="rr-input" placeholder="Email subject…" value={subject} onChange={e=>setSubject(e.target.value)}/>
        </div>

        {/* Body */}
        <div className="rr-field">
          <label className="rr-field__label">Message</label>
          <textarea className="rr-input rr-textarea" rows={10} style={{ minHeight:200, fontFamily:'inherit', lineHeight:1.7, fontSize:12.5 }}
            placeholder="Compose your message…" value={body} onChange={e=>setBody(e.target.value)}/>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16 }}>
          <p style={{ fontSize:10, color:'#334155' }}>
            Sending from <span style={{ color:'#fde68a' }}>{MOCK_RECRUITER.email}</span>
          </p>
          <div style={{ display:'flex', gap:8 }}>
            <button className="rr-btn rr-btn--ghost rr-btn--sm" onClick={onClose}>Cancel</button>
            <motion.button
              className="rr-btn rr-btn--amber rr-btn--sm"
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              style={{ opacity: (!subject.trim()||!body.trim()) ? 0.5 : 1 }}>
              {sending
                ? <><div style={{ width:12, height:12, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'rr-spin 0.8s linear infinite' }}/> Sending…</>
                : <><Send size={12}/> Send Mail</>
              }
            </motion.button>
          </div>
        </div>
        <style>{`@keyframes rr-spin{to{transform:rotate(360deg)}}`}</style>
      </motion.div>
    </motion.div>
  )
}

'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/tabs/FlagsTab.tsx
// Feature flag management: toggle · add · delete
//
// BACKEND:
// - Fetch:  supabase.from('feature_flags').select('*').order('key')
// - Toggle: supabase.from('feature_flags').update({enabled:!flag.enabled, updated_at:new Date(), updated_by:userId}).eq('id',id)
// - Add:    supabase.from('feature_flags').insert({key,label,description,enabled:false})
// - Delete: supabase.from('feature_flags').delete().eq('id',id)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X } from 'lucide-react'
import Modal, { FormField, ModalActions } from '../Modal'

interface Flag {
  id: string; key: string; label: string; description: string; enabled: boolean; updatedAt: string
}

const INITIAL_FLAGS: Flag[] = [
  { id:'f1', key:'ai_mentor_v2',         label:'AI Mentor v2 (GPT-4o)',       description:'Upgrades AI mentor to GPT-4o for all learners.',              enabled:true,  updatedAt:'2025-03-10' },
  { id:'f2', key:'resume_ai_scoring',    label:'Resume AI Scoring',           description:'AI-based resume strength analysis and suggestions.',          enabled:true,  updatedAt:'2025-03-08' },
  { id:'f3', key:'rit_beta',             label:'RIT Beta Flow',               description:'Beta version of the career orientation test UI.',             enabled:false, updatedAt:'2025-02-28' },
  { id:'f4', key:'college_bulk_import',  label:'College Bulk Import',         description:'Enables CSV bulk import for onboarding college batches.',     enabled:true,  updatedAt:'2025-03-01' },
  { id:'f5', key:'recruiter_ai_search',  label:'Recruiter AI Search',         description:'Semantic AI candidate matching for recruiter search.',        enabled:false, updatedAt:'2025-02-20' },
  { id:'f6', key:'roadmap_v3',           label:'Roadmap Generator v3',        description:'Next-gen personalised roadmap with adaptive learning paths.', enabled:false, updatedAt:'2025-01-15' },
  { id:'f7', key:'skill_badges',         label:'Skill Badges System',         description:'Earnable digital badges displayed on learner profiles.',      enabled:true,  updatedAt:'2025-03-05' },
  { id:'f8', key:'college_analytics_v2', label:'College Analytics v2',       description:'Enhanced batch analytics with cohort comparisons.',           enabled:false, updatedAt:'2025-02-10' },
]

const emptyFlag = (): Omit<Flag,'id'|'updatedAt'> => ({ key:'', label:'', description:'', enabled:false })

export default function FlagsTab() {
  const [flags, setFlags] = useState<Flag[]>(INITIAL_FLAGS)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteFlag, setDeleteFlag] = useState<Flag | null>(null)
  const [form, setForm] = useState(emptyFlag())
  const [toggling, setToggling] = useState<string | null>(null)

  const toggle = async (id: string) => {
    setToggling(id)
    // BACKEND: const flag = flags.find(f=>f.id===id); await supabase.from('feature_flags').update({enabled:!flag.enabled, updated_at:new Date().toISOString(), updated_by:userId}).eq('id',id)
    await new Promise(r => setTimeout(r, 300)) // simulate latency
    setFlags(prev => prev.map(f => f.id===id ? { ...f, enabled:!f.enabled, updatedAt: new Date().toISOString().slice(0,10) } : f))
    setToggling(null)
  }

  const handleAdd = () => {
    if (!form.key || !form.label) return
    setFlags(prev => [...prev, { ...form, id:`f${Date.now()}`, key: form.key.toLowerCase().replace(/\s+/g,'_'), updatedAt: new Date().toISOString().slice(0,10) }])
    // BACKEND: await supabase.from('feature_flags').insert({key:form.key,label:form.label,description:form.description,enabled:false})
    setAddOpen(false); setForm(emptyFlag())
  }

  const handleDelete = () => {
    if (!deleteFlag) return
    setFlags(prev => prev.filter(f => f.id !== deleteFlag.id))
    // BACKEND: await supabase.from('feature_flags').delete().eq('id', deleteFlag.id)
    setDeleteFlag(null)
  }

  const enabledCount = flags.filter(f=>f.enabled).length

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">{enabledCount}</span> of <span className="text-white font-bold">{flags.length}</span> flags enabled
          </p>
          <div className="flex gap-1">
            {flags.map(f=>(
              <div key={f.id} className="w-1.5 h-1.5 rounded-full" style={{ background: f.enabled ? '#34d399' : 'rgba(255,255,255,0.1)' }}/>
            ))}
          </div>
        </div>
        <button onClick={()=>{setForm(emptyFlag());setAddOpen(true)}}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition"
          style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', border:'1px solid rgba(139,92,246,0.4)', color:'#fff', boxShadow:'0 0 18px rgba(139,92,246,0.25)' }}>
          <Plus size={12}/> New Flag
        </button>
      </div>

      {/* Flags grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {flags.map((flag, i) => (
            <motion.div key={flag.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              transition={{ delay: i*0.04 }}
              className="rounded-2xl p-4 relative overflow-hidden"
              style={{
                background: flag.enabled ? 'rgba(52,211,153,0.05)' : 'rgba(10,4,28,0.75)',
                border: `1px solid ${flag.enabled ? 'rgba(52,211,153,0.2)' : 'rgba(139,92,246,0.12)'}`,
                boxShadow: flag.enabled ? '0 0 0 1px rgba(52,211,153,0.05)' : 'none',
              }}>

              {/* Enabled glow */}
              {flag.enabled && <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl pointer-events-none" style={{ background:'rgba(52,211,153,0.15)' }}/>}

              <div className="flex items-start justify-between mb-2 relative">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-white font-bold text-sm leading-tight">{flag.label}</p>
                  <code className="text-[9px] font-mono px-1.5 py-0.5 rounded mt-1 inline-block"
                    style={{ background:'rgba(139,92,246,0.12)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.2)' }}>
                    {flag.key}
                  </code>
                </div>
                {/* Toggle */}
                <button
                  onClick={()=>toggle(flag.id)}
                  disabled={toggling===flag.id}
                  className="relative shrink-0 mt-0.5"
                  style={{ width:40, height:22, borderRadius:11, background:flag.enabled?'#059669':'rgba(255,255,255,0.08)', border:`1px solid ${flag.enabled?'rgba(52,211,153,0.5)':'rgba(255,255,255,0.1)'}`, transition:'all 0.3s', cursor:'pointer', boxShadow:flag.enabled?'0 0 12px rgba(52,211,153,0.3)':'none' }}>
                  <motion.div
                    animate={{ x: flag.enabled ? 20 : 2 }}
                    transition={{ type:'spring', stiffness:400, damping:25 }}
                    style={{ position:'absolute', top:3, width:14, height:14, borderRadius:'50%', background:flag.enabled?'#fff':'rgba(255,255,255,0.4)' }}/>
                </button>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed mb-3 relative">{flag.description}</p>

              <div className="flex items-center justify-between relative">
                <span className="text-[10px] text-gray-700 font-mono">Updated {flag.updatedAt}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background:flag.enabled?'rgba(52,211,153,0.1)':'rgba(255,255,255,0.05)', color:flag.enabled?'#34d399':'#6b7280', border:`1px solid ${flag.enabled?'rgba(52,211,153,0.2)':'rgba(255,255,255,0.08)'}` }}>
                    {flag.enabled?'Enabled':'Disabled'}
                  </span>
                  <button onClick={()=>setDeleteFlag(flag)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition">
                    <Trash2 size={11}/>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Add Modal ── */}
      <Modal open={addOpen} title="Create Feature Flag" onClose={()=>setAddOpen(false)} width={460}>
        <div className="flex flex-col gap-4">
          <FormField label="Flag Label" value={form.label} onChange={v=>setForm(f=>({...f,label:v,key:v.toLowerCase().replace(/\s+/g,'_')}))} placeholder="AI Mentor v3" required/>
          <FormField label="Key (auto-generated)" value={form.key} onChange={v=>setForm(f=>({...f,key:v.toLowerCase().replace(/[^a-z0-9_]/g,'_')}))} placeholder="ai_mentor_v3" required/>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">Description</label>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
              placeholder="What does this flag control?" rows={3}
              className="px-3 py-2 text-xs rounded-xl text-gray-200 placeholder-gray-600 outline-none resize-none"
              style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.18)', fontFamily:'inherit' }}/>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background:'rgba(251,191,36,0.05)', border:'1px solid rgba(251,191,36,0.15)' }}>
            <span className="text-[10px] text-amber-300">⚠</span>
            <p className="text-[11px] text-amber-300/70">New flags are created in the disabled state. Enable them manually once deployed.</p>
          </div>
          <ModalActions onCancel={()=>setAddOpen(false)} onConfirm={handleAdd} confirmLabel="Create Flag"/>
        </div>
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteFlag} title="Delete Feature Flag" onClose={()=>setDeleteFlag(null)} width={400}>
        <p className="text-sm text-gray-300 leading-relaxed">
          Delete flag <code className="text-violet-300 font-mono">{deleteFlag?.key}</code>? Any code
          that checks for this flag will fall back to its default behaviour.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          {/* BACKEND: await supabase.from('feature_flags').delete().eq('id', deleteFlag.id) */}
        </p>
        <ModalActions onCancel={()=>setDeleteFlag(null)} onConfirm={handleDelete} confirmLabel="Delete Flag" danger/>
      </Modal>
    </div>
  )
}

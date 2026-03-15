'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/tabs/LearnersTab.tsx
// Full CRUD: Search · Filter by status/domain · Add · Edit · Delete
// Status toggle (active / inactive / placed)
//
// BACKEND COMMENTS:
// - Fetch: supabase.from('profiles').select('*, assessments(score,domain)').eq('role','learner')
// - Add:   supabase.auth.admin.createUser({email,password}) + supabase.from('profiles').insert({...})
// - Edit:  supabase.from('profiles').update({...}).eq('id', id)
// - Delete:supabase.auth.admin.deleteUser(id)  ← server action with service_role key
// - Status:supabase.from('profiles').update({status}).eq('id', id)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Trash2, Edit2, Filter, X, ChevronUp, ChevronDown, GraduationCap } from 'lucide-react'
import { MOCK_LEARNERS, learnerStatusMeta, type Learner } from '@/types/admin.types'
import Modal, { FormField, FormSelect, ModalActions } from '../Modal'

const DOMAINS  = ['Full Stack','Backend','Frontend','Data Science','DevOps','UI/UX']
const STATUSES = ['active','inactive','placed']

const emptyLearner = (): Omit<Learner,'id'|'assessmentsDone'> => ({
  name:'', email:'', college:'', domain:'Full Stack', readiness:0,
  resumeScore:0, status:'active', joinedAt: new Date().toISOString().slice(0,10), skills:[],
})

type SortKey = 'name' | 'readiness' | 'resumeScore' | 'college'

export default function LearnersTab() {
  const [rows, setRows]               = useState<Learner[]>(MOCK_LEARNERS)
  const [search, setSearch]           = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDomain, setFilterDomain] = useState('')
  const [sortKey, setSortKey]         = useState<SortKey>('readiness')
  const [sortAsc, setSortAsc]         = useState(false)
  const [addOpen, setAddOpen]         = useState(false)
  const [editRow, setEditRow]         = useState<Learner | null>(null)
  const [deleteRow, setDeleteRow]     = useState<Learner | null>(null)
  const [form, setForm]               = useState(emptyLearner())
  const [skillInput, setSkillInput]   = useState('')

  // ── Derived filtered + sorted list ────────────────────────────────────────
  const visible = rows
    .filter(r => {
      const q = search.toLowerCase()
      const matchQ = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.college.toLowerCase().includes(q)
      const matchS = !filterStatus || r.status === filterStatus
      const matchD = !filterDomain || r.domain === filterDomain
      return matchQ && matchS && matchD
    })
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      return sortAsc
        ? (typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number))
        : (typeof vb === 'string' ? vb.localeCompare(va as string) : (vb as number) - (va as number))
    })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  // ── Add ────────────────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!form.name || !form.email) return
    const newRow: Learner = { ...form, id: `l${Date.now()}`, assessmentsDone: 0 }
    setRows(prev => [newRow, ...prev])
    // BACKEND: await supabase.auth.admin.createUser({email:form.email, password:'TempPass123!'})
    //          await supabase.from('profiles').insert({...newRow})
    setAddOpen(false); setForm(emptyLearner())
  }

  // ── Edit ───────────────────────────────────────────────────────────────────
  const openEdit = (row: Learner) => { setEditRow(row); setForm({ ...row }) }
  const handleEdit = () => {
    if (!editRow) return
    setRows(prev => prev.map(r => r.id === editRow.id ? { ...r, ...form } : r))
    // BACKEND: await supabase.from('profiles').update({name:form.name,...}).eq('id', editRow.id)
    setEditRow(null)
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteRow) return
    setRows(prev => prev.filter(r => r.id !== deleteRow.id))
    // BACKEND: await fetch('/api/admin/delete-user', {method:'POST', body:JSON.stringify({id:deleteRow.id})})
    setDeleteRow(null)
  }

  // ── Status cycle ───────────────────────────────────────────────────────────
  const cycleStatus = (id: string) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r
      const next: Learner['status'][] = ['active','inactive','placed']
      const idx = next.indexOf(r.status)
      const newStatus = next[(idx + 1) % next.length]
      // BACKEND: await supabase.from('profiles').update({status:newStatus}).eq('id', id)
      return { ...r, status: newStatus }
    }))
  }

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortAsc ? <ChevronUp size={10} className="text-violet-400" /> : <ChevronDown size={10} className="text-violet-400" />)
    : <ChevronDown size={10} className="text-gray-700" />

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or college…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl text-gray-200 placeholder-gray-600 outline-none"
            style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}
          />
          {search && <button onClick={()=>setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={11}/></button>}
        </div>

        {/* Status filter */}
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl text-gray-300 outline-none cursor-pointer"
          style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s=><option key={s} value={s} className="bg-gray-900">{s}</option>)}
        </select>

        {/* Domain filter */}
        <select value={filterDomain} onChange={e=>setFilterDomain(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl text-gray-300 outline-none cursor-pointer"
          style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}>
          <option value="">All Domains</option>
          {DOMAINS.map(d=><option key={d} value={d} className="bg-gray-900">{d}</option>)}
        </select>

        <span className="text-xs text-gray-600">{visible.length} / {rows.length}</span>

        {/* Add button */}
        <button onClick={()=>{setForm(emptyLearner());setAddOpen(true)}}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ml-auto"
          style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', border:'1px solid rgba(139,92,246,0.4)', color:'#fff', boxShadow:'0 0 18px rgba(139,92,246,0.25)' }}>
          <Plus size={12}/> Add Learner
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(10,4,28,0.7)', border:'1px solid rgba(139,92,246,0.12)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]" style={{ background:'rgba(139,92,246,0.07)' }}>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">
                  <button className="flex items-center gap-1" onClick={()=>toggleSort('name')}>Name <SortIcon k="name"/></button>
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">College</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Domain</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">
                  <button className="flex items-center gap-1" onClick={()=>toggleSort('readiness')}>Readiness <SortIcon k="readiness"/></button>
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">
                  <button className="flex items-center gap-1" onClick={()=>toggleSort('resumeScore')}>Resume <SortIcon k="resumeScore"/></button>
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Skills</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Joined</th>
                <th className="px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <AnimatePresence>
                {visible.map((r, i) => {
                  const sm = learnerStatusMeta[r.status]
                  return (
                    <motion.tr key={r.id}
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background:'rgba(129,140,248,0.15)', color:'#818cf8', border:'1px solid rgba(129,140,248,0.2)' }}>
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-semibold leading-none">{r.name}</p>
                            <p className="text-gray-600 text-[10px] mt-0.5">{r.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{r.college}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background:'rgba(6,182,212,0.1)', color:'#67e8f9', border:'1px solid rgba(6,182,212,0.2)' }}>
                          {r.domain}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ background:'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width:`${r.readiness}%`, background:r.readiness>=75?'#34d399':r.readiness>=50?'#fbbf24':'#f87171', boxShadow:`0 0 6px ${r.readiness>=75?'#34d39950':r.readiness>=50?'#fbbf2450':'#f8717150'}` }}/>
                          </div>
                          <span className="text-[11px] font-mono" style={{ color:r.readiness>=75?'#34d399':r.readiness>=50?'#fbbf24':'#f87171' }}>{r.readiness}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-mono" style={{ color:r.resumeScore>=70?'#818cf8':'#94a3b8' }}>{r.resumeScore}/100</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap max-w-[140px]">
                          {r.skills.slice(0,2).map(s=>(
                            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background:'rgba(139,92,246,0.1)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.2)' }}>{s}</span>
                          ))}
                          {r.skills.length>2 && <span className="text-[9px] text-gray-600">+{r.skills.length-2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={()=>cycleStatus(r.id)}
                          className="px-2 py-1 rounded-full text-[10px] font-semibold transition hover:opacity-80 cursor-pointer"
                          style={{ background:sm.bg, color:sm.color, border:`1px solid ${sm.border}` }}>
                          {sm.label}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-[10px] font-mono">{r.joinedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={()=>openEdit(r)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition">
                            <Edit2 size={12}/>
                          </button>
                          <button onClick={()=>setDeleteRow(r)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition">
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="text-center py-12 text-gray-600 text-sm">No learners match your filters.</div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal open={addOpen || !!editRow} title={editRow ? 'Edit Learner' : 'Add New Learner'}
        onClose={() => { setAddOpen(false); setEditRow(null) }}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name"  value={form.name}    onChange={v=>setForm(f=>({...f,name:v}))}    placeholder="Priya Nair"         required />
            <FormField label="Email"      value={form.email}   onChange={v=>setForm(f=>({...f,email:v}))}   placeholder="priya@college.edu"  required type="email" />
            <FormField label="College"    value={form.college} onChange={v=>setForm(f=>({...f,college:v}))} placeholder="VIT Vellore"         required />
            <FormSelect label="Domain"   value={form.domain}  onChange={v=>setForm(f=>({...f,domain:v}))}
              options={DOMAINS.map(d=>({value:d,label:d}))} />
            <FormSelect label="Status"   value={form.status}  onChange={v=>setForm(f=>({...f,status:v as Learner['status']}))}
              options={STATUSES.map(s=>({value:s,label:s[0].toUpperCase()+s.slice(1)}))} />
            <FormField label="Joined Date" value={form.joinedAt} onChange={v=>setForm(f=>({...f,joinedAt:v}))} type="date" />
          </div>
          {/* Skills input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">Skills</label>
            <div className="flex gap-2">
              <input value={skillInput} onChange={e=>setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && skillInput.trim()) { setForm(f=>({...f,skills:[...f.skills,skillInput.trim()]})); setSkillInput('') }}}
                placeholder="Type skill + Enter"
                className="flex-1 px-3 py-2 text-xs rounded-xl text-gray-200 placeholder-gray-600 outline-none"
                style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}/>
              <button onClick={()=>{ if(skillInput.trim()){setForm(f=>({...f,skills:[...f.skills,skillInput.trim()]}));setSkillInput('')}}}
                className="px-3 py-2 text-xs rounded-xl font-semibold"
                style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', color:'#c4b5fd' }}>Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.skills.map((s,i)=>(
                <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background:'rgba(139,92,246,0.12)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.25)' }}>
                  {s}
                  <button onClick={()=>setForm(f=>({...f,skills:f.skills.filter((_,j)=>j!==i)}))} className="hover:text-red-400"><X size={9}/></button>
                </span>
              ))}
            </div>
          </div>
          <ModalActions onCancel={()=>{setAddOpen(false);setEditRow(null)}} onConfirm={editRow?handleEdit:handleAdd} confirmLabel={editRow?'Save Changes':'Add Learner'} />
        </div>
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteRow} title="Delete Learner" onClose={()=>setDeleteRow(null)} width={400}>
        <p className="text-sm text-gray-300 leading-relaxed">
          Are you sure you want to delete <span className="text-white font-bold">{deleteRow?.name}</span>?
          This will permanently remove their account and all associated data.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          {/* BACKEND: supabase.auth.admin.deleteUser(deleteRow.id) — requires service_role key, call via server action */}
          This action cannot be undone.
        </p>
        <ModalActions onCancel={()=>setDeleteRow(null)} onConfirm={handleDelete} confirmLabel="Delete Permanently" danger />
      </Modal>
    </div>
  )
}

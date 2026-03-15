'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/tabs/CollegesTab.tsx
// Full CRUD: Add · Edit · Delete · Approve · Suspend
//
// BACKEND:
// - Fetch:   supabase.from('colleges').select('*').order('total_students',{ascending:false})
// - Add:     supabase.from('colleges').insert({...}) + send invite to adminEmail
// - Edit:    supabase.from('colleges').update({...}).eq('id', id)
// - Delete:  supabase.from('colleges').delete().eq('id', id)
// - Approve: supabase.from('colleges').update({status:'active'}).eq('id', id)
// - Suspend: supabase.from('colleges').update({status:'suspended'}).eq('id', id)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Trash2, Edit2, CheckCircle, XCircle, X, ChevronUp, ChevronDown, Building2 } from 'lucide-react'
import { MOCK_COLLEGES, collegeStatusMeta, type College } from '@/types/admin.types'
import Modal, { FormField, FormSelect, ModalActions } from '../Modal'

const CITIES   = ['Vellore','Pilani','Mumbai','Trichy','Chennai','Manipal','Noida','Hyderabad','Pune','Bangalore']
const STATUSES: College['status'][] = ['active','pending','suspended']

const emptyCollege = (): Omit<College,'id'|'totalStudents'|'activeStudents'|'placementRate'|'avgReadiness'> => ({
  name:'', city:'', code:'', adminEmail:'', status:'pending',
  onboardedAt: new Date().toISOString().slice(0,10), topDomains:[],
})

export default function CollegesTab() {
  const [rows, setRows]             = useState<College[]>(MOCK_COLLEGES)
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilter]   = useState('')
  const [addOpen, setAddOpen]       = useState(false)
  const [editRow, setEditRow]       = useState<College | null>(null)
  const [deleteRow, setDeleteRow]   = useState<College | null>(null)
  const [viewRow, setViewRow]       = useState<College | null>(null)
  const [form, setForm]             = useState<ReturnType<typeof emptyCollege>>(emptyCollege())
  const [domainInput, setDomainInput] = useState('')

  const visible = rows.filter(r => {
    const q = search.toLowerCase()
    return (!q || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
      && (!filterStatus || r.status === filterStatus)
  })

  const handleAdd = () => {
    if (!form.name || !form.adminEmail) return
    setRows(prev => [{ ...form, id:`c${Date.now()}`, totalStudents:0, activeStudents:0, placementRate:0, avgReadiness:0 }, ...prev])
    // BACKEND: await supabase.from('colleges').insert({...form})
    //          await supabase.auth.admin.inviteUserByEmail(form.adminEmail, { data:{ role:'college', college_id: newId } })
    setAddOpen(false); setForm(emptyCollege())
  }

  const openEdit = (r: College) => { setEditRow(r); setForm({ name:r.name, city:r.city, code:r.code, adminEmail:r.adminEmail, status:r.status, onboardedAt:r.onboardedAt, topDomains:[...r.topDomains] }) }
  const handleEdit = () => {
    if (!editRow) return
    setRows(prev => prev.map(r => r.id===editRow.id ? { ...r, ...form } : r))
    // BACKEND: await supabase.from('colleges').update({name:form.name, city:form.city, ...}).eq('id', editRow.id)
    setEditRow(null)
  }

  const handleDelete = () => {
    if (!deleteRow) return
    setRows(prev => prev.filter(r => r.id!==deleteRow.id))
    // BACKEND: await supabase.from('colleges').delete().eq('id', deleteRow.id)
    setDeleteRow(null)
  }

  const setStatus = (id: string, status: College['status']) => {
    setRows(prev => prev.map(r => r.id===id ? { ...r, status } : r))
    // BACKEND: await supabase.from('colleges').update({status}).eq('id', id)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, city or code…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl text-gray-200 placeholder-gray-600 outline-none"
            style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}/>
          {search && <button onClick={()=>setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={11}/></button>}
        </div>
        <select value={filterStatus} onChange={e=>setFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl text-gray-300 outline-none cursor-pointer"
          style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s=><option key={s} value={s} className="bg-gray-900">{s[0].toUpperCase()+s.slice(1)}</option>)}
        </select>
        <span className="text-xs text-gray-600">{visible.length} / {rows.length}</span>
        <button onClick={()=>{setForm(emptyCollege());setAddOpen(true)}}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ml-auto"
          style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', border:'1px solid rgba(139,92,246,0.4)', color:'#fff', boxShadow:'0 0 18px rgba(139,92,246,0.25)' }}>
          <Plus size={12}/> Add College
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {visible.map((r, i) => {
            const sm = collegeStatusMeta[r.status]
            return (
              <motion.div key={r.id}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                transition={{ delay: i*0.04 }}
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background:'rgba(10,4,28,0.75)', border:'1px solid rgba(139,92,246,0.12)' }}>

                {/* Glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                  style={{ background: r.status==='active'?'rgba(52,211,153,0.08)': r.status==='pending'?'rgba(251,191,36,0.08)':'rgba(248,113,113,0.08)' }}/>

                <div className="flex items-start justify-between mb-3 relative">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background:'rgba(6,182,212,0.12)', color:'#67e8f9', border:'1px solid rgba(6,182,212,0.2)' }}>
                      {r.code.slice(0,3)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-none">{r.name}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{r.city} · {r.adminEmail}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                    style={{ background:sm.bg, color:sm.color, border:`1px solid ${sm.border}` }}>
                    {sm.label}
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label:'Students', value: r.totalStudents.toLocaleString() },
                    { label:'Active',   value: r.activeStudents.toLocaleString() },
                    { label:'Placed',   value: `${r.placementRate}%` },
                    { label:'Readiness',value: `${r.avgReadiness}%` },
                  ].map(s=>(
                    <div key={s.label} className="rounded-xl p-2 text-center" style={{ background:'rgba(255,255,255,0.03)' }}>
                      <p className="text-white font-bold text-sm">{s.value}</p>
                      <p className="text-gray-600 text-[9px] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Placement bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Placement Rate</span>
                    <span style={{ color: r.placementRate>=80?'#34d399':r.placementRate>=60?'#fbbf24':'#f87171' }}>{r.placementRate}%</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background:'rgba(255,255,255,0.05)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: r.placementRate>=80?'#34d399':r.placementRate>=60?'#fbbf24':'#f87171' }}
                      initial={{ width:0 }} animate={{ width:`${r.placementRate}%` }} transition={{ duration:0.8, delay:i*0.05 }}/>
                  </div>
                </div>

                {/* Top domains */}
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {r.topDomains.map(d=>(
                    <span key={d} className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background:'rgba(129,140,248,0.1)', color:'#a5b4fc', border:'1px solid rgba(129,140,248,0.2)' }}>
                      {d}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.05]">
                  <button onClick={()=>setViewRow(r)}
                    className="flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition text-gray-400 hover:text-white hover:bg-white/[0.05]">
                    View Details
                  </button>
                  <button onClick={()=>openEdit(r)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition">
                    <Edit2 size={12}/>
                  </button>
                  {r.status==='pending' && (
                    <button onClick={()=>setStatus(r.id,'active')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-500/10 transition"
                      title="Approve" style={{ color:'#34d399' }}>
                      <CheckCircle size={14}/>
                    </button>
                  )}
                  {r.status==='active' && (
                    <button onClick={()=>setStatus(r.id,'suspended')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-amber-500/10 transition"
                      title="Suspend" style={{ color:'#fbbf24' }}>
                      <XCircle size={14}/>
                    </button>
                  )}
                  {r.status==='suspended' && (
                    <button onClick={()=>setStatus(r.id,'active')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-500/10 transition"
                      title="Reinstate" style={{ color:'#34d399' }}>
                      <CheckCircle size={14}/>
                    </button>
                  )}
                  <button onClick={()=>setDeleteRow(r)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition">
                    <Trash2 size={12}/>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal open={addOpen || !!editRow} title={editRow ? `Edit — ${editRow.name}` : 'Onboard New College'} onClose={()=>{setAddOpen(false);setEditRow(null)}}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Institution Name" value={form.name}       onChange={v=>setForm(f=>({...f,name:v}))}       placeholder="VIT Vellore"       required />
            <FormField label="Short Code"       value={form.code}       onChange={v=>setForm(f=>({...f,code:v.toUpperCase()}))} placeholder="VIT"        required />
            <FormSelect label="City"            value={form.city}       onChange={v=>setForm(f=>({...f,city:v}))}       options={CITIES.map(c=>({value:c,label:c}))} />
            <FormField  label="Admin Email"     value={form.adminEmail} onChange={v=>setForm(f=>({...f,adminEmail:v}))} placeholder="admin@college.edu" required type="email"/>
            <FormSelect label="Status"          value={form.status}     onChange={v=>setForm(f=>({...f,status:v as College['status']}))}
              options={STATUSES.map(s=>({value:s,label:s[0].toUpperCase()+s.slice(1)}))} />
            <FormField  label="Onboarded Date"  value={form.onboardedAt} onChange={v=>setForm(f=>({...f,onboardedAt:v}))} type="date" />
          </div>
          {/* Top Domains */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">Top Domains</label>
            <div className="flex gap-2">
              <input value={domainInput} onChange={e=>setDomainInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&domainInput.trim()){setForm(f=>({...f,topDomains:[...f.topDomains,domainInput.trim()]}));setDomainInput('')}}}
                placeholder="e.g. Full Stack"
                className="flex-1 px-3 py-2 text-xs rounded-xl text-gray-200 placeholder-gray-600 outline-none"
                style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}/>
              <button onClick={()=>{if(domainInput.trim()){setForm(f=>({...f,topDomains:[...f.topDomains,domainInput.trim()]}));setDomainInput('')}}}
                className="px-3 py-2 text-xs rounded-xl font-semibold" style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', color:'#c4b5fd' }}>Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.topDomains.map((d,i)=>(
                <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background:'rgba(6,182,212,0.1)', color:'#67e8f9', border:'1px solid rgba(6,182,212,0.2)' }}>
                  {d}<button onClick={()=>setForm(f=>({...f,topDomains:f.topDomains.filter((_,j)=>j!==i)}))} className="hover:text-red-400"><X size={9}/></button>
                </span>
              ))}
            </div>
          </div>
          <ModalActions onCancel={()=>{setAddOpen(false);setEditRow(null)}} onConfirm={editRow?handleEdit:handleAdd} confirmLabel={editRow?'Save Changes':'Onboard College'}/>
        </div>
      </Modal>

      {/* ── View Details Modal ── */}
      <Modal open={!!viewRow} title={viewRow?.name ?? ''} onClose={()=>setViewRow(null)} width={480}>
        {viewRow && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:'City',           value: viewRow.city          },
                { label:'Code',           value: viewRow.code          },
                { label:'Admin Email',    value: viewRow.adminEmail    },
                { label:'Status',         value: collegeStatusMeta[viewRow.status].label },
                { label:'Total Students', value: viewRow.totalStudents  },
                { label:'Active Students',value: viewRow.activeStudents },
                { label:'Placement Rate', value: `${viewRow.placementRate}%` },
                { label:'Avg Readiness',  value: `${viewRow.avgReadiness}%`  },
                { label:'Onboarded',      value: viewRow.onboardedAt   },
              ].map(item=>(
                <div key={item.label} className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm text-white font-semibold mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Top Domains</p>
              <div className="flex flex-wrap gap-1.5">
                {viewRow.topDomains.map(d=>(
                  <span key={d} className="text-[10px] px-2.5 py-1 rounded-full" style={{ background:'rgba(129,140,248,0.1)', color:'#a5b4fc', border:'1px solid rgba(129,140,248,0.2)' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteRow} title="Remove College" onClose={()=>setDeleteRow(null)} width={400}>
        <p className="text-sm text-gray-300 leading-relaxed">
          Permanently remove <span className="text-white font-bold">{deleteRow?.name}</span>?
          All associated student and placement data will be unlinked.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          {/* BACKEND: await supabase.from('colleges').delete().eq('id', deleteRow.id) */}
          This action cannot be undone.
        </p>
        <ModalActions onCancel={()=>setDeleteRow(null)} onConfirm={handleDelete} confirmLabel="Remove College" danger/>
      </Modal>
    </div>
  )
}

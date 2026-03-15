'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/tabs/RecruitersTab.tsx
// Full CRUD: Add · Edit · Delete · Verify · Deactivate
//
// BACKEND:
// - Fetch:    supabase.from('profiles').select('*, jobs(count)').eq('role','recruiter')
// - Add:      supabase.auth.admin.inviteUserByEmail(email, {data:{role:'recruiter',company}})
// - Edit:     supabase.from('profiles').update({...}).eq('id', id)
// - Delete:   supabase.auth.admin.deleteUser(id) via server action
// - Verify:   supabase.from('profiles').update({status:'verified'}).eq('id', id)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Trash2, Edit2, X, ChevronUp, ChevronDown, BadgeCheck, Briefcase } from 'lucide-react'
import { MOCK_RECRUITERS, recruiterStatusMeta, type Recruiter } from '@/types/admin.types'
import Modal, { FormField, FormSelect, ModalActions } from '../Modal'

const INDUSTRIES = ['FinTech','Quick Commerce','FoodTech','EdTech','E-Commerce','SaaS','HealthTech','Logistics']
const STATUSES: Recruiter['status'][] = ['active','inactive','verified']
const DOMAINS = ['Full Stack','Backend','Frontend','Data Science','DevOps','UI/UX','Mobile']

const emptyRecruiter = (): Omit<Recruiter,'id'|'totalHires'> => ({
  name:'', email:'', company:'', industry:'FinTech', activeJobs:0,
  avgPackageLPA:0, status:'active', joinedAt: new Date().toISOString().slice(0,10), hiringDomains:[],
})

export default function RecruitersTab() {
  const [rows, setRows]           = useState<Recruiter[]>(MOCK_RECRUITERS)
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('')
  const [filterIndustry, setFilterInd] = useState('')
  const [addOpen, setAddOpen]     = useState(false)
  const [editRow, setEditRow]     = useState<Recruiter | null>(null)
  const [deleteRow, setDeleteRow] = useState<Recruiter | null>(null)
  const [viewRow, setViewRow]     = useState<Recruiter | null>(null)
  const [form, setForm]           = useState(emptyRecruiter())
  const [domainInput, setDomainInput] = useState('')
  const [sortKey, setSortKey]     = useState<'avgPackageLPA'|'totalHires'|'activeJobs'>('avgPackageLPA')
  const [sortAsc, setSortAsc]     = useState(false)

  const visible = rows
    .filter(r => {
      const q = search.toLowerCase()
      return (!q || r.name.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
        && (!filterStatus   || r.status   === filterStatus)
        && (!filterIndustry || r.industry === filterIndustry)
    })
    .sort((a,b) => sortAsc ? a[sortKey]-b[sortKey] : b[sortKey]-a[sortKey])

  const handleAdd = () => {
    if (!form.name || !form.email || !form.company) return
    setRows(prev => [{ ...form, id:`r${Date.now()}`, totalHires:0 }, ...prev])
    // BACKEND: await supabase.auth.admin.inviteUserByEmail(form.email, {data:{role:'recruiter', company:form.company}})
    //          await supabase.from('profiles').insert({...form})
    setAddOpen(false); setForm(emptyRecruiter())
  }

  const openEdit = (r: Recruiter) => { setEditRow(r); setForm({ ...r }) }
  const handleEdit = () => {
    if (!editRow) return
    setRows(prev => prev.map(r => r.id===editRow.id ? { ...r, ...form } : r))
    // BACKEND: await supabase.from('profiles').update({company:form.company, ...}).eq('id', editRow.id)
    setEditRow(null)
  }

  const handleDelete = () => {
    if (!deleteRow) return
    setRows(prev => prev.filter(r => r.id!==deleteRow.id))
    // BACKEND: await fetch('/api/admin/delete-user', {method:'POST', body:JSON.stringify({id:deleteRow.id})})
    setDeleteRow(null)
  }

  const toggleStatus = (id: string, status: Recruiter['status']) => {
    setRows(prev => prev.map(r => r.id===id ? { ...r, status } : r))
    // BACKEND: await supabase.from('profiles').update({status}).eq('id', id)
  }

  const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => (
    <button className="flex items-center gap-1 text-gray-500 hover:text-gray-300 font-semibold tracking-wider uppercase text-[10px]"
      onClick={()=>{ if(sortKey===k) setSortAsc(!sortAsc); else { setSortKey(k); setSortAsc(false) } }}>
      {label}
      {sortKey===k ? (sortAsc?<ChevronUp size={10} className="text-violet-400"/>:<ChevronDown size={10} className="text-violet-400"/>)
        : <ChevronDown size={10} className="text-gray-700"/>}
    </button>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, company or email…"
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
        <select value={filterIndustry} onChange={e=>setFilterInd(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl text-gray-300 outline-none cursor-pointer"
          style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}>
          <option value="">All Industries</option>
          {INDUSTRIES.map(ind=><option key={ind} value={ind} className="bg-gray-900">{ind}</option>)}
        </select>
        <span className="text-xs text-gray-600">{visible.length} / {rows.length}</span>
        <button onClick={()=>{setForm(emptyRecruiter());setAddOpen(true)}}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ml-auto"
          style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', border:'1px solid rgba(139,92,246,0.4)', color:'#fff', boxShadow:'0 0 18px rgba(139,92,246,0.25)' }}>
          <Plus size={12}/> Add Recruiter
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(10,4,28,0.7)', border:'1px solid rgba(139,92,246,0.12)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]" style={{ background:'rgba(139,92,246,0.07)' }}>
              <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Recruiter</th>
              <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Company</th>
              <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Industry</th>
              <th className="text-left px-4 py-3"><SortBtn k="activeJobs"    label="Active Jobs"/></th>
              <th className="text-left px-4 py-3"><SortBtn k="totalHires"    label="Total Hires"/></th>
              <th className="text-left px-4 py-3"><SortBtn k="avgPackageLPA" label="Avg LPA"/></th>
              <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Domains</th>
              <th className="text-left px-4 py-3 text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Status</th>
              <th className="px-4 py-3 text-right text-gray-500 font-semibold tracking-wider uppercase text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            <AnimatePresence>
              {visible.map((r, i) => {
                const sm = recruiterStatusMeta[r.status]
                return (
                  <motion.tr key={r.id}
                    initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    transition={{ delay: i*0.03 }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.2)' }}>
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold leading-none">{r.name}</p>
                          <p className="text-gray-600 text-[10px] mt-0.5">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-semibold">{r.company}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background:'rgba(245,158,11,0.1)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.2)' }}>
                        {r.industry}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Briefcase size={10} className="text-violet-400"/>
                        <span className="text-white font-bold">{r.activeJobs}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono text-[11px]">{r.totalHires}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-xs" style={{ color:'#34d399' }}>₹{r.avgPackageLPA} LPA</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap max-w-[160px]">
                        {r.hiringDomains.slice(0,2).map(d=>(
                          <span key={d} className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{ background:'rgba(6,182,212,0.1)', color:'#67e8f9', border:'1px solid rgba(6,182,212,0.2)' }}>{d}</span>
                        ))}
                        {r.hiringDomains.length>2 && <span className="text-[9px] text-gray-600">+{r.hiringDomains.length-2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold"
                        style={{ background:sm.bg, color:sm.color, border:`1px solid ${sm.border}` }}>
                        {sm.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={()=>setViewRow(r)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                          title="View">
                          <Briefcase size={11}/>
                        </button>
                        {r.status !== 'verified' && (
                          <button onClick={()=>toggleStatus(r.id,'verified')}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-500/10 transition"
                            title="Verify" style={{ color:'#34d399' }}>
                            <BadgeCheck size={13}/>
                          </button>
                        )}
                        {r.status !== 'inactive' && (
                          <button onClick={()=>toggleStatus(r.id,'inactive')}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition"
                            title="Deactivate">
                            <X size={11}/>
                          </button>
                        )}
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
        {visible.length===0 && <div className="text-center py-12 text-gray-600 text-sm">No recruiters found.</div>}
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal open={addOpen || !!editRow} title={editRow?`Edit — ${editRow.name}`:'Add New Recruiter'} onClose={()=>{setAddOpen(false);setEditRow(null)}}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField  label="Full Name"     value={form.name}         onChange={v=>setForm(f=>({...f,name:v}))}         placeholder="Aisha Kapoor"      required/>
            <FormField  label="Email"         value={form.email}        onChange={v=>setForm(f=>({...f,email:v}))}        placeholder="aisha@company.com" required type="email"/>
            <FormField  label="Company"       value={form.company}      onChange={v=>setForm(f=>({...f,company:v}))}      placeholder="Zepto"             required/>
            <FormSelect label="Industry"      value={form.industry}     onChange={v=>setForm(f=>({...f,industry:v}))}     options={INDUSTRIES.map(i=>({value:i,label:i}))}/>
            <FormSelect label="Status"        value={form.status}       onChange={v=>setForm(f=>({...f,status:v as Recruiter['status']}))} options={STATUSES.map(s=>({value:s,label:s[0].toUpperCase()+s.slice(1)}))}/>
            <FormField  label="Avg Package (LPA)" value={String(form.avgPackageLPA)} onChange={v=>setForm(f=>({...f,avgPackageLPA:Number(v)||0}))} type="number" placeholder="22"/>
          </div>
          {/* Hiring Domains */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">Hiring Domains</label>
            <div className="flex gap-2">
              <select value={domainInput} onChange={e=>setDomainInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl text-gray-200 outline-none cursor-pointer"
                style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}>
                <option value="">Select domain…</option>
                {DOMAINS.map(d=><option key={d} value={d} className="bg-gray-900">{d}</option>)}
              </select>
              <button onClick={()=>{if(domainInput){setForm(f=>({...f,hiringDomains:[...f.hiringDomains,domainInput]}));setDomainInput('')}}}
                className="px-3 py-2 text-xs rounded-xl font-semibold" style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', color:'#c4b5fd' }}>Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.hiringDomains.map((d,i)=>(
                <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background:'rgba(6,182,212,0.1)', color:'#67e8f9', border:'1px solid rgba(6,182,212,0.2)' }}>
                  {d}<button onClick={()=>setForm(f=>({...f,hiringDomains:f.hiringDomains.filter((_,j)=>j!==i)}))} className="hover:text-red-400"><X size={9}/></button>
                </span>
              ))}
            </div>
          </div>
          <ModalActions onCancel={()=>{setAddOpen(false);setEditRow(null)}} onConfirm={editRow?handleEdit:handleAdd} confirmLabel={editRow?'Save Changes':'Add Recruiter'}/>
        </div>
      </Modal>

      {/* ── View Modal ── */}
      <Modal open={!!viewRow} title={viewRow ? `${viewRow.name} — ${viewRow.company}` : ''} onClose={()=>setViewRow(null)} width={480}>
        {viewRow && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:'Email',          value: viewRow.email          },
                { label:'Industry',       value: viewRow.industry       },
                { label:'Active Jobs',    value: viewRow.activeJobs     },
                { label:'Total Hires',   value: viewRow.totalHires     },
                { label:'Avg Package',   value: `₹${viewRow.avgPackageLPA} LPA` },
                { label:'Status',         value: recruiterStatusMeta[viewRow.status].label },
                { label:'Joined',         value: viewRow.joinedAt       },
              ].map(item=>(
                <div key={item.label} className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm text-white font-semibold mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Hiring Domains</p>
              <div className="flex flex-wrap gap-1.5">
                {viewRow.hiringDomains.map(d=>(
                  <span key={d} className="text-[10px] px-2.5 py-1 rounded-full" style={{ background:'rgba(6,182,212,0.1)', color:'#67e8f9', border:'1px solid rgba(6,182,212,0.2)' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteRow} title="Remove Recruiter" onClose={()=>setDeleteRow(null)} width={400}>
        <p className="text-sm text-gray-300 leading-relaxed">
          Permanently remove <span className="text-white font-bold">{deleteRow?.name}</span> from <span className="text-white font-bold">{deleteRow?.company}</span>?
          All their job postings will be archived.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          {/* BACKEND: server action → supabase.auth.admin.deleteUser(deleteRow.id) */}
          This cannot be undone.
        </p>
        <ModalActions onCancel={()=>setDeleteRow(null)} onConfirm={handleDelete} confirmLabel="Remove Recruiter" danger/>
      </Modal>
    </div>
  )
}

'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/tabs/ActivityTab.tsx
// Full system log with severity filters + export
//
// BACKEND:
// - Fetch:     supabase.from('system_logs').select('*, profiles(full_name,email)').order('created_at',{ascending:false}).limit(100)
// - Realtime:  supabase.channel('admin-logs').on('postgres_changes',{event:'INSERT',table:'system_logs'},handler).subscribe()
// - Export CSV: convert logs to blob, trigger download
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, RefreshCw, X } from 'lucide-react'

type Severity = 'info' | 'warn' | 'error' | 'success'

interface LogEntry {
  id: string; time: string; action: string; actor: string; severity: Severity; module: string
}

const ALL_LOGS: LogEntry[] = [
  { id:'1',  time:'2 min ago',  action:"Learner 'Priya Nair' status changed to Placed",          actor:'admin@cosmos.ai', severity:'success', module:'Learners'   },
  { id:'2',  time:'14 min ago', action:"College 'IIT Bombay' approved and activated",             actor:'admin@cosmos.ai', severity:'success', module:'Colleges'   },
  { id:'3',  time:'31 min ago', action:"Recruiter 'Aisha Kapoor' verified — Zepto",               actor:'admin@cosmos.ai', severity:'success', module:'Recruiters' },
  { id:'4',  time:'45 min ago', action:"Feature flag 'recruiter_ai_search' toggled ON",           actor:'admin@cosmos.ai', severity:'info',    module:'Flags'      },
  { id:'5',  time:'1h ago',     action:"Learner 'Neha Kulkarni' marked inactive",                 actor:'admin@cosmos.ai', severity:'warn',    module:'Learners'   },
  { id:'6',  time:'2h ago',     action:"College 'Amity Noida' suspended — compliance failure",    actor:'system',          severity:'error',   module:'Colleges'   },
  { id:'7',  time:'2h ago',     action:"Bulk import: 340 learners added from VIT CSV",            actor:'admin@cosmos.ai', severity:'info',    module:'Learners'   },
  { id:'8',  time:'3h ago',     action:"Roadmap generation failed for learner #l9",               actor:'system',          severity:'error',   module:'System'     },
  { id:'9',  time:'4h ago',     action:"Recruiter 'Sonia Jain' deactivated",                     actor:'admin@cosmos.ai', severity:'warn',    module:'Recruiters' },
  { id:'10', time:'5h ago',     action:"Feature flag 'ai_mentor_v2' enabled",                    actor:'admin@cosmos.ai', severity:'info',    module:'Flags'      },
  { id:'11', time:'6h ago',     action:"API rate limit exceeded on /api/assessment endpoint",     actor:'system',          severity:'error',   module:'System'     },
  { id:'12', time:'7h ago',     action:"New college 'CBIT Hyderabad' onboarded",                 actor:'admin@cosmos.ai', severity:'success', module:'Colleges'   },
  { id:'13', time:'8h ago',     action:"Learner 'Shreya Ghosh' resume score updated to 89",      actor:'system',          severity:'info',    module:'Learners'   },
  { id:'14', time:'10h ago',    action:"Recruiter 'Dev Malhotra' (Groww) added 6 active jobs",   actor:'system',          severity:'info',    module:'Recruiters' },
  { id:'15', time:'12h ago',    action:"Admin login from new device — IP 103.21.244.1",          actor:'admin@cosmos.ai', severity:'warn',    module:'Security'   },
]

const sevMeta: Record<Severity, { color: string; bg: string; border: string; dot: string }> = {
  success: { color:'#34d399', bg:'rgba(52,211,153,0.08)',  border:'rgba(52,211,153,0.2)',  dot:'#34d399' },
  info:    { color:'#818cf8', bg:'rgba(129,140,248,0.08)', border:'rgba(129,140,248,0.2)', dot:'#818cf8' },
  warn:    { color:'#fbbf24', bg:'rgba(251,191,36,0.08)',  border:'rgba(251,191,36,0.2)',  dot:'#fbbf24' },
  error:   { color:'#f87171', bg:'rgba(248,113,113,0.08)', border:'rgba(248,113,113,0.2)', dot:'#f87171' },
}

export default function ActivityTab() {
  const [filter, setFilter]     = useState<Severity | 'all'>('all')
  const [modFilter, setModFilter] = useState('')
  const [search, setSearch]     = useState('')

  const modules = Array.from(new Set(ALL_LOGS.map(l=>l.module)))

  const visible = ALL_LOGS.filter(l =>
    (filter==='all' || l.severity===filter)
    && (!modFilter || l.module===modFilter)
    && (!search || l.action.toLowerCase().includes(search.toLowerCase()) || l.actor.toLowerCase().includes(search.toLowerCase()))
  )

  const exportCSV = () => {
    // BACKEND: const { data } = await supabase.from('system_logs').select('*').order('created_at',{ascending:false})
    // const header = 'id,action,actor,severity,module,created_at\n'
    // const rows = data.map(l => `${l.id},"${l.action}",${l.actor},${l.severity},${l.module},${l.created_at}`).join('\n')
    // const blob = new Blob([header+rows], {type:'text/csv'})
    // const url = URL.createObjectURL(blob); const a = document.createElement('a')
    // a.href=url; a.download='system_logs.csv'; a.click()
    alert('Export CSV — wire up Supabase query to download real logs')
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search actions or actors…"
            className="w-full pl-3 pr-3 py-2 text-xs rounded-xl text-gray-200 placeholder-gray-600 outline-none"
            style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}/>
          {search && <button onClick={()=>setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={11}/></button>}
        </div>
        {/* Severity pills */}
        {(['all','success','info','warn','error'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition"
            style={filter===f ? {
              background: f==='all' ? 'rgba(139,92,246,0.2)' : sevMeta[f as Severity]?.bg,
              border: `1px solid ${f==='all' ? 'rgba(139,92,246,0.4)' : sevMeta[f as Severity]?.border}`,
              color: f==='all' ? '#c4b5fd' : sevMeta[f as Severity]?.color,
            } : { background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'#4b5563' }}>
            {f}
          </button>
        ))}
        <select value={modFilter} onChange={e=>setModFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl text-gray-300 outline-none cursor-pointer"
          style={{ background:'rgba(139,92,246,0.07)', border:'1px solid rgba(139,92,246,0.18)' }}>
          <option value="">All Modules</option>
          {modules.map(m=><option key={m} value={m} className="bg-gray-900">{m}</option>)}
        </select>
        <span className="text-xs text-gray-600">{visible.length} entries</span>
        <button onClick={()=>{}} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white transition rounded-lg hover:bg-white/[0.06]" title="Refresh">
          {/* BACKEND: re-fetch system_logs */}
          <RefreshCw size={13}/>
        </button>
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', color:'#c4b5fd' }}>
          <Download size={11}/> Export CSV
        </button>
      </div>

      {/* Log list */}
      <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(10,4,28,0.7)', border:'1px solid rgba(139,92,246,0.12)' }}>
        <div className="divide-y divide-white/[0.04]">
          <AnimatePresence>
            {visible.map((log, i) => {
              const m = sevMeta[log.severity]
              return (
                <motion.div key={log.id}
                  initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                  transition={{ delay: i*0.02 }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  style={{ background: i===0 ? m.bg : undefined }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background:m.dot, boxShadow:`0 0 6px ${m.dot}` }}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-gray-200 leading-snug">{log.action}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-gray-600">by <span className="text-gray-500">{log.actor}</span></span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:m.bg, color:m.color, border:`1px solid ${m.border}` }}>
                        {log.module}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase"
                      style={{ background:m.bg, color:m.color, border:`1px solid ${m.border}` }}>
                      {log.severity}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono">{log.time}</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {visible.length===0 && <div className="text-center py-12 text-gray-600 text-sm">No log entries match your filters.</div>}
        </div>
      </div>
    </div>
  )
}

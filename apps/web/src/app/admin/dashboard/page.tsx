'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/app/admin/dashboard/page.tsx
//
// COSMOS Admin Dashboard — master page.
// All tabs live inside AdminShell (same glass + cosmic overlays as CollegeShell).
//
// ROUTE PROTECTION — add to src/middleware.ts:
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// export async function middleware(req) {
//   const supabase = createMiddlewareClient({ req, res: NextResponse.next() })
//   const { data: { session } } = await supabase.auth.getSession()
//   if (!session) return NextResponse.redirect(new URL('/login', req.url))
//   const { data: profile } = await supabase.from('profiles').select('role').eq('id',session.user.id).single()
//   if (profile?.role !== 'admin') return NextResponse.redirect(new URL('/', req.url))
// }
// export const config = { matcher: ['/admin/:path*'] }
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminShell    from '@/components/admin/AdminShell'
import OverviewTab   from '@/components/admin/tabs/OverviewTab'
import LearnersTab   from '@/components/admin/tabs/LearnersTab'
import CollegesTab   from '@/components/admin/tabs/CollegesTab'
import RecruitersTab from '@/components/admin/tabs/RecruitersTab'
import ActivityTab   from '@/components/admin/tabs/ActivityTab'
import FlagsTab      from '@/components/admin/tabs/FlagsTab'

type Tab = 'overview' | 'learners' | 'colleges' | 'recruiters' | 'activity' | 'flags' | 'settings'

const TAB_META: Record<Tab, { label: string; icon: string; description: string }> = {
  overview:   { label:'Overview',   icon:'⬡', description:'Platform-wide KPIs and real-time activity'   },
  learners:   { label:'Learners',   icon:'◉', description:'Manage learner accounts and career readiness' },
  colleges:   { label:'Colleges',   icon:'▣', description:'Onboard and manage college institutions'      },
  recruiters: { label:'Recruiters', icon:'◈', description:'Verify and track recruiter accounts'          },
  activity:   { label:'Activity',   icon:'△', description:'Full system log with severity filters'        },
  flags:      { label:'Flags',      icon:'⚑', description:'Toggle feature flags across the platform'    },
  settings:   { label:'Settings',   icon:'◎', description:'Platform configuration and preferences'       },
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // BACKEND — fetch all dashboard seed data in parallel on mount:
  // useEffect(() => {
  //   const supabase = createBrowserClient()
  //   Promise.all([
  //     supabase.rpc('get_admin_stats'),
  //     supabase.from('system_logs').select('*, profiles(email)').order('created_at',{ascending:false}).limit(15),
  //     supabase.from('feature_flags').select('*').order('key'),
  //   ]).then(([{ data: stats }, { data: logs }, { data: flags }]) => {
  //     // setStats(stats); setLogs(logs); setFlags(flags)
  //   })
  // }, [])

  // BACKEND — realtime log subscription:
  // useEffect(() => {
  //   const supabase = createBrowserClient()
  //   const ch = supabase.channel('admin-realtime')
  //     .on('postgres_changes', { event:'INSERT', schema:'public', table:'system_logs' },
  //       payload => { /* prepend to log state */ })
  //     .subscribe()
  //   return () => { supabase.removeChannel(ch) }
  // }, [])

  return (
    <AdminShell activeTab={activeTab} onTabChange={tab => setActiveTab(tab as Tab)}>

      {/* ── Breadcrumb + quick-switch ── */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xs">Admin</span>
            <span className="text-gray-700 text-xs">/</span>
            <span className="text-xs font-semibold" style={{ color:'#c4b5fd' }}>
              {TAB_META[activeTab].label}
            </span>
          </div>
          <p className="text-white font-bold text-sm mt-0.5">{TAB_META[activeTab].description}</p>
        </div>

        {/* Tab pills */}
        <div className="flex gap-1.5 flex-wrap justify-end">
          {(Object.keys(TAB_META) as Tab[]).filter(t => t !== 'settings').map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all"
              style={activeTab === tab ? {
                background: 'rgba(139,92,246,0.2)',
                border: '1px solid rgba(139,92,246,0.4)',
                color: '#c4b5fd',
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#6b7280',
              }}
            >
              {TAB_META[tab].icon} {TAB_META[tab].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content — cross-fade animation ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {activeTab === 'overview'   && <OverviewTab   />}
          {activeTab === 'learners'   && <LearnersTab   />}
          {activeTab === 'colleges'   && <CollegesTab   />}
          {activeTab === 'recruiters' && <RecruitersTab />}
          {activeTab === 'activity'   && <ActivityTab   />}
          {activeTab === 'flags'      && <FlagsTab      />}
          {activeTab === 'settings'   && (
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ height: 280, background:'rgba(10,4,28,0.7)', border:'1px solid rgba(139,92,246,0.12)' }}
            >
              <div className="text-center">
                <p className="text-3xl mb-3 opacity-40">◎</p>
                <p className="text-gray-400 text-sm font-semibold">Settings coming soon</p>
                <p className="text-gray-600 text-xs mt-1">Platform config, API keys, email templates, billing</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AdminShell>
  )
}

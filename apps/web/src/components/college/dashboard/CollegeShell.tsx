'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Users, BarChart2, Trophy,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, Building2, Mail,
} from 'lucide-react'
import { MOCK_COLLEGE } from './college.types.ts'

const NAV = [
  { label: 'Dashboard',  href: '/college/dashboard',  icon: LayoutDashboard },
  { label: 'Students',   href: '/college/students',   icon: Users           },
  { label: 'Analytics',  href: '/college/analytics',  icon: BarChart2       },
  { label: 'Placements', href: '/college/placements', icon: Trophy          },
  { label: 'Settings',   href: '/college/settings',   icon: Settings        },
]

// Same violet accent as learner shell — only active nav colour differs (teal)
const ACCENT = '#06b6d4'

interface CollegeShellProps {
  children:    React.ReactNode
  activeHref?: string
}

export default function CollegeShell({ children, activeHref = '' }: CollegeShellProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className="flex items-center justify-center w-screen h-screen overflow-hidden text-white"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Same cosmic overlays as learner */}
      <div className="absolute inset-0 bg-[#06010f]/60 pointer-events-none" />
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-purple-800/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-800/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-900/10 blur-[160px] pointer-events-none" />
      <style>{`html,body{overflow:hidden!important;height:100%}`}</style>

      {/* Same glass shell as learner */}
      <div
        className="relative z-10 flex overflow-hidden"
        style={{
          width: 'calc(100vw - 40px)',
          height: 'calc(100vh - 40px)',
          borderRadius: 20,
          background: 'rgba(6, 2, 18, 0.45)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(139,92,246,0.15)',
          boxShadow: '0 0 0 1px rgba(139,92,246,0.06), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          className={`relative flex flex-col h-full shrink-0 border-r border-white/[0.06] transition-all duration-300 ${collapsed ? 'w-14' : 'w-48'}`}
          style={{ background: 'rgba(10,4,30,0.5)' }}
        >
          {/* Logo — same as learner but says College */}
          <div className={`flex items-center gap-2 px-4 py-4 border-b border-white/[0.06] ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: '#fff' }}>
              ✦
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-black tracking-[0.2em] text-xs bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  COSMOS
                </span>
                <p className="text-[8px] text-gray-600 font-semibold tracking-widest uppercase">College</p>
              </div>
            )}
          </div>

          {/* College badge — only when expanded */}
          {!collapsed && (
            <div className="mx-2 mt-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <div className="flex items-center gap-1.5">
                <Building2 size={11} style={{ color: ACCENT, flexShrink: 0 }} />
                <p className="text-[10px] font-bold text-white truncate leading-tight">
                  {MOCK_COLLEGE.name.split(' ').slice(0, 3).join(' ')}
                </p>
              </div>
              <p className="text-[8.5px] text-gray-600 mt-0.5 ml-4">{MOCK_COLLEGE.city} · {MOCK_COLLEGE.code}</p>
            </div>
          )}

          {/* Nav — identical pattern to learner */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = href === activeHref
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150
                    ${active ? 'text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'}
                    ${collapsed ? 'justify-center' : ''}`}
                  style={active ? {
                    background: 'rgba(6,182,212,0.15)',
                    border: '1px solid rgba(6,182,212,0.28)',
                    boxShadow: '0 0 16px rgba(6,182,212,0.2)',
                    color: '#67e8f9',
                  } : {}}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={15} className="shrink-0" />
                  {!collapsed && <span className="font-medium">{label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className={`px-2 py-3 border-t border-white/[0.06] ${collapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={() => router.push('/login')}
              className={`flex items-center gap-2 text-gray-600 hover:text-red-400 text-xs transition px-3 py-2 rounded-xl hover:bg-red-500/10 ${collapsed ? 'justify-center' : 'w-full'}`}
            >
              <LogOut size={13} />
              {!collapsed && 'Logout'}
            </button>
          </div>

          {/* Collapse toggle — same as learner */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d0520] border border-violet-500/30 flex items-center justify-center text-violet-400 hover:text-white z-20 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          >
            {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header — same structure as learner */}
          <header
            className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0"
            style={{ background: 'rgba(10,4,30,0.3)' }}
          >
            <div>
              <p className="text-gray-500 text-xs">
                College Portal ·{' '}
                <span className="font-semibold" style={{ color: '#67e8f9' }}>
                  {MOCK_COLLEGE.name}
                </span>
              </p>
              <p className="text-white font-bold text-base tracking-tight">College Dashboard</p>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition">
                <Mail size={13} />
              </button>
              <button className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition">
                <Bell size={13} />
              </button>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)', boxShadow: '0 0 12px rgba(6,182,212,0.35)' }}
              >
                <GraduationCap size={14} color="#fff" />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/AdminShell.tsx
//
// Reusable shell wrapping every admin page.
// Matches the CollegeShell pattern: same cosmic overlays, same glass container,
// same collapsible sidebar, same header structure.
//
// BACKEND INTEGRATION:
// import { createBrowserClient } from '@/lib/supabase'
// const { data: { user } } = await supabase.auth.getUser()
// Check user profile.role === 'admin' in middleware.ts
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Building2, Briefcase,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  Shield, Activity, Flag,
} from 'lucide-react'

const NAV = [
  { label: 'Overview',   href: '/admin/dashboard',            icon: LayoutDashboard },
  { label: 'Learners',   href: '/admin/dashboard?tab=learners',  icon: Users       },
  { label: 'Colleges',   href: '/admin/dashboard?tab=colleges',  icon: Building2   },
  { label: 'Recruiters', href: '/admin/dashboard?tab=recruiters',icon: Briefcase   },
  { label: 'Activity',   href: '/admin/dashboard?tab=activity',  icon: Activity    },
  { label: 'Flags',      href: '/admin/dashboard?tab=flags',     icon: Flag        },
  { label: 'Settings',   href: '/admin/dashboard?tab=settings',  icon: Settings    },
]

interface AdminShellProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function AdminShell({ children, activeTab = 'overview', onTabChange }: AdminShellProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [displayName, setDisplayName] = useState('Super Admin')
  const [displayEmail, setDisplayEmail] = useState('admin@cosmos.ai')

  useEffect(() => {
    const storedName = sessionStorage.getItem('cosmos_name')
    const storedEmail = sessionStorage.getItem('cosmos_email')
    if (storedName) setDisplayName(storedName)
    if (storedEmail) setDisplayEmail(storedEmail)
  }, [])

  const handleNav = (href: string, label: string) => {
    const tab = label.toLowerCase()
    onTabChange?.(tab === 'overview' ? 'overview' : tab)
  }

  return (
    <div
      className="flex items-center justify-center w-screen h-screen overflow-hidden text-white"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        background: '#06010f',
      }}
    >
      {/* ── Cosmic overlays (same as CollegeShell) ── */}
      <div className="absolute inset-0 bg-[#06010f]/70 pointer-events-none" />
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-purple-800/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-800/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-900/10 blur-[160px] pointer-events-none" />
      {/* Extra red accent for admin danger feel */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-rose-900/10 blur-[120px] pointer-events-none" />
      <style>{`html,body{overflow:hidden!important;height:100%}`}</style>

      {/* ── Glass shell (same dimensions as CollegeShell) ── */}
      <div
        className="relative z-10 flex overflow-hidden"
        style={{
          width: 'calc(100vw - 40px)',
          height: 'calc(100vh - 40px)',
          borderRadius: 20,
          background: 'rgba(6, 2, 18, 0.48)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(139,92,246,0.15)',
          boxShadow: '0 0 0 1px rgba(139,92,246,0.06), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          className={`relative flex flex-col h-full shrink-0 border-r border-white/[0.06] transition-all duration-300 ${collapsed ? 'w-14' : 'w-48'}`}
          style={{ background: 'rgba(10,4,30,0.55)' }}
        >
          {/* Logo */}
          <div className={`flex items-center gap-2 px-4 py-4 border-b border-white/[0.06] ${collapsed ? 'justify-center' : ''}`}>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                boxShadow: '0 0 12px rgba(139,92,246,0.5)',
                color: '#fff',
              }}
            >
              <Shield size={13} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-black tracking-[0.2em] text-xs bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                  COSMOS
                </span>
                <p className="text-[8px] text-gray-600 font-semibold tracking-widest uppercase">Admin</p>
              </div>
            )}
          </div>

          {/* Admin badge */}
          {!collapsed && (
            <div
              className="mx-2 mt-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}
            >
              <div className="flex items-center gap-1.5">
                <Shield size={10} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <p className="text-[10px] font-bold text-white truncate">{displayName}</p>
              </div>
              <p className="text-[8.5px] text-gray-600 mt-0.5 ml-4">{displayEmail}</p>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {NAV.map(({ label, href, icon: Icon }) => {
              const tab = label.toLowerCase()
              const isActive = tab === 'overview' ? activeTab === 'overview' : activeTab === tab
              return (
                <button
                  key={label}
                  onClick={() => handleNav(href, label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150
                    ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'}
                    ${collapsed ? 'justify-center' : ''}`}
                  style={isActive ? {
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.30)',
                    boxShadow: '0 0 16px rgba(139,92,246,0.18)',
                    color: '#c4b5fd',
                  } : {}}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={14} className="shrink-0" />
                  {!collapsed && <span className="font-medium">{label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className={`px-2 py-3 border-t border-white/[0.06] ${collapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={() => {
                // BACKEND: await supabase.auth.signOut(); router.push('/login')
                router.push('/login')
              }}
              className={`flex items-center gap-2 text-gray-600 hover:text-red-400 text-xs transition px-3 py-2 rounded-xl hover:bg-red-500/10 ${collapsed ? 'justify-center' : 'w-full'}`}
            >
              <LogOut size={13} />
              {!collapsed && 'Logout'}
            </button>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d0520] border border-violet-500/30 flex items-center justify-center text-violet-400 hover:text-white z-20 shadow-[0_0_10px_rgba(139,92,246,0.3)] transition"
          >
            {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header
            className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0"
            style={{ background: 'rgba(10,4,30,0.35)' }}
          >
            <div>
              <p className="text-gray-500 text-xs">
                Mission Control ·{' '}
                <span className="font-semibold" style={{ color: '#c4b5fd' }}>
                  Platform Administration
                </span>
              </p>
              <p className="text-white font-bold text-base tracking-tight">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Live
              </div>
              <button className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition">
                <Bell size={13} />
              </button>
              {/* Admin avatar */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer font-bold text-xs"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 12px rgba(139,92,246,0.35)' }}
              >
                {displayName.trim().charAt(0) || 'A'}
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

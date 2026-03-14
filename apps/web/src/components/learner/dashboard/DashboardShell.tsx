'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, BrainCircuit, MessageSquare, Map,
  FileText, Briefcase, LogOut, ChevronLeft, ChevronRight,
  Mail, Bell, Target, Sparkles,
} from 'lucide-react'

import MailPanel         from './MailPanel'
import NotificationPanel from './NotificationPanel'
import ProfilePanel      from './ProfilePanel'
import CosmicOnboarding  from './CosmicOnboarding'
import type { OnboardingData } from './CosmicOnboarding'

// ── Storage keys ──────────────────────────────────────────────────────────────
const KEY_DONE = 'cosmos_onboarding_done'
const KEY_GOAL = 'cosmos_user_goal'

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV = [
  { label: 'Dashboard',      href: '/learner/dashboard',     icon: LayoutDashboard },
  { label: 'Assessment',     href: '/learner/assessment',    icon: BrainCircuit    },
  { label: 'Digital Mentor', href: '/learner/mentor',        icon: MessageSquare   },
  { label: 'Roadmap',        href: '/learner/roadmap',       icon: Map             },
  { label: 'Resume Builder', href: '/learner/resume',        icon: FileText        },
  { label: 'Opportunities',  href: '/learner/opportunities', icon: Briefcase       },
]

const MAIL_UNREAD  = 2
const NOTIF_UNREAD = 3

type Panel = 'mail' | 'notification' | 'profile' | null

interface DashboardShellProps {
  children:    React.ReactNode
  activeHref?: string
}

export default function DashboardShell({ children, activeHref = '' }: DashboardShellProps) {
  const router = useRouter()
  const [collapsed,  setCollapsed]  = useState(false)
  const [openPanel,  setOpenPanel]  = useState<Panel>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // ── Onboarding state ──────────────────────────────────────────────────────
  // showOnboarding: true  → first-time popup (auto on signup)
  // showGoalEditor: true  → re-open from dashboard toggle button
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showGoalEditor, setShowGoalEditor] = useState(false)
  const [savedGoal,      setSavedGoal]      = useState<OnboardingData | null>(null)

  // On mount: check if first-time user (localStorage has no completion flag)
  // TODO backend teammate: replace localStorage check with
  //   GET /api/learner/profile → { onboardingComplete: boolean }
  useEffect(() => {
    const done = localStorage.getItem(KEY_DONE)
    if (!done) {
      // First time — show popup after short delay for page-load feel
      const t = setTimeout(() => setShowOnboarding(true), 600)
      return () => clearTimeout(t)
    }
    // Load saved goal for display in header tooltip
    const raw = localStorage.getItem(KEY_GOAL)
    if (raw) {
      try { setSavedGoal(JSON.parse(raw)) } catch {}
    }
  }, [])

  // ── Panel outside-click handler ───────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenPanel(null)
      }
    }
    if (openPanel) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openPanel])

  function togglePanel(panel: Panel) {
    setOpenPanel(prev => prev === panel ? null : panel)
  }

  // ── Onboarding confirm handlers ───────────────────────────────────────────
  function handleFirstTimeConfirm(data: OnboardingData) {
    // localStorage already saved inside CosmicOnboarding component
    setSavedGoal(data)
    setShowOnboarding(false)
    // TODO backend teammate: POST /api/learner/onboarding { ...data }
  }

  function handleGoalUpdateConfirm(data: OnboardingData) {
    setSavedGoal(data)
    setShowGoalEditor(false)
    // TODO backend teammate: PATCH /api/learner/goal { ...data }
  }

  return (
    <div
      className="flex items-center justify-center w-screen h-screen overflow-hidden text-white"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Cosmic bg overlays */}
      <div className="absolute inset-0 bg-[#06010f]/60 pointer-events-none" />
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-purple-800/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-800/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-900/10 blur-[160px] pointer-events-none" />

      {/* ── First-time onboarding popup ── */}
      <AnimatePresence>
        {showOnboarding && (
          <CosmicOnboarding
            mode="onboarding"
            onConfirm={handleFirstTimeConfirm}
            onClose={() => {
              // Allow closing — mark as seen so it doesn't show again
              localStorage.setItem(KEY_DONE, 'true')
              setShowOnboarding(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Update goal popup (opened from dashboard toggle) ── */}
      <AnimatePresence>
        {showGoalEditor && (
          <CosmicOnboarding
            mode="update"
            existing={savedGoal ?? undefined}
            onConfirm={handleGoalUpdateConfirm}
            onClose={() => setShowGoalEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Glass shell ── */}
      <div
        className="relative z-10 flex overflow-hidden"
        style={{
          width: 'calc(100vw - 40px)',
          height: 'calc(100vh - 40px)',
          borderRadius: '20px',
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
          {/* Logo */}
          <div className={`flex items-center gap-2 px-4 py-4 border-b border-white/[0.06] ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(139,92,246,0.6)]">✦</div>
            {!collapsed && (
              <span className="font-black tracking-[0.2em] text-xs bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                COSMOS
              </span>
            )}
          </div>

          {/* Goal mini badge in sidebar (when not collapsed) */}
          {!collapsed && savedGoal && (
            <div
              className="mx-2 mt-2 px-3 py-2 rounded-xl cursor-pointer"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
              onClick={() => setShowGoalEditor(true)}
            >
              <p className="text-[8px] font-semibold uppercase tracking-widest text-violet-400 mb-0.5">
                🎯 Active Goal
              </p>
              <p className="text-white text-[10px] font-semibold truncate">{savedGoal.goal}</p>
              <p className="text-gray-500 text-[9px] mt-0.5">{savedGoal.days}d remaining</p>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = href === activeHref
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150
                    ${active ? 'bg-violet-600/70 text-white shadow-[0_0_16px_rgba(124,58,237,0.5)]' : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'}
                    ${collapsed ? 'justify-center' : ''}`}
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

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d0520] border border-violet-500/30 flex items-center justify-center text-violet-400 hover:text-white z-20 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          >
            {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <header
            className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0"
            style={{ background: 'rgba(10,4,30,0.3)' }}
          >
            <div>
              <p className="text-gray-500 text-xs">
                Welcome Back, <span className="text-violet-300 font-semibold">Akash</span>
              </p>
              <p className="text-white font-bold text-base tracking-tight">Learner Dashboard</p>
            </div>

            <div className="flex items-center gap-2" ref={panelRef}>

              {/* ── Set Goal toggle button ── */}
              <motion.button
                onClick={() => setShowGoalEditor(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Set or update your cosmic goal"
                className="flex items-center gap-1.5 px-3 h-8 rounded-xl text-[10px] font-bold transition-all"
                style={{
                  background: savedGoal
                    ? 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(99,102,241,0.2))'
                    : 'rgba(124,58,237,0.15)',
                  border: `1px solid ${savedGoal ? 'rgba(139,92,246,0.45)' : 'rgba(139,92,246,0.25)'}`,
                  color: savedGoal ? '#c4b5fd' : '#7c3aed',
                  boxShadow: savedGoal ? '0 0 12px rgba(124,58,237,0.25)' : 'none',
                }}
              >
                {savedGoal
                  ? <><Target size={11} /> <span className="max-w-[80px] truncate">{savedGoal.goal}</span></>
                  : <><Sparkles size={11} /> Set Goal</>
                }
              </motion.button>

              {/* ── Mail ── */}
              <div className="relative">
                <button
                  onClick={() => togglePanel('mail')}
                  aria-label="Open inbox"
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                    openPanel === 'mail'
                      ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                      : 'border-white/[0.08] bg-white/[0.03] text-gray-500 hover:text-violet-300 hover:border-violet-500/30'
                  }`}
                >
                  <Mail size={13} />
                </button>
                {MAIL_UNREAD > 0 && openPanel !== 'mail' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                    style={{ background: '#7c3aed', boxShadow: '0 0 6px rgba(124,58,237,0.7)' }}>
                    {MAIL_UNREAD}
                  </div>
                )}
                <AnimatePresence>
                  {openPanel === 'mail' && <MailPanel onClose={() => setOpenPanel(null)} />}
                </AnimatePresence>
              </div>

              {/* ── Notifications ── */}
              <div className="relative">
                <button
                  onClick={() => togglePanel('notification')}
                  aria-label="Open notifications"
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                    openPanel === 'notification'
                      ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                      : 'border-white/[0.08] bg-white/[0.03] text-gray-500 hover:text-violet-300 hover:border-violet-500/30'
                  }`}
                >
                  <Bell size={13} />
                </button>
                {NOTIF_UNREAD > 0 && openPanel !== 'notification' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                    style={{ background: '#a855f7', boxShadow: '0 0 6px rgba(168,85,247,0.7)' }}>
                    {NOTIF_UNREAD}
                  </div>
                )}
                <AnimatePresence>
                  {openPanel === 'notification' && <NotificationPanel onClose={() => setOpenPanel(null)} />}
                </AnimatePresence>
              </div>

              {/* ── Profile ── */}
              <div className="relative">
                <button
                  onClick={() => togglePanel('profile')}
                  aria-label="Open profile"
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black cursor-pointer transition-all ${
                    openPanel === 'profile'
                      ? 'shadow-[0_0_16px_rgba(124,58,237,0.7)] ring-2 ring-violet-500/60'
                      : 'shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                  }`}
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                  A
                </button>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0418]"
                  style={{ background: '#10b981', boxShadow: '0 0 5px rgba(16,185,129,0.8)' }}
                />
                <AnimatePresence>
                  {openPanel === 'profile' && <ProfilePanel onClose={() => setOpenPanel(null)} />}
                </AnimatePresence>
              </div>

            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-violet-900/40">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

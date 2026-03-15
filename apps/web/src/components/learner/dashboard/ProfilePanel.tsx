'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  X, User, Settings, LogOut, Edit3, Shield,
  BookOpen, Trophy, Star, ChevronRight, Check,
  Moon, Sun, Bell, Lock,
} from 'lucide-react'

interface ProfilePanelProps {
  onClose: () => void
}

const STATS = [
  { label: 'Readiness', value: '68%',  color: '#a855f7' },
  { label: 'Streak',    value: '52d',  color: '#f59e0b' },
  { label: 'Completed', value: '1/6',  color: '#10b981' },
]

const MENU_ITEMS = [
  { icon: User,     label: 'Edit Profile',       desc: 'Update your name, bio & avatar', color: '#818cf8' },
  { icon: BookOpen, label: 'Learning Preferences',desc: 'Adjust your goals & pace',       color: '#a855f7' },
  { icon: Trophy,   label: 'Achievements',        desc: 'View badges & milestones',       color: '#fbbf24' },
  { icon: Shield,   label: 'Privacy & Security',  desc: 'Password, 2FA & data',           color: '#10b981' },
  { icon: Settings, label: 'Account Settings',    desc: 'Notifications, theme & more',    color: '#6b7280' },
]

type Tab = 'profile' | 'settings'

export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const router = useRouter()
  const [tab, setTab]         = useState<Tab>('profile')
  const [darkMode, setDarkMode]   = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [publicProfile, setPublicProfile] = useState(false)
  const [editName, setEditName]   = useState(false)
  const [name, setName]           = useState('Akash')
  const [cosmosId, setCosmosId]   = useState('CSM-LRN-4821')
  const [roleLabel, setRoleLabel] = useState('Learner')
  const [bio, setBio]             = useState('Backend Developer in the making 🚀')

  useEffect(() => {
    const storedName = sessionStorage.getItem('cosmos_name')
    const storedId = sessionStorage.getItem('cosmos_id')
    const storedRole = sessionStorage.getItem('cosmos_role')
    if (storedName) setName(storedName)
    if (storedId) setCosmosId(storedId)
    if (storedRole) setRoleLabel(storedRole.charAt(0).toUpperCase() + storedRole.slice(1))
  }, [])

  function handleLogout() {
    onClose()
    router.push('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-12 right-0 w-72 rounded-2xl overflow-hidden z-50 flex flex-col"
      style={{
        background: 'rgba(8, 3, 22, 0.97)',
        border: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)',
        backdropFilter: 'blur(32px)',
        maxHeight: '80vh',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex gap-2">
          {(['profile', 'settings'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1 rounded-lg text-[10px] font-bold capitalize transition-all"
              style={{
                background: tab === t ? 'rgba(124,58,237,0.4)' : 'transparent',
                color: tab === t ? '#c4b5fd' : '#6b7280',
                border: `1px solid ${tab === t ? 'rgba(139,92,246,0.4)' : 'transparent'}`,
              }}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={onClose}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition">
          <X size={13} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        <AnimatePresence mode="wait">

          {/* ── Profile tab ── */}
          {tab === 'profile' && (
            <motion.div key="profile"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              {/* Avatar + info */}
              <div className="px-4 py-4 flex items-start gap-3">
                <div className="relative shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      boxShadow: '0 0 20px rgba(124,58,237,0.5)',
                    }}
                  >
                    {name.trim().charAt(0) || 'A'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#080316]"
                    style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  {editName ? (
                    <div className="space-y-1.5">
                      <input value={name} onChange={e => setName(e.target.value)}
                        className="w-full bg-white/[0.05] border border-violet-500/30 rounded-lg px-2 py-1 text-white text-xs outline-none focus:border-violet-400"
                        placeholder="Your name" />
                      <input value={bio} onChange={e => setBio(e.target.value)}
                        className="w-full bg-white/[0.05] border border-violet-500/30 rounded-lg px-2 py-1 text-gray-300 text-[10px] outline-none focus:border-violet-400"
                        placeholder="Your bio" />
                      <button onClick={() => setEditName(false)}
                        className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <Check size={10} /> Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <p className="text-white font-bold text-sm">{name}</p>
                        <button onClick={() => setEditName(true)}
                          className="text-gray-600 hover:text-violet-400 transition">
                          <Edit3 size={10} />
                        </button>
                      </div>
                      <p className="text-gray-500 text-[10px] mt-0.5">{bio}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white"
                          style={{ background: '#7c3aed' }}>{roleLabel}</span>
                        <span className="text-[9px] text-gray-600">{cosmosId}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-1.5 px-4 pb-3">
                {STATS.map(s => (
                  <div key={s.label} className="rounded-xl py-2 text-center"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                    <p className="font-black text-sm" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[9px] text-gray-600 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/[0.05] mx-4" />

              {/* Menu items */}
              <div className="py-2">
                {MENU_ITEMS.map(item => (
                  <button key={item.label}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/[0.03] transition group text-left">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                      <item.icon size={13} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">{item.label}</p>
                      <p className="text-gray-600 text-[9px]">{item.desc}</p>
                    </div>
                    <ChevronRight size={12} className="text-gray-700 group-hover:text-gray-500 transition" />
                  </button>
                ))}
              </div>

              <div className="h-px bg-white/[0.05] mx-4" />

              {/* Logout */}
              <div className="p-3">
                <button onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-red-400 transition-all hover:bg-red-500/10 border border-red-500/15">
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Settings tab ── */}
          {tab === 'settings' && (
            <motion.div key="settings"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="py-2"
            >
              <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest px-4 py-2">
                Preferences
              </p>

              {[
                {
                  icon: darkMode ? Moon : Sun,
                  label: 'Dark Mode',
                  desc: 'Switch between light and dark theme',
                  value: darkMode,
                  toggle: () => setDarkMode(!darkMode),
                  color: '#818cf8',
                },
                {
                  icon: Bell,
                  label: 'Notifications',
                  desc: 'Push alerts for updates & reminders',
                  value: notifications,
                  toggle: () => setNotifications(!notifications),
                  color: '#a855f7',
                },
                {
                  icon: Star,
                  label: 'Public Profile',
                  desc: 'Let recruiters discover your profile',
                  value: publicProfile,
                  toggle: () => setPublicProfile(!publicProfile),
                  color: '#fbbf24',
                },
              ].map(s => (
                <div key={s.label}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                    <s.icon size={13} style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium">{s.label}</p>
                    <p className="text-gray-600 text-[9px]">{s.desc}</p>
                  </div>
                  {/* Toggle */}
                  <button onClick={s.toggle}
                    className="w-9 h-5 rounded-full relative transition-all shrink-0"
                    style={{ background: s.value ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.1)' }}>
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                      animate={{ left: s.value ? '18px' : '2px' }}
                      transition={{ duration: 0.15 }}
                      style={{ boxShadow: s.value ? '0 0 6px rgba(124,58,237,0.6)' : 'none' }}
                    />
                  </button>
                </div>
              ))}

              <div className="h-px bg-white/[0.05] mx-4 my-2" />

              <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest px-4 py-2">
                Account
              </p>

              {[
                { icon: Lock,   label: 'Change Password',  color: '#10b981' },
                { icon: Shield, label: 'Two-Factor Auth',  color: '#6366f1' },
                { icon: User,   label: 'Delete Account',   color: '#f87171' },
              ].map(item => (
                <button key={item.label}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/[0.03] transition group text-left">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                    <item.icon size={13} style={{ color: item.color }} />
                  </div>
                  <p className="flex-1 text-white text-xs font-medium">{item.label}</p>
                  <ChevronRight size={12} className="text-gray-700 group-hover:text-gray-500 transition" />
                </button>
              ))}

              <div className="p-3 mt-1">
                <p className="text-center text-[9px] text-gray-700">COSMOS v1.0.0 · {cosmosId}</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}

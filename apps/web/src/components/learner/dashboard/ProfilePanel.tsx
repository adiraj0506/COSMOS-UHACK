'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  X, User, Settings, LogOut, Edit3, Shield,
  BookOpen, Trophy, Star, ChevronRight, Check,
  Moon, Sun, Bell, Lock, ArrowLeft, Eye, EyeOff,
  Download, Package, Activity, Smartphone, MessageSquare,
  Key, Trash2, Save, Zap, Leaf, Flame, AlertTriangle,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface ProfilePanelProps {
  onClose: () => void
}

type Tab     = 'profile' | 'settings'
type SubView =
  | null
  | 'edit-profile'
  | 'learning-prefs'
  | 'achievements'
  | 'privacy'
  | 'account-settings'
  | 'change-password'
  | 'two-factor'
  | 'delete-account'
  | 'logout-confirm'

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const STATS = [
  { label: 'Readiness', value: '68%', color: '#a855f7' },
  { label: 'Streak',    value: '52d',  color: '#f59e0b' },
  { label: 'Completed', value: '1/6',  color: '#10b981' },
]

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#7c3aed,#4f46e5)',
  'linear-gradient(135deg,#db2777,#9333ea)',
  'linear-gradient(135deg,#0891b2,#2563eb)',
  'linear-gradient(135deg,#059669,#0d9488)',
  'linear-gradient(135deg,#d97706,#dc2626)',
]

const BADGES = [
  { icon: '🔥', name: 'Hot Streak',    desc: '52-day streak',  color: '#f59e0b', earned: true  },
  { icon: '✅', name: 'First Blood',   desc: '1 course done',  color: '#10b981', earned: true  },
  { icon: '⚡', name: 'Speed Run',     desc: '5 topics/day',   color: '#a855f7', earned: true  },
  { icon: '🏅', name: 'Half-Way',      desc: '3/6 courses',    color: '#6b7280', earned: false },
  { icon: '🌟', name: 'Completionist', desc: '6/6 courses',    color: '#6b7280', earned: false },
  { icon: '💯', name: 'Perfect Score', desc: '100% quiz',      color: '#6b7280', earned: false },
]

const FOCUS_TAGS = ['Backend', 'Frontend', 'DevOps', 'Algorithms', 'ML/AI', 'Databases']
const PACES      = [
  { id: 'casual',    icon: <Leaf size={12} />,  label: 'Casual',    desc: '1–2 topics/day, relaxed schedule' },
  { id: 'steady',    icon: <Flame size={12} />, label: 'Steady',    desc: '3–5 topics/day, consistent progress' },
  { id: 'intensive', icon: <Zap size={12} />,   label: 'Intensive', desc: '6+ topics/day, fast-track mode' },
]

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function pwStrength(v: string): { pct: number; label: string; color: string } {
  let score = 0
  if (v.length >= 8)            score++
  if (/[A-Z]/.test(v))          score++
  if (/[0-9]/.test(v))          score++
  if (/[^A-Za-z0-9]/.test(v))  score++
  const map = [
    { pct: 0,   label: '',       color: '#374151' },
    { pct: 25,  label: 'Weak',   color: '#f87171' },
    { pct: 50,  label: 'Fair',   color: '#fbbf24' },
    { pct: 75,  label: 'Good',   color: '#34d399' },
    { pct: 100, label: 'Strong', color: '#10b981' },
  ]
  return map[score]
}

/* ─────────────────────────────────────────────
   SMALL SHARED COMPONENTS
───────────────────────────────────────────── */
function Toggle({ on, onToggle, color = '#7c3aed' }: { on: boolean; onToggle: () => void; color?: string }) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-5 rounded-full relative transition-all shrink-0"
      style={{ background: on ? `${color}cc` : 'rgba(255,255,255,0.1)' }}
      aria-checked={on} role="switch"
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
        animate={{ left: on ? '18px' : '2px' }}
        transition={{ duration: 0.15 }}
        style={{ boxShadow: on ? `0 0 6px ${color}99` : 'none' }}
      />
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest px-4 py-2 pt-3">
      {children}
    </p>
  )
}

function MenuItem({
  icon: Icon, label, desc, color, onClick,
}: { icon: React.ElementType; label: string; desc?: string; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/[0.03] transition group text-left"
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
        <Icon size={13} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium">{label}</p>
        {desc && <p className="text-gray-600 text-[9px]">{desc}</p>}
      </div>
      <ChevronRight size={12} className="text-gray-700 group-hover:text-gray-500 transition" />
    </button>
  )
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-3 border-b border-white/[0.06] shrink-0">
      <button onClick={onBack}
        className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-white/[0.06] transition">
        <ArrowLeft size={13} />
      </button>
      <p className="text-white text-xs font-bold">{title}</p>
    </div>
  )
}

function SaveBtn({ onClick, label = 'Save Changes' }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold transition-all mt-2"
      style={{ background: 'rgba(124,58,237,0.5)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
      <Save size={11} /> {label}
    </button>
  )
}

function StyledInput({ value, onChange, type = 'text', placeholder, className = '' }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string
}) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={`w-full bg-white/[0.05] border border-violet-500/30 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-violet-400 placeholder-gray-700 transition ${className}`}
    />
  )
}

function Toast({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] px-4 py-2 rounded-xl text-xs font-bold text-white pointer-events-none"
      style={{ background: 'rgba(16,185,129,0.9)', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}
    >
      {msg}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   SUB-VIEWS
───────────────────────────────────────────── */

// 1. EDIT PROFILE
function EditProfileView({
  name, bio, role, avatarIdx,
  onSave, onBack,
}: {
  name: string; bio: string; role: string; avatarIdx: number
  onSave: (n: string, b: string, r: string, ai: number) => void
  onBack: () => void
}) {
  const [n, setN]   = useState(name)
  const [b, setB]   = useState(bio)
  const [r, setR]   = useState(role)
  const [ai, setAi] = useState(avatarIdx)

  return (
    <>
      <SubHeader title="Edit Profile" onBack={onBack} />
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {/* Avatar picker */}
        <div className="flex items-center gap-3 mb-1">
          <div
            onClick={() => setAi((ai + 1) % AVATAR_GRADIENTS.length)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white cursor-pointer select-none"
            style={{ background: AVATAR_GRADIENTS[ai], boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}
            title="Tap to change colour"
          >
            {n.trim().charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Avatar Color</p>
            <p className="text-gray-600 text-[9px]">Tap to cycle gradients</p>
          </div>
        </div>

        <label className="text-[10px] text-gray-500">Display Name</label>
        <StyledInput value={n} onChange={setN} placeholder="Your name" />

        <label className="text-[10px] text-gray-500">Bio</label>
        <textarea
          value={b} onChange={e => setB(e.target.value)}
          className="w-full bg-white/[0.05] border border-violet-500/30 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-violet-400 resize-none placeholder-gray-700 transition"
          rows={2} placeholder="Write something about you…"
        />

        <label className="text-[10px] text-gray-500">Role</label>
        <StyledInput value={r} onChange={setR} placeholder="e.g. Learner, Pro" />

        <SaveBtn onClick={() => onSave(n, b, r, ai)} />
      </div>
    </>
  )
}

// 2. LEARNING PREFERENCES
function LearningPrefsView({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [mins,   setMins]   = useState(30)
  const [topics, setTopics] = useState(3)
  const [pace,   setPace]   = useState('steady')
  const [tags,   setTags]   = useState<string[]>(['Backend', 'Algorithms'])

  function toggleTag(t: string) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  return (
    <>
      <SubHeader title="Learning Preferences" onBack={onBack} />
      <div className="overflow-y-auto flex-1">
        <SectionLabel>Daily Goal</SectionLabel>
        <div className="px-4 space-y-3 pb-2">
          {[
            { label: 'Study time', val: `${mins}m`, min: 10, max: 120, step: 5, v: mins, set: setMins },
            { label: 'Topics / session', val: String(topics), min: 1, max: 10, step: 1, v: topics, set: setTopics },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <p className="text-gray-400 text-[10px] w-28 shrink-0">{s.label}</p>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.v}
                onChange={e => s.set(Number(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#7c3aed' }}
              />
              <p className="text-violet-400 text-[10px] font-bold w-6 text-right">{s.val}</p>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/[0.05] mx-4" />
        <SectionLabel>Learning Pace</SectionLabel>
        <div className="px-3 space-y-1 pb-2">
          {PACES.map(p => (
            <button key={p.id} onClick={() => setPace(p.id)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left transition-all"
              style={{
                background:   pace === p.id ? 'rgba(124,58,237,0.2)' : 'transparent',
                border:       pace === p.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
              }}>
              <span style={{ color: pace === p.id ? '#c4b5fd' : '#6b7280' }}>{p.icon}</span>
              <div>
                <p className="text-white text-[11px] font-semibold">{p.label}</p>
                <p className="text-gray-600 text-[9px]">{p.desc}</p>
              </div>
              {pace === p.id && <Check size={10} className="ml-auto text-violet-400" />}
            </button>
          ))}
        </div>

        <div className="h-px bg-white/[0.05] mx-4" />
        <SectionLabel>Focus Areas</SectionLabel>
        <div className="flex flex-wrap gap-1.5 px-4 pb-4">
          {FOCUS_TAGS.map(t => {
            const active = tags.includes(t)
            return (
              <button key={t} onClick={() => toggleTag(t)}
                className="text-[10px] px-2.5 py-1 rounded-2xl font-semibold transition-all"
                style={{
                  background:   active ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                  border:       active ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color:        active ? '#c4b5fd' : '#6b7280',
                }}>{t}</button>
            )
          })}
        </div>

        <div className="px-4 pb-4"><SaveBtn onClick={onSave} label="Save Preferences" /></div>
      </div>
    </>
  )
}

// 3. ACHIEVEMENTS
function AchievementsView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <SubHeader title="Achievements" onBack={onBack} />
      <div className="overflow-y-auto flex-1">
        {/* Progress bar */}
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.07]">
            <div className="h-full rounded-full w-[17%]"
              style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)' }} />
          </div>
          <span className="text-[9px] text-gray-600">1 / 6 courses</span>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 pb-3">
          {BADGES.map(b => (
            <div key={b.name} className="rounded-xl py-2.5 px-1 text-center"
              style={{
                background: b.earned ? `${b.color}12` : 'rgba(255,255,255,0.03)',
                border:     b.earned ? `1px solid ${b.color}28` : '1px solid rgba(255,255,255,0.06)',
                opacity:    b.earned ? 1 : 0.45,
              }}>
              <p className="text-lg" style={{ filter: b.earned ? 'none' : 'grayscale(1)' }}>{b.icon}</p>
              <p className="text-[9px] font-bold mt-1" style={{ color: b.earned ? b.color : '#4b5563' }}>{b.name}</p>
              <p className="text-[8px] mt-0.5" style={{ color: b.earned ? `${b.color}99` : '#374151' }}>{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/[0.05] mx-4" />
        <SectionLabel>Recent Activity</SectionLabel>
        {[
          { dot: '#7c3aed', text: 'Completed Module 4: REST APIs',  time: 'Today, 9:41 AM' },
          { dot: '#f59e0b', text: 'Extended streak to 52 days 🔥',  time: 'Yesterday' },
          { dot: '#10b981', text: 'Scored 94% on the SQL quiz',     time: '3 days ago' },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-white/[0.04]">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: a.dot }} />
            <div>
              <p className="text-gray-300 text-[11px] leading-snug">{a.text}</p>
              <p className="text-gray-600 text-[9px] mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// 4. PRIVACY & SECURITY
function PrivacyView({ onBack, openSub }: { onBack: () => void; openSub: (v: SubView) => void }) {
  const rows = [
    { label: 'Password strength', tag: 'Strong',   tagCls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Two-Factor Auth',   tag: 'Not set',  tagCls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Last login',        tag: 'Today 9:41 AM', tagCls: 'text-gray-400 bg-white/[0.04] border-white/[0.08]' },
    { label: 'Profile visibility',tag: 'Private',  tagCls: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { label: 'Data sharing',      tag: 'Off',      tagCls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ]
  return (
    <>
      <SubHeader title="Privacy & Security" onBack={onBack} />
      <div className="overflow-y-auto flex-1">
        <div className="mx-4 my-3 rounded-xl overflow-hidden border border-white/[0.07]">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05] last:border-none">
              <p className="text-gray-300 text-[11px]">{row.label}</p>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${row.tagCls}`}>{row.tag}</span>
            </div>
          ))}
        </div>

        <SectionLabel>Actions</SectionLabel>
        <MenuItem icon={Lock}     label="Change Password"     color="#10b981" onClick={() => openSub('change-password')} />
        <MenuItem icon={Shield}   label="Set Up 2FA"          color="#6366f1" onClick={() => openSub('two-factor')} />
        <MenuItem icon={Activity} label="Download Activity Log" color="#818cf8" onClick={() => {}} />
        <MenuItem icon={Package}  label="Export My Data"      color="#a855f7" onClick={() => {}} />
      </div>
    </>
  )
}

// 5. ACCOUNT SETTINGS
function AccountSettingsView({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [email,   setEmail]   = useState(true)
  const [streak,  setStreak]  = useState(true)
  const [courses, setCourses] = useState(false)
  const [theme,   setTheme]   = useState('cosmos')
  const [lang,    setLang]    = useState('English (US)')

  const themes = [
    { id: 'cosmos', label: 'Cosmos', color: '#7c3aed', textColor: '#c4b5fd' },
    { id: 'nebula', label: 'Nebula', color: '#0ea5e9', textColor: '#7dd3fc' },
    { id: 'aurora', label: 'Aurora', color: '#10b981', textColor: '#6ee7b7' },
  ]

  return (
    <>
      <SubHeader title="Account Settings" onBack={onBack} />
      <div className="overflow-y-auto flex-1">
        <SectionLabel>Notifications</SectionLabel>
        {[
          { label: 'Email Digest',       desc: 'Weekly progress summary',    val: email,   set: setEmail   },
          { label: 'Streak Reminders',   desc: "Don't break the chain!",     val: streak,  set: setStreak  },
          { label: 'New Course Alerts',  desc: 'Notify on new content',      val: courses, set: setCourses },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition">
            <div className="flex-1">
              <p className="text-white text-xs font-medium">{s.label}</p>
              <p className="text-gray-600 text-[9px]">{s.desc}</p>
            </div>
            <Toggle on={s.val} onToggle={() => s.set(!s.val)} />
          </div>
        ))}

        <div className="h-px bg-white/[0.05] mx-4 mt-1" />
        <SectionLabel>Appearance</SectionLabel>
        <div className="flex gap-2 px-4 pb-3">
          {themes.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className="flex-1 py-2 rounded-xl text-[9px] font-bold transition-all"
              style={{
                color:      t.textColor,
                background: theme === t.id ? `${t.color}28` : 'rgba(255,255,255,0.04)',
                border:     theme === t.id ? `2px solid ${t.color}60` : '1px solid rgba(255,255,255,0.08)',
              }}>{t.label}</button>
          ))}
        </div>

        <SectionLabel>Language</SectionLabel>
        <div className="px-4 pb-4">
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="w-full bg-white/[0.05] border border-violet-500/30 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none">
            {['English (US)', 'Hindi', 'Spanish', 'French', 'German'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="px-4 pb-4"><SaveBtn onClick={onSave} label="Save Settings" /></div>
      </div>
    </>
  )
}

// 6. CHANGE PASSWORD
function ChangePasswordView({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [cur,  setCur]  = useState('')
  const [nw,   setNw]   = useState('')
  const [conf, setConf] = useState('')
  const [showNw,   setShowNw]   = useState(false)
  const [showConf, setShowConf] = useState(false)
  const strength = pwStrength(nw)

  function handleSave() {
    if (!cur || !nw || !conf) return
    if (nw !== conf)    return
    if (nw.length < 8)  return
    onSave()
  }

  return (
    <>
      <SubHeader title="Change Password" onBack={onBack} />
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        <label className="text-[10px] text-gray-500">Current Password</label>
        <StyledInput value={cur} onChange={setCur} type="password" placeholder="••••••••" />

        <label className="text-[10px] text-gray-500">New Password</label>
        <div className="relative">
          <StyledInput value={nw} onChange={setNw} type={showNw ? 'text' : 'password'} placeholder="Min. 8 characters" />
          <button onClick={() => setShowNw(!showNw)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
            {showNw ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>

        {/* Strength bar */}
        {nw && (
          <div className="space-y-1">
            <div className="h-1 rounded-full bg-white/[0.07]">
              <motion.div className="h-full rounded-full"
                animate={{ width: `${strength.pct}%` }}
                transition={{ duration: 0.3 }}
                style={{ background: strength.color }}
              />
            </div>
            <p className="text-[9px] font-semibold" style={{ color: strength.color }}>{strength.label}</p>
          </div>
        )}

        <label className="text-[10px] text-gray-500">Confirm New Password</label>
        <div className="relative">
          <StyledInput value={conf} onChange={setConf} type={showConf ? 'text' : 'password'} placeholder="Repeat password" />
          <button onClick={() => setShowConf(!showConf)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
            {showConf ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>
        {conf && nw !== conf && (
          <p className="text-[9px] text-red-400">Passwords don't match</p>
        )}

        <SaveBtn onClick={handleSave} label="Update Password" />
      </div>
    </>
  )
}

// 7. TWO FACTOR AUTH
function TwoFactorView({ onBack }: { onBack: () => void }) {
  const [smsEnabled, setSmsEnabled] = useState(false)

  return (
    <>
      <SubHeader title="Two-Factor Auth" onBack={onBack} />
      <div className="overflow-y-auto flex-1">
        <div className="mx-4 mt-3 mb-2 p-3 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-amber-400 text-[11px] font-semibold">2FA not enabled</p>
          <p className="text-amber-900 text-[9px] mt-0.5">Add extra protection to your account</p>
        </div>

        {[
          {
            icon: <Smartphone size={14} style={{ color: '#818cf8' }} />,
            iconBg: 'rgba(129,140,248,0.12)', iconBorder: 'rgba(129,140,248,0.22)',
            label: 'Authenticator App', sub: 'Google Auth / Authy',
            btn: 'Setup', btnColor: '#7c3aed',
            action: () => {},
          },
          {
            icon: <MessageSquare size={14} style={{ color: '#10b981' }} />,
            iconBg: 'rgba(16,185,129,0.12)', iconBorder: 'rgba(16,185,129,0.22)',
            label: 'SMS Verification', sub: '+91 ••••••7823',
            btn: smsEnabled ? 'Disable' : 'Enable', btnColor: smsEnabled ? '#f87171' : '#10b981',
            action: () => setSmsEnabled(!smsEnabled),
          },
          {
            icon: <Key size={14} style={{ color: '#a855f7' }} />,
            iconBg: 'rgba(168,85,247,0.12)', iconBorder: 'rgba(168,85,247,0.22)',
            label: 'Backup Codes', sub: 'One-time recovery codes',
            btn: 'View', btnColor: '#6b7280',
            action: () => {},
          },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: item.iconBg, border: `1px solid ${item.iconBorder}` }}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-white text-xs font-medium">{item.label}</p>
              <p className="text-gray-600 text-[9px]">{item.sub}</p>
            </div>
            <button onClick={item.action}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
              style={{
                color:      item.btnColor,
                background: `${item.btnColor}18`,
                border:     `1px solid ${item.btnColor}30`,
              }}>{item.btn}</button>
          </div>
        ))}
      </div>
    </>
  )
}

// 8. DELETE ACCOUNT
function DeleteAccountView({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState('')
  const [deleted, setDeleted] = useState(false)
  const valid = input === 'DELETE'

  if (deleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
        <p className="text-4xl">👋</p>
        <p className="text-white text-sm font-bold">Account deleted</p>
        <p className="text-gray-500 text-[10px]">Your data has been removed. Goodbye!</p>
      </div>
    )
  }

  return (
    <>
      <SubHeader title="Delete Account" onBack={onBack} />
      <div className="overflow-y-auto flex-1 p-4">
        <div className="p-3 rounded-xl mb-4"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={12} className="text-red-400" />
            <p className="text-red-400 text-[11px] font-semibold">This action is permanent</p>
          </div>
          <p className="text-red-900 text-[9px] leading-relaxed">
            Your profile, 52-day streak, achievements, and all learning progress will be permanently erased.
          </p>
        </div>

        <label className="text-[10px] text-gray-500">Type DELETE to confirm</label>
        <StyledInput value={input} onChange={setInput} placeholder='Type "DELETE"' className="mt-2" />

        <button
          onClick={() => valid && setDeleted(true)}
          disabled={!valid}
          className="w-full py-2.5 rounded-xl text-xs font-bold mt-3 transition-all"
          style={{
            background: valid ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.04)',
            border:     valid ? '1px solid rgba(248,113,113,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color:      valid ? '#fff' : '#4b5563',
            cursor:     valid ? 'pointer' : 'not-allowed',
          }}>
          <Trash2 size={11} className="inline mr-1.5" />
          Permanently Delete
        </button>
      </div>
    </>
  )
}

// 9. LOGOUT CONFIRM
function LogoutConfirmView({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  return (
    <>
      <SubHeader title="Sign Out" onBack={onBack} />
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center gap-4">
        <p className="text-4xl">👋</p>
        <div>
          <p className="text-white text-sm font-bold mb-1">Ready to leave?</p>
          <p className="text-gray-500 text-[10px] leading-relaxed">
            Your 52-day streak and progress are safe.<br />See you soon!
          </p>
        </div>
        <div className="w-full space-y-2 mt-2">
          <button onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(239,68,68,0.5)', border: '1px solid rgba(248,113,113,0.3)', color: '#fff' }}>
            <LogOut size={12} /> Yes, Sign Out
          </button>
          <button onClick={onBack}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-gray-500"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────
   SETTINGS TAB
───────────────────────────────────────────── */
function SettingsTab({ openSub }: { openSub: (v: SubView) => void }) {
  const [dark,    setDark]    = useState(true)
  const [notifs,  setNotifs]  = useState(true)
  const [pubProf, setPubProf] = useState(false)

  return (
    <div className="py-2">
      <SectionLabel>Preferences</SectionLabel>

      {[
        { icon: dark ? Moon : Sun, label: 'Dark Mode',       desc: 'Switch theme',            val: dark,    set: setDark,    color: '#818cf8' },
        { icon: Bell,              label: 'Notifications',   desc: 'Push alerts & reminders', val: notifs,  set: setNotifs,  color: '#a855f7' },
        { icon: Star,              label: 'Public Profile',  desc: 'Let recruiters find you', val: pubProf, set: setPubProf, color: '#fbbf24' },
      ].map(s => (
        <div key={s.label} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
            <s.icon size={13} style={{ color: s.color }} />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-medium">{s.label}</p>
            <p className="text-gray-600 text-[9px]">{s.desc}</p>
          </div>
          <Toggle on={s.val} onToggle={() => s.set(!s.val)} color={s.color} />
        </div>
      ))}

      <div className="h-px bg-white/[0.05] mx-4 my-1" />
      <SectionLabel>Account</SectionLabel>

      <MenuItem icon={Lock}   label="Change Password" color="#10b981" onClick={() => openSub('change-password')} />
      <MenuItem icon={Shield} label="Two-Factor Auth" color="#6366f1" onClick={() => openSub('two-factor')} />
      <button
        onClick={() => openSub('delete-account')}
        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-500/[0.04] transition group text-left">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Trash2 size={13} style={{ color: '#f87171' }} />
        </div>
        <p className="text-red-400 text-xs font-medium flex-1">Delete Account</p>
        <ChevronRight size={12} className="text-gray-700 group-hover:text-red-500/60 transition" />
      </button>

      <div className="px-4 py-3">
        <p className="text-center text-[9px] text-gray-700">COSMOS v1.0.0 · CSM-LRN-4821</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PROFILE TAB
───────────────────────────────────────────── */
function ProfileTab({
  name, bio, role, avatarIdx, openSub,
}: {
  name: string; bio: string; role: string; avatarIdx: number; openSub: (v: SubView) => void
}) {
  return (
    <div>
      {/* Avatar + info */}
      <div className="px-4 py-4 flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white"
            style={{ background: AVATAR_GRADIENTS[avatarIdx], boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
            {name.trim().charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#080316]"
            style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-white font-bold text-sm">{name}</p>
            <button onClick={() => openSub('edit-profile')} className="text-gray-600 hover:text-violet-400 transition">
              <Edit3 size={10} />
            </button>
          </div>
          <p className="text-gray-500 text-[10px] mt-0.5">{bio}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white"
              style={{ background: '#7c3aed' }}>{role}</span>
            <span className="text-[9px] text-gray-600">CSM-LRN-4821</span>
          </div>
        </div>
      </div>

      {/* Stats */}
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

      {/* Menu */}
      <div className="py-2">
        <MenuItem icon={User}     label="Edit Profile"         desc="Update your name, bio & avatar" color="#818cf8" onClick={() => openSub('edit-profile')} />
        <MenuItem icon={BookOpen} label="Learning Preferences" desc="Adjust your goals & pace"       color="#a855f7" onClick={() => openSub('learning-prefs')} />
        <MenuItem icon={Trophy}   label="Achievements"         desc="View badges & milestones"       color="#fbbf24" onClick={() => openSub('achievements')} />
        <MenuItem icon={Shield}   label="Privacy & Security"   desc="Password, 2FA & data"           color="#10b981" onClick={() => openSub('privacy')} />
        <MenuItem icon={Settings} label="Account Settings"     desc="Notifications, theme & more"    color="#6b7280" onClick={() => openSub('account-settings')} />
      </div>

      <div className="h-px bg-white/[0.05] mx-4" />

      <div className="p-3">
        <button onClick={() => openSub('logout-confirm')}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-red-400 transition-all hover:bg-red-500/10 border border-red-500/15">
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const router = useRouter()

  const [tab,       setTab]       = useState<Tab>('profile')
  const [subView,   setSubView]   = useState<SubView>(null)

  // profile state
  const [name,      setName]      = useState('Akash')
  const [bio,       setBio]       = useState('Backend Developer in the making 🚀')
  const [role,      setRole]      = useState('Learner')
  const [avatarIdx, setAvatarIdx] = useState(0)

  // toast
  const [toast,    setToast]    = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const sn = sessionStorage.getItem('cosmos_name')
    const sr = sessionStorage.getItem('cosmos_role')
    if (sn) setName(sn)
    if (sr) setRole(sr.charAt(0).toUpperCase() + sr.slice(1))
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  function openSub(v: SubView) { setSubView(v) }
  function closeSub()          { setSubView(null) }

  function saveProfile(n: string, b: string, r: string, ai: number) {
    setName(n); setBio(b); setRole(r); setAvatarIdx(ai)
    showToast('Profile updated!')
    closeSub()
  }

  const subViewTitle: Partial<Record<NonNullable<SubView>, string>> = {
    'edit-profile':     'Edit Profile',
    'learning-prefs':   'Learning Prefs',
    'achievements':     'Achievements',
    'privacy':          'Privacy & Security',
    'account-settings': 'Account Settings',
    'change-password':  'Change Password',
    'two-factor':       'Two-Factor Auth',
    'delete-account':   'Delete Account',
    'logout-confirm':   'Sign Out',
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute top-12 right-0 w-72 rounded-2xl overflow-hidden z-50 flex flex-col"
        style={{
          background:    'rgba(8, 3, 22, 0.97)',
          border:        '1px solid rgba(139,92,246,0.2)',
          boxShadow:     '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)',
          backdropFilter:'blur(32px)',
          maxHeight:     '80vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
          {subView ? (
            /* breadcrumb in header when sub-view open */
            <p className="text-[10px] text-violet-400 font-bold">{subViewTitle[subView]}</p>
          ) : (
            <div className="flex gap-2">
              {(['profile', 'settings'] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-3 py-1 rounded-lg text-[10px] font-bold capitalize transition-all"
                  style={{
                    background:   tab === t ? 'rgba(124,58,237,0.4)' : 'transparent',
                    color:        tab === t ? '#c4b5fd' : '#6b7280',
                    border:       `1px solid ${tab === t ? 'rgba(139,92,246,0.4)' : 'transparent'}`,
                  }}>{t}</button>
              ))}
            </div>
          )}
          <button onClick={subView ? closeSub : onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition">
            {subView ? <ArrowLeft size={13} /> : <X size={13} />}
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <AnimatePresence mode="wait">

            {/* ── Sub-view layer ── */}
            {subView && (
              <motion.div key={subView}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.16 }}
                className="flex flex-col h-full"
              >
                {subView === 'edit-profile' && (
                  <EditProfileView name={name} bio={bio} role={role} avatarIdx={avatarIdx}
                    onSave={saveProfile} onBack={closeSub} />
                )}
                {subView === 'learning-prefs' && (
                  <LearningPrefsView onBack={closeSub} onSave={() => { showToast('Preferences saved!'); closeSub() }} />
                )}
                {subView === 'achievements' && (
                  <AchievementsView onBack={closeSub} />
                )}
                {subView === 'privacy' && (
                  <PrivacyView onBack={closeSub} openSub={openSub} />
                )}
                {subView === 'account-settings' && (
                  <AccountSettingsView onBack={closeSub} onSave={() => { showToast('Settings saved!'); closeSub() }} />
                )}
                {subView === 'change-password' && (
                  <ChangePasswordView onBack={closeSub} onSave={() => { showToast('Password updated!'); closeSub() }} />
                )}
                {subView === 'two-factor' && (
                  <TwoFactorView onBack={closeSub} />
                )}
                {subView === 'delete-account' && (
                  <DeleteAccountView onBack={closeSub} />
                )}
                {subView === 'logout-confirm' && (
                  <LogoutConfirmView onBack={closeSub} onLogout={() => { onClose(); router.push('/login') }} />
                )}
              </motion.div>
            )}

            {/* ── Profile tab ── */}
            {!subView && tab === 'profile' && (
              <motion.div key="profile"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <ProfileTab name={name} bio={bio} role={role} avatarIdx={avatarIdx} openSub={openSub} />
              </motion.div>
            )}

            {/* ── Settings tab ── */}
            {!subView && tab === 'settings' && (
              <motion.div key="settings"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <SettingsTab openSub={openSub} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key={toast} msg={toast} />}
      </AnimatePresence>
    </>
  )
}

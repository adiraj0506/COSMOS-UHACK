'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Check, CheckCheck, Trash2 } from 'lucide-react'

interface Notification {
  id: string
  type: 'achievement' | 'reminder' | 'update' | 'alert' | 'tip'
  title: string
  body: string
  time: string
  read: boolean
  emoji: string
}

const INITIAL_NOTIFS: Notification[] = [
  { id: '1', type: 'achievement', emoji: '🏆', title: 'Streak Milestone!',           body: 'You hit a 52-day active streak. Keep going!',                                time: '5m ago',  read: false },
  { id: '2', type: 'tip',         emoji: '💡', title: 'Mentor Tip',                  body: 'Your System Design score is 50% — focus on LLD patterns this week.',          time: '1h ago',  read: false },
  { id: '3', type: 'reminder',    emoji: '⏰', title: 'Assessment Due Soon',          body: 'DSA Module assessment is scheduled for next week. Start preparing now.',      time: '3h ago',  read: false },
  { id: '4', type: 'update',      emoji: '✨', title: 'New Resources Available',      body: '3 new System Design resources were added to your learning path.',             time: '5h ago',  read: true  },
  { id: '5', type: 'alert',       emoji: '⚡', title: 'Job Match Alert',              body: 'StartupX Backend Intern — 87% match with your profile.',                      time: '1d ago',  read: true  },
  { id: '6', type: 'achievement', emoji: '🎯', title: 'Goal Completed',               body: 'You completed "Build REST API" from your roadmap. Well done!',                time: '2d ago',  read: true  },
  { id: '7', type: 'tip',         emoji: '🚀', title: 'Readiness Increased',          body: 'Your overall readiness went from 63% to 68% this month. Great progress!',    time: '3d ago',  read: true  },
]

const TYPE_COLOR: Record<Notification['type'], string> = {
  achievement: '#fbbf24',
  reminder:    '#f87171',
  update:      '#a855f7',
  alert:       '#10b981',
  tip:         '#06b6d4',
}

const FILTERS = ['All', 'Unread', 'Achievements', 'Reminders'] as const
type Filter = typeof FILTERS[number]

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifs, setNotifs]     = useState<Notification[]>(INITIAL_NOTIFS)
  const [filter, setFilter]     = useState<Filter>('All')

  const unread = notifs.filter(n => !n.read).length

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function deleteNotif(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function clearAll() {
    setNotifs([])
  }

  const filtered = notifs.filter(n => {
    if (filter === 'Unread')       return !n.read
    if (filter === 'Achievements') return n.type === 'achievement'
    if (filter === 'Reminders')    return n.type === 'reminder'
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-12 right-0 w-80 rounded-2xl overflow-hidden z-50 flex flex-col"
      style={{
        background: 'rgba(8, 3, 22, 0.95)',
        border: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)',
        backdropFilter: 'blur(32px)',
        maxHeight: '70vh',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-violet-400" />
          <span className="text-white font-bold text-sm">Notifications</span>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-violet-600 text-white">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {unread > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1 text-[9px] text-gray-500 hover:text-violet-300 transition px-1.5 py-1 rounded-lg hover:bg-white/[0.04]">
              <CheckCheck size={10} /> All read
            </button>
          )}
          <button onClick={clearAll}
            className="flex items-center gap-1 text-[9px] text-gray-500 hover:text-red-400 transition px-1.5 py-1 rounded-lg hover:bg-white/[0.04]">
            <Trash2 size={10} /> Clear
          </button>
          <button onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 px-3 py-2 border-b border-white/[0.04] shrink-0">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold transition-all"
            style={{
              background: filter === f ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter === f ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.06)'}`,
              color: filter === f ? '#c4b5fd' : '#6b7280',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-gray-600">
              <Bell size={24} className="mb-2 opacity-30" />
              <p className="text-[11px]">No notifications</p>
            </motion.div>
          ) : (
            filtered.map((n, i) => (
              <motion.div key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8, height: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] cursor-pointer group transition-all ${n.read ? 'opacity-60 hover:opacity-100' : 'hover:bg-white/[0.03]'}`}
              >
                {/* Emoji + unread dot */}
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                    style={{
                      background: `${TYPE_COLOR[n.type]}15`,
                      border: `1px solid ${TYPE_COLOR[n.type]}30`,
                    }}>
                    {n.emoji}
                  </div>
                  {!n.read && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-400"
                      style={{ boxShadow: '0 0 4px #a855f7' }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-semibold leading-snug ${n.read ? 'text-gray-400' : 'text-white'}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                      {!n.read && (
                        <button onClick={() => markRead(n.id)}
                          className="p-0.5 hover:text-violet-400 transition">
                          <Check size={10} className="text-gray-600" />
                        </button>
                      )}
                      <button onClick={e => deleteNotif(n.id, e)}
                        className="p-0.5 hover:text-red-400 transition">
                        <X size={10} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_COLOR[n.type] }} />
                    <span className="text-[9px] text-gray-600 capitalize">{n.type}</span>
                    <span className="text-[9px] text-gray-600 ml-auto">{n.time}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

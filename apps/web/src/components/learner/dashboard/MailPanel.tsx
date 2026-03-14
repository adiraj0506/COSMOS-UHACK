'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Star, Trash2, Archive, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  read: boolean
  starred: boolean
  tag: string
  tagColor: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', from: 'COSMOS Team',     subject: '🚀 Your weekly progress report is ready',      preview: 'You improved 5% in Problem Solving this week. Check your full report...',     time: '2m ago',   read: false, starred: true,  tag: 'Report',    tagColor: '#7c3aed' },
  { id: '2', from: 'Mentor AI',       subject: '💡 New System Design resources added',          preview: 'We curated 3 new resources tailored to your Backend Developer path...',         time: '1h ago',   read: false, starred: false, tag: 'Resources', tagColor: '#0e7490' },
  { id: '3', from: 'Opportunities',   subject: '⚡ 2 new jobs match your profile',              preview: 'StartupX is hiring Backend Interns. Your match score is 87%...',               time: '3h ago',   read: true,  starred: false, tag: 'Jobs',      tagColor: '#065f46' },
  { id: '4', from: 'Assessment',      subject: '📊 Assessment reminder — DSA Module due soon', preview: 'Your DSA assessment is scheduled for next week. Start preparing now...',        time: '1d ago',   read: true,  starred: false, tag: 'Reminder',  tagColor: '#be185d' },
  { id: '5', from: 'COSMOS Updates',  subject: '✨ New feature: AI Resume Builder is live',     preview: 'Build a job-ready resume in minutes using our new AI-powered resume builder...', time: '2d ago',   read: true,  starred: true,  tag: 'Update',    tagColor: '#4f46e5' },
]

interface MailPanelProps {
  onClose: () => void
}

export default function MailPanel({ onClose }: MailPanelProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [selected, setSelected] = useState<string | null>(null)

  const unread = messages.filter(m => !m.read).length

  function markRead(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    setSelected(id)
  }

  function toggleStar(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }

  function deleteMsg(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected === id) setSelected(null)
  }

  function markAllRead() {
    setMessages(prev => prev.map(m => ({ ...m, read: true })))
  }

  const selectedMsg = messages.find(m => m.id === selected)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-12 right-0 w-[520px] rounded-2xl overflow-hidden z-50 flex flex-col"
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
          <Mail size={14} className="text-violet-400" />
          <span className="text-white font-bold text-sm">Inbox</span>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-violet-600 text-white">
              {unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-violet-300 transition px-2 py-1 rounded-lg hover:bg-white/[0.04]">
            <RefreshCw size={10} /> Mark all read
          </button>
          <button onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition">
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Message list */}
        <div className="w-48 border-r border-white/[0.05] overflow-y-auto shrink-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <Mail size={20} className="mb-2 opacity-40" />
              <p className="text-[10px]">No messages</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} onClick={() => markRead(msg.id)}
                className={`px-3 py-2.5 cursor-pointer border-b border-white/[0.04] transition-all group ${selected === msg.id ? 'bg-violet-900/30' : 'hover:bg-white/[0.03]'}`}>
                <div className="flex items-start justify-between gap-1 mb-0.5">
                  <p className={`text-[10px] truncate flex-1 ${msg.read ? 'text-gray-500' : 'text-white font-semibold'}`}>
                    {msg.from}
                  </p>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button onClick={e => toggleStar(msg.id, e)} className="p-0.5 hover:text-amber-400 transition">
                      <Star size={9} className={msg.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
                    </button>
                    <button onClick={e => deleteMsg(msg.id, e)} className="p-0.5 hover:text-red-400 transition">
                      <Trash2 size={9} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                <p className={`text-[9px] truncate ${msg.read ? 'text-gray-600' : 'text-gray-400'}`}>{msg.subject}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] px-1 py-0.5 rounded font-semibold text-white"
                    style={{ background: msg.tagColor }}>{msg.tag}</span>
                  <span className="text-[8px] text-gray-600">{msg.time}</span>
                </div>
                {!msg.read && (
                  <div className="w-1 h-1 rounded-full bg-violet-400 absolute right-2 top-1/2 -translate-y-1/2"
                    style={{ boxShadow: '0 0 4px #a855f7' }} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Message detail */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div key={selectedMsg.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4"
              >
                <div className="mb-3">
                  <span className="text-[9px] px-2 py-0.5 rounded font-bold text-white mb-2 inline-block"
                    style={{ background: selectedMsg.tagColor }}>{selectedMsg.tag}</span>
                  <h3 className="text-white font-bold text-xs leading-snug mt-1">{selectedMsg.subject}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-gray-500 text-[10px]">From: <span className="text-gray-400">{selectedMsg.from}</span></p>
                    <p className="text-gray-600 text-[9px]">{selectedMsg.time}</p>
                  </div>
                </div>
                <div className="h-px bg-white/[0.05] mb-3" />
                <p className="text-gray-300 text-xs leading-relaxed">{selectedMsg.preview}</p>
                <p className="text-gray-500 text-xs leading-relaxed mt-2">
                  Click the button below to view the full details in your dashboard.
                </p>
                <button className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 0 14px rgba(124,58,237,0.35)' }}>
                  Open in Dashboard →
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-12 text-gray-600">
                <Mail size={28} className="mb-3 opacity-30" />
                <p className="text-[11px]">Select a message to read</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

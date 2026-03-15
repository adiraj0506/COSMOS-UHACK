'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send, Sparkles, RotateCcw, Bot, ChevronDown } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id:   number
  role: 'user' | 'assistant'
  text: string
  ts:   string
}

interface ChatbotWidgetProps {
  /** Pass the sidebar's collapsed state so the button adapts */
  collapsed: boolean
}

// ── Quick prompts ─────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  'Explain my roadmap',
  'What to study next?',
  'How do I prep for DSA?',
  'Review my score',
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const GREET: Message = {
  id:   0,
  role: 'assistant',
  text: "Hey Akash! 👋 I'm Saarthi. Ask me anything about your roadmap, study plan, or career goals.",
  ts:   now(),
}

// ── Mock reply — swap with POST /api/saarthi/chat ─────────────────────────────
async function fetchReply(msg: string): Promise<string> {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 500))
  const l = msg.toLowerCase()
  if (l.includes('roadmap'))
    return 'Your roadmap is 34% complete. Next: finish DSA + 2 system design problems. Want a weekly breakdown?'
  if (l.includes('dsa') || l.includes('algorithm'))
    return 'Focus on: Arrays → Linked Lists → Trees → Graphs → DP. Aim for 2–3 LeetCode problems daily. Weak spot: tree traversals — want a curated list?'
  if (l.includes('assessment') || l.includes('score'))
    return 'Last assessment: 72%. Strong: JS & CSS. Needs work: Async patterns & React internals. Retake after 3–4 days of focused revision.'
  if (l.includes('study') || l.includes('next'))
    return 'Next 3 days: 1) Event loop & microtasks, 2) React reconciliation deep-dive, 3) 2 mock system design sessions.'
  return "Great question! Consistency beats intensity — 2 focused hours daily is the goal. Anything specific to dig into?"
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatbotWidget({ collapsed }: ChatbotWidgetProps) {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREET])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)
  const panelRef  = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  // Auto-scroll on new messages
useEffect(() => {
  if (!open) return

  const container = chatRef.current
  if (!container) return

  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  })
}, [messages.length, open])
  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    const userMsg: Message = { id: Date.now(), role: 'user', text: msg, ts: now() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    const reply = await fetchReply(msg)
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply, ts: now() }])
    setLoading(false)
  }

  function reset() { setMessages([GREET]); setInput('') }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    // Wrapper sits at the bottom of the sidebar, full-width
    <div
      ref={panelRef}
      className="relative px-2 pb-3"
      style={{ borderTop: '1px solid rgba(139,92,246,0.1)', paddingTop: '10px' }}
    >

      {/* ── Chat popup — opens upward above the button ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="saarthi-popup"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 12, scale: 0.96  }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="absolute left-2 right-2 z-50 flex flex-col overflow-hidden"
            style={{
              bottom:      '56px',
              height:      '420px',
              borderRadius: '16px',
              background:   'rgba(8, 3, 22, 0.92)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border:       '1px solid rgba(139,92,246,0.25)',
              boxShadow:    '0 0 0 1px rgba(139,92,246,0.08), 0 -8px 40px rgba(0,0,0,0.6), 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 shrink-0"
              style={{ borderBottom: '1px solid rgba(139,92,246,0.12)', background: 'rgba(124,58,237,0.1)' }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 8px rgba(124,58,237,0.5)' }}
              >
                <Bot size={12} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-bold leading-none">Saarthi</p>
                <p className="text-violet-400 text-[9px] mt-0.5 flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
                    style={{ boxShadow: '0 0 4px rgba(52,211,153,0.9)' }}
                  />
                  AI Learning Companion
                </p>
              </div>
              <button
                onClick={reset}
                aria-label="Reset conversation"
                className="w-5 h-5 rounded-md flex items-center justify-center text-gray-600 hover:text-violet-300 hover:bg-white/[0.05] transition"
              >
                <RotateCcw size={10} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-5 h-5 rounded-md flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <X size={10} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-violet-900/40">
              {messages.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-1.5`}
                >
                  {m.role === 'assistant' && (
                    <div
                      className="w-5 h-5 rounded-lg shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
                    >
                      <Bot size={9} className="text-white" />
                    </div>
                  )}
                  <div className="max-w-[82%]">
                    <div
                      className="px-2.5 py-1.5 text-[11px] leading-relaxed"
                      style={{
                        borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                        background:   m.role === 'user'
                          ? 'linear-gradient(135deg,rgba(124,58,237,0.55),rgba(79,70,229,0.45))'
                          : 'rgba(255,255,255,0.05)',
                        border: m.role === 'user'
                          ? '1px solid rgba(139,92,246,0.35)'
                          : '1px solid rgba(255,255,255,0.06)',
                        color: m.role === 'user' ? '#e9d5ff' : '#d1d5db',
                      }}
                    >
                      {m.text}
                    </div>
                    <p className="text-[8px] text-gray-700 mt-0.5 px-1">{m.ts}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing dots */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
                  >
                    <Bot size={9} className="text-white" />
                  </div>
                  <div
                    className="px-2.5 py-2 flex gap-1 items-center"
                    style={{ borderRadius: '12px 12px 12px 3px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {[0, 0.18, 0.36].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="w-1 h-1 rounded-full bg-violet-400"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                        transition={{ duration: 0.85, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts — only on welcome screen */}
            {messages.length <= 1 && (
              <div className="px-2.5 pb-2 flex gap-1 flex-wrap">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-[9px] px-2 py-1 rounded-lg text-violet-300 transition-all hover:text-white"
                    style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input row */}
            <div
              className="px-2.5 pb-2.5 pt-2 shrink-0"
              style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
            >
              <div
                className="flex items-end gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.18)' }}
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask Saarthi anything…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-[11px] text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed"
                  style={{ maxHeight: '64px', overflowY: 'auto' }}
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                  style={{
                    background:  input.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(124,58,237,0.2)',
                    boxShadow:   input.trim() && !loading ? '0 0 8px rgba(124,58,237,0.5)' : 'none',
                  }}
                >
                  <Send size={10} className="text-white" />
                </motion.button>
              </div>
              <p className="text-[8px] text-gray-700 text-center mt-1">Enter to send · Shift+Enter for newline</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trigger button ── */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Open Saarthi chatbot"
        className={`w-full flex items-center rounded-xl transition-all duration-150 ${
          collapsed ? 'justify-center px-0 py-2.5' : 'gap-2 px-3 py-2.5'
        }`}
        style={{
          background: open ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.1)',
          border:     `1px solid ${open ? 'rgba(139,92,246,0.45)' : 'rgba(139,92,246,0.2)'}`,
          boxShadow:  open ? '0 0 14px rgba(124,58,237,0.3)' : 'none',
        }}
      >
        {/* Icon */}
        <div className="relative shrink-0">
          {!open && (
            <motion.span
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'rgba(139,92,246,0.35)' }}
            />
          )}
          <div
            className="w-5 h-5 rounded-lg flex items-center justify-center relative z-10"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 8px rgba(124,58,237,0.5)' }}
          >
            {open
              ? <ChevronDown size={11} className="text-white" />
              : <Sparkles   size={11} className="text-white" />
            }
          </div>
        </div>

        {/* Label + subtitle — hidden when sidebar collapsed */}
        {!collapsed && (
          <div className="flex-1 text-left min-w-0">
            <p className="text-[11px] font-bold text-violet-200 leading-none">Saarthi</p>
            <p className="text-[9px] text-violet-500 mt-0.5">AI companion</p>
          </div>
        )}

        {/* Unread dot */}
        {!open && messages.length > 1 && !collapsed && (
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: '#a78bfa', boxShadow: '0 0 4px rgba(167,139,250,0.8)' }}
          />
        )}
      </motion.button>
    </div>
  )
}

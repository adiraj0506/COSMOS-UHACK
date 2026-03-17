'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send, Sparkles, RotateCcw, Bot, ChevronDown } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  ts: string
}

interface ChatbotWidgetProps {
  collapsed: boolean
}

const QUICK_PROMPTS = [
  'Explain my roadmap',
  'What to study next?',
  'How do I prep for DSA?',
  'Review my score',
]

function now() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const GREET: Message = {
  id: 0,
  role: 'assistant',
  text: "Hello 👋 I'm Saarthi — your AI learning companion inside COSMOS.",
  ts: now(),
}

async function fetchReply(msg: string): Promise<string> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/app/routes/mentor.py", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: msg,
      }),
    })

    if (!res.ok) {
      throw new Error('Backend failed')
    }

    const data = await res.json()

    return data.response || 'No response received.'
  } catch (error) {
    console.error('Groq fetch error:', error)
    return '⚠️ Unable to connect to Saarthi right now.'
  }
}

export default function ChatbotWidget({ collapsed }: ChatbotWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREET])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const container = chatRef.current
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages.length, open])

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

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: msg,
      ts: now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    const reply = await fetchReply(msg)

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: 'assistant',
        text: reply,
        ts: now(),
      },
    ])

    setLoading(false)
  }

  function reset() {
    setMessages([GREET])
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div
      ref={panelRef}
      className="relative px-2 pb-3"
      style={{
        borderTop: '1px solid rgba(139,92,246,0.1)',
        paddingTop: '10px',
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="saarthi-popup"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="absolute left-2 right-2 z-50 flex flex-col overflow-hidden"
            style={{
              bottom: '56px',
              height: '420px',
              borderRadius: '16px',
              background: 'rgba(8, 3, 22, 0.92)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow:
                '0 0 0 1px rgba(139,92,246,0.08), 0 -8px 40px rgba(0,0,0,0.6), 0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5 shrink-0"
              style={{
                borderBottom: '1px solid rgba(139,92,246,0.12)',
                background: 'rgba(124,58,237,0.1)',
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                }}
              >
                <Bot size={12} className="text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-bold">Ask AI</p>
                <p className="text-violet-400 text-[9px]">AI Learning Companion</p>
              </div>

              <button onClick={reset}>
                <RotateCcw size={10} />
              </button>

              <button onClick={() => setOpen(false)}>
                <X size={10} />
              </button>
            </div>

            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2.5"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="px-3 py-2 text-[11px]"
                    style={{
                      borderRadius:
                        m.role === 'user'
                          ? '12px 12px 3px 12px'
                          : '12px 12px 12px 3px',
                      background:
                        m.role === 'user'
                          ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                          : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-violet-300 text-[11px]">Thinking...</div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-2.5 pb-2 flex gap-1 flex-wrap">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-[9px] px-2 py-1 rounded-lg text-violet-300"
                    style={{
                      background: 'rgba(124,58,237,0.12)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <div className="px-2.5 pb-2.5 pt-2">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask Saarthi anything…"
                  className="flex-1 bg-transparent text-[11px] text-white resize-none outline-none"
                />

                <button onClick={() => send()}>
                  <Send size={10} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center rounded-xl ${
          collapsed ? 'justify-center px-0 py-2.5' : 'gap-2 px-3 py-2.5'
        }`}
        style={{
          background: open
            ? 'rgba(124,58,237,0.25)'
            : 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div
          className="w-5 h-5 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          }}
        >
          {open ? (
            <ChevronDown size={11} className="text-white" />
          ) : (
            <Sparkles size={11} className="text-white" />
          )}
        </div>

        {!collapsed && (
          <div className="flex-1 text-left">
            <p className="text-[11px] font-bold text-violet-200">Ask AI</p>
            <p className="text-[9px] text-violet-500">AI companion</p>
          </div>
        )}
      </motion.button>
    </div>
  )
}



'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'

type Tab = 'chat' | 'insights' | 'resources'

const TABS = [
  { id: 'chat', label: '💬 Chat with Mentor' },
  { id: 'insights', label: '📊 AI Insights' },
  { id: 'resources', label: '📚 Resources' },
]

interface Message {
  role: 'mentor' | 'user'
  text: string
  time: string
}

const INSIGHTS = [
  {
    icon: '📈',
    title: 'Progress Trend',
    body: 'Problem Solving improved 5% this week. Keep solving 2-3 problems daily to maintain momentum.',
    color: 'from-emerald-900/30 to-transparent',
    border: 'border-emerald-500/20',
  },
  {
    icon: '⚠️',
    title: 'Gap Alert',
    body: 'Web Development at 40% is below the Backend Dev threshold of 60%. Prioritise REST API and Node.js this week.',
    color: 'from-amber-900/25 to-transparent',
    border: 'border-amber-500/20',
  },
  {
    icon: '🎯',
    title: 'Next Milestone',
    body: 'Reach 75% readiness in 3 weeks by completing the System Design module and 2 backend projects.',
    color: 'from-violet-900/30 to-transparent',
    border: 'border-violet-500/20',
  },
  {
    icon: '💡',
    title: 'Strength to Leverage',
    body: 'Your Communication score (55%) is above average. Use this in mock interviews to stand out for team-lead roles.',
    color: 'from-indigo-900/25 to-transparent',
    border: 'border-indigo-500/20',
  },
]

const RESOURCES = [
  { emoji: '🎥', title: 'System Design Primer', type: 'Course', source: 'YouTube', link: '#' },
  { emoji: '📘', title: 'Designing Data-Intensive Apps', type: 'Book', source: "O'Reilly", link: '#' },
  { emoji: '💻', title: 'LeetCode Top 150', type: 'Practice', source: 'LeetCode', link: '#' },
  { emoji: '🌐', title: 'Node.js REST API Guide', type: 'Tutorial', source: 'DevDocs', link: '#' },
  { emoji: '🗣️', title: 'Backend Interview Prep', type: 'Guide', source: 'GitHub', link: '#' },
]

interface ChatWindowProps {
  pendingPrompt: string
  onPromptConsumed: () => void
}

export default function ChatWindow({
  pendingPrompt,
  onPromptConsumed,
}: ChatWindowProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [userName, setUserName] = useState('Akash')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('cosmos_name')
    if (stored) setUserName(stored)
  }, [])

  useEffect(() => {
    async function loadGreeting() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/mentor/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Give a short 2-line premium mentor greeting for ${userName} as a backend learner on COSMOS.`,
          }),
        })

        const data = await res.json()

        setMessages([
          {
            role: 'mentor',
            text: data.response,
            time: 'Just now',
          },
        ])
      } catch {
        setMessages([
          {
            role: 'mentor',
            text: `Hello ${userName}! I'm your Saarthi- AI Mentor. What would you like to improve today?`,
            time: 'Just now',
          },
        ])
      }
    }

    if (userName) loadGreeting()
  }, [userName])

  useEffect(() => {
    if (messages.length <= 1) return

    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt)
      onPromptConsumed()
    }
  }, [pendingPrompt, onPromptConsumed])

  function now() {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: 'user', text, time: now() }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
        }),
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          role: 'mentor',
          text: data.response,
          time: now(),
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'mentor',
          text: '⚠️ Unable to connect to Saarthi- AI Mentor right now.',
          time: now(),
        },
      ])
    }

    setLoading(false)
  }

  return (
    <div className="glass-card flex flex-col w-full min-h-[620px] overflow-hidden">
      <div className="mentor-tabs shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <div className="chat-container flex flex-col flex-1 overflow-hidden">
          <div className="chat-messages flex-1 overflow-y-auto pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                <div className="bubble-label flex items-center justify-between">
                  <span>{msg.role === 'mentor' ? '🤖 Saarthi' : '👤 You'}</span>
                  <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>{msg.time}</span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble mentor">
                <div className="bubble-label">🤖 Saarthi</div>
                <div className="flex items-center gap-2 text-violet-400">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row shrink-0">
            <input
              className="chat-input"
              placeholder="Ask your mentor anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />

            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <>
                  <Send size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-violet-400" />
            <p className="text-white font-bold text-xs">
              AI-Generated Insights for {userName}
            </p>
          </div>

          {INSIGHTS.map((ins, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-3 py-3 rounded-xl bg-gradient-to-r ${ins.color} border ${ins.border}`}
            >
              <span className="text-xl shrink-0">{ins.icon}</span>
              <div>
                <p className="text-white font-bold text-xs mb-1">{ins.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{ins.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {RESOURCES.map((res, i) => (
            <a
              key={i}
              href={res.link}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <span>{res.emoji}</span>
              <div className="flex-1">
                <p className="text-white text-xs font-semibold">{res.title}</p>
                <span className="text-[9px] text-gray-500">
                  {res.type} · {res.source}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}


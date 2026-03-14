'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'

type Tab = 'chat' | 'insights' | 'resources'

const TABS = [
  { id: 'chat',      label: '💬 Chat with Mentor' },
  { id: 'insights',  label: '📊 AI Insights'       },
  { id: 'resources', label: '📚 Resources'          },
]

interface Message {
  role: 'mentor' | 'user'
  text: string
  time: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'mentor',
    text: "Hey Akash! 👋 I'm your COSMOS AI Mentor. I've analysed your skill profile — your Problem Solving is strong at 72%, but System Design at 50% is your biggest growth opportunity for a Backend Developer role. Where would you like to start today?",
    time: 'Just now',
  },
]

const INSIGHTS = [
  { icon: '📈', title: 'Progress Trend',    body: 'Problem Solving improved 5% this week. Keep solving 2-3 problems daily to maintain momentum.', color: 'from-emerald-900/30 to-transparent', border: 'border-emerald-500/20' },
  { icon: '⚠️', title: 'Gap Alert',         body: 'Web Development at 40% is below the Backend Dev threshold of 60%. Prioritise REST API and Node.js this week.', color: 'from-amber-900/25 to-transparent', border: 'border-amber-500/20' },
  { icon: '🎯', title: 'Next Milestone',    body: 'Reach 75% readiness in 3 weeks by completing the System Design module and 2 backend projects.', color: 'from-violet-900/30 to-transparent', border: 'border-violet-500/20' },
  { icon: '💡', title: 'Strength to Leverage', body: 'Your Communication score (55%) is above average. Use this in mock interviews to stand out for team-lead roles.', color: 'from-indigo-900/25 to-transparent', border: 'border-indigo-500/20' },
]

const RESOURCES = [
  { emoji: '🎥', title: 'System Design Primer',    type: 'Course',   source: 'YouTube',   tag: 'System Design', tagColor: '#7c3aed', link: '#' },
  { emoji: '📘', title: 'Designing Data-Intensive Apps', type: 'Book', source: 'O\'Reilly', tag: 'System Design', tagColor: '#7c3aed', link: '#' },
  { emoji: '💻', title: 'LeetCode Top 150',         type: 'Practice', source: 'LeetCode', tag: 'DSA',           tagColor: '#4f46e5', link: '#' },
  { emoji: '🌐', title: 'Node.js REST API Guide',   type: 'Tutorial', source: 'DevDocs',  tag: 'Web Dev',       tagColor: '#0e7490', link: '#' },
  { emoji: '🗣️', title: 'Backend Interview Prep',  type: 'Guide',    source: 'GitHub',   tag: 'Interview',     tagColor: '#be185d', link: '#' },
]

interface ChatWindowProps {
  pendingPrompt: string
  onPromptConsumed: () => void
}

export default function ChatWindow({ pendingPrompt, onPromptConsumed }: ChatWindowProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Consume prompt injected from quick-prompt chips
  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt)
      onPromptConsumed()
    }
  }, [pendingPrompt, onPromptConsumed])
const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
  if (messagesRef.current) {
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }
}, [messages])

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text, time: now() }])
    setLoading(true)

    // TODO backend teammate: POST /api/mentor/chat  { message: text, userId, context: { role, skills } }
    // Returns { reply: string }
    await new Promise(r => setTimeout(r, 1200))
    const reply = getMockReply(text)
    setMessages(prev => [...prev, { role: 'mentor', text: reply, time: now() }])
    setLoading(false)
  }

  return (
    <div className="glass-card flex flex-col h-full min-h-0">
      {/* Tabs */}
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

      {/* ── Chat tab ── */}
      {activeTab === 'chat' && (
        <div className="chat-container flex-1 min-h-0">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                <div className="bubble-label flex items-center justify-between">
                  <span>{msg.role === 'mentor' ? '🤖 COSMOS Mentor' : '👤 You'}</span>
                  <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>{msg.time}</span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble mentor">
                <div className="bubble-label">🤖 COSMOS Mentor</div>
                <div className="flex items-center gap-2 text-violet-400">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask your mentor anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            />
            <button className="chat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? <Loader2 size={12} className="animate-spin" /> : <><Send size={12} style={{ display: 'inline', marginRight: 4 }} />Send</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Insights tab ── */}
      {activeTab === 'insights' && (
        <div className="flex-1 overflow-y-auto p-1 space-y-2.5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-violet-400" style={{ filter: 'drop-shadow(0 0 4px #a855f7)' }} />
            <p className="text-white font-bold text-xs">AI-Generated Insights for Akash</p>
          </div>
          {INSIGHTS.map((ins, i) => (
            <div key={i} className={`flex items-start gap-3 px-3 py-3 rounded-xl bg-gradient-to-r ${ins.color} border ${ins.border}`}>
              <span className="text-xl shrink-0">{ins.icon}</span>
              <div>
                <p className="text-white font-bold text-xs mb-1">{ins.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{ins.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Resources tab ── */}
      {activeTab === 'resources' && (
        <div className="flex-1 overflow-y-auto p-1 space-y-2">
          <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-3">Curated for Backend Developer Path</p>
          {RESOURCES.map((res, i) => (
            <a
              key={i}
              href={res.link}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-violet-500/25 hover:bg-violet-900/10 transition-all block"
            >
              <span className="text-xl shrink-0">{res.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{res.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-semibold text-white"
                    style={{ background: res.tagColor }}
                  >
                    {res.tag}
                  </span>
                  <span className="text-[9px] text-gray-600">{res.type} · {res.source}</span>
                </div>
              </div>
              <span className="text-[10px] text-violet-500 shrink-0">→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// Mock reply generator — replace with real API call
function getMockReply(input: string): string {
  const q = input.toLowerCase()
  if (q.includes('system design'))
    return "Great question! For System Design, I recommend starting with the basics:\n\n1. Study scalability concepts (horizontal vs vertical scaling)\n2. Learn about databases — SQL vs NoSQL trade-offs\n3. Understand caching strategies (Redis, CDN)\n4. Practice designing common systems like URL shorteners\n\nYour current score is 50% — focusing here will have the biggest impact on your Backend Dev readiness. Want me to suggest a 2-week study plan?"
  if (q.includes('dsa') || q.includes('algorithm'))
    return "Your DSA score is solid at 62%! 🎉 To push it above 75%:\n\n• Focus on Trees, Graphs, and Dynamic Programming\n• Solve 2-3 LeetCode medium problems daily\n• Review time complexity for each solution\n\nYou're solving array problems already — great foundation. Shall I create a targeted DSA roadmap for you?"
  if (q.includes('roadmap'))
    return "Based on your current scores, here's your optimised roadmap for the next 4 weeks:\n\nWeek 1-2: System Design fundamentals (LLD patterns, DB design)\nWeek 2-3: REST API project + Node.js deep dive\nWeek 3-4: Mock interviews + communication practice\n\nThis should take you from 68% to ~82% readiness. Want me to add these to your official roadmap?"
  if (q.includes('interview'))
    return "Let's prep! Here's a Backend Dev interview question:\n\n**Design a rate limiter for an API.**\n\nConsider: sliding window vs token bucket algorithm, Redis for distributed rate limiting, response headers (X-RateLimit-*), and handling burst traffic.\n\nTake 5 minutes to outline your approach, then share it with me for feedback!"
  return "That's a great question! Based on your profile as a Backend Developer learner with a 68% readiness score, I'd suggest focusing on the areas where small improvements yield the biggest career impact. Would you like me to dive deeper into any specific topic or create a personalised action plan?"
}

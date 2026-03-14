'use client'

interface MentorPersonaProps {
  onPrompt: (text: string) => void
}

const QUICK_PROMPTS = [
  'Explain System Design basics',
  'How to improve DSA score?',
  'Review my roadmap',
  'Tips for Backend Dev role',
  'What to study next?',
  'Mock interview question',
]

export default function MentorPersona({ onPrompt }: MentorPersonaProps) {
  return (
    <div className="glass-card flex flex-col gap-3">
      {/* Avatar + identity */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(99,102,241,0.3))',
            border: '1px solid rgba(139,92,246,0.4)',
            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
          }}
        >
          🤖
          <div
            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#06020f]"
            style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }}
          />
        </div>
        <div>
          <p className="text-white font-bold text-xs">COSMOS Mentor</p>
          <p className="text-violet-400 text-[10px]">AI Career Intelligence</p>
          <p className="text-gray-600 text-[9px] mt-0.5">Specialised: Backend Development</p>
        </div>
      </div>

      <div className="h-px bg-white/[0.05]" />

      {/* Quick prompts */}
      <div>
        <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest mb-2">Quick Prompts</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPrompt(prompt)}
              className="text-[10px] px-2.5 py-1 rounded-lg font-medium transition-all"
              style={{
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(139,92,246,0.2)',
                color: '#c4b5fd',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = 'rgba(124,58,237,0.28)'
                ;(e.target as HTMLElement).style.borderColor = 'rgba(139,92,246,0.45)'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'rgba(124,58,237,0.12)'
                ;(e.target as HTMLElement).style.borderColor = 'rgba(139,92,246,0.2)'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

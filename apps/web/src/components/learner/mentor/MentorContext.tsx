'use client'

import { Target, TrendingUp, Clock } from 'lucide-react'

const FOCUS_SKILLS = [
  { label: 'System Design', score: 50, color: '#a855f7', border: 'rgba(168,85,247,0.35)', bg: 'rgba(168,85,247,0.12)' },
  { label: 'DSA',           score: 62, color: '#818cf8', border: 'rgba(129,140,248,0.35)', bg: 'rgba(129,140,248,0.12)' },
  { label: 'Web Dev',       score: 40, color: '#c084fc', border: 'rgba(192,132,252,0.35)', bg: 'rgba(192,132,252,0.12)' },
  { label: 'Communication', score: 55, color: '#e879f9', border: 'rgba(232,121,249,0.35)', bg: 'rgba(232,121,249,0.12)' },
]

export default function MentorContext() {
  return (
    <div className="glass-card flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[10px] shadow-[0_0_8px_rgba(139,92,246,0.5)]">🎯</div>
        <p className="text-white font-bold text-xs">Focus Areas</p>
      </div>

      <div className="space-y-2">
        {FOCUS_SKILLS.map(({ label, score, color, border, bg }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <span
                className="skill-pill text-[10px]"
                style={{ color, borderColor: border, background: bg }}
              >
                {label}
              </span>
              <span className="text-[10px] font-bold text-white">{score}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${score}%`, background: color, boxShadow: `0 0 6px ${color}` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5 mt-1">
        <div className="stat-mini">
          <Target size={12} className="text-violet-400 mb-1" style={{ filter: 'drop-shadow(0 0 4px #a855f7)' }} />
          <p className="text-white font-black text-sm">68%</p>
          <p className="text-gray-600 text-[9px] mt-0.5">Readiness</p>
        </div>
        <div className="stat-mini">
          <TrendingUp size={12} className="text-emerald-400 mb-1" style={{ filter: 'drop-shadow(0 0 4px #34d399)' }} />
          <p className="text-white font-black text-sm">+5%</p>
          <p className="text-gray-600 text-[9px] mt-0.5">This Week</p>
        </div>
        <div className="stat-mini">
          <Clock size={12} className="text-amber-400 mb-1" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
          <p className="text-white font-black text-sm">12h</p>
          <p className="text-gray-600 text-[9px] mt-0.5">Studied</p>
        </div>
      </div>
    </div>
  )
}

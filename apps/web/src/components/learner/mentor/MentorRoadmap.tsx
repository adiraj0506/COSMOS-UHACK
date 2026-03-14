'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  { emoji: '📐', label: 'Study LLD patterns',         tag: 'System Design', tagColor: '#7c3aed', due: 'Today',   done: false },
  { emoji: '🌐', label: 'Build a REST API project',   tag: 'Web Dev',       tagColor: '#0e7490', due: 'This week', done: false },
  { emoji: '🧩', label: 'Solve 5 graph problems',     tag: 'DSA',           tagColor: '#4f46e5', due: 'This week', done: true  },
  { emoji: '🗣️', label: 'Mock interview practice',    tag: 'Communication', tagColor: '#be185d', due: 'Next week', done: false },
]

export default function MentorRoadmap() {
  return (
    <div className="glass-card flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center text-[10px] shadow-[0_0_8px_rgba(99,102,241,0.5)]">🗺️</div>
        <p className="text-white font-bold text-xs">Mentor Suggested Roadmap</p>
      </div>

      <div className="space-y-1.5">
        {STEPS.map(({ emoji, label, tag, tagColor, due, done }) => (
          <div key={label} className="roadmap-item">
            <span className="text-sm shrink-0">{emoji}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium leading-tight ${done ? 'text-gray-600 line-through' : 'text-gray-200'}`}>{label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded font-semibold text-white"
                  style={{ background: tagColor }}
                >
                  {tag}
                </span>
                <span className="text-[9px] text-gray-600">{due}</span>
              </div>
            </div>
            {done && (
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)' }}
              >
                <span className="text-[8px]">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Link
        href="/learner/roadmap"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[10px] font-bold text-violet-300 transition-all mt-1"
        style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        View Full Roadmap <ChevronRight size={11} />
      </Link>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Target, ChevronDown } from 'lucide-react'

const GOALS = [
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Data Engineer',
  'DevOps Engineer',
  'ML Engineer',
]

interface GoalSelectionProps {
  value?: string
  onChange?: (value: string) => void
}

export default function GoalSelection({ value = 'Backend Developer', onChange }: GoalSelectionProps) {
  const [selected, setSelected] = useState(value)

  useEffect(() => {
    setSelected(value)
  }, [value])

  function handleChange(next: string) {
    setSelected(next)
    if (onChange) onChange(next)
  }

  return (
    <div className="asmnt-card asmnt-card--glow-violet flex flex-col gap-3">
      <p className="asmnt-label">
        <Target size={12} style={{ color: '#a855f7' }} />
        Career Goal
      </p>
      <div className="relative">
        <select
          className="asmnt-select pr-8"
          value={selected}
          onChange={e => handleChange(e.target.value)}
        >
          {GOALS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#a855f7' }}
        />
      </div>
      <div
        className="mt-auto px-3 py-2 rounded-xl text-center"
        style={{
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          Matched skills
        </p>
        <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
          4 <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>/ 6 domains</span>
        </p>
      </div>
    </div>
  )
}

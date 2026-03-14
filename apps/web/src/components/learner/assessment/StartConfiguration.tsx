'use client'

import { useState } from 'react'
import { Settings2, ChevronDown, Play } from 'lucide-react'

const DURATIONS = ['15 min', '30 min', '45 min', '60 min']
type Difficulty = 'Easy' | 'Medium' | 'Hard'

export default function StartConfiguration() {
  const [duration,   setDuration]   = useState('30 min')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')

  return (
    <div className="asmnt-card asmnt-card--glow-emerald flex flex-col gap-3">
      <p className="asmnt-label">
        <Settings2 size={12} style={{ color: '#10b981' }} />
        Configuration
      </p>

      {/* Duration */}
      <div className="relative">
        <select
          className="asmnt-select pr-8"
          value={duration}
          onChange={e => setDuration(e.target.value)}
        >
          {DURATIONS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#10b981' }} />
      </div>

      {/* Difficulty */}
      <div className="difficulty-row">
        {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`diff-badge diff-badge--${d.toLowerCase()} ${difficulty === d ? 'active' : ''}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Start */}
      <button className="start-btn">
        <Play size={11} style={{ display: 'inline', marginRight: 6 }} />
        Start Assessment
      </button>
    </div>
  )
}

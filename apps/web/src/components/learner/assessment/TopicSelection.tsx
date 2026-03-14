'use client'

import { useState } from 'react'
import { Layers } from 'lucide-react'

const TOPICS = ['DSA', 'System Design', 'Web Dev', 'OS', 'DBMS', 'Networking', 'OOP', 'SQL']

export default function TopicSelection() {
  const [selected, setSelected] = useState<string[]>(['DSA', 'System Design'])

  function toggle(t: string) {
    setSelected(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  return (
    <div className="asmnt-card flex flex-col gap-3">
      <p className="asmnt-label">
        <Layers size={12} style={{ color: '#06b6d4' }} />
        Topics
        <span style={{ marginLeft: 'auto', fontSize: 9, color: '#a855f7', fontWeight: 700 }}>
          {selected.length} selected
        </span>
      </p>
      <div className="topic-grid">
        {TOPICS.map(t => (
          <button
            key={t}
            onClick={() => toggle(t)}
            className={`topic-pill ${selected.includes(t) ? 'active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

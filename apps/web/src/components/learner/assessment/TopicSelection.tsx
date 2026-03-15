'use client'

import { useEffect, useState } from 'react'
import { Layers } from 'lucide-react'

const TOPICS = ['DSA', 'System Design', 'Web Dev', 'OS', 'DBMS', 'Networking', 'OOP', 'SQL']

interface TopicSelectionProps {
  value?: string[]
  onChange?: (value: string[]) => void
}

export default function TopicSelection({ value = ['DSA', 'System Design'], onChange }: TopicSelectionProps) {
  const [selected, setSelected] = useState<string[]>(value)

  useEffect(() => {
    setSelected(value)
  }, [value])

  function toggle(t: string) {
    const next = selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]
    setSelected(next)
    if (onChange) onChange(next)
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

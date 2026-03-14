'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import type { OppType } from './opportunities.types'
import { TYPE_COLOR } from './opportunities.types'

type FilterType = 'all' | OppType

const FILTERS: { id: FilterType; label: string; emoji: string }[] = [
  { id: 'all',         label: 'All',         emoji: '✦'  },
  { id: 'job',         label: 'Jobs',         emoji: '💼' },
  { id: 'internship',  label: 'Internships',  emoji: '🎯' },
  { id: 'hackathon',   label: 'Hackathons',   emoji: '⚡' },
  { id: 'event',       label: 'Events',       emoji: '📅' },
  { id: 'open-source', label: 'Open Source',  emoji: '🔗' },
]

interface OpportunityFiltersProps {
  active:       FilterType
  search:       string
  sort:         string
  onFilter:     (f: FilterType) => void
  onSearch:     (s: string) => void
  onSort:       (s: string) => void
}

export default function OpportunityFilters({
  active, search, sort, onFilter, onSearch, onSort,
}: OpportunityFiltersProps) {
  return (
    <div className="op-filter-bar">

      {/* Search */}
      <div className="op-search-wrap">
        <Search size={13} className="op-search-icon" />
        <input
          className="op-search"
          placeholder="Search jobs, companies, skills…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Type filters */}
      {FILTERS.map(f => (
        <button
          key={f.id}
          className={`op-filter-pill ${active === f.id ? 'active' : ''}`}
          data-cat={f.id}
          onClick={() => onFilter(f.id)}
        >
          <span>{f.emoji}</span>
          {f.label}
        </button>
      ))}

      {/* Sort */}
      <div style={{ position: 'relative', marginLeft: 'auto' }}>
        <select
          value={sort}
          onChange={e => onSort(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(139,92,246,0.22)',
            borderRadius: 10, padding: '7px 32px 7px 12px',
            color: '#94a3b8', fontSize: 11, fontWeight: 600,
            fontFamily: 'inherit', outline: 'none',
            cursor: 'pointer', appearance: 'none',
            colorScheme: 'dark',
          }}
        >
          <option value="match">Best Match</option>
          <option value="recent">Most Recent</option>
          <option value="deadline">Deadline</option>
        </select>
        <SlidersHorizontal size={11} style={{
          position: 'absolute', right: 10, top: '50%',
          transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { NavItem } from '@/types/assessment'

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'assessment-center', icon: '▶', label: 'Assessment Center' },
  { id: 'digital-mentor', icon: '◈', label: 'Digital Mentor' },
  { id: 'roadmap', icon: '⚑', label: 'Roadmap' },
  { id: 'resume-builder', icon: '≡', label: 'Resume Builder' },
  { id: 'opportunities', icon: '⊙', label: 'Opportunities' },
]

export default function Sidebar() {

  const [active, setActive] = useState('assessment-center')

  return (

    <aside className="sidebar">

      <div className="sidebar-logo">
        <span className="logo-stars">✦ ✧</span>
        COSMOS
      </div>

      <nav className="sidebar-nav">

        {NAV_ITEMS.map((item) => (

          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`sidebar-item ${active === item.id ? 'active' : ''}`}
          >

            <span className="sidebar-icon">
              {item.icon}
            </span>

            {item.label}

          </button>

        ))}

      </nav>

      <div className="sidebar-spacer" />

      <button className="sidebar-logout">
        <span>⇥</span> Logout
      </button>

    </aside>

  )
}
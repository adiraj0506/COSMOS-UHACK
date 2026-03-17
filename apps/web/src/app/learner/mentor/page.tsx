'use client'

import { useState } from 'react'
import DashboardShell from '@/components/learner/dashboard/DashboardShell'
import MentorContext from '@/components/learner/mentor/MentorContext'
import MentorPersona from '@/components/learner/mentor/MentorPersona'
import MentorRoadmap from '@/components/learner/mentor/MentorRoadmap'
import ChatWindow from '@/components/learner/mentor/ChatWindow'
import './mentor.css'

export default function MentorPage() {
  const [pendingPrompt, setPendingPrompt] = useState('')

  return (
    <DashboardShell activeHref="/learner/mentor">

      {/* ── Context strip ── */}
      <h2 className="section-title">✦ Mentor Overview</h2>

      <div className="mentor-context-grid">
        <MentorPersona onPrompt={setPendingPrompt} />
        <MentorContext />
        <MentorRoadmap />
      </div>

      {/* ── Main chat + sidebar ── */}
      <h2 className="section-title">✦ Digital Mentor Session</h2>

      <div className="mentor-main-grid">
        <div className="mentor-chat-span">
          <ChatWindow
            pendingPrompt={pendingPrompt}
            onPromptConsumed={() => setPendingPrompt('')}
          />
        </div>
      </div>

    </DashboardShell>
  )
}

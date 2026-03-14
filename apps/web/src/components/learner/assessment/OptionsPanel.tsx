'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Users, BookOpen } from 'lucide-react'

type Tab = 'tips' | 'mentor' | 'api'

const TIPS_CONTENT = [
  { icon: '🧠', title: 'Break it down',     body: 'Start with base cases. For trees, always ask: what happens when root is null?' },
  { icon: '📐', title: 'Think recursively', body: 'Max depth = 1 + max(left depth, right depth). Recurse until leaf nodes.' },
  { icon: '⏱️', title: 'Time complexity',   body: 'O(n) time — you must visit every node once. O(h) space for call stack.' },
  { icon: '🔄', title: 'Iterative option',  body: 'BFS with a queue can solve this iteratively, avoiding stack overflow on large trees.' },
]

const MENTOR_CONTENT = [
  { icon: '💬', title: 'Pattern recognition', body: 'This is a classic DFS recursion problem. You\'ve seen similar patterns in your roadmap.' },
  { icon: '🎯', title: 'Your weakness',        body: 'Your tree traversal score is 55%. This question directly targets that gap.' },
  { icon: '✅', title: 'You got this',         body: 'You solved 18/25 array problems correctly. Apply the same recursive thinking here.' },
]

const API_CONTENT = [
  { icon: '📘', title: 'TreeNode class',    body: 'class TreeNode: def __init__(self, val=0, left=None, right=None)' },
  { icon: '🔗', title: 'LeetCode #104',     body: 'Maximum Depth of Binary Tree — Easy difficulty, 73% acceptance rate.' },
  { icon: '📚', title: 'Related problems',  body: '#110 Balanced Binary Tree, #543 Diameter of Binary Tree, #226 Invert Binary Tree' },
]

const PANELS: Record<Tab, typeof TIPS_CONTENT> = {
  tips:   TIPS_CONTENT,
  mentor: MENTOR_CONTENT,
  api:    API_CONTENT,
}

interface OptionsPanelProps {
  activeTab: Tab
}

export default function OptionsPanel({ activeTab }: OptionsPanelProps) {
  const items = PANELS[activeTab]

  return (
    <div className="asmnt-card" style={{ gridColumn: '2', gridRow: '2' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              className="tip-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.18 }}
            >
              <span className="tip-icon">{item.icon}</span>
              <div>
                <p className="tip-title">{item.title}</p>
                <p className="tip-body">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

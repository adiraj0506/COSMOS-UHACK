'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/components/admin/Modal.tsx
// Generic slide-in modal used by Add / Edit forms across all three sections.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
}

export default function Modal({ open, title, onClose, children, width = 520 }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          style={{ background: 'rgba(4,2,14,0.75)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.93, y: 24  }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width,
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'rgba(10,4,28,0.97)',
              border: '1px solid rgba(139,92,246,0.22)',
              borderRadius: 16,
              boxShadow: '0 0 0 1px rgba(139,92,246,0.08), 0 40px 80px rgba(0,0,0,0.8)',
            }}
          >
            {/* Top accent line */}
            <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,#7c3aed,#06b6d4,transparent)', borderRadius: '16px 16px 0 0' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable form field components used inside modals
// ─────────────────────────────────────────────────────────────────────────────

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: 'rgba(139,92,246,0.06)',
  border: '1px solid rgba(139,92,246,0.18)',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export function FormField({
  label, type = 'text', value, onChange, placeholder, required,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={fieldStyle}
        onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
        onBlur={e  => (e.target.style.borderColor = 'rgba(139,92,246,0.18)')}
      />
    </div>
  )
}

export function FormSelect({
  label, value, onChange, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        style={{ ...fieldStyle, cursor: 'pointer' }}
        onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
        onBlur={e  => (e.target.style.borderColor = 'rgba(139,92,246,0.18)')}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function ModalActions({ onCancel, onConfirm, confirmLabel = 'Save', danger = false }: {
  onCancel: () => void; onConfirm: () => void; confirmLabel?: string; danger?: boolean
}) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-lg border border-white/[0.08] hover:border-white/20 transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-5 py-2 text-xs font-bold rounded-lg transition"
        style={danger ? {
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171', boxShadow: '0 0 16px rgba(239,68,68,0.12)',
        } : {
          background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
          border: '1px solid rgba(139,92,246,0.4)',
          color: '#fff', boxShadow: '0 0 20px rgba(139,92,246,0.3)',
        }}
      >
        {confirmLabel}
      </button>
    </div>
  )
}

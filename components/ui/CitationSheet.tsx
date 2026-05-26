'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSource } from '@/lib/questions'

interface CitationSheetProps {
  sourceId: string | null
  isOpen: boolean
  onClose: () => void
}

const VERIFICATION_LABELS: Record<string, { label: string; color: string }> = {
  verified: { label: 'Verified', color: 'var(--brackish)' },
  pending: { label: 'Verification pending', color: 'var(--amber)' },
  contested: { label: 'Contested — see notes', color: '#B04A2A' },
}

export default function CitationSheet({ sourceId, isOpen, onClose }: CitationSheetProps) {
  const source = sourceId ? getSource(sourceId) : null
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const verif = source
    ? VERIFICATION_LABELS[source.verification_status] ?? VERIFICATION_LABELS.pending
    : null

  return (
    <AnimatePresence>
      {isOpen && source && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[90] bg-deep-blue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-[100] rounded-t-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--off-white)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) onClose()
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Source citation"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: 'rgba(27, 58, 92, 0.2)' }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-deep-blue/10">
              <span className="text-[13px] font-medium" style={{ color: 'var(--brackish)' }}>
                Source
              </span>
              <button
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full"
                style={{ color: 'var(--deep-blue)' }}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-5 pb-safe space-y-4 h-sheet overflow-y-auto">
              <div>
                <h2
                  className="text-[18px] font-semibold leading-snug"
                  style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--deep-blue)' }}
                >
                  {source.title}
                </h2>
                <p className="text-[14px] mt-1" style={{ color: 'var(--clay)' }}>
                  {source.authors} · {source.year}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[13px] font-medium uppercase tracking-wide" style={{ color: 'var(--brackish)' }}>
                  Publication
                </p>
                <p className="text-[15px]" style={{ color: 'var(--deep-blue)' }}>
                  {source.publication}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[13px] font-medium uppercase tracking-wide" style={{ color: 'var(--brackish)' }}>
                  Claim used
                </p>
                <p className="text-[15px]" style={{ color: 'var(--deep-blue)' }}>
                  {source.claim_used}
                </p>
              </div>

              {source.url && (
                <div className="space-y-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide" style={{ color: 'var(--brackish)' }}>
                    Link
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] underline underline-offset-2 break-all"
                    style={{ color: 'var(--deep-blue)' }}
                  >
                    {source.url}
                  </a>
                </div>
              )}

              {verif && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[13px]"
                  style={{
                    backgroundColor: `${verif.color}18`,
                    color: verif.color,
                    border: `1px solid ${verif.color}40`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: verif.color }}
                  />
                  {verif.label}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

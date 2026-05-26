'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/state'

export default function Intro() {
  const { setPhase } = useGameStore()

  return (
    <div className="flex flex-col items-center justify-between h-full px-6 py-16 text-center">
      {/* Header */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="space-y-1">
          <p
            className="text-[13px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--brackish)' }}
          >
            GDM Enviro Consulting
          </p>
        </div>

        <h1
          className="text-[34px] leading-tight md:text-[52px] md:leading-tight"
          style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--deep-blue)' }}
        >
          Reading the Subsurface
        </h1>

        <p
          className="text-[16px] leading-[24px] max-w-sm mx-auto"
          style={{ color: 'rgba(27, 58, 92, 0.7)' }}
        >
          A 10-question journey through the UAE water inversion.
          What do you actually know about where the water goes?
        </p>
      </motion.div>

      {/* Details */}
      <motion.div
        className="space-y-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 text-[13px]" style={{ color: 'rgba(27, 58, 92, 0.45)' }}>
          <span>10 questions</span>
          <span>·</span>
          <span>7–10 minutes</span>
          <span>·</span>
          <span>Public data only</span>
        </div>
        <p className="text-[13px]" style={{ color: 'rgba(27, 58, 92, 0.35)' }}>
          No score. No right answers. Just predictions.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={() => setPhase('question')}
        className="w-full max-w-xs py-5 rounded-xl text-[17px] font-medium min-h-[56px]"
        style={{ backgroundColor: 'var(--deep-blue)', color: 'var(--sand)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileTap={{ scale: 0.98 }}
      >
        Begin
      </motion.button>
    </div>
  )
}

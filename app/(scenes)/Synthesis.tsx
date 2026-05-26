'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/state'

export default function Synthesis() {
  const { reset } = useGameStore()

  return (
    <div className="flex flex-col h-full px-6 py-16">
      <motion.div
        className="flex-1 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="text-[28px] leading-tight"
          style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--deep-blue)' }}
        >
          You have seen the picture.
        </h1>

        <div className="space-y-4 text-[16px] leading-[24px]" style={{ color: 'var(--deep-blue)' }}>
          <p>
            Dubai and Abu Dhabi were built to never run out of water.
          </p>
          <p>
            They are now accumulating water in the wrong compartments at the wrong quality,
            on a trajectory that is already measurable in published data, and no single authority
            owns the question of what to do about it.
          </p>
          <p style={{ color: 'rgba(27, 58, 92, 0.6)', fontStyle: 'italic' }}>
            The subsurface owns the answer whether anyone asks it to or not.
          </p>
        </div>

        <div
          className="text-[13px] space-y-1 pt-4 border-t"
          style={{ borderColor: 'rgba(27, 58, 92, 0.12)', color: 'rgba(27, 58, 92, 0.5)' }}
        >
          <p>Reading the Subsurface — full version in development.</p>
          <a
            href="mailto:gary@gdm-enviro.com"
            className="underline underline-offset-2"
            style={{ color: 'var(--brackish)' }}
          >
            gary@gdm-enviro.com
          </a>
        </div>
      </motion.div>

      <motion.button
        onClick={reset}
        className="w-full py-4 rounded-xl text-[16px] border mt-8 min-h-[56px]"
        style={{
          borderColor: 'rgba(27, 58, 92, 0.2)',
          color: 'var(--deep-blue)',
          backgroundColor: 'transparent',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Play again
      </motion.button>
    </div>
  )
}

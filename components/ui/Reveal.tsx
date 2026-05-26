'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface RevealProps {
  playerValue: number
  trueValue: number
  unit: string
  displayUnit: string
}

function formatNumber(v: number, unit: string): string {
  if (unit === 'M') return `${v.toFixed(1)}M`
  if (unit === '%') return `${Math.round(v)}%`
  if (unit === 'L') return `${Math.round(v)}`
  if (unit === '') return `${Math.round(v)}`
  return `${Math.round(v)}${unit}`
}

export default function Reveal({ playerValue, trueValue, unit, displayUnit }: RevealProps) {
  const count = useMotionValue(0)
  const displayValue = useTransform(count, (v) => formatNumber(v, unit))

  useEffect(() => {
    const timeout = setTimeout(() => {
      animate(count, trueValue, {
        duration: 1.2,
        ease: 'easeOut',
      })
    }, 350)
    return () => clearTimeout(timeout)
  }, [trueValue, count])

  const gapPercent = Math.abs(trueValue - playerValue) / trueValue
  const isClose = gapPercent < 0.2
  const isWayOff = gapPercent > 0.6

  return (
    <div className="w-full space-y-6">
      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* Player prediction */}
        <div className="space-y-1">
          <p className="text-[13px] font-medium uppercase tracking-wide" style={{ color: 'var(--brackish)' }}>
            Your guess
          </p>
          <p
            className="text-[32px] leading-tight font-semibold"
            style={{ fontFamily: 'var(--font-inter)', color: 'rgba(27, 58, 92, 0.5)' }}
          >
            {formatNumber(playerValue, unit)}
          </p>
          <p className="text-[13px]" style={{ color: 'rgba(27, 58, 92, 0.4)' }}>
            {displayUnit}
          </p>
        </div>

        {/* True value */}
        <div className="space-y-1">
          <p className="text-[13px] font-medium uppercase tracking-wide" style={{ color: 'var(--deep-blue)' }}>
            The answer
          </p>
          <motion.p
            className="text-[56px] leading-[64px] font-semibold"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--deep-blue)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span>{displayValue}</motion.span>
          </motion.p>
          <p className="text-[13px]" style={{ color: 'rgba(27, 58, 92, 0.6)' }}>
            {displayUnit}
          </p>
        </div>
      </div>

      {/* Gap note */}
      {isWayOff && (
        <motion.p
          className="text-[15px] italic"
          style={{ color: 'var(--amber)' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.4 }}
        >
          Off by {Math.round(gapPercent * 100)}%. Most people are.
        </motion.p>
      )}
      {isClose && (
        <motion.p
          className="text-[15px] italic"
          style={{ color: 'var(--brackish)' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.4 }}
        >
          Close.
        </motion.p>
      )}
    </div>
  )
}

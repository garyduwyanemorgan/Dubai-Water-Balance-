'use client'

import { motion } from 'framer-motion'

interface BarItem {
  label: string
  value: number
  color: string
  isPlayer?: boolean
  isTrue?: boolean
}

interface ComparisonBarProps {
  playerValue: number
  trueValue: number
  unit: string
  comparisons?: Array<{ label: string; value: number }>
}

export default function ComparisonBar({
  playerValue,
  trueValue,
  unit,
  comparisons = [],
}: ComparisonBarProps) {
  const allValues = [playerValue, trueValue, ...comparisons.map((c) => c.value)]
  const maxVal = Math.max(...allValues) * 1.1

  const bars: BarItem[] = [
    { label: 'Your guess', value: playerValue, color: 'rgba(27, 58, 92, 0.25)', isPlayer: true },
    { label: 'Actual', value: trueValue, color: 'var(--deep-blue)', isTrue: true },
    ...comparisons.map((c) => ({
      label: c.label,
      value: c.value,
      color: 'rgba(27, 58, 92, 0.12)',
    })),
  ]

  return (
    <div className="w-full space-y-2.5">
      {bars.map((bar, i) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span
              className="text-[13px]"
              style={{ color: bar.isTrue ? 'var(--deep-blue)' : 'rgba(27, 58, 92, 0.5)' }}
            >
              {bar.label}
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: bar.isTrue ? 'var(--deep-blue)' : 'rgba(27, 58, 92, 0.4)' }}
            >
              {bar.value}{unit}
            </span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--off-white)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(bar.value / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.15 + 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

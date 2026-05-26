'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface SliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  unit: string
  displayUnit: string
  hasBeenMoved: boolean
  onFirstMove: () => void
}

export default function Slider({
  min,
  max,
  step,
  value,
  onChange,
  unit,
  displayUnit,
  hasBeenMoved,
  onFirstMove,
}: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [thumbPercent, setThumbPercent] = useState(0)

  useEffect(() => {
    setThumbPercent((value - min) / (max - min))
  }, [value, min, max])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseFloat(e.target.value)
      const snapped = Math.round(raw / step) * step
      const clamped = Math.min(max, Math.max(min, parseFloat(snapped.toFixed(10))))
      if (!hasBeenMoved) onFirstMove()
      onChange(clamped)
    },
    [step, min, max, hasBeenMoved, onFirstMove, onChange]
  )

  let formatted: string
  if (unit === 'M') formatted = `${value.toFixed(1)}M`
  else if (unit === '%') formatted = `${Math.round(value)}%`
  else if (unit === 'L') formatted = `${Math.round(value)}`
  else if (unit === '') formatted = `${Math.round(value)}`
  else formatted = `${Math.round(value)}${unit}`

  const labelOffset = `calc(${thumbPercent * 100}% - ${thumbPercent * 44}px)`

  return (
    <div className="w-full space-y-6">
      {/* Value label — tracks thumb position */}
      <div className="relative h-12 flex items-center">
        <div
          className="absolute"
          style={{ left: labelOffset }}
          aria-hidden="true"
        >
          <div
            className="flex flex-col items-center"
            style={{ width: 44 }}
          >
            <span
              className="text-[40px] font-semibold leading-none whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-inter)',
                color: hasBeenMoved ? 'var(--deep-blue)' : 'rgba(27, 58, 92, 0.35)',
              }}
            >
              {formatted}
            </span>
            <span
              className="text-[13px] mt-0.5"
              style={{ color: 'rgba(27, 58, 92, 0.5)' }}
            >
              {displayUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={containerRef}
        className="relative w-full py-3"
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        {/* Filled portion */}
        <div
          className="absolute top-1/2 left-0 h-2 rounded-l-full -translate-y-1/2 pointer-events-none"
          style={{
            width: `calc(${thumbPercent * 100}% - ${thumbPercent * 22}px + 11px)`,
            backgroundColor: hasBeenMoved ? 'var(--deep-blue)' : 'rgba(27, 58, 92, 0.2)',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="relative w-full"
          aria-label={`Select value in ${displayUnit}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatted}
        />
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-[13px]" style={{ color: 'rgba(27, 58, 92, 0.5)' }}>
        <span>{unit === 'M' ? `${min}M` : unit === '%' ? `${min}%` : `${min}`}</span>
        <span>{unit === 'M' ? `${max}M` : unit === '%' ? `${max}%` : `${max}`}</span>
      </div>
    </div>
  )
}

'use client'

import { getAllQuestions } from '@/lib/questions'

const ACT_COLORS: Record<number, string> = {
  1: '#5A7A5F', // brackish
  2: '#C58A3A', // amber
  3: '#3D3D3D', // stark-grey
}

interface ProgressBarProps {
  current: number // 0-indexed
}

export default function ProgressBar({ current }: ProgressBarProps) {
  const questions = getAllQuestions()

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex gap-0.5 px-1 pt-safe"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={10}
      aria-label={`Question ${current + 1} of 10`}
    >
      {questions.map((q, i) => {
        const color = ACT_COLORS[q.act] ?? '#5A7A5F'
        const filled = i <= current
        const active = i === current

        return (
          <div
            key={q.id}
            className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{
              backgroundColor: filled ? color : 'rgba(27, 58, 92, 0.15)',
              opacity: active ? undefined : filled ? 0.85 : 0.4,
              animation: active ? 'pulse 2s ease-in-out infinite' : undefined,
            }}
          />
        )
      })}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

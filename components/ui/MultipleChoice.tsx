'use client'

interface MultipleChoiceProps {
  options: string[]
  value: string | null
  onChange: (value: string) => void
}

export default function MultipleChoice({ options, value, onChange }: MultipleChoiceProps) {
  return (
    <div className="w-full space-y-3">
      {options.map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className="w-full text-left px-5 py-4 rounded-xl border transition-all min-h-[56px] text-[16px] leading-[22px]"
            style={{
              backgroundColor: selected ? 'var(--deep-blue)' : 'var(--off-white)',
              color: selected ? 'var(--sand)' : 'var(--deep-blue)',
              borderColor: selected ? 'var(--deep-blue)' : 'rgba(27, 58, 92, 0.2)',
            }}
            aria-pressed={selected}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

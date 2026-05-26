'use client'

interface CitationBadgeProps {
  sourceId: string
  onOpen: () => void
}

export default function CitationBadge({ sourceId, onOpen }: CitationBadgeProps) {
  return (
    <button
      onClick={onOpen}
      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full border text-[13px] leading-[18px] transition-colors min-h-[44px]"
      style={{
        borderColor: 'var(--brackish)',
        color: 'var(--brackish)',
        backgroundColor: 'transparent',
      }}
      aria-label={`View source: ${sourceId}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        style={{ color: 'var(--brackish)' }}
      >
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 5.5v3M6 4h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Source
    </button>
  )
}

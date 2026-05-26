'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/state'
import type { TranslationElement } from '@/lib/questions'
import CitationBadge from '@/components/ui/CitationBadge'

interface TranslationCardStackProps {
  elements: TranslationElement[]
  sourceId: string
  onComplete: () => void
}

export default function TranslationCardStack({
  elements,
  sourceId,
  onComplete,
}: TranslationCardStackProps) {
  const { currentTranslationCard, nextTranslationCard, openCitation } = useGameStore()
  const card = elements[currentTranslationCard]
  const isLast = currentTranslationCard === elements.length - 1
  const showCitation = currentTranslationCard === elements.length - 1

  if (!card) return null

  return (
    <div className="flex flex-col h-full">
      {/* Card area — 70% of available space */}
      <div className="relative flex-1 mb-4">
        {/* Ghost cards for depth illusion */}
        {currentTranslationCard < elements.length - 2 && (
          <div
            className="absolute inset-x-2 rounded-2xl pointer-events-none"
            aria-hidden="true"
            style={{
              top: 16,
              bottom: -16,
              backgroundColor: 'var(--off-white)',
              opacity: 0.4,
              zIndex: 0,
            }}
          />
        )}
        {currentTranslationCard < elements.length - 1 && (
          <div
            className="absolute inset-x-1 rounded-2xl pointer-events-none"
            aria-hidden="true"
            style={{
              top: 8,
              bottom: -8,
              backgroundColor: 'var(--off-white)',
              opacity: 0.65,
              zIndex: 1,
            }}
          />
        )}

        {/* Active card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTranslationCard}
            className="absolute inset-0 rounded-2xl p-6 flex flex-col"
            style={{ backgroundColor: 'var(--off-white)', zIndex: 2 }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p
              className="text-[13px] font-medium uppercase tracking-wider mb-3"
              style={{ color: 'var(--brackish)' }}
            >
              {card.heading}
            </p>
            <p
              className="text-[16px] leading-[24px] flex-1"
              style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
            >
              {card.body}
            </p>

            {showCitation && (
              <div className="mt-4">
                <CitationBadge sourceId={sourceId} onOpen={() => openCitation(sourceId)} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 space-y-3 pb-4">
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5">
          {elements.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentTranslationCard ? 20 : 6,
                height: 6,
                backgroundColor:
                  i <= currentTranslationCard
                    ? 'var(--deep-blue)'
                    : 'rgba(27, 58, 92, 0.2)',
              }}
            />
          ))}
        </div>

        {/* Action button */}
        {isLast ? (
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl text-[16px] font-medium transition-colors min-h-[56px]"
            style={{ backgroundColor: 'var(--deep-blue)', color: 'var(--sand)' }}
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={nextTranslationCard}
            className="w-full py-4 rounded-xl border text-[16px] font-medium transition-colors min-h-[56px]"
            style={{
              borderColor: 'rgba(27, 58, 92, 0.2)',
              color: 'var(--deep-blue)',
              backgroundColor: 'transparent',
            }}
          >
            Next — {currentTranslationCard + 2}/{elements.length}
          </button>
        )}
      </div>
    </div>
  )
}

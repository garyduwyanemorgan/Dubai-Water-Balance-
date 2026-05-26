'use client'

import { motion } from 'framer-motion'
import type { TranslationElement } from '@/lib/questions'
import CitationBadge from '@/components/ui/CitationBadge'
import { useGameStore } from '@/lib/state'

interface TranslationParagraphProps {
  elements: TranslationElement[]
  sourceId: string
  onComplete: () => void
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function TranslationParagraph({
  elements,
  sourceId,
  onComplete,
}: TranslationParagraphProps) {
  const { openCitation } = useGameStore()

  return (
    <div className="w-full space-y-8">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {elements.map((el, i) => (
          <motion.div key={i} variants={itemVariants} className="space-y-1.5">
            <h3
              className="text-[13px] font-medium uppercase tracking-wider"
              style={{ color: 'var(--brackish)' }}
            >
              {el.heading}
            </h3>
            <p
              className="md:text-[18px] text-[16px] md:leading-[28px] leading-[24px]"
              style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
            >
              {el.body}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-col items-start gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <CitationBadge sourceId={sourceId} onOpen={() => openCitation(sourceId)} />
        <button
          onClick={onComplete}
          className="px-8 py-4 rounded-xl text-[16px] font-medium min-h-[56px]"
          style={{ backgroundColor: 'var(--deep-blue)', color: 'var(--sand)' }}
        >
          Continue →
        </button>
      </motion.div>
    </div>
  )
}

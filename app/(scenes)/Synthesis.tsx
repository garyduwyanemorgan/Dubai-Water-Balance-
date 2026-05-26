'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/state'
import { getAllQuestions } from '@/lib/questions'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function useBiggestGap(predictions: Record<string, number | string>) {
  const questions = getAllQuestions()
  let biggest = { questionId: 'q4', gapPercent: 0 }

  for (const q of questions) {
    if (q.stub || q.format === 'reflective' || q.format === 'multiple_choice') continue
    const pred = predictions[q.id]
    if (typeof pred !== 'number') continue
    const truth = (q as { true_value: number }).true_value
    const gap = Math.abs(truth - pred) / Math.abs(truth)
    if (gap > biggest.gapPercent) {
      biggest = { questionId: q.id, gapPercent: gap }
    }
  }

  return biggest.questionId
}

const Q_LABELS: Record<string, string> = {
  q1: "Dubai's population growth",
  q2: 'UAE per-capita water use',
  q3: 'GCC share of global desalination',
  q4: 'the UAE aquifer depletion',
  q5: 'the recharge inversion',
  q6: "Al Ain's rising groundwater",
  q7: 'the April 2024 flood persistence',
  q8: 'the subsea pipeline',
  q9: "DECCA's establishment",
}

export default function Synthesis() {
  const { reset, predictions } = useGameStore()
  const biggestGapId = useBiggestGap(predictions)
  const biggestGapLabel = Q_LABELS[biggestGapId] ?? 'the aquifer depletion'

  const hasPredictions = Object.keys(predictions).length > 0

  return (
    <div
      className="flex flex-col min-h-[100dvh] px-6 pt-16 pb-12"
      style={{ backgroundColor: '#D4CFC8' }}
    >
      <motion.div
        className="flex-1 space-y-8 max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Opening — what they got right */}
        <motion.div variants={itemVariants} className="space-y-3">
          <p
            className="text-[18px] leading-[26px]"
            style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
          >
            You predicted Dubai&apos;s population, the UAE&apos;s water use, the share of global desalination.
          </p>
          <p
            className="text-[16px] leading-[24px] italic"
            style={{ color: 'rgba(27, 58, 92, 0.6)' }}
          >
            You probably came close.
          </p>
        </motion.div>

        {/* What they got wrong */}
        <motion.div variants={itemVariants} className="space-y-3">
          <p
            className="text-[18px] leading-[26px]"
            style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
          >
            You predicted the aquifer loss, the recharge inversion, when Al Ain started flooding.
          </p>
          <p
            className="text-[16px] leading-[24px] italic"
            style={{ color: 'rgba(27, 58, 92, 0.6)' }}
          >
            You probably did not.
            {hasPredictions && (
              <> Your biggest gap was on {biggestGapLabel}.</>
            )}
          </p>
        </motion.div>

        {/* DECCA */}
        <motion.div variants={itemVariants}>
          <p
            className="text-[18px] leading-[26px]"
            style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
          >
            You did not know the institutional architecture meant to integrate these things is eighteen months old.
          </p>
          <p
            className="text-[16px] leading-[24px] italic mt-2"
            style={{ color: 'rgba(27, 58, 92, 0.6)' }}
          >
            Almost no-one does.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="border-t"
          style={{ borderColor: 'rgba(27, 58, 92, 0.15)' }}
        />

        {/* The argument */}
        <motion.div variants={itemVariants} className="space-y-4">
          <p
            className="text-[18px] leading-[26px]"
            style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
          >
            Dubai and Abu Dhabi were built to never run out of water.
          </p>
          <p
            className="text-[18px] leading-[26px]"
            style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
          >
            They are now accumulating water in the wrong compartments at the wrong quality, on a trajectory that is already measurable in published data, and no single authority owns the question of what to do about it.
          </p>
          <p
            className="text-[18px] leading-[28px] italic"
            style={{ color: 'rgba(27, 58, 92, 0.55)', fontFamily: 'var(--font-newsreader)' }}
          >
            The subsurface owns the answer whether anyone asks it to or not.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="border-t"
          style={{ borderColor: 'rgba(27, 58, 92, 0.15)' }}
        />

        {/* Closing */}
        <motion.div variants={itemVariants} className="space-y-2">
          <p
            className="text-[16px] leading-[24px]"
            style={{ color: 'rgba(27, 58, 92, 0.7)', fontFamily: 'var(--font-newsreader)' }}
          >
            Reading the subsurface — forensically, integrating across compartments and timescales — is the discipline this work exists to build.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          variants={itemVariants}
          className="pt-2 space-y-3"
        >
          <a
            href="mailto:gary@gdm-enviro.com"
            className="block text-[15px] underline underline-offset-2"
            style={{ color: 'var(--brackish)' }}
          >
            gary@gdm-enviro.com
          </a>
          <p className="text-[13px]" style={{ color: 'rgba(27, 58, 92, 0.4)' }}>
            GDM Enviro Consulting · All data publicly sourced
          </p>
        </motion.div>

        {/* Play again */}
        <motion.div variants={itemVariants}>
          <button
            onClick={reset}
            className="w-full py-4 rounded-xl text-[16px] border min-h-[56px]"
            style={{
              borderColor: 'rgba(27, 58, 92, 0.25)',
              color: 'var(--deep-blue)',
              backgroundColor: 'transparent',
            }}
          >
            Play again
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

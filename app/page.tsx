'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/lib/state'
import { useIsPhone } from '@/lib/useMediaQuery'
import { getAllQuestions } from '@/lib/questions'
import ProgressBar from '@/components/ui/ProgressBar'
import CitationSheet from '@/components/ui/CitationSheet'

const Intro = dynamic(() => import('./(scenes)/Intro'), { ssr: false })
const QuestionScene = dynamic(() => import('./(scenes)/QuestionScene'), { ssr: false })
const Synthesis = dynamic(() => import('./(scenes)/Synthesis'), { ssr: false })

const QUESTION_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']

// Act backgrounds — subtle progression, not jarring
const ACT_BACKGROUNDS: Record<number, string> = {
  1: '#E8DCC4', // sand — warm and familiar
  2: '#DCCFB0', // amber-tinted sand — muted, something has shifted
  3: '#D4CFC8', // grey-sand — institutional, cooler
}

export default function GameShell() {
  const {
    phase,
    currentQuestion,
    citationOpen,
    activeCitationId,
    closeCitation,
    setIsPhone,
  } = useGameStore()

  const isPhone = useIsPhone()

  useEffect(() => {
    setIsPhone(isPhone)
  }, [isPhone, setIsPhone])

  const questions = getAllQuestions()
  const currentQuestionId = QUESTION_IDS[currentQuestion] ?? 'q1'
  const currentAct = questions[currentQuestion]?.act ?? 1
  const bgColor = ACT_BACKGROUNDS[currentAct] ?? ACT_BACKGROUNDS[1]

  return (
    <motion.main
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {/* Progress bar — only shown during questions */}
      {phase === 'question' && <ProgressBar current={currentQuestion} />}

      {/* Scene container */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Intro />
            </motion.div>
          )}

          {phase === 'question' && (
            <motion.div
              key={`question-${currentQuestionId}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <QuestionScene questionId={currentQuestionId} />
            </motion.div>
          )}

          {phase === 'synthesis' && (
            <motion.div
              key="synthesis"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Synthesis />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Citation sheet — portaled at page level to escape stacking contexts */}
      <CitationSheet
        sourceId={activeCitationId}
        isOpen={citationOpen}
        onClose={closeCitation}
      />
    </motion.main>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/state'
import { getQuestion, getTranslationElements } from '@/lib/questions'
import type { SliderQuestion, MultipleChoiceQuestion } from '@/lib/questions'
import { useIsPhone } from '@/lib/useMediaQuery'
import Slider from '@/components/ui/Slider'
import MultipleChoice from '@/components/ui/MultipleChoice'
import Reveal from '@/components/ui/Reveal'
import ComparisonBar from '@/components/viz/ComparisonBar'
import CitationBadge from '@/components/ui/CitationBadge'
import TranslationCardStack from './TranslationCardStack'
import TranslationParagraph from './TranslationParagraph'

interface QuestionSceneProps {
  questionId: string
}

// Q1 comparison cities (years to grow 10×)
const Q1_COMPARISONS = [
  { label: 'London (10× growth)', value: 100 },
  { label: 'Singapore (10× growth)', value: 70 },
  { label: 'Riyadh (10× growth)', value: 50 },
]

export default function QuestionScene({ questionId }: QuestionSceneProps) {
  const question = getQuestion(questionId)
  const isPhone = useIsPhone()

  const {
    questionPhase,
    setQuestionPhase,
    setPrediction,
    predictions,
    openCitation,
    nextQuestion,
  } = useGameStore()

  const [hasBeenMoved, setHasBeenMoved] = useState(false)
  const [localValue, setLocalValue] = useState<number | string>(() => {
    if (question.stub) return 0
    if ((question as SliderQuestion).format === 'slider') {
      return (question as SliderQuestion).range.min
    }
    return ''
  })

  const handleLockIn = useCallback(() => {
    if (!question.stub) {
      setPrediction(questionId, localValue)
      setQuestionPhase('reveal')
    }
  }, [questionId, localValue, question.stub, setPrediction, setQuestionPhase])

  const handleAdvanceToTranslation = useCallback(() => {
    setQuestionPhase('translation')
  }, [setQuestionPhase])

  const handleComplete = useCallback(() => {
    nextQuestion()
  }, [nextQuestion])

  // Stub question (Q2–Q10 in Phase 1)
  if (question.stub) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6">
        <p className="text-[22px] leading-[28px]" style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}>
          Question {questionId.replace('q', '')} coming soon.
        </p>
        <button
          onClick={handleComplete}
          className="px-8 py-4 rounded-xl text-[16px] font-medium min-h-[56px]"
          style={{ backgroundColor: 'var(--deep-blue)', color: 'var(--sand)' }}
        >
          Continue →
        </button>
      </div>
    )
  }

  const sliderQ = question as SliderQuestion
  const mcQ = question as MultipleChoiceQuestion
  const step = isPhone ? sliderQ.range?.step_phone ?? sliderQ.range?.step : sliderQ.range?.step
  const translationElements = getTranslationElements(question.translation!)

  const playerNumber = typeof localValue === 'number' ? localValue : 0
  const storedPrediction = predictions[questionId]
  const revealPlayer = typeof storedPrediction === 'number' ? storedPrediction : playerNumber

  return (
    <div className="flex flex-col h-full px-5 pb-6">
      <AnimatePresence mode="wait">
        {/* INPUT PHASE */}
        {questionPhase === 'input' && (
          <motion.div
            key="input"
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Prompt */}
            <div className="pt-16 pb-8">
              <p
                className="text-[22px] leading-[28px] md:text-[30px] md:leading-[38px]"
                style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--deep-blue)' }}
              >
                {question.prompt}
              </p>
            </div>

            {/* Input control */}
            <div className="flex-1">
              {question.format === 'slider' && (
                <Slider
                  min={sliderQ.range.min}
                  max={sliderQ.range.max}
                  step={step ?? sliderQ.range.step}
                  value={typeof localValue === 'number' ? localValue : sliderQ.range.min}
                  onChange={(v) => setLocalValue(v)}
                  unit={sliderQ.unit}
                  displayUnit={sliderQ.display_unit}
                  hasBeenMoved={hasBeenMoved}
                  onFirstMove={() => setHasBeenMoved(true)}
                />
              )}
              {question.format === 'multiple_choice' && (
                <MultipleChoice
                  options={mcQ.options}
                  value={typeof localValue === 'string' ? localValue : null}
                  onChange={(v) => {
                    setLocalValue(v)
                    setHasBeenMoved(true)
                  }}
                />
              )}
            </div>

            {/* Lock in button */}
            <button
              onClick={handleLockIn}
              disabled={!hasBeenMoved}
              className="w-full py-4 rounded-xl text-[16px] font-medium transition-all min-h-[56px] mt-6"
              style={{
                backgroundColor: hasBeenMoved ? 'var(--deep-blue)' : 'rgba(27, 58, 92, 0.15)',
                color: hasBeenMoved ? 'var(--sand)' : 'rgba(27, 58, 92, 0.4)',
                cursor: hasBeenMoved ? 'pointer' : 'not-allowed',
              }}
              aria-disabled={!hasBeenMoved}
            >
              Lock in
            </button>
          </motion.div>
        )}

        {/* REVEAL PHASE */}
        {questionPhase === 'reveal' && (
          <motion.div
            key="reveal"
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* Prompt (muted) */}
            <div className="pt-16 pb-6">
              <p
                className="text-[16px] leading-[22px]"
                style={{ color: 'rgba(27, 58, 92, 0.45)', fontFamily: 'var(--font-newsreader)' }}
              >
                {question.prompt}
              </p>
            </div>

            {/* Reveal numbers */}
            <div className="mb-6">
              <Reveal
                playerValue={revealPlayer}
                trueValue={typeof sliderQ.true_value === 'number' ? sliderQ.true_value : 0}
                unit={sliderQ.unit ?? '%'}
                displayUnit={sliderQ.display_unit ?? ''}
              />
            </div>

            {/* Comparison bar */}
            {question.format === 'slider' && questionId === 'q1' && (
              <div className="mb-6">
                <ComparisonBar
                  playerValue={revealPlayer}
                  trueValue={typeof sliderQ.true_value === 'number' ? sliderQ.true_value : 0}
                  unit={sliderQ.unit}
                  comparisons={Q1_COMPARISONS}
                />
              </div>
            )}

            {question.format === 'slider' && questionId !== 'q1' && (
              <div className="mb-6">
                <ComparisonBar
                  playerValue={revealPlayer}
                  trueValue={typeof sliderQ.true_value === 'number' ? sliderQ.true_value : 0}
                  unit={sliderQ.unit}
                />
              </div>
            )}

            <div className="mt-auto space-y-3">
              <CitationBadge
                sourceId={question.source_id}
                onOpen={() => openCitation(question.source_id)}
              />
              <button
                onClick={handleAdvanceToTranslation}
                className="w-full py-4 rounded-xl text-[16px] font-medium min-h-[56px]"
                style={{ backgroundColor: 'var(--deep-blue)', color: 'var(--sand)' }}
              >
                What does this mean? →
              </button>
            </div>
          </motion.div>
        )}

        {/* TRANSLATION PHASE */}
        {questionPhase === 'translation' && (
          <motion.div
            key="translation"
            className="flex flex-col h-full pt-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {isPhone ? (
              <TranslationCardStack
                elements={translationElements}
                sourceId={question.source_id}
                onComplete={handleComplete}
              />
            ) : (
              <TranslationParagraph
                elements={translationElements}
                sourceId={question.source_id}
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

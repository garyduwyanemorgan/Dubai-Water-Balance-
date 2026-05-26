'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/state'
import { getQuestion, getTranslationElements } from '@/lib/questions'
import type { SliderQuestion, MultipleChoiceQuestion, ReflectiveQuestion } from '@/lib/questions'
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

const Q1_COMPARISONS = [
  { label: 'London (10× growth)', value: 100 },
  { label: 'Singapore (10× growth)', value: 70 },
  { label: 'Riyadh (10× growth)', value: 50 },
]

function formatRevealValue(value: number, unit: string): string {
  if (unit === 'M') return `${value.toFixed(1)}M`
  if (unit === '%') return `${Math.round(value)}%`
  if (unit === 'L') return `${Math.round(value)}L/day`
  if (unit === '') return `${Math.round(value)}`
  return `${value}${unit}`
}

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

  const isSlider = !question.stub && question.format === 'slider'
  const isMC = !question.stub && question.format === 'multiple_choice'
  const isReflective = !question.stub && question.format === 'reflective'

  const sliderQ = isSlider ? (question as SliderQuestion) : null
  const mcQ = isMC ? (question as MultipleChoiceQuestion) : null
  const reflQ = isReflective ? (question as ReflectiveQuestion) : null

  const defaultValue = sliderQ ? sliderQ.range.min : ''
  const [hasBeenMoved, setHasBeenMoved] = useState(false)
  const [localValue, setLocalValue] = useState<number | string>(defaultValue)

  const step = isPhone
    ? (sliderQ?.range.step_phone ?? sliderQ?.range.step ?? 1)
    : (sliderQ?.range.step ?? 1)

  const handleLockIn = useCallback(() => {
    if (!question.stub && !isReflective) {
      setPrediction(questionId, localValue)
      setQuestionPhase('reveal')
    }
  }, [questionId, localValue, question.stub, isReflective, setPrediction, setQuestionPhase])

  const handleReflectiveSelect = useCallback(
    (option: string) => {
      setPrediction(questionId, option)
      nextQuestion()
    },
    [questionId, setPrediction, nextQuestion]
  )

  const handleAdvanceToTranslation = useCallback(() => {
    setQuestionPhase('translation')
  }, [setQuestionPhase])

  const handleComplete = useCallback(() => {
    nextQuestion()
  }, [nextQuestion])

  // Stub question (safety net — shouldn't be reached in Phase 2)
  if (question.stub) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6">
        <p
          className="text-[22px] leading-[28px]"
          style={{ color: 'var(--deep-blue)', fontFamily: 'var(--font-newsreader)' }}
        >
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

  const storedPrediction = predictions[questionId]
  const revealPlayer = typeof storedPrediction === 'number'
    ? storedPrediction
    : typeof localValue === 'number'
    ? localValue
    : sliderQ?.range.min ?? 0

  const trueValue = (sliderQ?.true_value ?? 0) as number
  const translationElements =
    'translation' in question && question.translation
      ? getTranslationElements(question.translation)
      : []

  return (
    <div className="flex flex-col h-full px-5 pb-6">
      <AnimatePresence mode="wait">

        {/* ── REFLECTIVE (Q10 — no reveal, goes straight to synthesis) ── */}
        {questionPhase === 'input' && isReflective && reflQ && (
          <motion.div
            key="reflective"
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-16 pb-8">
              <p
                className="text-[22px] leading-[28px] md:text-[28px] md:leading-[36px]"
                style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--deep-blue)' }}
              >
                {reflQ.prompt}
              </p>
            </div>
            <div className="flex-1">
              <MultipleChoice
                options={reflQ.options}
                value={typeof localValue === 'string' ? localValue : null}
                onChange={(v) => {
                  setLocalValue(v)
                  setHasBeenMoved(true)
                }}
              />
            </div>
            <button
              onClick={() => {
                if (hasBeenMoved && typeof localValue === 'string') {
                  handleReflectiveSelect(localValue)
                }
              }}
              disabled={!hasBeenMoved}
              className="w-full py-4 rounded-xl text-[16px] font-medium transition-all min-h-[56px] mt-6"
              style={{
                backgroundColor: hasBeenMoved ? 'var(--deep-blue)' : 'rgba(27, 58, 92, 0.15)',
                color: hasBeenMoved ? 'var(--sand)' : 'rgba(27, 58, 92, 0.4)',
                cursor: hasBeenMoved ? 'pointer' : 'not-allowed',
              }}
              aria-disabled={!hasBeenMoved}
            >
              Finish
            </button>
          </motion.div>
        )}

        {/* ── INPUT PHASE (slider + multiple choice) ── */}
        {questionPhase === 'input' && !isReflective && (
          <motion.div
            key="input"
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-16 pb-8">
              <p
                className="text-[22px] leading-[28px] md:text-[30px] md:leading-[38px]"
                style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--deep-blue)' }}
              >
                {question.prompt}
              </p>
            </div>

            <div className="flex-1">
              {isSlider && sliderQ && (
                <Slider
                  min={sliderQ.range.min}
                  max={sliderQ.range.max}
                  step={step}
                  value={typeof localValue === 'number' ? localValue : sliderQ.range.min}
                  onChange={(v) => setLocalValue(v)}
                  unit={sliderQ.unit}
                  displayUnit={sliderQ.display_unit}
                  hasBeenMoved={hasBeenMoved}
                  onFirstMove={() => setHasBeenMoved(true)}
                />
              )}
              {isMC && mcQ && (
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

        {/* ── REVEAL PHASE ── */}
        {questionPhase === 'reveal' && (
          <motion.div
            key="reveal"
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="pt-16 pb-6">
              <p
                className="text-[16px] leading-[22px]"
                style={{ color: 'rgba(27, 58, 92, 0.45)', fontFamily: 'var(--font-newsreader)' }}
              >
                {question.prompt}
              </p>
            </div>

            {isSlider && sliderQ && (
              <>
                <div className="mb-6">
                  <Reveal
                    playerValue={revealPlayer}
                    trueValue={trueValue}
                    unit={sliderQ.unit}
                    displayUnit={sliderQ.display_unit}
                  />
                </div>
                <div className="mb-6">
                  <ComparisonBar
                    playerValue={revealPlayer}
                    trueValue={trueValue}
                    unit={sliderQ.unit}
                    comparisons={questionId === 'q1' ? Q1_COMPARISONS : undefined}
                  />
                </div>
              </>
            )}

            {isMC && mcQ && (
              <div className="mb-6 space-y-4">
                {mcQ.options.map((opt) => {
                  const isCorrect = opt === mcQ.true_value
                  const isSelected = opt === storedPrediction
                  return (
                    <div
                      key={opt}
                      className="px-5 py-4 rounded-xl border text-[16px] leading-[22px]"
                      style={{
                        backgroundColor: isCorrect
                          ? 'var(--deep-blue)'
                          : isSelected
                          ? 'rgba(197, 138, 58, 0.15)'
                          : 'var(--off-white)',
                        color: isCorrect ? 'var(--sand)' : 'var(--deep-blue)',
                        borderColor: isCorrect
                          ? 'var(--deep-blue)'
                          : isSelected
                          ? 'var(--amber)'
                          : 'rgba(27, 58, 92, 0.15)',
                      }}
                    >
                      {opt}
                      {isCorrect && (
                        <span className="ml-2 text-[13px] opacity-75">← answer</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-auto space-y-3">
              {'source_id' in question && (
                <CitationBadge
                  sourceId={question.source_id}
                  onOpen={() => openCitation(question.source_id)}
                />
              )}
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

        {/* ── TRANSLATION PHASE ── */}
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
                sourceId={'source_id' in question ? question.source_id : ''}
                onComplete={handleComplete}
              />
            ) : (
              <TranslationParagraph
                elements={translationElements}
                sourceId={'source_id' in question ? question.source_id : ''}
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

import questionsData from '@/data/questions.json'
import sourcesData from '@/data/sources.json'

export interface TranslationElement {
  heading: string
  body: string
}

export interface SliderRange {
  min: number
  max: number
  step: number
  step_phone: number
}

export interface SliderQuestion {
  id: string
  stub?: false
  act: number
  format: 'slider'
  range: SliderRange
  unit: string
  display_unit: string
  prompt: string
  true_value: number
  source_id: string
  translation: Record<string, TranslationElement>
  share_template: string
}

export interface MultipleChoiceQuestion {
  id: string
  stub?: false
  act: number
  format: 'multiple_choice'
  options: string[]
  prompt: string
  true_value: string
  source_id: string
  translation: Record<string, TranslationElement>
  share_template: string
}

export interface StubQuestion {
  id: string
  stub: true
  act: number
}

export type Question = SliderQuestion | MultipleChoiceQuestion | StubQuestion

export interface Source {
  title: string
  authors: string
  year: number
  publication: string
  url: string
  claim_used: string
  verification_status: 'verified' | 'pending' | 'contested'
}

const QUESTION_ORDER = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']

export function getQuestion(id: string): Question {
  const q = (questionsData as Record<string, unknown>)[id]
  if (!q) throw new Error(`Question ${id} not found`)
  return q as Question
}

export function getAllQuestions(): Question[] {
  return QUESTION_ORDER.map((id) => getQuestion(id))
}

export function getSource(id: string): Source {
  const s = (sourcesData as Record<string, unknown>)[id]
  if (!s) throw new Error(`Source ${id} not found`)
  return s as Source
}

export function getTranslationElements(
  translation: Record<string, TranslationElement>
): TranslationElement[] {
  return ['element_1', 'element_2', 'element_3', 'element_4', 'element_5']
    .map((key) => translation[key])
    .filter(Boolean)
}

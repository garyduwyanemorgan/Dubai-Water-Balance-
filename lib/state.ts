import { create } from 'zustand'

type Phase = 'intro' | 'question' | 'synthesis'
type QuestionPhase = 'input' | 'reveal' | 'translation'

interface GameState {
  phase: Phase
  currentQuestion: number
  questionPhase: QuestionPhase
  currentTranslationCard: number
  predictions: Record<string, number | string>
  isPhone: boolean
  citationOpen: boolean
  activeCitationId: string | null

  setPhase: (phase: Phase) => void
  setQuestionPhase: (phase: QuestionPhase) => void
  setPrediction: (questionId: string, value: number | string) => void
  nextTranslationCard: () => void
  nextQuestion: () => void
  setIsPhone: (v: boolean) => void
  openCitation: (sourceId: string) => void
  closeCitation: () => void
  reset: () => void
}

const initialState = {
  phase: 'intro' as Phase,
  currentQuestion: 0,
  questionPhase: 'input' as QuestionPhase,
  currentTranslationCard: 0,
  predictions: {} as Record<string, number | string>,
  isPhone: true,
  citationOpen: false,
  activeCitationId: null as string | null,
}

const TOTAL_QUESTIONS = 10

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  setQuestionPhase: (questionPhase) => set({ questionPhase }),

  setPrediction: (questionId, value) =>
    set((state) => ({
      predictions: { ...state.predictions, [questionId]: value },
    })),

  nextTranslationCard: () =>
    set((state) => ({
      currentTranslationCard: state.currentTranslationCard + 1,
    })),

  nextQuestion: () => {
    const { currentQuestion } = get()
    const next = currentQuestion + 1
    if (next >= TOTAL_QUESTIONS) {
      set({ phase: 'synthesis', questionPhase: 'input', currentTranslationCard: 0 })
    } else {
      set({ currentQuestion: next, questionPhase: 'input', currentTranslationCard: 0 })
    }
  },

  setIsPhone: (isPhone) => set({ isPhone }),

  openCitation: (sourceId) =>
    set({ citationOpen: true, activeCitationId: sourceId }),

  closeCitation: () =>
    set({ citationOpen: false, activeCitationId: null }),

  reset: () => set(initialState),
}))

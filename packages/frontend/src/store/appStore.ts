import { create } from "zustand";
import { Question, ComparisonResults } from "../lib/types";

interface AppState {
  // User data
  userEmail: string;
  setUserEmail: (email: string) => void;

  // Questions
  questions: Question[];
  setQuestions: (questions: Question[]) => void;

  // Current questionnaire state
  currentQuestionIndex: number;
  answers: Record<string, any>;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: any) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;

  // Session and results
  sessionId: string | null;
  results: ComparisonResults | null;
  isLoading: boolean;
  setSessionId: (sessionId: string) => void;
  setResults: (results: ComparisonResults) => void;
  setIsLoading: (loading: boolean) => void;

  // Reset state
  reset: () => void;
}

// Removed 'get' as it's not being used
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  userEmail: "",
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  sessionId: null,
  results: null,
  isLoading: false,

  // Actions
  setUserEmail: (email) => set({ userEmail: email }),

  setQuestions: (questions) => set({ questions }),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  nextQuestion: () =>
    set((state) => {
      const nextIndex = Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      );
      return { currentQuestionIndex: nextIndex };
    }),

  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  setSessionId: (sessionId) => set({ sessionId }),

  setResults: (results) => set({ results }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () =>
    set({
      userEmail: "",
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      sessionId: null,
      results: null,
      isLoading: false,
    }),
}));

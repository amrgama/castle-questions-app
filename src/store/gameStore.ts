import { create } from 'zustand';
import { questions } from '@/data/questions';
import { validateAnswer } from '@/utils/validate';

export type GamePhase = 'home' | 'wizard' | 'question' | 'feedback' | 'transition' | 'retry' | 'victory' | 'gameover';

export interface QuestionHistoryItem {
  questionId: string;
  isCorrect: boolean;
  timeMs: number;
}

export interface GameState {
  phase: GamePhase;
  currentStep: number; // 0-4
  lives: number;
  score: number;
  doorOpen: boolean;
  obstacleVisible: boolean;
  questionHistory: QuestionHistoryItem[];
}

export interface GameActions {
  submitAnswer: (answer: string) => void;
  advanceStep: () => void;
  loseLife: () => void;
  resetGame: () => void;
  setPhase: (phase: GamePhase) => void;
}

export type GameStore = GameState & GameActions;

const initialState: GameState = {
  phase: 'home',
  currentStep: 0,
  lives: 3,
  score: 0,
  doorOpen: false,
  obstacleVisible: false,
  questionHistory: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  submitAnswer: (answer: string) => {
    const state = get();
    const question = questions[state.currentStep];
    const isCorrect = validateAnswer(question, answer);
    const timeMs = 0; // Placeholder, will be updated with timer later

    set((state) => ({
      questionHistory: [
        ...state.questionHistory,
        { questionId: question.id, isCorrect, timeMs },
      ],
      ...(isCorrect
        ? { doorOpen: true, score: state.score + 10, phase: 'transition' }
        : {}),
    }));

    if (!isCorrect) {
      get().loseLife();
    }
  },

  advanceStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
      doorOpen: false,
      phase: 'wizard',
    }));
  },

  loseLife: () => {
    set((state) => ({
      lives: Math.max(state.lives - 1, 0),
      obstacleVisible: true,
      phase: 'feedback',
    }));
  },

  resetGame: () => {
    set(initialState);
  },

  setPhase: (phase: GamePhase) => {
    set({ phase });
  },
}));
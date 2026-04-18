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
  tryAgain: () => void;
  skipQuestion: () => void;
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
        : { phase: 'retry' }),
    }));

    if (isCorrect) {
      // Will advance after transition
    } else {
      // Phase set to retry
    }
  },

  advanceStep: () => {
    set((state) => {
      const newStep = Math.min(state.currentStep + 1, 5);
      return {
        currentStep: newStep,
        doorOpen: false,
        phase: newStep > 4 ? 'victory' : 'wizard',
      };
    });
  },

  loseLife: () => {
    set((state) => {
      const newLives = Math.max(state.lives - 1, 0);
      return {
        lives: newLives,
        obstacleVisible: true,
        phase: newLives <= 0 ? 'gameover' : 'feedback',
      };
    });
  },

  tryAgain: () => {
    set({ phase: 'question' });
  },

  skipQuestion: () => {
    get().loseLife();
    get().advanceStep();
  },

  resetGame: () => {
    set(initialState);
  },

  setPhase: (phase: GamePhase) => {
    set({ phase });
  },
}));
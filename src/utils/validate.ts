import { Question } from '@/data/questions';

/**
 * Validates the answer for a given question.
 * @param question The question object.
 * @param answer The user's answer string.
 * @returns True if the answer is correct, false otherwise.
 */
export function validateAnswer(question: Question, answer: string): boolean {
  const normalizedAnswer = answer.trim().toLowerCase();
  const normalizedCorrect = question.correctAnswer.trim().toLowerCase();

  switch (question.type) {
    case 'multiple_choice':
      return normalizedAnswer === normalizedCorrect;
    case 'true_false':
      return normalizedAnswer === normalizedCorrect;
    case 'reorder':
      // For reorder, answer is space-separated words, compare sorted
      const answerWords = normalizedAnswer.split(/\s+/).sort();
      const correctWords = normalizedCorrect.split(/\s+/).sort();
      return JSON.stringify(answerWords) === JSON.stringify(correctWords);
    case 'riddle':
      return normalizedAnswer === normalizedCorrect;
    case 'timed':
      return normalizedAnswer === normalizedCorrect;
    default:
      return false;
  }
}

/**
 * Validates a multiple choice answer.
 * @param correctAnswer The correct answer.
 * @param userAnswer The user's selected answer.
 * @returns True if correct.
 */
export function validateMultipleChoice(correctAnswer: string, userAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * Validates a true/false answer.
 * @param correctAnswer 'true' or 'false'.
 * @param userAnswer The user's answer.
 * @returns True if correct.
 */
export function validateTrueFalse(correctAnswer: string, userAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * Validates a reorder answer by comparing sorted word arrays.
 * @param correctWords The correct words array.
 * @param userAnswer The user's joined answer string.
 * @returns True if correct.
 */
export function validateReorder(correctAnswer: string, userAnswer: string): boolean {
  const userWords = userAnswer.trim().toLowerCase().split(/\s+/).sort();
  const correctWords = correctAnswer.trim().toLowerCase().split(/\s+/).sort();
  return JSON.stringify(userWords) === JSON.stringify(correctWords);
}

/**
 * Validates a riddle answer.
 * @param correctAnswer The correct answer.
 * @param userAnswer The user's answer.
 * @returns True if correct.
 */
export function validateRiddle(correctAnswer: string, userAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * Validates a timed question answer.
 * @param correctAnswer The correct answer.
 * @param userAnswer The user's answer.
 * @returns True if correct.
 */
export function validateTimed(correctAnswer: string, userAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}
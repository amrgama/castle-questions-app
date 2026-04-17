export type QuestionType = 'multiple_choice' | 'true_false' | 'reorder' | 'riddle' | 'timed';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  words?: string[];
  timeLimit?: number;
  wizardLine: string;
  hint?: string;
}

export const questions: Question[] = [
  // Multiple Choice 1
  {
    id: 'mc1',
    type: 'multiple_choice',
    prompt: 'What is the synonym of "happy"?',
    options: ['Sad', 'Joyful', 'Angry', 'Tired'],
    correctAnswer: 'Joyful',
    wizardLine: 'Choose wisely, young scholar.',
  },
  // Multiple Choice 2
  {
    id: 'mc2',
    type: 'multiple_choice',
    prompt: 'Which word means "to run quickly"?',
    options: ['Walk', 'Sprint', 'Crawl', 'Stroll'],
    correctAnswer: 'Sprint',
    wizardLine: 'Speed is of the essence!',
  },
  // True False 1
  {
    id: 'tf1',
    type: 'true_false',
    prompt: 'The word "affect" is a verb.',
    correctAnswer: 'true',
    wizardLine: 'Truth or falsehood, decide!',
  },
  // True False 2
  {
    id: 'tf2',
    type: 'true_false',
    prompt: ' "Their" is a possessive pronoun.',
    correctAnswer: 'true',
    wizardLine: 'Pronouns can be tricky.',
  },
  // Reorder 1
  {
    id: 're1',
    type: 'reorder',
    prompt: 'Reorder the words to form a correct sentence: quickly runs the boy',
    words: ['the', 'boy', 'runs', 'quickly'],
    correctAnswer: 'the boy runs quickly',
    wizardLine: 'Arrange them in order.',
  },
  // Reorder 2
  {
    id: 're2',
    type: 'reorder',
    prompt: 'Reorder: ate apple red the',
    words: ['the', 'red', 'apple', 'ate'],
    correctAnswer: 'ate the red apple',
    wizardLine: 'Put the words right.',
  },
  // Riddle 1
  {
    id: 'ri1',
    type: 'riddle',
    prompt: 'What has keys but opens no locks?',
    correctAnswer: 'piano',
    hint: 'It makes music.',
    wizardLine: 'Think musically!',
  },
  // Riddle 2
  {
    id: 'ri2',
    type: 'riddle',
    prompt: 'What gets wetter as it dries?',
    correctAnswer: 'towel',
    hint: 'Used in the bathroom.',
    wizardLine: 'A drying paradox!',
  },
  // Timed 1
  {
    id: 'ti1',
    type: 'timed',
    prompt: 'Spell "necessary" correctly.',
    correctAnswer: 'necessary',
    timeLimit: 10,
    wizardLine: 'Hurry, time is ticking!',
  },
  // Timed 2
  {
    id: 'ti2',
    type: 'timed',
    prompt: 'What is 15 + 27?',
    correctAnswer: '42',
    timeLimit: 15,
    wizardLine: 'Quick math!',
  },
];
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '@/data/questions';

const STORAGE_KEY = 'customQuestions';

export const useQuestionSet = () => {
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomQuestions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuestions = async (questions: Question[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      setCustomQuestions(questions);
    } catch (error) {
      console.error('Failed to save questions:', error);
    }
  };

  const addQuestion = async (question: Question) => {
    const newQuestions = [...customQuestions, question];
    await saveQuestions(newQuestions);
  };

  const updateQuestion = async (index: number, question: Question) => {
    const newQuestions = [...customQuestions];
    newQuestions[index] = question;
    await saveQuestions(newQuestions);
  };

  const deleteQuestion = async (index: number) => {
    const newQuestions = customQuestions.filter((_, i) => i !== index);
    await saveQuestions(newQuestions);
  };

  return {
    customQuestions,
    isLoading,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
};
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { Question } from '@/data/questions';

interface SentenceReorderProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const SentenceReorder: React.FC<SentenceReorderProps> = ({ question, onAnswer }) => {
  const words = question.words || [];
  const [availableWords, setAvailableWords] = useState(words);
  const [slots, setSlots] = useState<(string | null)[]>(new Array(words.length).fill(null));
  const [animValues] = useState(words.map(() => new Animated.Value(1)));

  useEffect(() => {
    if (slots.every(slot => slot !== null)) {
      const answer = slots.join(' ');
      setTimeout(() => onAnswer(answer), 500);
    }
  }, [slots, onAnswer]);

  const handleWordPress = (word: string, index: number) => {
    const slotIndex = slots.findIndex(slot => slot === null);
    if (slotIndex !== -1) {
      // Move to slot
      const newSlots = [...slots];
      newSlots[slotIndex] = word;
      setSlots(newSlots);
      setAvailableWords(availableWords.filter(w => w !== word));

      Animated.spring(animValues[index], {
        toValue: 1.2,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(animValues[index], {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleSlotPress = (slotIndex: number) => {
    const word = slots[slotIndex];
    if (word) {
      // Return to available
      setAvailableWords([...availableWords, word]);
      const newSlots = [...slots];
      newSlots[slotIndex] = null;
      setSlots(newSlots);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.wordsContainer}>
        {availableWords.map((word, index) => (
          <Animated.View
            key={word}
            style={[
              styles.wordChip,
              { transform: [{ scale: animValues[words.indexOf(word)] }] },
            ]}
          >
            <TouchableOpacity onPress={() => handleWordPress(word, words.indexOf(word))}>
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      <View style={styles.slotsContainer}>
        {slots.map((slot, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.slot, slot ? styles.filledSlot : styles.emptySlot]}
            onPress={() => handleSlotPress(index)}
          >
            <Text style={styles.slotText}>{slot || '_'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prompt: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  wordChip: {
    backgroundColor: '#555',
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    borderRadius: 20,
  },
  wordText: {
    fontSize: 16,
    color: 'white',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  slot: {
    width: 60,
    height: 40,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#666',
  },
  filledSlot: {
    backgroundColor: '#4CAF50',
  },
  slotText: {
    fontSize: 16,
    color: 'white',
  },
});

export default SentenceReorder;
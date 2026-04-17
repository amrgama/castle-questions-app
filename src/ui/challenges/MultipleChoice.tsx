import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { Question } from '@/data/questions';

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = (option: string, index: number) => {
    if (selected) return;
    setSelected(option);

    if (option === question.correctAnswer) {
      // Correct: green bg + spring scale
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => onAnswer(option), 500);
      });
    } else {
      // Wrong: shake + red
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => onAnswer(option), 500);
      });
    }
  };

  const renderOption = (option: string, index: number) => {
    const letters = ['A', 'B', 'C', 'D'];
    const isSelected = selected === option;
    const isCorrect = option === question.correctAnswer;

    let backgroundColor = '#333';
    if (isSelected) {
      backgroundColor = isCorrect ? '#4CAF50' : '#F44336';
    }

    return (
      <Animated.View
        key={index}
        style={[
          styles.option,
          {
            backgroundColor,
            transform: [
              { translateX: shakeAnim },
              { scale: isSelected && isCorrect ? scaleAnim : 1 },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.optionTouchable}
          onPress={() => handlePress(option, index)}
          disabled={!!selected}
        >
          <Text style={styles.letter}>{letters[index]}</Text>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.grid}>
        {question.options?.map((option, index) => renderOption(option, index))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  option: {
    width: 140,
    height: 80,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: 5,
    left: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default MultipleChoice;
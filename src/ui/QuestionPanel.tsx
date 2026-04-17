import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { questions } from '@/data/questions';
import MultipleChoice from './challenges/MultipleChoice';
import TrueFalse from './challenges/TrueFalse';
import SentenceReorder from './challenges/SentenceReorder';
import Riddle from './challenges/Riddle';
import TimedQuestion from './challenges/TimedQuestion';

const QuestionPanel: React.FC = () => {
  const currentStep = useGameStore((state) => state.currentStep);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const slideAnim = useRef(new Animated.Value(1)).current; // Start off-screen
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const question = questions[currentStep];

  React.useEffect(() => {
    // Entry animation
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleAnswer = (answer: string) => {
    submitAnswer(answer);
  };

  const handleTimeUp = () => {
    submitAnswer(''); // Timeout as wrong
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Trigger shake on wrong answer (this would be called from store or something, but for now placeholder)
  // In real implementation, listen to phase changes or something

  const renderChallenge = () => {
    const commonProps = { question, onAnswer: handleAnswer };

    switch (question.type) {
      case 'multiple_choice':
        return <MultipleChoice {...commonProps} />;
      case 'true_false':
        return <TrueFalse {...commonProps} />;
      case 'reorder':
        return <SentenceReorder {...commonProps} />;
      case 'riddle':
        return <Riddle {...commonProps} />;
      case 'timed':
        return (
          <TimedQuestion {...commonProps} onTimeUp={handleTimeUp}>
            <MultipleChoice {...commonProps} /> {/* Example, could be any */}
          </TimedQuestion>
        );
      default:
        return <Text style={{ color: 'white' }}>Unknown question type</Text>;
    }
  };

  const getTypeBadge = () => {
    switch (question.type) {
      case 'multiple_choice': return 'MC';
      case 'true_false': return 'T/F';
      case 'reorder': return 'Reorder';
      case 'riddle': return 'Riddle';
      case 'timed': return 'Timed';
      default: return '?';
    }
  };

  const renderStepDots = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <View key={i} style={[styles.dot, i <= currentStep && styles.activeDot]} />
    ));
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getTypeBadge()}</Text>
        </View>
        <View style={styles.dots}>
          {renderStepDots()}
        </View>
      </View>
      {renderChallenge()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(8,4,20,0.95)',
    borderTopWidth: 3,
    borderTopColor: '#ffd700',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  badge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#ffd700',
  },
});

export default QuestionPanel;
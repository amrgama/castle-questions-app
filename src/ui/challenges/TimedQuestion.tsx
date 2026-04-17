import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Question } from '@/data/questions';

interface TimedQuestionProps {
  question: Question;
  children: React.ReactNode;
  onAnswer: (answer: string) => void;
  onTimeUp: () => void;
}

const TimedQuestion: React.FC<TimedQuestionProps> = ({ question, children, onAnswer, onTimeUp }) => {
  const timeLimit = question.timeLimit || 30;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [pulseAnim] = useState(new Animated.Value(1));
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onTimeUp]);

  useEffect(() => {
    if (timeLeft < 5) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft, pulseAnim]);

  const progress = timeLeft / timeLimit;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - progress * circumference;

  let strokeColor = '#4CAF50'; // green
  if (timeLeft <= 5) strokeColor = '#F44336'; // red
  else if (timeLeft <= 10) strokeColor = '#FF9800'; // amber

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Svg width={100} height={100}>
          <Circle
            cx={50}
            cy={50}
            r={40}
            stroke="#333"
            strokeWidth={8}
            fill="none"
          />
          <Circle
            cx={50}
            cy={50}
            r={40}
            stroke={strokeColor}
            strokeWidth={8}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 50 50)`}
          />
        </Svg>
        <View style={styles.timerTextContainer}>
          <Animated.Text style={[styles.timerText, { transform: [{ scale: pulseAnim }] }]}>
            {timeLeft}
          </Animated.Text>
        </View>
      </Animated.View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  timerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});

export default TimedQuestion;
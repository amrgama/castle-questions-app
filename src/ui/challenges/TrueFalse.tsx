import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, PanResponder, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { Question } from '@/data/questions';

interface TrueFalseProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const TrueFalse: React.FC<TrueFalseProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        tiltX.setValue(dx / 10);
        tiltY.setValue(-dy / 10);
      },
      onPanResponderRelease: () => {
        Animated.spring(tiltX, { toValue: 0, useNativeDriver: true }).start();
        Animated.spring(tiltY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  );

  const handlePress = (answer: string) => {
    if (selected) return;
    setSelected(answer);

    // Flip animation
    Animated.timing(flipAnim, {
      toValue: 180,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => onAnswer(answer), 500);
    });
  };

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [0, 0, 1],
  });

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.current.panHandlers}
        style={[
          styles.card,
          {
            transform: [
              { perspective: 800 },
              { rotateX: tiltY.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] }) },
              { rotateY: tiltX.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] }) },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.cardFace,
            styles.front,
            { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] },
          ]}
        >
          <Text style={styles.statement}>{question.prompt}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.cardFace,
            styles.back,
            { opacity: backOpacity, transform: [{ rotateY: backRotate }] },
          ]}
        >
          <Text style={styles.reveal}>{selected === question.correctAnswer ? 'Correct!' : 'Wrong!'}</Text>
        </Animated.View>
      </Animated.View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, selected === 'true' && styles.selected]}
          onPress={() => handlePress('true')}
          disabled={!!selected}
        >
          <Text style={styles.buttonText}>TRUE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selected === 'false' && styles.selected]}
          onPress={() => handlePress('false')}
          disabled={!!selected}
        >
          <Text style={styles.buttonText}>FALSE</Text>
        </TouchableOpacity>
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
  card: {
    width: 300,
    height: 200,
    marginBottom: 40,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  front: {
    backgroundColor: '#333',
  },
  back: {
    backgroundColor: '#4CAF50',
  },
  statement: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
  reveal: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#555',
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: '#ffd700',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TrueFalse;
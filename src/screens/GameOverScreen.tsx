import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '@/store/gameStore';
import GameOverScene from '@/scene/GameOverScene';

const { height } = Dimensions.get('window');

const GameOverScreen: React.FC = () => {
  const navigation = useNavigation();
  const score = useGameStore((state) => state.score);
  const questionHistory = useGameStore((state) => state.questionHistory);
  const resetGame = useGameStore((state) => state.resetGame);

  const [showResults, setShowResults] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const panelAnim = useRef(new Animated.Value(height)).current;

  const correctAnswers = questionHistory.filter(h => h.isCorrect).length;
  const totalQuestions = questionHistory.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const timeElapsed = questionHistory.reduce((sum, h) => sum + h.timeMs, 0) / 1000; // seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResults(true);
      Animated.spring(panelAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      // Score counter
      let current = 0;
      const increment = score / 50;
      const counter = setInterval(() => {
        current += increment;
        if (current >= score) {
          current = score;
          clearInterval(counter);
        }
        setAnimatedScore(Math.round(current));
      }, 30);
    }, 3000);

    return () => clearTimeout(timer);
  }, [score, panelAnim]);

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate('Home' as never);
  };

  const handleTeacherView = () => {
    navigation.navigate('Teacher' as never);
  };

  return (
    <View style={styles.container}>
      <GameOverScene style={styles.scene} />
      {showResults && (
        <Animated.View
          style={[
            styles.resultsPanel,
            { transform: [{ translateY: panelAnim }] },
          ]}
        >
          <Text style={styles.skull}>💀</Text>
          <Text style={styles.title}>GAME OVER</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>Score: {animatedScore}</Text>
            <Text style={styles.stat}>Time: {timeElapsed.toFixed(1)}s</Text>
            <Text style={styles.stat}>Accuracy: {accuracy}%</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.playAgain]} onPress={handlePlayAgain}>
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.teacher]} onPress={handleTeacherView}>
              <Text style={styles.buttonText}>Teacher View</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  resultsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  skull: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stats: {
    marginBottom: 30,
  },
  stat: {
    fontSize: 18,
    color: 'white',
    marginVertical: 5,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  playAgain: {
    backgroundColor: '#4CAF50',
  },
  teacher: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GameOverScreen;
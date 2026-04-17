import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import HeartDisplay from './HeartDisplay';

interface RetryOverlayProps {
  onTryAgain: () => void;
  onSkip: () => void;
}

const RetryOverlay: React.FC<RetryOverlayProps> = ({ onTryAgain, onSkip }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Wrong Answer!</Text>
      <HeartDisplay />
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.tryAgain]} onPress={onTryAgain}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.skip]} onPress={onSkip}>
          <Text style={styles.buttonText}>Skip (-5 pts)</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  tryAgain: {
    backgroundColor: '#4CAF50',
  },
  skip: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RetryOverlay;
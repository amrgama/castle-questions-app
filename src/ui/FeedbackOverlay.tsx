import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong';
  onComplete: () => void;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ type, onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type === 'correct') {
      // Score pop
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateYAnim, { toValue: 0, useNativeDriver: true }),
      ]).start();

      // Checkmark draw
      setTimeout(() => {
        Animated.timing(checkmarkAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      }, 200);

      setTimeout(onComplete, 1500);
    } else {
      // Red flash
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();

      setTimeout(onComplete, 600);
    }
  }, [type, fadeAnim, translateYAnim, checkmarkAnim, flashAnim, onComplete]);

  const checkmarkPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";
  const xPath = "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z";

  return (
    <View style={styles.container}>
      {type === 'correct' && (
        <>
          <Animated.View
            style={[
              styles.scorePop,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
              },
            ]}
          >
            <Text style={styles.scoreText}>+10</Text>
          </Animated.View>
          <View style={styles.checkmarkContainer}>
            <Svg width={100} height={100}>
              <AnimatedPath
                d={checkmarkPath}
                fill="#4CAF50"
                stroke="#4CAF50"
                strokeWidth={2}
                strokeDasharray={1000}
                strokeDashoffset={checkmarkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1000, 0],
                })}
              />
            </Svg>
          </View>
        </>
      )}
      {type === 'wrong' && (
        <Animated.View
          style={[
            styles.flash,
            {
              opacity: flashAnim,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePop: {
    position: 'absolute',
    top: '30%',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: '40%',
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
  },
});

export default FeedbackOverlay;
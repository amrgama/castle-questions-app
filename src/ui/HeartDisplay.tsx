import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useGameStore } from '@/store/gameStore';

const HeartDisplay: React.FC = () => {
  const lives = useGameStore((state) => state.lives);
  const scaleAnims = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;
  const wiggleAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    // On lives change, animate the lost heart
    const lostIndex = 3 - lives - 1; // 0-based index of lost heart
    if (lostIndex >= 0 && lostIndex < 3) {
      // Pop the lost heart
      Animated.spring(scaleAnims[lostIndex], {
        toValue: 1.5,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnims[lostIndex], {
          toValue: 0.8,
          useNativeDriver: true,
        }).start();
      });

      // Wiggle remaining hearts
      for (let i = 0; i < 3; i++) {
        if (i !== lostIndex) {
          Animated.sequence([
            Animated.timing(wiggleAnims[i], { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(wiggleAnims[i], { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(wiggleAnims[i], { toValue: 0, duration: 100, useNativeDriver: true }),
          ]).start();
        }
      }
    }
  }, [lives, scaleAnims, wiggleAnims]);

  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  const renderHeart = (index: number) => {
    const isFilled = index < lives;
    return (
      <Animated.View
        key={index}
        style={[
          styles.heart,
          {
            transform: [
              { scale: scaleAnims[index] },
              { rotate: wiggleAnims[index].interpolate({
                inputRange: [-10, 10],
                outputRange: ['-5deg', '5deg'],
              }) },
            ],
          },
        ]}
      >
        <Svg width={30} height={30}>
          <Path
            d={heartPath}
            fill={isFilled ? '#F44336' : 'none'}
            stroke="#F44336"
            strokeWidth={2}
          />
        </Svg>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2].map(renderHeart)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
  },
  heart: {
    marginHorizontal: 5,
  },
});

export default HeartDisplay;
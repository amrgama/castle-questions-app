import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '@/store/gameStore';
import CorridorScene from '@/scene/CorridorScene';
import PhaseOverlayManager from '@/ui/PhaseOverlayManager';

const GameScreen: React.FC = () => {
  const navigation = useNavigation();
  const phase = useGameStore((state) => state.phase);

  useEffect(() => {
    if (phase === 'victory') {
      navigation.navigate('Victory' as never);
    } else if (phase === 'gameover') {
      navigation.navigate('GameOver' as never);
    }
  }, [phase, navigation]);

  return (
    <View style={styles.container}>
      <CorridorScene style={styles.scene} />
      <PhaseOverlayManager />
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
});

export default GameScreen;
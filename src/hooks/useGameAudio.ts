import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/utils/AudioManager';
import { useHaptics } from '@/hooks/useHaptics';

export const useGameAudio = () => {
  const phase = useGameStore((state) => state.phase);
  const lastAnswer = useGameStore((state) => state.questionHistory[state.questionHistory.length - 1]);
  const haptics = useHaptics();

  useEffect(() => {
    // Phase-based audio
    switch (phase) {
      case 'home':
        audioManager.playSound('background', { loop: true, volume: 0.5 });
        break;
      case 'game':
        // Continue background or play game music
        break;
      case 'victory':
        audioManager.stopSound('background');
        audioManager.playSound('victory');
        haptics.success();
        break;
      case 'gameover':
        audioManager.stopSound('background');
        audioManager.playSound('gameover');
        haptics.error();
        break;
      case 'retry':
        audioManager.playSound('wrong');
        haptics.warning();
        break;
    }
  }, [phase, haptics]);

  useEffect(() => {
    // Answer feedback
    if (lastAnswer) {
      if (lastAnswer.isCorrect) {
        audioManager.playSound('correct');
        haptics.success();
      } else {
        audioManager.playSound('wrong');
        haptics.error();
      }
    }
  }, [lastAnswer, haptics]);

  // Load sounds on mount
  useEffect(() => {
    audioManager.loadSounds();
    return () => {
      audioManager.unloadSounds();
    };
  }, []);
};
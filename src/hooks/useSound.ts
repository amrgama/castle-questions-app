import { useCallback } from 'react';
import { audioManager } from '@/utils/AudioManager';

export const useSound = (soundName: string) => {
  const play = useCallback(async (options?: { volume?: number; loop?: boolean }) => {
    await audioManager.playSound(soundName, options);
  }, [soundName]);

  const stop = useCallback(async () => {
    await audioManager.stopSound(soundName);
  }, [soundName]);

  return { play, stop };
};
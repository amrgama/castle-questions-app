import { Audio } from 'expo-av';

export class AudioManager {
  private sounds: Map<string, Audio.Sound> = new Map();
  private isLoaded = false;

  async loadSounds() {
    if (this.isLoaded) return;

    // Placeholder sound URLs - replace with actual audio files
    const soundFiles = {
      'background': require('@/assets/audio/background.mp3'),
      'correct': require('@/assets/audio/correct.mp3'),
      'wrong': require('@/assets/audio/wrong.mp3'),
      'victory': require('@/assets/audio/victory.mp3'),
      'gameover': require('@/assets/audio/gameover.mp3'),
      'button': require('@/assets/audio/button.mp3'),
      'door': require('@/assets/audio/door.mp3'),
    };

    for (const [name, file] of Object.entries(soundFiles)) {
      try {
        const { sound } = await Audio.Sound.createAsync(file);
        this.sounds.set(name, sound);
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error);
      }
    }

    this.isLoaded = true;
  }

  async playSound(name: string, options?: { volume?: number; loop?: boolean }) {
    const sound = this.sounds.get(name);
    if (!sound) return;

    try {
      await sound.setVolumeAsync(options?.volume ?? 1);
      await sound.setIsLoopingAsync(options?.loop ?? false);
      await sound.replayAsync();
    } catch (error) {
      console.warn(`Failed to play sound: ${name}`, error);
    }
  }

  async stopSound(name: string) {
    const sound = this.sounds.get(name);
    if (!sound) return;

    try {
      await sound.stopAsync();
    } catch (error) {
      console.warn(`Failed to stop sound: ${name}`, error);
    }
  }

  async unloadSounds() {
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.warn('Failed to unload sound', error);
      }
    }
    this.sounds.clear();
    this.isLoaded = false;
  }
}

export const audioManager = new AudioManager();
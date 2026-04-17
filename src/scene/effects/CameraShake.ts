import { THREE } from 'expo-three';

export class CameraShake {
  private camera: THREE.Camera;
  private originalPosition: THREE.Vector3;
  private isShaking = false;
  private startTime = 0;
  private duration = 1000; // ms

  constructor(camera: THREE.Camera) {
    this.camera = camera;
    this.originalPosition = camera.position.clone();
  }

  start(duration = 1000) {
    this.isShaking = true;
    this.startTime = Date.now();
    this.duration = duration;
  }

  update() {
    if (!this.isShaking) return;

    const elapsed = Date.now() - this.startTime;
    const t = elapsed / this.duration;

    if (t >= 1) {
      this.camera.position.copy(this.originalPosition);
      this.isShaking = false;
      return;
    }

    const decay = 1 - t;
    const shakeX = Math.sin(elapsed * 0.018) * 0.15 * decay;
    const shakeY = Math.sin(elapsed * 0.014 + 1) * 0.08 * decay;

    this.camera.position.x = this.originalPosition.x + shakeX;
    this.camera.position.y = this.originalPosition.y + shakeY;
  }

  isActive() {
    return this.isShaking;
  }
}
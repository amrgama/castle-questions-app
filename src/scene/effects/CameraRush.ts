import { THREE } from 'expo-three';

export class CameraRush {
  private camera: THREE.Camera;
  private targetZ: number;
  private onComplete?: () => void;

  constructor(camera: THREE.Camera, targetZ: number, onComplete?: () => void) {
    this.camera = camera;
    this.targetZ = targetZ;
    this.onComplete = onComplete;
  }

  update() {
    const currentZ = this.camera.position.z;
    const diff = this.targetZ - currentZ;
    this.camera.position.z += diff * 0.03;

    // Narrow FOV
    if (this.camera instanceof THREE.PerspectiveCamera) {
      const targetFov = 50;
      this.camera.fov += (targetFov - this.camera.fov) * 0.03;
      this.camera.updateProjectionMatrix();
    }

    if (Math.abs(diff) < 0.1) {
      this.camera.position.z = this.targetZ;
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }
}
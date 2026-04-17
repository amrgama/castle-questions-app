import { THREE } from 'expo-three';
import Corridor from '@/scene/objects/Corridor';
import { createTorch } from '@/scene/objects/Torch';
import Avatar from '@/scene/objects/Avatar';
import PathTrail from '@/scene/objects/PathTrail';
import ExitArch from '@/scene/objects/ExitArch';

export class GameOverScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private corridor: Corridor;
  private torches: THREE.Group[] = [];
  private avatar: Avatar;
  private pathTrail: PathTrail;
  private exitArch: ExitArch;
  private ambientLight: THREE.AmbientLight;
  private fog: THREE.Fog;
  private startTime: number;
  private duration: number = 5000; // 5 seconds for full effect

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.startTime = Date.now();
  }

  async init() {
    // Setup corridor
    this.corridor = new Corridor();
    await this.corridor.init();
    this.scene.add(this.corridor.group);

    // Setup torches
    for (let i = 0; i < 10; i++) {
      const torch = createTorch(new THREE.Vector3(-4.5 + i * 1, 1.5, -i * 2));
      this.torches.push(torch);
      this.scene.add(torch);
    }

    // Avatar
    this.avatar = new Avatar();
    await this.avatar.init();
    this.avatar.group.position.set(0, 0, 5);
    this.scene.add(this.avatar.group);

    // Path trail
    this.pathTrail = new PathTrail();
    await this.pathTrail.init();
    this.scene.add(this.pathTrail.group);

    // Exit arch
    this.exitArch = new ExitArch();
    await this.exitArch.init();
    this.exitArch.group.position.set(0, 0, -18);
    this.scene.add(this.exitArch.group);

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 10, 5);
    this.scene.add(dirLight);

    // Fog
    this.fog = new THREE.Fog(0x000000, 10, 50);
    this.scene.fog = this.fog;

    // Camera
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0, -10);
  }

  update() {
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);

    // Torch extinguish
    this.torches.forEach((torch, index) => {
      const delay = index * 100; // Stagger
      const torchProgress = Math.min((elapsed - delay) / 1000, 1);
      const scale = torchProgress < 1 ? 1 : 0;
      torch.scale.setScalar(scale);
      if (torchProgress >= 1) {
        // Set color to black
        torch.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
            child.material.color.set(0x000000);
          }
          if (child instanceof THREE.PointLight) {
            child.intensity = 0;
          }
        });
      } else {
        (torch as any).updateFlame();
      }
    });

    // Darkness advance
    this.ambientLight.intensity = 0.4 * (1 - progress * 0.8);
    this.fog.near = 10 - progress * 5;
    this.fog.far = 50 - progress * 20;

    // Desaturation (simplified: reduce color saturation)
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshLambertMaterial) {
        const mat = child.material;
        if (mat.color) {
          const gray = (mat.color.r + mat.color.g + mat.color.b) / 3;
          mat.color.setRGB(
            mat.color.r + (gray - mat.color.r) * progress,
            mat.color.g + (gray - mat.color.g) * progress,
            mat.color.b + (gray - mat.color.b) * progress
          );
        }
      }
    });

    // Camera pullback
    const targetZ = 5 + progress * 10;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.02;

    // Update objects
    this.avatar.update();
    this.pathTrail.update();
    this.exitArch.update();
  }
}

import React, { useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { THREE } from 'expo-three';

interface GameOverSceneProps {
  style?: any;
}

const GameOverSceneComponent: React.FC<GameOverSceneProps> = ({ style }) => {
  const glViewRef = useRef<GLView>(null);

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const gameOverScene = new GameOverScene(scene, camera);
    await gameOverScene.init();

    const render = () => {
      requestAnimationFrame(render);
      gameOverScene.update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <GLView
      ref={glViewRef}
      style={style}
      onContextCreate={onContextCreate}
    />
  );
};

export default GameOverSceneComponent;
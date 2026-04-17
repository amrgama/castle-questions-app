import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { createCorridor } from './objects/Corridor';
import { createDoor } from './objects/Door';
import { createTorch } from './objects/Torch';
import { createAvatar } from './objects/Avatar';
import { createPathTrail } from './objects/PathTrail';
import { createExitArch } from './objects/ExitArch';

interface CorridorSceneProps {
  style?: any;
}

const CorridorScene: React.FC<CorridorSceneProps> = ({ style }) => {
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 16);
    camera.lookAt(0, 2, -20);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Add corridor
    const corridor = createCorridor();
    scene.add(corridor);

    // Add doors
    const doors: THREE.Group[] = [];
    const doorPositions = [-2, -6, -10, -14, -18];
    for (let i = 0; i < 5; i++) {
      const x = i % 2 === 0 ? -2.6 : 2.6;
      const door = createDoor({
        position: new THREE.Vector3(x, 0, doorPositions[i]),
        doorIndex: i,
        isUnlocked: false,
        isTarget: i === 0, // First door is target
      });
      scene.add(door);
      doors.push(door);
    }

    // Add torches (2 per door, 10 total)
    const torches: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const z = doorPositions[i];
      const torch1 = createTorch(new THREE.Vector3(-2.8, 3, z));
      const torch2 = createTorch(new THREE.Vector3(2.8, 3, z));
      scene.add(torch1);
      scene.add(torch2);
      torches.push(torch1, torch2);
    }

    // Add avatar
    const avatar = createAvatar();
    scene.add(avatar);

    // Add path trail
    const pathTrail = createPathTrail();
    scene.add(pathTrail);

    // Add exit arch
    const exitArch = createExitArch();
    scene.add(exitArch);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Camera breathing
      camera.position.y = 2.5 + Math.sin(time * 0.4) * 0.05;

      // Update torches
      torches.forEach(torch => {
        (torch as any).updateFlame();
      });

      // Update avatar idle
      (avatar as any).updateIdle(0.016); // ~60fps
      (avatar as any).updateWalk();

      // Update path trail
      (pathTrail as any).updateTrail(time);

      // Update exit arch
      (exitArch as any).updateGlow(time);

      // Update doors
      doors.forEach(door => {
        (door as any).updateAnimation();
      });

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
};

export default CorridorScene;
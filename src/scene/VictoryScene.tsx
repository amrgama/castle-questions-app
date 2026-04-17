import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';

interface VictorySceneProps {
  style?: any;
}

const VictoryScene: React.FC<VictorySceneProps> = ({ style }) => {
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000011);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2, 10);
    camera.lookAt(0, 0, 0);

    // Trophy
    const trophyGroup = new THREE.Group();
    const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0x222200 });

    // Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 0.5, 16), goldMaterial);
    base.position.set(0, -1, 0);
    trophyGroup.add(base);

    // Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 8), goldMaterial);
    stem.position.set(0, 0, 0);
    trophyGroup.add(stem);

    // Cup
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.8, 16), goldMaterial);
    cup.position.set(0, 1, 0);
    trophyGroup.add(cup);

    // Handles
    const handle1 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI), goldMaterial);
    handle1.position.set(0.6, 0.8, 0);
    handle1.rotation.z = Math.PI / 2;
    trophyGroup.add(handle1);

    const handle2 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI), goldMaterial);
    handle2.position.set(-0.6, 0.8, 0);
    handle2.rotation.z = -Math.PI / 2;
    trophyGroup.add(handle2);

    scene.add(trophyGroup);

    // Confetti
    const confettiGeometry = new THREE.BufferGeometry();
    const confettiPositions = [];
    const confettiColors = [];
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    for (let i = 0; i < 300; i++) {
      confettiPositions.push(
        (Math.random() - 0.5) * 20,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 10
      );
      confettiColors.push(...new THREE.Color(colors[i % 6]).toArray());
    }
    confettiGeometry.setAttribute('position', new THREE.Float32BufferAttribute(confettiPositions, 3));
    confettiGeometry.setAttribute('color', new THREE.Float32BufferAttribute(confettiColors, 3));
    const confettiMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
    const confetti = new THREE.Points(confettiGeometry, confettiMaterial);
    scene.add(confetti);

    // Fireworks
    const fireworks: THREE.Points[] = [];
    for (let i = 0; i < 6; i++) {
      const fwGeometry = new THREE.BufferGeometry();
      const fwPositions = [];
      for (let j = 0; j < 60; j++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2;
        fwPositions.push(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        );
      }
      fwGeometry.setAttribute('position', new THREE.Float32BufferAttribute(fwPositions, 3));
      const fwMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
      const fw = new THREE.Points(fwGeometry, fwMaterial);
      fw.visible = false;
      fireworks.push(fw);
      scene.add(fw);
    }

    // Star sparkles
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparklePositions = [];
    for (let i = 0; i < 120; i++) {
      sparklePositions.push(
        (Math.random() - 0.5) * 30,
        Math.random() * 10,
        (Math.random() - 0.5) * 20
      );
    }
    sparkleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sparklePositions, 3));
    const sparkleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkles);

    // God-ray cone
    const rayGeometry = new THREE.ConeGeometry(5, 10, 16);
    const rayMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    const godRay = new THREE.Mesh(rayGeometry, rayMaterial);
    godRay.position.set(0, 5, -5);
    godRay.rotation.x = Math.PI;
    scene.add(godRay);

    // Lights
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.5);
    directional.position.set(5, 5, 5);
    scene.add(directional);

    // Animations
    let trophyScale = 0;
    let confettiTime = 0;
    let sparkleTime = 0;
    let fireworkIndex = 0;
    let fireworkTime = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Trophy
      if (trophyScale < 1) {
        trophyScale += 0.02;
        trophyGroup.scale.setScalar(Math.min(trophyScale, 1));
      }
      trophyGroup.rotation.y += 0.006;
      goldMaterial.emissive.setScalar(0.3 + Math.sin(time * 2) * 0.15);

      // Confetti
      confettiTime += 0.016;
      const positions = confettiGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.02; // Fall
        positions[i] += Math.sin(time + i * 0.01) * 0.005; // Drift
        if (positions[i + 1] < -5) {
          positions[i + 1] = 15; // Respawn
          positions[i] = (Math.random() - 0.5) * 20;
          positions[i + 2] = (Math.random() - 0.5) * 10;
        }
      }
      confettiGeometry.attributes.position.needsUpdate = true;

      // Fireworks
      fireworkTime += 16;
      if (fireworkTime > 900) {
        fireworkTime = 0;
        const fw = fireworks[fireworkIndex];
        fw.position.set(
          (Math.random() - 0.5) * 20,
          Math.random() * 10 + 5,
          (Math.random() - 0.5) * 10
        );
        fw.visible = true;
        fireworkIndex = (fireworkIndex + 1) % 6;

        // Animate burst
        const fwPositions = fw.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < fwPositions.length; i += 3) {
          const speed = 0.1;
          fwPositions[i] += (Math.random() - 0.5) * speed;
          fwPositions[i + 1] += (Math.random() - 0.5) * speed;
          fwPositions[i + 2] += (Math.random() - 0.5) * speed;
        }
        fw.geometry.attributes.position.needsUpdate = true;

        // Fade out
        setTimeout(() => {
          fw.visible = false;
        }, 800);
      }

      // Sparkles
      sparkleTime += 0.016;
      const sparklePositions = sparkleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparklePositions.length; i += 3) {
        sparklePositions[i + 1] += 0.01; // Upward drift
        if (sparklePositions[i + 1] > 20) {
          sparklePositions[i + 1] = 0;
        }
      }
      sparkleGeometry.attributes.position.needsUpdate = true;
      sparkleMaterial.size = 0.05 + Math.sin(sparkleTime * 3) * 0.02;

      // God ray
      rayMaterial.opacity = 0.1 + Math.sin(time * 0.8) * 0.05;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
};

export default VictoryScene;
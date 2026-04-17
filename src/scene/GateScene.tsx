import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';

interface GateSceneProps {
  style?: any;
}

const GateScene: React.FC<GateSceneProps> = ({ style }) => {
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0d0a1a);

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0a1a, 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 8, 40);
    camera.lookAt(0, 0, 0);

    // Camera animation
    let cameraTargetZ = 25;
    let cameraAnimating = true;
    const cameraStartTime = Date.now();

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Torch lights
    const torchLight1 = new THREE.PointLight(0xffaa00, 1, 10);
    torchLight1.position.set(-10, 5, 2);
    scene.add(torchLight1);

    const torchLight2 = new THREE.PointLight(0xffaa00, 1, 10);
    torchLight2.position.set(10, 5, 2);
    scene.add(torchLight2);

    // Wizard light
    const wizardLight = new THREE.PointLight(0x8888ff, 0.5, 5);
    wizardLight.position.set(0, 12, 5);
    scene.add(wizardLight);

    // Castle keep
    const keepMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1f14 });
    const keep = new THREE.Mesh(new THREE.BoxGeometry(24, 18, 8), keepMaterial);
    keep.position.set(0, 9, 0);
    scene.add(keep);

    // Crenellations
    for (let i = 0; i < 8; i++) {
      const crenel = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), keepMaterial);
      crenel.position.set(-10.5 + i * 3, 19, 0);
      scene.add(crenel);
    }

    // Left tower
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1f14 });
    const leftTower = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3, 16, 12), towerMaterial);
    leftTower.position.set(-13, 8, 0);
    scene.add(leftTower);
    const leftCap = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4, 12), towerMaterial);
    leftCap.position.set(-13, 18, 0);
    scene.add(leftCap);

    // Right tower
    const rightTower = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3, 18, 12), towerMaterial);
    rightTower.position.set(13, 9, 0);
    scene.add(rightTower);
    const rightCap = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4, 12), towerMaterial);
    rightCap.position.set(13, 19, 0);
    scene.add(rightCap);

    // Portcullis
    const gateMaterial = new THREE.MeshStandardMaterial({ color: 0x2c2c2c, metalness: 0.9 });
    for (let i = 0; i < 12; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 8, 0.2), gateMaterial);
      bar.position.set(-5.5 + i * 1, 4, 4);
      scene.add(bar);
    }
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(11, 0.2, 0.2), gateMaterial);
      bar.position.set(0, 0.5 + i * 2, 4);
      scene.add(bar);
    }

    // Drawbridge
    const drawbridgeMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const drawbridge = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 8), drawbridgeMaterial);
    drawbridge.position.set(0, 0.2, -4);
    drawbridge.rotation.x = Math.PI / 2;
    scene.add(drawbridge);

    // Animate drawbridge
    let drawbridgeTargetRotation = 0;
    let drawbridgeAnimating = true;
    const drawbridgeStartTime = Date.now();

    // Wizard
    const wizardGroup = new THREE.Group();
    const wizardHead = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffdbac }));
    wizardHead.position.set(0, 1.5, 5);
    wizardGroup.add(wizardHead);
    const wizardBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8), new THREE.MeshStandardMaterial({ color: 0x4a4a4a }));
    wizardBody.position.set(0, 0.75, 5);
    wizardGroup.add(wizardBody);
    const wizardHat = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1, 8), new THREE.MeshStandardMaterial({ color: 0x800080 }));
    wizardHat.position.set(0, 2.5, 5);
    wizardGroup.add(wizardHat);
    scene.add(wizardGroup);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 5000; i++) {
      const radius = Math.random() * 180;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Fog planes
    const fogMaterial1 = new THREE.MeshBasicMaterial({ color: 0x0d0a1a, transparent: true, opacity: 0.3 });
    const fogPlane1 = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), fogMaterial1);
    fogPlane1.rotation.x = -Math.PI / 2;
    fogPlane1.position.y = 0;
    scene.add(fogPlane1);

    const fogMaterial2 = new THREE.MeshBasicMaterial({ color: 0x0d0a1a, transparent: true, opacity: 0.2 });
    const fogPlane2 = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), fogMaterial2);
    fogPlane2.rotation.x = -Math.PI / 2;
    fogPlane2.position.y = 0.5;
    scene.add(fogPlane2);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Camera animation
      if (cameraAnimating) {
        const elapsed = Date.now() - cameraStartTime;
        const progress = Math.min(elapsed / 3000, 1);
        camera.position.z = 40 - progress * 15;
        if (progress >= 1) cameraAnimating = false;
      }

      // Drawbridge animation
      if (drawbridgeAnimating) {
        const elapsed = Date.now() - drawbridgeStartTime;
        const progress = Math.min(elapsed / 2000, 1);
        drawbridge.rotation.x = Math.PI / 2 - progress * (Math.PI / 2);
        if (progress >= 1) drawbridgeAnimating = false;
      }

      // Wizard floating
      wizardGroup.position.y = Math.sin(time * 0.5) * 0.2;

      // Stars rotation
      stars.rotation.y += 0.0001;

      // Fog UV offset (simple animation)
      fogPlane1.material.map?.offset.set(time * 0.01, time * 0.01);
      fogPlane2.material.map?.offset.set(-time * 0.005, -time * 0.005);

      // Torch flicker
      const flicker = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
      torchLight1.intensity = flicker;
      torchLight2.intensity = flicker;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
};

export default GateScene;
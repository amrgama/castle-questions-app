import { THREE } from 'expo-three';

export const createExitArch = (): THREE.Group => {
  const group = new THREE.Group();
  group.position.set(0, 3, -20);

  // Arch frame
  const archMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  // Simple pointed arch using box
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 0.5), archMaterial);
  leftPillar.position.set(-1.5, 0, 0);
  group.add(leftPillar);

  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 0.5), archMaterial);
  rightPillar.position.set(1.5, 0, 0);
  group.add(rightPillar);

  const topArch = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.5, 0.5), archMaterial);
  topArch.position.set(0, 3, 0);
  group.add(topArch);

  // Pointed top
  const point = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1, 4), archMaterial);
  point.position.set(0, 3.75, 0);
  group.add(point);

  // Golden light
  const light = new THREE.PointLight(0xffd700, 2, 15);
  light.position.set(0, 3, 2);
  group.add(light);

  // Glowing plane
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), glowMaterial);
  glowPlane.position.set(0, 3, -0.25);
  group.add(glowPlane);

  // Pulsing glow
  const updateGlow = (time: number) => {
    const pulse = Math.sin(time * 3) * 0.2 + 0.8;
    light.intensity = pulse * 2;
    glowMaterial.opacity = pulse * 0.5;
  };

  (group as any).updateGlow = updateGlow;

  return group;
};
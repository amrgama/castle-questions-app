import { THREE } from 'expo-three';

export const createPathTrail = (): THREE.Group => {
  const group = new THREE.Group();

  const segmentMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.5,
  });

  const segments: THREE.Mesh[] = [];

  for (let i = 0; i < 20; i++) {
    const segment = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), segmentMaterial.clone());
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(0, 0.01, -2 - i * 0.8);
    group.add(segment);
    segments.push(segment);
  }

  // Pulsing wave animation
  const updateTrail = (time: number) => {
    segments.forEach((segment, index) => {
      const wave = Math.sin(time * 2 + index * 0.5) * 0.5 + 0.5;
      (segment.material as THREE.MeshBasicMaterial).opacity = wave * 0.8 + 0.2;
    });
  };

  (group as any).updateTrail = updateTrail;

  return group;
};
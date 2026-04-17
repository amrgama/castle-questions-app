import { THREE } from 'expo-three';

export const createCorridor = (): THREE.Group => {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 40), material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -10);
  group.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(6, 40), material);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 6, -10);
  group.add(ceiling);

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 6), material);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-3, 3, -10);
  group.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 6), material);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(3, 3, -10);
  group.add(rightWall);

  return group;
};
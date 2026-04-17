import { THREE } from 'expo-three';

interface DoorProps {
  position: THREE.Vector3;
  doorIndex: number;
  isUnlocked: boolean;
  isTarget: boolean;
}

export const createDoor = ({ position, doorIndex, isUnlocked, isTarget }: DoorProps): THREE.Group => {
  const group = new THREE.Group();
  group.position.copy(position);

  // Frame
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.2, 0.2), frameMaterial);
  frame.position.set(0, 2.1, 0);
  group.add(frame);

  // Door leaf
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 0.1), doorMaterial);
  doorLeaf.position.set(0, 2, 0.05);
  group.add(doorLeaf);

  // Keyhole
  const keyholeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const keyhole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8), keyholeMaterial);
  keyhole.rotation.x = Math.PI / 2;
  keyhole.position.set(0, 2, 0.11);
  group.add(keyhole);

  // Target light
  if (isTarget) {
    const light = new THREE.PointLight(0xffd700, 1, 5);
    light.position.set(0, 3, 1);
    group.add(light);
  }

  // Animation state
  let animationStart = 0;
  let isAnimating = false;

  const startUnlockAnimation = () => {
    if (!isAnimating && !isUnlocked) {
      isAnimating = true;
      animationStart = Date.now();
    }
  };

  const updateAnimation = () => {
    if (isAnimating) {
      const elapsed = Date.now() - animationStart;
      const progress = Math.min(elapsed / 1800, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      doorLeaf.rotation.y = -eased * (Math.PI / 2);
      if (progress >= 1) {
        isAnimating = false;
        // Mark as unlocked
      }
    }
  };

  // Expose methods
  (group as any).startUnlockAnimation = startUnlockAnimation;
  (group as any).updateAnimation = updateAnimation;

  return group;
};
import { THREE } from 'expo-three';

export const createAvatar = (): THREE.Group => {
  const group = new THREE.Group();
  group.position.set(0, 1.5, 12); // Start at Z=12

  // Head
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), headMaterial);
  head.position.set(0, 0.3, 0);
  group.add(head);

  // Body
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.8, 8), bodyMaterial);
  body.position.set(0, 0, 0);
  group.add(body);

  // Legs
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000080 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6), legMaterial);
  leftLeg.position.set(-0.15, -0.6, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6), legMaterial);
  rightLeg.position.set(0.15, -0.6, 0);
  group.add(rightLeg);

  // Idle bob
  let idleTime = 0;
  const updateIdle = (delta: number) => {
    idleTime += delta;
    group.position.y = 1.5 + Math.sin(idleTime * 2) * 0.05;
  };

  // Walk animation
  let isWalking = false;
  let walkStartZ = 0;
  let walkTargetZ = 0;
  let walkStartTime = 0;
  const walkDuration = 2000; // 2 seconds

  const startWalk = (targetZ: number) => {
    if (!isWalking) {
      isWalking = true;
      walkStartZ = group.position.z;
      walkTargetZ = targetZ;
      walkStartTime = Date.now();
    }
  };

  const updateWalk = () => {
    if (isWalking) {
      const elapsed = Date.now() - walkStartTime;
      const progress = Math.min(elapsed / walkDuration, 1);
      group.position.z = walkStartZ + (walkTargetZ - walkStartZ) * progress;

      // Simple leg swing
      const legSwing = Math.sin(progress * Math.PI * 4) * 0.2;
      leftLeg.rotation.x = legSwing;
      rightLeg.rotation.x = -legSwing;

      if (progress >= 1) {
        isWalking = false;
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
      }
    }
  };

  (group as any).updateIdle = updateIdle;
  (group as any).startWalk = startWalk;
  (group as any).updateWalk = updateWalk;

  return group;
};
import { THREE } from 'expo-three';

export const createDoorUnlockEffect = (scene: THREE.Scene, doorPosition: THREE.Vector3): THREE.Group => {
  const group = new THREE.Group();
  group.position.copy(doorPosition);

  // White flash light
  const flashLight = new THREE.PointLight(0xffffff, 0, 10);
  flashLight.position.set(0, 2, 1);
  group.add(flashLight);

  // Golden light beam
  const beamGeometry = new THREE.CylinderGeometry(0, 2.8, 5, 24);
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.set(0, 2.5, -2.5);
  beam.rotation.z = Math.PI / 2;
  group.add(beam);

  // Keyhole sparks
  const sparkGeometry = new THREE.BufferGeometry();
  const sparkPositions = [];
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.5;
    sparkPositions.push(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      Math.random() * 0.2
    );
  }
  sparkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sparkPositions, 3));
  const sparkMaterial = new THREE.PointsMaterial({ color: 0xffd700, size: 0.05 });
  const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
  sparks.position.set(0, 2, 0.11);
  group.add(sparks);

  // Hinge dust
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = [];
  for (let i = 0; i < 60; i++) {
    dustPositions.push(
      (Math.random() - 0.5) * 0.5,
      Math.random() * 0.5,
      (Math.random() - 0.5) * 0.5
    );
  }
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.02 });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.position.set(-0.1, 2, 0);
  group.add(dust);

  // Animation state
  let isActive = false;
  let startTime = 0;
  let doorVelocity = 0;
  let doorRotation = 0;
  const doorTargetRotation = -Math.PI / 2;

  const start = () => {
    isActive = true;
    startTime = Date.now();
    flashLight.intensity = 8;
    beamMaterial.opacity = 0.18;
  };

  const update = (deltaTime: number) => {
    if (!isActive) return;

    const elapsed = Date.now() - startTime;

    // Flash light decay
    if (elapsed < 200) {
      flashLight.intensity = 8 * (1 - elapsed / 200);
    } else {
      flashLight.intensity = 0;
    }

    // Door swing spring physics
    if (elapsed > 0) {
      const force = (doorTargetRotation - doorRotation) * 0.12;
      doorVelocity += force;
      doorVelocity *= 0.82;
      doorRotation += doorVelocity * deltaTime * 60; // Assuming 60fps
      // Apply to door (this would be set on the actual door mesh)
    }

    // Beam fades after 1s
    if (elapsed > 1000) {
      beamMaterial.opacity = Math.max(0, 0.18 - (elapsed - 1000) / 1000);
    }

    // Sparks fade after 500ms
    if (elapsed > 500) {
      sparkMaterial.opacity = Math.max(0, 1 - (elapsed - 500) / 500);
    }

    // Dust falls
    if (elapsed > 80) {
      const dustPositionsAttr = dustGeometry.attributes.position.array as Float32Array;
      for (let i = 1; i < dustPositionsAttr.length; i += 3) {
        dustPositionsAttr[i] -= 0.01; // Fall down
      }
      dustGeometry.attributes.position.needsUpdate = true;
      dustMaterial.opacity = Math.max(0, 1 - elapsed / 1000);
    }

    // End after 2s
    if (elapsed > 2000) {
      isActive = false;
      group.visible = false;
    }
  };

  // Expose methods
  (group as any).start = start;
  (group as any).update = update;
  (group as any).getDoorRotation = () => doorRotation;

  return group;
};
import { THREE } from 'expo-three';

export const createMagicCircle = (): THREE.Group => {
  const group = new THREE.Group();
  group.position.set(0, 12, 5); // Above wizard

  // Concentric rings
  const innerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.6, 32),
    new THREE.MeshBasicMaterial({ color: 0x818cf8, side: THREE.DoubleSide })
  );
  group.add(innerRing);

  const middleRing = new THREE.Mesh(
    new THREE.RingGeometry(0.7, 0.8, 32),
    new THREE.MeshBasicMaterial({ color: 0x4f46e5, side: THREE.DoubleSide })
  );
  group.add(middleRing);

  const outerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.9, 1.0, 32),
    new THREE.MeshBasicMaterial({ color: 0x3730a3, side: THREE.DoubleSide })
  );
  group.add(outerRing);

  // Rune sprites (8 runes radially)
  const runeMaterial = new THREE.MeshBasicMaterial({ color: 0xc084fc });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const x = Math.cos(angle) * 0.75;
    const z = Math.sin(angle) * 0.75;
    const rune = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), runeMaterial);
    rune.position.set(x, 0, z);
    rune.rotation.x = -Math.PI / 2; // Face up
    group.add(rune);
  }

  // Spell-dust points
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = [];
  for (let i = 0; i < 200; i++) {
    const radius = Math.random() * 1.5 + 0.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    dustPositions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  }
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  group.add(dust);

  // Animation state
  let scale = 0;
  let isVisible = false;
  let exitStart = 0;

  const show = () => {
    isVisible = true;
    scale = 0;
  };

  const hide = () => {
    exitStart = Date.now();
  };

  const update = () => {
    if (isVisible) {
      if (scale < 1) {
        scale += 0.016 / 0.6; // Over 600ms
        if (scale > 1) scale = 1;
      } else {
        // Rotate rings
        const time = Date.now() * 0.001;
        innerRing.rotation.y = time * 2;
        middleRing.rotation.y = -time * 1.5;
        outerRing.rotation.y = time * 1;

        // Orbit dust
        dust.rotation.y += 0.01;
      }
    } else if (exitStart > 0) {
      const elapsed = Date.now() - exitStart;
      scale = Math.max(0, 1 - elapsed / 400);
      if (scale === 0) {
        exitStart = 0;
      }
    }

    group.scale.setScalar(scale);
  };

  (group as any).show = show;
  (group as any).hide = hide;
  (group as any).update = update;

  return group;
};
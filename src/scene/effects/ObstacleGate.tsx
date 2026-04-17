import { THREE } from 'expo-three';

export const createObstacleGate = (scene: THREE.Scene): THREE.Group => {
  const group = new THREE.Group();
  group.position.set(0, 6, 12); // Above avatar

  const material = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c,
    metalness: 0.95,
    roughness: 0.1,
  });

  // 8 vertical bars
  for (let i = 0; i < 8; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4, 0.1), material);
    bar.position.set(-1.75 + i * 0.5, -2, 0);
    group.add(bar);
  }

  // 3 horizontal bars
  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 0.1), material);
    bar.position.set(0, -3.5 + i * 1.5, 0);
    group.add(bar);
  }

  // Impact dust
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = [];
  for (let i = 0; i < 80; i++) {
    dustPositions.push(
      (Math.random() - 0.5) * 4,
      Math.random() * 0.5,
      (Math.random() - 0.5) * 0.5
    );
  }
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({ color: 0x666666, size: 0.05 });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.visible = false;
  group.add(dust);

  // Red flash light
  const flashLight = new THREE.PointLight(0xff0000, 0, 10);
  flashLight.position.set(0, 1.5, 12);
  scene.add(flashLight);

  // Animation state
  let isDropping = false;
  let velocity = 0;
  let position = 6;
  let startTime = 0;
  let dustVisible = false;

  const startDrop = () => {
    isDropping = true;
    startTime = Date.now();
    flashLight.intensity = 6;
  };

  const update = (deltaTime: number) => {
    if (isDropping) {
      const elapsed = Date.now() - startTime;

      // Drop physics
      velocity += 0.018;
      position -= velocity * deltaTime * 60;
      group.position.y = Math.max(position, 0);

      // Bounce on floor
      if (position <= 0 && velocity > 0) {
        velocity *= -0.28; // Restitution
        if (Math.abs(velocity) < 0.01) {
          velocity = 0;
          isDropping = false;
        }
      }

      // Impact dust at 480ms
      if (elapsed > 480 && !dustVisible) {
        dustVisible = true;
        dust.visible = true;
        dust.position.y = 0.1;
      }

      // Dust fade
      if (dustVisible) {
        dustMaterial.opacity = Math.max(0, 1 - (elapsed - 480) / 800);
      }

      // Flash light decay
      flashLight.intensity *= 0.8;

      // Torch dim at 600ms
      if (elapsed > 600) {
        // This would affect all torches, but for now, placeholder
      }
    }
  };

  (group as any).startDrop = startDrop;
  (group as any).update = update;

  return group;
};
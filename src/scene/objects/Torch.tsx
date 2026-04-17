import { THREE } from 'expo-three';

export const createTorch = (position: THREE.Vector3): THREE.Group => {
  const group = new THREE.Group();
  group.position.copy(position);

  // Bracket
  const bracketMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), bracketMaterial);
  bracket.position.set(0, 0, 0);
  group.add(bracket);

  // Outer flame
  const outerFlameGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
  const outerFlameMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.7 });
  const outerFlame = new THREE.Mesh(outerFlameGeometry, outerFlameMaterial);
  outerFlame.position.set(0, 0.25, 0);
  group.add(outerFlame);

  // Inner flame
  const innerFlameGeometry = new THREE.ConeGeometry(0.05, 0.3, 6);
  const innerFlameMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
  innerFlame.position.set(0, 0.15, 0);
  group.add(innerFlame);

  // Point light
  const light = new THREE.PointLight(0xffaa00, 1, 10);
  light.position.set(0, 0.3, 0);
  group.add(light);

  // Animation
  const updateFlame = () => {
    const time = Date.now() * 0.01;
    const flicker = Math.sin(time) * 0.1 + 0.9;

    // Vertex displacement for outer flame
    const positions = outerFlameGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      positions[i] = x + Math.sin(time + y * 10) * 0.02;
      positions[i + 2] = z + Math.cos(time + y * 10) * 0.02;
    }
    outerFlameGeometry.attributes.position.needsUpdate = true;

    // Inner flame similar
    const innerPositions = innerFlameGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < innerPositions.length; i += 3) {
      const x = innerPositions[i];
      const y = innerPositions[i + 1];
      const z = innerPositions[i + 2];
      innerPositions[i] = x + Math.sin(time + y * 15) * 0.01;
      innerPositions[i + 2] = z + Math.cos(time + y * 15) * 0.01;
    }
    innerFlameGeometry.attributes.position.needsUpdate = true;

    // Light intensity
    light.intensity = flicker;
  };

  (group as any).updateFlame = updateFlame;

  return group;
};
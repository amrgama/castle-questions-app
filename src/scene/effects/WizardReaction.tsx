import { THREE } from 'expo-three';

export const createWizardReaction = (wizardGroup: THREE.Group): void => {
  // Assume wizard has arm geometry, e.g., a child named 'arm'
  const arm = wizardGroup.getObjectByName('arm') as THREE.Mesh;
  if (!arm) return;

  let isReacting = false;
  let startTime = 0;

  const startReaction = () => {
    isReacting = true;
    startTime = Date.now();
  };

  const update = () => {
    if (!isReacting) return;

    const elapsed = Date.now() - startTime;

    if (elapsed < 300) {
      // Rotate arm
      const progress = elapsed / 300;
      arm.rotation.z = progress * (Math.PI / 4);
    } else if (elapsed < 800) {
      // Hold
      arm.rotation.z = Math.PI / 4;
    } else if (elapsed < 1100) {
      // Return
      const progress = (elapsed - 800) / 300;
      arm.rotation.z = (Math.PI / 4) * (1 - progress);
    } else {
      arm.rotation.z = 0;
      isReacting = false;
    }
  };

  // Expose on wizardGroup
  (wizardGroup as any).startReaction = startReaction;
  (wizardGroup as any).updateReaction = update;
};
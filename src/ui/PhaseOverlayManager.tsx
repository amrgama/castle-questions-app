import React from 'react';
import { View } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import WizardDialog from './WizardDialog';
import QuestionPanel from './QuestionPanel';
import FeedbackOverlay from './FeedbackOverlay';
import RetryOverlay from './RetryOverlay';

const PhaseOverlayManager: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const currentStep = useGameStore((state) => state.currentStep);
  const setPhase = useGameStore((state) => state.setPhase);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleWizardDismiss = () => {
    setPhase('question');
  };

  const handleFeedbackComplete = () => {
    // For wrong answers, show retry
    setPhase('retry'); // Assuming we add 'retry' phase
  };

  const handleTryAgain = () => {
    setPhase('question');
  };

  const handleSkip = () => {
    // Skip logic, e.g., lose 5 points, advance
    // For now, just advance
    setPhase('wizard');
  };

  if (phase === 'wizard') {
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <WizardDialog
          wizardLine="Welcome to the castle! Answer my questions to proceed."
          onDismiss={handleWizardDismiss}
          questionNumber={currentStep + 1}
        />
      </View>
    );
  }

  if (phase === 'question') {
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <QuestionPanel />
      </View>
    );
  }

  if (phase === 'feedback') {
    return (
      <FeedbackOverlay type="wrong" onComplete={handleFeedbackComplete} />
    );
  }

  if (phase === 'retry') {
    return (
      <RetryOverlay onTryAgain={handleTryAgain} onSkip={handleSkip} />
    );
  }

  return null;
};

export default PhaseOverlayManager;
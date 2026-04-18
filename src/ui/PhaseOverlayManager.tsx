import React from 'react';
import { View } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { questions } from '@/data/questions';
import WizardDialog from './WizardDialog';
import QuestionPanel from './QuestionPanel';
import FeedbackOverlay from './FeedbackOverlay';
import RetryOverlay from './RetryOverlay';

const PhaseOverlayManager: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const currentStep = useGameStore((state) => state.currentStep);
  const setPhase = useGameStore((state) => state.setPhase);
  const tryAgain = useGameStore((state) => state.tryAgain);
  const skipQuestion = useGameStore((state) => state.skipQuestion);

  const handleWizardDismiss = () => {
    setPhase('question');
  };

  const handleFeedbackComplete = () => {
    setPhase('retry');
  };

  if (phase === 'wizard') {
    const question = questions[currentStep];
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <WizardDialog
          wizardLine={question?.wizardLine || 'Answer my question!'}
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
      <RetryOverlay onTryAgain={tryAgain} onSkip={skipQuestion} />
    );
  }

  return null;
};

export default PhaseOverlayManager;
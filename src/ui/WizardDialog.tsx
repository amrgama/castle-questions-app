import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

const { height: screenHeight } = Dimensions.get('window');

interface WizardDialogProps {
  wizardLine: string;
  onDismiss: () => void;
  questionNumber: number;
}

const WizardDialog: React.FC<WizardDialogProps> = ({ wizardLine, onDismiss, questionNumber }) => {
  const [displayedText, setDisplayedText] = useState('');
  const slideAnim = useRef(new Animated.Value(screenHeight * 0.42)).current;

  useEffect(() => {
    // Entry animation
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    // Typewriter effect
    let index = 0;
    const interval = setInterval(() => {
      if (index < wizardLine.length) {
        setDisplayedText(wizardLine.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [wizardLine, slideAnim]);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Exit animation
    Animated.timing(slideAnim, {
      toValue: screenHeight * 0.42,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🧙</Text>
        </View>
        <Text style={styles.wizardName}>The Wizard</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Q {questionNumber}/5</Text>
        </View>
      </View>
      <View style={styles.speechContainer}>
        <Text style={styles.speechText}>{displayedText}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.42,
    backgroundColor: 'rgba(8,4,20,0.92)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#c084fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  wizardName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  badge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  speechContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  speechText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#ffd700',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default WizardDialog;
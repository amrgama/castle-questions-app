import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '@/data/questions';

interface RiddleProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const Riddle: React.FC<RiddleProps> = ({ question, onAnswer }) => {
  const [input, setInput] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [focused, setFocused] = useState(false);

  const correctAnswer = question.correctAnswer || '';
  const hint = question.hint || '';

  const getHintText = () => {
    if (hintLevel === 0) return '_ '.repeat(correctAnswer.length).trim();
    const revealed = hint.slice(0, hintLevel);
    const remaining = '_ '.repeat(Math.max(0, correctAnswer.length - hintLevel)).trim();
    return (revealed + ' ' + remaining).trim();
  };

  const handleRevealHint = () => {
    if (hintLevel < hint.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const handleSubmit = () => {
    onAnswer(input.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <TextInput
        style={[styles.input, focused && styles.focused]}
        value={input}
        onChangeText={setInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Enter your answer..."
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.hint}>{getHintText()}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.hintButton]}
          onPress={handleRevealHint}
          disabled={hintLevel >= hint.length}
        >
          <Text style={styles.buttonText}>Reveal Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  prompt: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  focused: {
    borderColor: '#ffd700',
  },
  hint: {
    fontSize: 16,
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  hintButton: {
    backgroundColor: '#555',
  },
  submitButton: {
    backgroundColor: '#ffd700',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Riddle;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Question, QuestionType } from '@/data/questions';

interface QuestionEditorProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [type, setType] = useState<QuestionType>(question?.type || 'multiple_choice');
  const [prompt, setPrompt] = useState(question?.prompt || '');
  const [options, setOptions] = useState<string[]>(question?.options || []);
  const [words, setWords] = useState<string[]>(question?.words || []);
  const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || '');
  const [timeLimit, setTimeLimit] = useState(question?.timeLimit?.toString() || '');
  const [wizardLine, setWizardLine] = useState(question?.wizardLine || '');
  const [hint, setHint] = useState(question?.hint || '');

  const handleSave = () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Question prompt is required');
      return;
    }

    let newQuestion: Question;

    switch (type) {
      case 'multiple_choice':
        if (options.length < 2 || !correctAnswer) {
          Alert.alert('Error', 'Multiple choice needs at least 2 options and a correct answer');
          return;
        }
        newQuestion = {
          id: question?.id || Date.now().toString(),
          type,
          prompt: prompt.trim(),
          options,
          correctAnswer,
          wizardLine: wizardLine.trim() || 'Choose wisely.',
          hint: hint.trim() || undefined,
        };
        break;

      case 'true_false':
        if (!correctAnswer || !['true', 'false'].includes(correctAnswer.toLowerCase())) {
          Alert.alert('Error', 'True/False answer must be "true" or "false"');
          return;
        }
        newQuestion = {
          id: question?.id || Date.now().toString(),
          type,
          prompt: prompt.trim(),
          correctAnswer: correctAnswer.toLowerCase(),
          wizardLine: wizardLine.trim() || 'Truth or falsehood, decide!',
          hint: hint.trim() || undefined,
        };
        break;

      case 'reorder':
        if (words.length < 2) {
          Alert.alert('Error', 'Reorder needs at least 2 words');
          return;
        }
        newQuestion = {
          id: question?.id || Date.now().toString(),
          type,
          prompt: prompt.trim(),
          words,
          correctAnswer: words.join(' '),
          wizardLine: wizardLine.trim() || 'Arrange them properly!',
          hint: hint.trim() || undefined,
        };
        break;

      case 'riddle':
        if (!correctAnswer) {
          Alert.alert('Error', 'Riddle needs a correct answer');
          return;
        }
        newQuestion = {
          id: question?.id || Date.now().toString(),
          type,
          prompt: prompt.trim(),
          correctAnswer,
          wizardLine: wizardLine.trim() || 'Solve the riddle!',
          hint: hint.trim() || undefined,
        };
        break;

      case 'timed':
        if (!timeLimit || !correctAnswer) {
          Alert.alert('Error', 'Timed question needs time limit and answer');
          return;
        }
        newQuestion = {
          id: question?.id || Date.now().toString(),
          type,
          prompt: prompt.trim(),
          correctAnswer,
          timeLimit: parseInt(timeLimit),
          wizardLine: wizardLine.trim() || 'Answer quickly!',
          hint: hint.trim() || undefined,
        };
        break;
    }

    onSave(newQuestion);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{question ? 'Edit Question' : 'Add Question'}</Text>

        <Text style={styles.label}>Type:</Text>
        <View style={styles.typeButtons}>
          {(['multiple_choice', 'true_false', 'reorder', 'riddle', 'timed'] as QuestionType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
                {t.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Prompt:</Text>
        <TextInput
          style={styles.textInput}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Enter question prompt"
          multiline
        />

        {type === 'multiple_choice' && (
          <>
            <Text style={styles.label}>Options:</Text>
            {options.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  style={styles.optionInput}
                  value={option}
                  onChangeText={(value) => updateOption(index, value)}
                  placeholder={`Option ${index + 1}`}
                />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeOption(index)}>
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addOption}>
              <Text style={styles.addButtonText}>+ Add Option</Text>
            </TouchableOpacity>
          </>
        )}

        {type === 'reorder' && (
          <>
            <Text style={styles.label}>Words (comma-separated):</Text>
            <TextInput
              style={styles.textInput}
              value={words.join(', ')}
              onChangeText={(value) => setWords(value.split(',').map(w => w.trim()).filter(w => w))}
              placeholder="Enter words separated by commas"
              multiline
            />
          </>
        )}

        <Text style={styles.label}>
          Correct Answer:
          {type === 'true_false' && ' (true or false)'}
          {type === 'reorder' && ' (will be set to word order)'}
        </Text>
        <TextInput
          style={styles.textInput}
          value={correctAnswer}
          onChangeText={setCorrectAnswer}
          placeholder="Enter correct answer"
          editable={type !== 'reorder'}
        />

        {type === 'timed' && (
          <>
            <Text style={styles.label}>Time Limit (seconds):</Text>
            <TextInput
              style={styles.textInput}
              value={timeLimit}
              onChangeText={setTimeLimit}
              placeholder="30"
              keyboardType="numeric"
            />
          </>
        )}

        <Text style={styles.label}>Wizard Line:</Text>
        <TextInput
          style={styles.textInput}
          value={wizardLine}
          onChangeText={setWizardLine}
          placeholder="Enter wizard's line"
        />

        <Text style={styles.label}>Hint (optional):</Text>
        <TextInput
          style={styles.textInput}
          value={hint}
          onChangeText={setHint}
          placeholder="Enter hint"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  typeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 5,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: 'white',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 40,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
    padding: 10,
  },
  removeButtonText: {
    fontSize: 18,
    color: 'red',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QuestionEditor;
import React from 'react';
import { View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Teacher'>;

const TeacherScreen: React.FC<Props> = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>TeacherScreen</Text>
    </View>
  );
};

export default TeacherScreen;
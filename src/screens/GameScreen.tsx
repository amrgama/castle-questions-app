import React from 'react';
import { View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Game'>;

const GameScreen: React.FC<Props> = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>GameScreen</Text>
    </View>
  );
};

export default GameScreen;
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import GateScene from '@/scene/GateScene';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const { height } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleEnterCastle = () => {
    // TODO: Play door creak sound
    navigation.navigate('Game');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ height: height * 0.7 }}>
        <GateScene style={{ flex: 1 }} />
      </View>
      <View style={{ height: height * 0.3, backgroundColor: 'rgba(8,4,20,0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold', marginBottom: 10 }}>CASTLE ESCAPE</Text>
        <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 30 }}>
          Answer questions to unlock the doors and escape the castle!
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#ffd700', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10 }}
          onPress={handleEnterCastle}
        >
          <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Enter the Castle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
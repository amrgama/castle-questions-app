import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '@/screens/HomeScreen';
import GameScreen from '@/screens/GameScreen';
import VictoryScreen from '@/screens/VictoryScreen';
import GameOverScreen from '@/screens/GameOverScreen';
import TeacherScreen from '@/screens/TeacherScreen';

export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  Victory: undefined;
  GameOver: undefined;
  Teacher: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export type AppNavigationProp = StackNavigationProp<RootStackParamList>;

export const useAppNavigation = () => useNavigation<AppNavigationProp>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          // Default transition
        }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          // Custom slide from right
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      />
      <Stack.Screen
        name="Victory"
        component={VictoryScreen}
        options={{
          // Fade transition
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen
        name="GameOver"
        component={GameOverScreen}
        options={{
          // Fade transition
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen
        name="Teacher"
        component={TeacherScreen}
        options={{
          // Default transition
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
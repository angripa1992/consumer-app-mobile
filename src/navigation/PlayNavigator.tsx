import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import MatchMakerScreen from '@/screens/Play/MatchMaker';
import PlayScreen from '@/screens/Play/PlayScreen';
import PlayNowScreen from '@/screens/Play/PlayNow';
import SelectCityScreen from '@/screens/Play/SelectCity';
import HoldOnScreen from '@/screens/Play/Loading';
import QueuePlayScreen from '@/screens/Play/Queue';


const Stack = createStackNavigator();

const PlayNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlayScreen"
        component={PlayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchMakerScreen"
        component={MatchMakerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlayNowScreen"
        component={PlayNowScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectCityScreen"
        component={SelectCityScreen}
        options={{ headerShown: false }}
     />
     <Stack.Screen
        name="HoldOnScreen"
        component={HoldOnScreen}
        options={{ headerShown: false }}
     />
     <Stack.Screen
        name="QueuePlayScreen"
        component={QueuePlayScreen}
        options={{ headerShown: false }}
     />

    </Stack.Navigator>
  );
};

export default PlayNavigator;

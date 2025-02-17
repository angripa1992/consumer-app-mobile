import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import MatchMakerScreen from '@/screens/Play/MatchMaker/MatchMaker';
import PlayScreen from '@/screens/Play/PlayScreen';
import PlayNowScreen from '@/screens/Play/MatchMaker/PlayNow';
import SelectCityScreen from '@/screens/Play/MatchMaker/SelectCity';
import HoldOnScreen from '@/screens/Play/MatchMaker/Loading';
import QueuePlayScreen from '@/screens/Play/MatchMaker/Queue';
import MatchScreen from '@/screens/Play/MatchMaker/Match';
import CollabListScreen from '@/screens/Play/MatchMaker/CollabList';
import PlayAgainScreen from '@/screens/Play/MatchMaker/PlayAgain';
import InviteFriendsScreen from '@/screens/Play/MatchMaker/InviteFriends';


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
     <Stack.Screen
        name="Match"
        component={MatchScreen}
        options={{ headerShown: false }}
     />
     <Stack.Screen
        name="CollabList"
        component={CollabListScreen}
        options={{ headerShown: false }}
     />
     <Stack.Screen
        name="PlayAgain"
        component={PlayAgainScreen}
        options={{ headerShown: false }}
     />
     <Stack.Screen
        name="InviteFriends"
        component={InviteFriendsScreen}
        options={{ headerShown: false }}
     />

    </Stack.Navigator>
  );
};

export default PlayNavigator;

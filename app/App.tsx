import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {io} from 'socket.io-client';
import {createStackNavigator} from '@react-navigation/stack';
import {ChatRoomListScreen} from './ChatRoomList.tsx';
import {ChatRoomDetailScreen} from './ChatRoomDetail.tsx';

const Stack = createStackNavigator();

console.disableYellowBox = true;

export const socket = io('ws://localhost:3000');

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ChatRoomList" component={ChatRoomListScreen} />
        <Stack.Screen name="ChatRoomDetail" component={ChatRoomDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ShuffleScreen } from '../components/ShuffleScreen';
import { ShuffleStackParamList } from './navigationTypes';

const Stack = createStackNavigator<ShuffleStackParamList>();

export const ShuffleStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="ShuffleScreen"
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen component={ShuffleScreen} name="ShuffleScreen" />
    </Stack.Navigator>
);

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ShareWorkoutScreen } from '../components/ShareWorkoutScreen';
import { TabataTimerScreen } from '../components/TabataTimerScreen';
import { ShuffleScreen } from '../components/ShuffleScreen';
import { ShuffleStackParamList } from './navigationTypes';
import { LoadWorkoutScreen } from '../components/LoadWorkoutScreen';

const Stack = createStackNavigator<ShuffleStackParamList>();

export const ShuffleStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="ShuffleScreen"
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen component={ShuffleScreen} name="ShuffleScreen" />
        <Stack.Screen component={TabataTimerScreen} name="TabataTimer" />
        <Stack.Screen component={ShareWorkoutScreen} name="ShareWorkoutScreen" />
        <Stack.Screen component={LoadWorkoutScreen} name="LoadWorkoutScreen" />
    </Stack.Navigator>
);

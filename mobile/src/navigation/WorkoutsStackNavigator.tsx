import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WorkoutsStackParamList } from './navigationTypes';
import { BuildWorkoutScreen } from '../components/BuildWorkoutScreen';
import { SelectExerciseScreen } from '../components/SelectExerciseScreen';
import { WorkoutsScreen } from '../components/WorkoutsScreen';
import { TabataTimerScreen } from '../components/TabataTimerScreen';
import { ShareWorkoutScreen } from '../components/ShareWorkoutScreen';
import { ViewWorkoutScreen } from '../components/ViewWorkoutScreen';
import { LoadWorkoutScreen } from '../components/LoadWorkoutScreen';
import { DiscoverWorkoutsScreen } from '../components/DiscoverWorkoutsScreen';

const Stack = createStackNavigator<WorkoutsStackParamList>();

export const WorkoutsStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="WorkoutsScreen"
        // screenOptions={{ headerShown: false }}
    >
        <Stack.Screen component={WorkoutsScreen} name="WorkoutsScreen" />
        <Stack.Screen component={BuildWorkoutScreen} name="BuildWorkoutScreen" />
        <Stack.Screen component={SelectExerciseScreen} name="SelectExerciseScreen" />
        <Stack.Screen component={TabataTimerScreen} name="TabataTimerScreen" />
        <Stack.Screen component={ShareWorkoutScreen} name="ShareWorkoutScreen" />
        <Stack.Screen component={ViewWorkoutScreen} name="ViewWorkoutScreen" />
        <Stack.Screen component={LoadWorkoutScreen} name="LoadWorkoutScreen" />
        <Stack.Screen component={DiscoverWorkoutsScreen} name="DiscoverWorkoutsScreen" />
    </Stack.Navigator>
);

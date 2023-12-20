import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WorkoutsStackParamList } from './navigationTypes';
import { BuildTabataScreen } from '../components/BuildWorkoutScreen';
import { SelectExerciseScreen } from '../components/SelectExerciseScreen';
import { LoadWorkoutScreen } from '../components/LoadWorkoutScreen';

const Stack = createStackNavigator<WorkoutsStackParamList>();

export const WorkoutsStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="LoadWorkoutScreen"
        // screenOptions={{ headerShown: false }}
    >
        <Stack.Screen component={LoadWorkoutScreen} name="LoadWorkoutScreen" />
        <Stack.Screen component={BuildTabataScreen} name="BuildWorkoutScreen" />
        <Stack.Screen component={SelectExerciseScreen} name="SelectExerciseScreen" />
    </Stack.Navigator>
);

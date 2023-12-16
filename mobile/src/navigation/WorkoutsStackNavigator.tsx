import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WorkoutsStackParamList } from './navigationTypes';
import { BuildTabataScreen } from '../components/BuildWorkoutScreen';
import { SelectExerciseScreen } from '../components/SelectExerciseScreen';

const Stack = createStackNavigator<WorkoutsStackParamList>();

export const WorkoutsStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="BuildWorkoutScreen"
        // screenOptions={{ headerShown: false }}
    >
        <Stack.Screen component={BuildTabataScreen} name="BuildWorkoutScreen" />
        <Stack.Screen component={SelectExerciseScreen} name="SelectExerciseScreen" />
    </Stack.Navigator>
);

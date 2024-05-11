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
import { PremadeWorkoutsScreen } from '../components/PremadeWorkoutsScreen';

const Stack = createStackNavigator<WorkoutsStackParamList>();

export const WorkoutsStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="WorkoutsScreen"
        screenOptions={{
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTintColor: 'white',
        }}
    >
        <Stack.Screen
            component={WorkoutsScreen}
            name="WorkoutsScreen"
            options={{
                headerTitle: 'Workouts',
            }}
        />
        <Stack.Screen
            component={BuildWorkoutScreen}
            name="BuildWorkoutScreen"
            options={{
                headerTitle: 'Build Workout',
            }}
        />
        <Stack.Screen
            component={SelectExerciseScreen}
            name="SelectExerciseScreen"
            options={{
                headerTitle: 'Select Exercise',
            }}
        />
        <Stack.Screen
            component={TabataTimerScreen}
            name="TabataTimerScreen"
            options={{
                headerTitle: 'Tabata Timer',
            }}
        />
        <Stack.Screen
            component={ShareWorkoutScreen}
            name="ShareWorkoutScreen"
            options={{
                headerTitle: 'Share Workout',
            }}
        />
        <Stack.Screen
            component={ViewWorkoutScreen}
            name="ViewWorkoutScreen"
            options={{
                headerTitle: 'View Workout',
            }}
        />
        <Stack.Screen
            component={LoadWorkoutScreen}
            name="LoadWorkoutScreen"
            options={{
                headerTitle: 'Load Workout',
            }}
        />
        <Stack.Screen
            component={DiscoverWorkoutsScreen}
            name="DiscoverWorkoutsScreen"
            options={{
                headerTitle: 'Discover Workouts',
            }}
        />
        <Stack.Screen
            component={PremadeWorkoutsScreen}
            name="PremadeWorkoutsScreen"
            options={{
                headerTitle: 'TabaFit Workouts',
            }}
        />
    </Stack.Navigator>
);

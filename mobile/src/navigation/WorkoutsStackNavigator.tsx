import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'native-base';
import { WorkoutsStackParamList } from './navigationTypes';
import { BuildWorkoutScreen } from '../components/BuildWorkoutScreen';
import { SelectExerciseScreen } from '../components/SelectExerciseScreen';
import { WorkoutsScreen } from '../components/WorkoutsScreen';
import { TabataTimerScreen } from '../components/TabataTimerScreen';
import { ShareWorkoutScreen } from '../components/ShareWorkoutScreen';
import { ViewWorkoutScreen } from '../components/ViewWorkoutScreen';
import { SavedWorkoutsScreen } from '../components/SavedWorkoutsScreen';
import { DiscoverWorkoutsScreen } from '../components/DiscoverWorkoutsScreen';
import { PremadeWorkoutsScreen } from '../components/PremadeWorkoutsScreen';
import { ShuffleWorkoutScreen } from '../components/ShuffleWorkoutScreen';
import { MyCreatedWorkoutsScreen } from '../components/MyCreatedWorkoutsScreen';

const Stack = createStackNavigator<WorkoutsStackParamList>();

export const WorkoutsStackNavigator = (): JSX.Element => {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="WorkoutsScreen"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.gray[800],
                },
                // eslint-disable-next-line
                headerTintColor: "white",
                headerTitleStyle: { color: 'white' },
                headerShadowVisible: false,
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
                    headerBackTitle: 'Back',
                    headerTitle: 'Build Workout',
                }}
            />
            <Stack.Screen
                component={ShuffleWorkoutScreen}
                name="ShuffleWorkoutScreen"
                options={{
                    headerTitle: 'Shuffle Workout',
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
                    headerShown: false,
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
                    headerTitle: 'Details',
                }}
            />
            <Stack.Screen
                component={SavedWorkoutsScreen}
                name="SavedWorkoutsScreen"
                options={{
                    headerTitle: 'Saved Workouts',
                }}
            />
            <Stack.Screen
                component={MyCreatedWorkoutsScreen}
                name="MyCreatedWorkoutsScreen"
                options={{
                    headerTitle: 'My Created Workouts',
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
};

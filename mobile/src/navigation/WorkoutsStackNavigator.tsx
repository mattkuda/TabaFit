import React from 'react';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import {
    Icon, IconButton, Menu, useTheme, Text,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
import { ManualWorkoutScreen } from '../components/ManualWorkoutScreen';
import { TabNavigatorParamList } from '../types/navigationTypes';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

const Stack = createStackNavigator<WorkoutsStackParamList>();
const ManualWorkoutButtonComponent = (): JSX.Element => {
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();

    return (
        <Menu
            backgroundColor="gray.900"
            shadow={2}
            // eslint-disable-next-line react/no-unstable-nested-components
            trigger={(triggerProps): JSX.Element => (
                <IconButton
                    {...triggerProps}
                    _icon={{
                        color: 'white',
                    }}
                    borderRadius="full"
                    icon={<Icon as={Ionicons} name="ellipsis-horizontal-outline" size="lg" />}
                />
            )}
        >
            <Menu.Item onPress={(): void => navigation.navigate('ManualWorkoutScreen')}>
                <Icon as={Ionicons} color="white" name="add-circle-outline" size="sm" />
                <Text color="white">Share Manual Workout</Text>
            </Menu.Item>
        </Menu>
    );
};

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
                // headerRight: ManualWorkoutButtonComponent,
            }}
        >
            <Stack.Screen
                component={WorkoutsScreen}
                name="WorkoutsScreen"
                options={{
                    headerTitle: 'Workouts',
                    headerRight: ManualWorkoutButtonComponent,
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
                    headerBackTitle: 'Back',
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
                    headerTitle: 'Workout Details',
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
                    headerTitle: 'My Workouts',
                }}
            />
            <Stack.Screen
                component={DiscoverWorkoutsScreen}
                name="DiscoverWorkoutsScreen"
                options={{
                    headerTitle: 'Community Workouts',
                }}
            />
            <Stack.Screen
                component={PremadeWorkoutsScreen}
                name="PremadeWorkoutsScreen"
                options={{
                    headerTitle: 'TabaFit Workouts',
                }}
            />
            <Stack.Screen
                component={ManualWorkoutScreen}
                name="ManualWorkoutScreen"
                options={{
                    headerTitle: 'Add Manual Workout',
                    headerBackTitle: 'Back',
                }}
            />
        </Stack.Navigator>
    );
};

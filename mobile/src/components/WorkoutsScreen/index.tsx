import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Button, ScrollView, Pressable, Text, Box, HStack,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const WorkoutsScreen = (): JSX.Element => {
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();
    const { data: mySavedWorkouts } = useQueryMySavedWorkouts();

    const handlePressQuickShuffle = (): void => {
        // TODO: Implement or navigate to Quick Shuffle functionality
        navigation.navigate('ShuffleScreen');
    };

    const handlePressBuildWorkout = (): void => {
        // TODO: Implement or navigate to Build Workout functionality
        navigation.navigate('BuildWorkoutScreen');
    };

    const handlePressViewMyWorkouts = (): void => {
        // TODO: Implement or navigate to View My Workouts functionality
    };

    const handlePressBrowseWorkouts = (): void => {
        // TODO: Implement or navigate to Browse Workouts functionality
    };

    return (
        <ScrollView>
            <VStack mt={4} px={5} space={4}>
                {/* Quick Shuffle Row */}
                <Pressable onPress={handlePressQuickShuffle}>
                    <Box>
                        <Text>Go to Quick Shuffle</Text>
                    </Box>
                </Pressable>

                {/* Build Workout Row */}
                <Pressable onPress={handlePressBuildWorkout}>
                    <Box>
                        <Text>Build a Workout</Text>
                    </Box>
                </Pressable>

                {/* Discover Workouts Header */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">Discover Workouts</Heading>
                    <Button onPress={handlePressBrowseWorkouts}>Browse all</Button>
                </HStack>

                {/* Example Discoverable Workouts */}
                <HStack space={2}>
                    <Pressable onPress={(): void => console.log('Navigate to Discoverable workout 1')}>
                        <Box><Text>Discoverable workout 1</Text></Box>
                    </Pressable>
                    <Pressable onPress={(): void => console.log('Navigate to Discoverable workout 2')}>
                        <Box><Text>Discoverable workout 2</Text></Box>
                    </Pressable>
                </HStack>

                {/* My Workouts Header */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">My Workouts</Heading>
                    <Button onPress={handlePressViewMyWorkouts}>View all</Button>
                </HStack>

                {/* Example Saved Workouts */}
                <HStack space={2}>
                    {mySavedWorkouts?.map((savedWorkout) => (
                        <Pressable onPress={(): void => console.log('Navigate to Saved workout 1')}>
                            <Box><Text>{savedWorkout.name}</Text></Box>
                        </Pressable>
                    ))}
                </HStack>
            </VStack>
        </ScrollView>
    );
};

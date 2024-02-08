import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Button, Pressable, Text, Box, HStack, Icon, IconButton,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { soundTestingWorkout } from '../shuffleUtil';
import { BuildWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabataWorkout } from '../../types/workouts';
import { RefreshableScrollView } from '../RefreshableScrollView';
import { HorizontalWorkoutCards } from '../HorizontalWorkoutCards';
import { useQueryWorkouts } from '../../hooks/useQueryWorkouts';
import { featuredWorkouts } from '../../util/featuredWorkouts';
import { formatTabatasCount } from '../../util/util';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const WorkoutsScreen = (): JSX.Element => {
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();
    const {
        data: mySavedWorkouts, refetch: refetchMySavedWorkouts,
        isLoading: isMySavedWorkoutsLoading,
    } = useQueryMySavedWorkouts({ limit: 5, offset: 0 });

    const {
        data: newWorkouts, refetch: refetchNewWorkouts,
        isLoading: isNewWorkoutsLoading,
    } = useQueryWorkouts({ limit: 5, offset: 0 });

    const [shuffledWorkout, setShuffledWorkout] = useState<TabataWorkout>(soundTestingWorkout);

    const handlePressQuickShuffle = (): void => {
        // First go to customizable settings screen (to-build)
        navigation.navigate('BuildWorkoutScreen', {
            customWorkout: shuffledWorkout,
            isShuffle: true,
            isSavedWorkout: false,
        } as BuildWorkoutScreenProps);
    };

    const handlePressBuildWorkout = (): void => {
        navigation.navigate('BuildWorkoutScreen', {
            isShuffle: false,
            isSavedWorkout: false,
        } as BuildWorkoutScreenProps);
    };

    const handlePressViewWorkout = (workout: TabataWorkout): void => {
        navigation.navigate('ViewWorkoutScreen', { workoutId: workout._id.toString() });
    };

    const handlePressViewMyWorkout = (workout: TabataWorkout): void => {
        navigation.navigate('ViewWorkoutScreen', {
            workoutId: workout._id.toString(),
            isInMyWorkouts: true,
        });
    };

    const handlePressViewMyWorkouts = (): void => {
        navigation.navigate('LoadWorkoutScreen');
    };

    const handlePressDiscoverWorkouts = (): void => {
        navigation.navigate('DiscoverWorkoutsScreen');
    };

    const refetchData = async (): Promise<void> => {
        refetchMySavedWorkouts();
        refetchNewWorkouts();
    };

    return (
        <RefreshableScrollView onRefresh={refetchData}>
            <VStack mt={4} px={5} space={4}>
                <Box
                    bg="orange.500" // Set the background to orange
                    p="12"
                    rounded="xl"
                >
                    <Heading color="warmGray.50" size="md" textAlign="center">Generate Workout</Heading>
                    <HStack alignItems="center" justifyContent="center" mt={4}>
                        <IconButton
                            icon={<Icon as={Ionicons} color="white" name="remove" />}
                            onPress={(): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                numberOfTabatas: prev.numberOfTabatas - 1,
                            }))}
                        />
                        <Text color="white" mx={2}>{formatTabatasCount(shuffledWorkout.numberOfTabatas)}</Text>
                        <IconButton
                            icon={<Icon as={Ionicons} color="white" name="add" />}
                            onPress={(): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                numberOfTabatas: prev.numberOfTabatas + 1,
                            }))}
                        />
                    </HStack>
                    <Button mt={4} onPress={handlePressQuickShuffle}>Create</Button>
                </Box>

                {/* Build Workout Row */}
                <Pressable onPress={handlePressBuildWorkout}>
                    <Box>
                        <Text>Build a Workout</Text>
                    </Box>
                </Pressable>

                {/* Discover Workouts */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">Discover Workouts</Heading>
                    <Button onPress={handlePressDiscoverWorkouts}>Browse all</Button>
                </HStack>
                <HorizontalWorkoutCards
                    isLoading={isNewWorkoutsLoading}
                    workouts={newWorkouts}
                    onPressWorkout={handlePressViewWorkout}
                />
                {/* My Workouts */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">My Workouts</Heading>
                    <Button onPress={handlePressViewMyWorkouts}>View all</Button>
                </HStack>
                <HorizontalWorkoutCards
                    isLoading={isMySavedWorkoutsLoading}
                    workouts={mySavedWorkouts}
                    onPressWorkout={handlePressViewMyWorkout}
                />

                {/* Abcountable Workouts */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">Abcountable Workouts</Heading>
                    <Button onPress={handlePressDiscoverWorkouts}>Browse all</Button>
                </HStack>
                <HorizontalWorkoutCards
                    isLoading={false}
                    workouts={featuredWorkouts}
                    onPressWorkout={handlePressViewWorkout}
                />
            </VStack>
        </RefreshableScrollView>
    );
};

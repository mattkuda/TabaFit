import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Button, Text, Box, HStack, Icon,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { soundTestingWorkout } from '../shuffleUtil';
import { BuildWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabataWorkout } from '../../types/workouts';
import { RefreshableScrollView } from '../RefreshableScrollView';
import { HorizontalWorkoutCards } from '../HorizontalWorkoutCards';
import { useQueryWorkouts } from '../../hooks/useQueryWorkouts';
import { featuredWorkouts } from '../../util/featuredWorkouts';

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

    const shuffledWorkout = soundTestingWorkout;

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
        <VStack backgroundColor="gray9" flex={1}>
            <RefreshableScrollView onRefresh={refetchData}>
                <VStack backgroundColor="gray9" flex={1} p={4} space={2}>
                    <TouchableOpacity onPress={handlePressQuickShuffle}>
                        {/* Build Workout Row */}
                        <Box
                            alignItems="center"
                            bg={{
                                linearGradient: {
                                    colors: ['orange.400', 'orange.600'],
                                    start: [0, 1],
                                    end: [1, 0],
                                },
                            }}
                            flexDirection="row"
                            justifyContent="space-between"
                            mb="2"
                            p="4"
                            rounded="xl"
                        >
                            <HStack flex={1}>
                                <VStack alignItems="flex-start">
                                    <HStack alignItems="center">
                                        <Icon as={Ionicons} color="white" mr={2} name="shuffle" size="xl" />
                                        <Heading color="warmGray.50" p={0} size="lg" textAlign="left">
                                            Quick Shuffle
                                        </Heading>
                                    </HStack>
                                    <Text color="warmGray.50" mt={2} textAlign="left">
                                        Quickly generate a workout with custom settings
                                    </Text>
                                </VStack>
                            </HStack>
                            <Icon as={Ionicons} color="white" mx="2" name="chevron-forward" size="xl" />
                        </Box>
                    </TouchableOpacity>
                    {/* Build Workout Row */}
                    <TouchableOpacity onPress={handlePressBuildWorkout}>
                        <Box
                            alignItems="center"
                            bg={{
                                linearGradient: {
                                    colors: ['blue.400', 'blue.600'],
                                    start: [0, 1],
                                    end: [1, 0],
                                },
                            }}
                            flexDirection="row"
                            justifyContent="space-between"
                            p="4"
                            rounded="xl"
                        >
                            <HStack flex={1}>
                                <VStack alignItems="flex-start">
                                    <HStack alignItems="center">
                                        <Icon as={Ionicons} color="white" mr={2} name="barbell-outline" size="xl" />
                                        <Heading color="warmGray.50" p={0} size="lg" textAlign="left">
                                            Build Workout
                                        </Heading>
                                    </HStack>
                                    <Text color="warmGray.50" mt={2} textAlign="left">
                                        Create a custom workout with your own settings. Complete now or save for later.
                                    </Text>
                                </VStack>
                            </HStack>
                            <Icon as={Ionicons} color="white" mx="2" name="chevron-forward" size="xl" />
                        </Box>
                    </TouchableOpacity>
                    {/* Discover Workouts */}
                    <HStack alignItems="center" justifyContent="space-between">
                        <Heading size="md">Discover Workouts</Heading>
                        <Button colorScheme="secondary" variant="ghost" onPress={handlePressDiscoverWorkouts}>View all</Button>
                    </HStack>
                    <HorizontalWorkoutCards
                        isLoading={isNewWorkoutsLoading}
                        workouts={newWorkouts ?? []}
                        onPressWorkout={handlePressViewWorkout}
                    />
                    {/* My Workouts */}
                    <HStack alignItems="center" justifyContent="space-between">
                        <Heading size="md">My Saved Workouts</Heading>
                        <Button colorScheme="secondary" variant="ghost" onPress={handlePressViewMyWorkouts}>View all </Button>
                    </HStack>
                    <HorizontalWorkoutCards
                        isLoading={isMySavedWorkoutsLoading}
                        workouts={mySavedWorkouts ?? []}
                        onPressWorkout={handlePressViewMyWorkout}
                    />

                    {/* Abcountable Workouts */}
                    <HStack alignItems="center" justifyContent="space-between">
                        <Heading size="md">Abcountable Workouts</Heading>
                        <Button colorScheme="secondary" variant="ghost" onPress={handlePressDiscoverWorkouts}>View all</Button>
                    </HStack>
                    <HorizontalWorkoutCards
                        isLoading={false}
                        workouts={featuredWorkouts ?? []}
                        onPressWorkout={handlePressViewWorkout}
                    />
                </VStack>
            </RefreshableScrollView>
        </VStack>
    );
};

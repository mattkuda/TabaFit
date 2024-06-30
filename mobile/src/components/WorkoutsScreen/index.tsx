/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Button, Text, Box, HStack, Icon, Popover,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, TouchableOpacity } from 'react-native';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMyCreatedWorkouts, useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { shuffleWorkoutTemplate } from '../shuffleUtil';
import { BuildWorkoutScreenProps, ShuffleWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabataWorkout } from '../../types/workouts';
import { RefreshableScrollView } from '../RefreshableScrollView';
import { HorizontalWorkoutCards } from '../HorizontalWorkoutCards';
import { useQueryWorkouts } from '../../hooks/useQueryWorkouts';
import { tabaFitWorkouts } from '../../util/tabaFitWorkouts';
import { GradientVStack } from '../common/GradientVStack';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const WorkoutsScreen = (): JSX.Element => {
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();
    const {
        data: mySavedWorkouts, refetch: refetchMySavedWorkouts,
        isLoading: isMySavedWorkoutsLoading,
    } = useQueryMySavedWorkouts({ limit: 5, offset: 0 });
    const {
        data: myCreatedWorkouts, refetch: refetchMyCreatedWorkouts,
        isLoading: isMyCreatedWorkoutsLoading,
    } = useQueryMyCreatedWorkouts({ limit: 5, offset: 0 });

    const {
        data: newWorkouts, refetch: refetchNewWorkouts,
        isLoading: isNewWorkoutsLoading,
    } = useQueryWorkouts({ limit: 5, offset: 0 });

    const handlePressQuickShuffle = (): void => {
        // First go to customizable settings screen (to-build)
        navigation.navigate('ShuffleWorkoutScreen', {
            workout: shuffleWorkoutTemplate,
        } as ShuffleWorkoutScreenProps);
    };

    const handlePressBuildWorkout = (): void => {
        navigation.navigate('BuildWorkoutScreen', {
            isShuffle: false,
            isSavedWorkout: false,
        } as BuildWorkoutScreenProps);
    };

    const handlePressViewWorkout = (workout: TabataWorkout): void => {
        if (workout._id.toString().startsWith('tabafit')) {
            navigation.navigate('ViewWorkoutScreen', { workout });
        } else {
            navigation.navigate('ViewWorkoutScreen', { workoutId: workout._id.toString() });
        }
    };

    const handlePressViewMyWorkout = (workout: TabataWorkout): void => {
        navigation.navigate('ViewWorkoutScreen', {
            workoutId: workout._id.toString(),
            isInMyWorkouts: true,
        });
    };

    const handlePressViewMyCreatedWorkouts = (): void => {
        console.log('TODO: View my created workouts');
        navigation.navigate('LoadWorkoutScreen');
    };

    const handlePressViewMyWorkouts = (): void => {
        navigation.navigate('LoadWorkoutScreen');
    };

    const handlePressDiscoverWorkouts = (): void => {
        navigation.navigate('DiscoverWorkoutsScreen');
    };

    const handlePressTabaFitWorkouts = (): void => {
        navigation.navigate('PremadeWorkoutsScreen');
    };

    const refetchData = async (): Promise<void> => {
        refetchMySavedWorkouts();
        refetchNewWorkouts();
        refetchMyCreatedWorkouts();
    };

    return (
        <GradientVStack flex={1}>
            <RefreshableScrollView onRefresh={refetchData}>
                <VStack
                    backgroundColor="gray.900"
                    bg={{
                        linearGradient: {
                            colors: ['gray.800', 'gray.900'], // Adjust these colors for your preference
                            start: [0, 0], // Top left
                            end: [0, 1], // Bottom left (creates vertical gradient)
                        },
                    }}
                    flex={1}
                    p={4}
                    space={2}
                >
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                        onPress={handlePressQuickShuffle}
                    >
                        {/* Quick Shuffle Row */}
                        <Box
                            alignItems="center"
                            bg={{
                                linearGradient: {
                                    colors: ['flameCherry.900', 'cherry.600'],
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
                                        <Heading color="gray.50" p={0} size="lg" textAlign="left">
                                            Quick Shuffle
                                        </Heading>
                                    </HStack>
                                    <Text color="gray.50" mt={2} textAlign="left">
                                        Auto-generate your workout!
                                    </Text>
                                    <Text color="gray.50" textAlign="left">
                                        Choose your length, body focus, and more.
                                    </Text>
                                </VStack>
                            </HStack>
                            <Icon as={Ionicons} color="white" mx="2" name="chevron-forward" size="xl" />
                        </Box>
                    </TouchableOpacity>
                    {/* Build Workout Row */}
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                        onPress={handlePressBuildWorkout}
                    >
                        <Box
                            alignItems="center"
                            bg={{
                                linearGradient: {
                                    colors: ['flame.500', 'flameCherry.500'],
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
                                        <Heading p={0} size="lg" textAlign="left">
                                            Build Workout
                                        </Heading>
                                    </HStack>
                                    <Text color="gray.50" mt={2} textAlign="left">
                                        Create a custom workout with your own settings. Complete now or save for later.
                                    </Text>
                                </VStack>
                            </HStack>
                            <Icon as={Ionicons} color="white" mx="2" name="chevron-forward" size="xl" />
                        </Box>
                    </TouchableOpacity>
                    {/* Discover Workouts */}
                    <HStack alignItems="center" justifyContent="space-between">
                        <HStack alignItems="center" space={2}>
                            <Heading size="md">Discover Workouts</Heading>
                            <Popover
                                trigger={(triggerProps): JSX.Element => (
                                    <Pressable {...triggerProps}>
                                        <Icon as={Ionicons} color="gray.400" name="information-circle" />
                                    </Pressable>
                                )}
                            >
                                <Popover.Content>
                                    <Popover.Arrow bg="gray.900" />
                                    <Popover.Body bg="gray.900">
                                        <Text>
                                            Explore new workouts built by the community
                                        </Text>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </HStack>
                        <Button colorScheme="secondary" variant="ghost" onPress={handlePressDiscoverWorkouts}>View all</Button>
                    </HStack>
                    <HorizontalWorkoutCards
                        isLoading={isNewWorkoutsLoading}
                        workouts={newWorkouts ?? []}
                        onPressWorkout={handlePressViewWorkout}
                    />
                    {/* /* My Workouts */ }
                    <HStack alignItems="center" justifyContent="space-between">
                        <HStack alignItems="center" space={2}>
                            <Heading size="md">My Created Workouts</Heading>
                            <Popover
                                trigger={(triggerProps): JSX.Element => (
                                    <Pressable {...triggerProps}>
                                        <Icon as={Ionicons} color="gray.400" name="information-circle" />
                                    </Pressable>
                                )}
                            >
                                <Popover.Content>
                                    <Popover.Arrow bg="gray.900" />
                                    <Popover.Body bg="gray.900">
                                        <Text>View and manage your saved workouts</Text>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </HStack>
                        <Button colorScheme="secondary" variant="ghost" onPress={handlePressViewMyCreatedWorkouts}>
                            View all
                        </Button>
                    </HStack>
                    <HorizontalWorkoutCards
                        isLoading={isMyCreatedWorkoutsLoading}
                        workouts={myCreatedWorkouts ?? []}
                        onPressWorkout={handlePressViewMyWorkout}
                    />
                    {/* /* My Workouts */ }
                    <HStack alignItems="center" justifyContent="space-between">
                        <HStack alignItems="center" space={2}>
                            <Heading size="md">Saved Workouts</Heading>
                            <Popover
                                trigger={(triggerProps): JSX.Element => (
                                    <Pressable {...triggerProps}>
                                        <Icon as={Ionicons} color="gray.400" name="information-circle" />
                                    </Pressable>
                                )}
                            >
                                <Popover.Content>
                                    <Popover.Arrow bg="gray.900" />
                                    <Popover.Body bg="gray.900">
                                        <Text>View and manage your saved workouts</Text>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </HStack>
                        <Button colorScheme="secondary" variant="ghost" onPress={handlePressViewMyWorkouts}>
                            View all
                        </Button>
                    </HStack>
                    <HorizontalWorkoutCards
                        isLoading={isMySavedWorkoutsLoading}
                        workouts={mySavedWorkouts ?? []}
                        onPressWorkout={handlePressViewMyWorkout}
                    />
                    {/* TabaFit Workouts */}
                    <HStack alignItems="center" justifyContent="space-between">
                        <HStack alignItems="center" space={2}>
                            <Heading size="md">TabaFit Workouts</Heading>
                            <Popover
                                trigger={(triggerProps): JSX.Element => (
                                    <Pressable {...triggerProps}>
                                        <Icon as={Ionicons} color="gray.400" name="information-circle" />
                                    </Pressable>
                                )}
                            >
                                <Popover.Content>
                                    <Popover.Arrow bg="gray.900" />
                                    <Popover.Body bg="gray.900">
                                        <Text>
                                            Built by the TabaFit team, these workouts are designed to be
                                            challenging and fun
                                        </Text>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </HStack>
                        <Button colorScheme="secondary" variant="ghost" onPress={handlePressTabaFitWorkouts}>View all</Button>
                    </HStack>
                    <Text color="gray.300" mt={-3} />
                    <HorizontalWorkoutCards
                        isLoading={false}
                        workouts={tabaFitWorkouts ?? []}
                        onPressWorkout={handlePressViewWorkout}
                    />
                </VStack>
            </RefreshableScrollView>
        </GradientVStack>
    );
};

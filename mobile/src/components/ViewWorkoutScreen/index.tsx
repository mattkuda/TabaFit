/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect } from 'react';
import {
    ScrollView, Text, VStack, Button, Icon, Center, Spinner, HStack, Box, Image,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Animated, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useQueryClient } from 'react-query';
import { TabataCircuit, TabataWorkoutWithUserInfo } from '../../types/workouts';
import { ViewWorkoutScreenRouteProp, BuildWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryWorkoutById } from '../../hooks/useQueryWorkoutById';
import { exerciseIconDictionary, formatBodyParts, getWorkoutDifficultyGradient } from '../../util/util';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';
import { useAuth } from '../../context/AuthContext';
import { useSaveWorkout, useUnsaveWorkout } from '../../mutations/workoutMutations';
import { PictureWithName } from '../PictureWithName';
import { GradientVStack } from '../common/GradientVStack';
import { useWorkoutOwnership } from '../../hooks/useUserInfo';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const ViewWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ViewWorkoutScreenRouteProp>();
    const { workoutId } = route.params;
    const routeWorkout = route.params?.workout as TabataWorkoutWithUserInfo | undefined;
    const { data: queriedWorkout, isLoading, isError } = useQueryWorkoutById(routeWorkout?._id.toString() ?? workoutId);
    const { isWorkoutCreatedByUser, isWorkoutSavedByUser } = useWorkoutOwnership(workoutId);
    // Todo: Consider including user info in the route workout so we don't have to query it
    const workout = queriedWorkout;
    const { authState } = useAuth();
    const queryClient = useQueryClient();
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();
    const saveWorkoutMutation = useSaveWorkout();
    const unsaveWorkoutMutation = useUnsaveWorkout();
    const formattedDate = workout?.createdAt ? format(new Date(workout.createdAt), 'MMM do, yyyy') : 'emtpy date';

    const handleEditWorkout = useCallback((): void => {
        navigation.navigate(
            'BuildWorkoutScreen',
            {
                workout,
                shouldUpdate: isWorkoutCreatedByUser,
            } as BuildWorkoutScreenProps,
        );
    }, [navigation, workout, isWorkoutCreatedByUser]);

    const handleSaveWorkout = useCallback((): void => {
        const onSuccessCallback = (): void => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries('my-saved-workouts');
            queryClient.invalidateQueries(['workout', workout._id.toString()]);
            queryClient.invalidateQueries(['userInfo']);
        };

        saveWorkoutMutation.mutate({
            workoutId: workout._id.toString(),
        }, {
            onSuccess: onSuccessCallback,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout, authState.userId, queryClient, navigation, saveWorkoutMutation]);

    const handleUnsaveWorkout = useCallback((): void => {
        const onSuccessCallback = (): void => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries('my-saved-workouts');
            queryClient.invalidateQueries(['workout', workout._id.toString()]);
            queryClient.invalidateQueries(['userInfo']);
        };

        unsaveWorkoutMutation.mutate({
            workoutId: workout._id.toString(),
        }, {
            onSuccess: onSuccessCallback,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout, authState.userId, queryClient, navigation, saveWorkoutMutation]);

    const handleStartWorkout = (): void => {
        navigation.navigate('TabataTimerScreen', { workout });
    };

    const scaleAnimation = new Animated.Value(1);

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: (): JSX.Element => (
                isWorkoutCreatedByUser ? (
                    <Button
                        colorScheme="secondary"
                        size="lg"
                        variant="ghost"
                        onPress={handleEditWorkout}
                    >
                        Edit
                    </Button>
                ) : (
                    (
                        <Button
                            colorScheme={isWorkoutSavedByUser ? 'success' : 'secondary'}
                            size="lg"
                            variant="ghost"
                            onPress={isWorkoutSavedByUser ? handleUnsaveWorkout : handleSaveWorkout}
                        >
                            {isWorkoutSavedByUser ? 'Saved' : 'Save'}
                        </Button>
                    )
                )
            ),
        });
    }, [navigation, isWorkoutCreatedByUser, isWorkoutSavedByUser, workout,
        handleSaveWorkout, handleEditWorkout, handleUnsaveWorkout]);

    Animated.loop(
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 1.4,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]),
    ).start();

    if (isLoading) {
        return (
            <GradientVStack
                backgroundColor="gray9"
                flex={1}
                space={4}
                width="100%"
            >
                <Center flex={1}><Spinner color="white" /></Center>
            </GradientVStack>
        );
    }

    if (isError || !workout) {
        return (
            <GradientVStack
                backgroundColor="gray9"
                flex={1}
                space={4}
                width="100%"
            >
                <Center flex={1}>
                    <Text>Error loading workout or workout not found</Text>
                    <Text>
                        Workout ID:
                        {workoutId}
                    </Text>
                </Center>
            </GradientVStack>
        );
    }

    return (
        <GradientVStack
            flex={1}
            space={4}
            width="100%"
        >
            <ScrollView>
                <VStack
                    p={4}
                    space={4}
                    width="100%"
                >
                    <HStack
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="center"
                        w="100%"
                    >
                        <Icon as={Ionicons} color={getWorkoutDifficultyGradient(workout.difficulty)} mr={2} name="barbell-outline" size="xl" />
                        <Text bold flex={1} fontSize="2xl">{workout.name}</Text>
                    </HStack>
                    <Box alignItems="center" flexDirection="row" justifyContent="space-between">
                        <PictureWithName isTabaFitAdmin={workout.isPremade} user={workout.user} />
                        {!workout.isPremade && <Text>{ formattedDate }</Text>}
                    </Box>
                    <Text italic fontSize="sm">
                        {formatBodyParts(workout.includeSettings)}
                    </Text>
                    <HStack justifyContent="space-between" mt={2}>
                        <VStack alignItems="center" flex={1} space={0}>
                            <Icon as={Ionicons} name="body-outline" size="md" />
                            <Text fontSize="sm">
                                {`${workout.tabatas.length} ${workout.tabatas.length === 1 ? 'Tabata' : 'Tabatas'}`}
                            </Text>
                        </VStack>
                        <VStack alignItems="center" flex={1} space={0}>
                            <Icon as={Ionicons} name="time-outline" size="md" />
                            <Text fontSize="sm">{getFormattedTimeForTabataWorkout(workout)}</Text>
                        </VStack>
                    </HStack>
                    {workout.tabatas.map((circuit: TabataCircuit, index: number) => (
                        <VStack
                            bg="workoutDisplayGray"
                            borderColor="primary"
                            borderRadius="md"
                            key={index}
                            mt={2}
                            p={4}
                            space={2}
                        >
                            <Text bold fontSize="lg">
                                Tabata
                                {' '}
                                {index + 1}
                            </Text>
                            {circuit.map((exercise, exIndex) => (
                                <HStack space="2">
                                    <Image
                                        alt={`${exercise.types[0]} icon`}
                                        paddingX="2"
                                        source={exerciseIconDictionary[exercise.types[0]]}
                                        style={{
                                            height: 24, width: 24, tintColor: 'white', paddingHorizontal: 2,
                                        }}
                                    />
                                    <Text key={exIndex}>{exercise.name}</Text>
                                </HStack>
                            ))}
                        </VStack>
                    ))}
                </VStack>
            </ScrollView>
            {/* Start Button */}
            <TouchableOpacity onPress={handleStartWorkout}>
                <Box
                    alignItems="center"
                    bg={{
                        linearGradient: {
                            colors: ['flame.500', 'cherry.500'],
                            start: [0, 1],
                            end: [1, 0],
                        },
                    }}
                    borderRadius="full"
                    flexDirection="row"
                    // @ts-expect-error
                    gap={2}
                    justifyContent="center"
                    mb="4"
                    mx="4"
                    p="4"
                    px={4}
                >
                    <Text bold fontSize="lg">Start</Text>
                    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                        <Icon as={Ionicons} name="flash" />
                    </Animated.View>
                </Box>
            </TouchableOpacity>
        </GradientVStack>
    );
};

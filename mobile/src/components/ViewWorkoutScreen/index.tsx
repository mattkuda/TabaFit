/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import {
    ScrollView, Text, VStack, Button, Icon, Center, Spinner, HStack, Box, Image,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Animated, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useQueryClient } from 'react-query';
import { TabataCircuit, TabataWorkout, TabataWorkoutWithUserInfo } from '../../types/workouts';
import { ViewWorkoutScreenRouteProp, BuildWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryWorkoutById } from '../../hooks/useQueryWorkoutById';
import { exerciseIconDictionary, formatBodyParts } from '../../util/util';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';
import { useAuth } from '../../context/AuthContext';
import { useMutateSaveWorkout } from '../../mutations/useMutateSaveWorkout';
import { ProfilePicture } from '../ProfilePicture';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const ViewWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ViewWorkoutScreenRouteProp>();
    const { workoutId, isInMyWorkouts } = route.params;
    const customWorkout = route.params?.workout as TabataWorkoutWithUserInfo | undefined;
    const { data: queriedWorkout, isLoading, isError } = useQueryWorkoutById(workoutId);
    const workout = customWorkout ?? queriedWorkout;
    const { authState } = useAuth();
    const queryClient = useQueryClient();
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();
    const saveWorkoutMutation = useMutateSaveWorkout();
    const formattedDate = workout?.createdAt ? format(new Date(workout.createdAt), 'MMM do, yyyy') : 'emtpy date';
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleEditWorkout = (): void => {
        navigation.navigate(
            'BuildWorkoutScreen',
            {
                customWorkout: workout,
                isShuffle: false,
                isSavedWorkout: isInMyWorkouts,
            } as BuildWorkoutScreenProps,
        );
    };

    const handleSaveOrUpdateWorkout = useCallback((): void => {
        const workoutData: TabataWorkout = {
            ...workout,
            createdAt: new Date().toISOString(),
            userId: authState.userId,
        };

        const onSuccessCallback = (): void => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries('my-saved-workouts');
            queryClient.invalidateQueries(['workout', workout._id.toString()]);
            setSaveSuccess(true);
        };

        saveWorkoutMutation.mutate({
            workout: workoutData,
        }, {
            onSuccess: onSuccessCallback,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout, authState.userId, queryClient, navigation, saveWorkoutMutation]);

    const handleStartWorkout = (): void => {
        navigation.navigate('TabataTimerScreen', { workout, isInMyWorkouts });
    };

    const scaleAnimation = new Animated.Value(1);

    let saveButtonText;

    if (isInMyWorkouts) {
        saveButtonText = 'Edit';
    } else if (saveSuccess) {
        saveButtonText = 'Saved';
    } else {
        saveButtonText = 'Save';
    }

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
            <VStack
                backgroundColor="gray9"
                flex={1}
                space={4}
                width="100%"
            >
                <Center flex={1}><Spinner /></Center>
            </VStack>
        );
    }

    if (isError || !workout) {
        return (
            <VStack
                backgroundColor="gray9"
                flex={1}
                space={4}
                width="100%"
            >
                <Center flex={1}><Text>Error loading workout or workout not found</Text></Center>
            </VStack>
        );
    }

    return (
        <VStack
            backgroundColor="gray9"
            flex={1}
            space={4}
            width="100%"
        >
            <ScrollView>
                <VStack
                    backgroundColor="gray9"
                    borderColor="gray7"
                    p={4}
                    space={4}
                    width="100%"
                >
                    <HStack>
                        <Text bold flex={1} fontSize="xl">{workout.name}</Text>
                        <Button
                            disabled={saveSuccess}
                            rightIcon={isInMyWorkouts ? <Icon as={Ionicons} color="primary" name="pencil" /> : <Icon as={Ionicons} color={saveSuccess ? 'green.500' : 'flame.500'} name="arrow-down-circle" />}
                            variant="outline"
                            onPress={isInMyWorkouts ? handleEditWorkout : handleSaveOrUpdateWorkout}
                        >
                            {saveButtonText}
                        </Button>
                    </HStack>
                    <Box alignItems="center" flexDirection="row" justifyContent="space-between">
                        <Box alignItems="center" flexDirection="row">
                            <ProfilePicture size="xs" user={workout?.user} />
                            <Text style={{ marginLeft: 8 }}>
                                {`${workout?.user?.firstName} ${workout?.user?.lastName}`}
                            </Text>
                        </Box>
                        {formattedDate}
                    </Box>
                    <Text italic fontSize="sm">
                        {formatBodyParts(workout.includeSettings)}
                    </Text>
                    <HStack justifyContent="space-between" mt={2}>
                        <VStack alignItems="center" flex={1} space={0}>
                            <Icon as={Ionicons} name="body-outline" size="md" />
                            <Text fontSize="sm">
                                {`${workout.numberOfTabatas} ${workout.numberOfTabatas === 1 ? 'Tabata' : 'Tabatas'}`}
                            </Text>
                        </VStack>
                        <VStack alignItems="center" flex={1} space={0}>
                            <Icon as={Ionicons} name="time-outline" size="md" />
                            <Text fontSize="sm">{getFormattedTimeForTabataWorkout(workout)}</Text>
                        </VStack>
                    </HStack>
                    {workout.tabatas.map((circuit: TabataCircuit, index: number) => (
                        <VStack
                            bg={{
                                linearGradient: {
                                    colors: ['gray.600', 'gray.700'],
                                    start: [0, 1],
                                    end: [1, 0],
                                },
                            }}
                            borderColor="primary"
                            borderRadius="md"
                            borderWidth={1}
                            key={index}
                            mt={2}
                            p={4}
                            space={2}
                        >
                            <Text bold fontSize="md">
                                Tabata
                                {' '}
                                {index + 1}
                            </Text>
                            {circuit.map((exercise, exIndex) => (
                                <HStack space="2">
                                    <Image
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
        </VStack>
    );
};

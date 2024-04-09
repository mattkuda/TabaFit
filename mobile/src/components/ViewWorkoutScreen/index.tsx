/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
    ScrollView, Text, VStack, Button, Icon, Center, Spinner,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Animated } from 'react-native';
import { TabataCircuit, TabataWorkout } from '../../types/workouts';
import { ViewWorkoutScreenRouteProp, BuildWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryWorkoutById } from '../../hooks/useQueryWorkoutById';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const ViewWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ViewWorkoutScreenRouteProp>();
    const { workoutId, isInMyWorkouts } = route.params;
    const customWorkout = route.params?.workout as TabataWorkout | undefined;
    const { data: queriedWorkout, isLoading, isError } = useQueryWorkoutById(workoutId);
    const workout = customWorkout ?? queriedWorkout;

    const navigation = useNavigation<WorkoutsScreenNavigationProp>();

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

    const handleStartWorkout = (): void => {
        navigation.navigate('TabataTimerScreen', { workout, isInMyWorkouts });
    };

    if (isLoading) {
        return <Center flex={1}><Spinner /></Center>; // Show loading indicator while data is loading
    }

    if (isError || !workout) {
        return <Center flex={1}><Text>Error loading workout or workout not found</Text></Center>; // Show error message
    }

    const scaleAnimation = new Animated.Value(1);

    Animated.loop(
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 1.2,
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
                    <Text bold fontSize="xl">{workout.name}</Text>
                    <Button
                        rightIcon={<Icon as={Ionicons} name="pencil" size="sm" />}
                        size="sm"
                        variant="outline"
                        onPress={handleEditWorkout}
                    >
                        {isInMyWorkouts ? 'Edit' : 'Save'}
                    </Button>
                    <Text fontSize="md">
                        Created on:
                        {' '}
                        {workout.createdAt}
                    </Text>
                    <Text fontSize="md">
                        Number of Tabatas:
                        {' '}
                        {workout.numberOfTabatas}
                    </Text>
                    {workout.tabatas.map((circuit: TabataCircuit, index: number) => (
                        <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} key={index} mt={2} p={4} space={2}>
                            <Text bold fontSize="md">
                                Tabata
                                {' '}
                                {index + 1}
                            </Text>
                            {circuit.map((exercise, exIndex) => (
                                <Text key={exIndex}>{exercise.name}</Text>
                            ))}
                        </VStack>
                    ))}
                </VStack>
            </ScrollView>
            <Button
                bottom={0}
                endIcon={(
                    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                        <Icon as={Ionicons} name="flash" />
                    </Animated.View>

                )}
                flex={1}
                mt={4}
                position="absolute"
                width="100%"
                onPress={handleStartWorkout}
            >
                Start
            </Button>
        </VStack>
    );
};

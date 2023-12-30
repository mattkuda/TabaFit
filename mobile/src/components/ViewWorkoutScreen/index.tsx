/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
    ScrollView, Text, VStack, Button,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabataCircuit } from '../../types/workouts';
import { ViewWorkoutScreenRouteProp, BuildWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabNavigatorParamList } from '../../types/navigationTypes';

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const ViewWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ViewWorkoutScreenRouteProp>();
    const { workout } = route.params; // Assuming workout is passed through route params
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();

    const handleEditWorkout = (): void => {
        navigation.navigate(
            'BuildWorkoutScreen',
            {
                customWorkout: workout,
                isShuffle: false,
            } as BuildWorkoutScreenProps,
        );
    };

    return (
        <ScrollView>
            <VStack px={5} py={4} space={4}>
                <Text bold fontSize="xl">{workout.name}</Text>
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
                <Text fontSize="md">
                    Exercises per Tabata:
                    {' '}
                    {workout.exercisesPerTabata}
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
            <Button mt={4} onPress={handleEditWorkout}>Edit Workout</Button>
        </ScrollView>
    );
};

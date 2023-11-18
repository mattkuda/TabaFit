import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput, Button } from 'react-native';
import { VStack, Text } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { ShareWorkoutScreenRouteProp } from '../../navigation/navigationTypes';

export const ShareWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ShareWorkoutScreenRouteProp>();
    const { workout, completedAt } = route.params;
    const [workoutName, setWorkoutName] = useState('');
    const [workoutDescription, setWorkoutDescription] = useState('');

    const getTimeOfDay = (date: Date): string => {
        const hour = date.getHours();

        if (hour >= 4 && hour < 11) return 'Morning';
        if (hour >= 1 && hour < 1) return 'Lunch';
        if (hour >= 1 && hour <= 5) return 'Afternoon';
        return 'Evening';
    };

    // Usage
    useEffect(() => {
        const timeOfDay = getTimeOfDay(completedAt);

        setWorkoutName(`${timeOfDay} Tabata`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDiscardWorkout = (): void => {
        // Logic to discard the workout
    };

    const handleSaveWorkout = (): void => {
        // Logic to save the workout
    };

    const handleShareWorkout = (): void => {
        // Logic to share the workout
    };

    return (
        <ScrollView>
            <VStack p={4} space={4}>
                <Text bold fontSize="xl">Share Workout</Text>
                <Text bold fontSize="xl">{JSON.stringify(workout)}</Text>
                <TextInput
                    placeholder="Workout Name"
                    style={{
                        borderWidth: 1, borderColor: 'grey', padding: 10, margin: 10,
                    }}
                    value={workoutName}
                    onChangeText={setWorkoutName}
                />
                <TextInput
                    multiline
                    placeholder="Workout Description"
                    style={{
                        borderWidth: 1,
                        borderColor: 'grey',
                        padding: 10,
                        margin: 10,
                        height: 100,
                        textAlignVertical: 'top',
                    }}
                    value={workoutDescription}
                    onChangeText={setWorkoutDescription}
                />
                <Button color="red" title="Discard Workout" onPress={handleDiscardWorkout} />
                <Button title="Save Workout" onPress={handleSaveWorkout} />
                <Button title="Share Workout" onPress={handleShareWorkout} />
            </VStack>
        </ScrollView>
    );
};

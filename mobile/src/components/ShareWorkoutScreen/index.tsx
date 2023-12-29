import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import {
    VStack, Text, Button, Icon,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ShareWorkoutrScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { useMutateShareWorkout } from '../../mutations/useMutateSharePost';
import { ShareWorkoutScreenRouteProp } from '../../navigation/navigationTypes';
import { useMutateSaveWorkout } from '../../mutations/useMutateSaveWorkout';

export const ShareWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ShareWorkoutScreenRouteProp>();
    const { workout, completedAt } = route.params;
    const [workoutTitle, setWorkoutTitle] = useState('');
    const [workoutDescription, setWorkoutDescription] = useState('');
    const shareWorkoutMutation = useMutateShareWorkout();
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<ShareWorkoutrScreenNavigationProp>();
    const saveWorkoutMutation = useMutateSaveWorkout();
    const [isWorkoutSaved, setIsWorkoutSaved] = useState(false);

    const handleSaveWorkout = (): void => {
        if (authState?.userId && workout) {
            saveWorkoutMutation.mutate({
                workout: {
                    ...workout,
                    userId,
                },
            }, {
                onSuccess: () => {
                    setIsWorkoutSaved(true);
                },
            });
        }
    };
    const handleReturnHome = (): void => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'WorkoutsScreen' }],
        });
        navigation.navigate('Home');
    };

    const handleShareWorkout = (): void => {
        shareWorkoutMutation.mutate({
            userId,
            workout,
            title: workoutTitle,
            description: workoutDescription,
        }, { onSuccess: handleReturnHome });
    };

    const getTimeOfDay = (date: Date): string => {
        const hour = date.getHours();

        if (hour >= 4 && hour < 11) return 'Morning';
        if (hour >= 1 && hour < 1) return 'Lunch';
        if (hour >= 1 && hour <= 5) return 'Afternoon';
        return 'Evening';
    };

    useEffect(() => {
        const timeOfDay = getTimeOfDay(completedAt);

        setWorkoutTitle(`${timeOfDay} Tabata`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDiscardWorkout = (): void => {
        // Logic to discard the workout
    };

    return (
        <ScrollView>
            <VStack p={4} space={4}>
                <Text bold fontSize="xl">Share Workout</Text>
                <Text bold fontSize="xl">
                    UserId:
                    {' '}
                    {userId}
                </Text>

                <TextInput
                    placeholder="Workout Name"
                    style={{
                        borderWidth: 1, borderColor: 'grey', padding: 10, margin: 10,
                    }}
                    value={workoutTitle}
                    onChangeText={setWorkoutTitle}
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
                <Button color="red" onPress={handleDiscardWorkout}>Discard Workout</Button>
                <Button
                    disabled={isWorkoutSaved}
                    leftIcon={
                        isWorkoutSaved
                            ? <Icon as={<Ionicons name="checkmark" />} color="green.500" size="sm" />
                            : <Icon as={<Ionicons name="save-outline" />} size="sm" />
                    }
                    onPress={handleSaveWorkout}
                >
                    {isWorkoutSaved ? 'Workout Saved' : 'Save Workout'}
                </Button>
                <Button onPress={handleShareWorkout}>Share Workout</Button>
            </VStack>
        </ScrollView>
    );
};

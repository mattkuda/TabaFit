import React, { useEffect, useState } from 'react';
import {
    VStack, Text, Button, Icon, Input, TextArea,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useQueryClient } from 'react-query';
import { ShareWorkoutrScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { useMutateShareWorkout } from '../../mutations/useMutateSharePost';
import { ShareWorkoutScreenRouteProp } from '../../navigation/navigationTypes';
import { useMutateSaveWorkout } from '../../mutations/useMutateSaveWorkout';

export const ShareWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ShareWorkoutScreenRouteProp>();
    const { workout, completedAt, isInMyWorkouts } = route.params;
    const [workoutTitle, setWorkoutTitle] = useState('');
    const [workoutDescription, setWorkoutDescription] = useState('');
    const shareWorkoutMutation = useMutateShareWorkout();
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<ShareWorkoutrScreenNavigationProp>();
    const saveWorkoutMutation = useMutateSaveWorkout();
    const [isWorkoutSaved, setIsWorkoutSaved] = useState(false);
    const queryClient = useQueryClient();

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
        navigation.navigate('HomePage');
    };

    const handleShareWorkout = (): void => {
        shareWorkoutMutation.mutate({
            userId,
            workout,
            title: workoutTitle,
            description: workoutDescription,
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries('following-posts');
                handleReturnHome();
            },
        });
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

    return (
        <VStack backgroundColor="gray9" flex={1} p={4} space={4}>
            <Text bold fontSize="xl">Share Workout</Text>
            <Input
                fontSize="lg"
                placeholder="Enter Post Name"
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
            />
            <TextArea
                autoCompleteType={undefined}
                h={20}
                placeholder="Workout Description"
                value={workoutDescription}
                onChangeText={setWorkoutDescription}
            />

            <Button onPress={handleShareWorkout}>Share Workout</Button>
            {isInMyWorkouts
                ? <Text>Workout Saved</Text>
                : (
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
                )}
            <Button color="red" onPress={handleReturnHome}>Return home</Button>
        </VStack>
    );
};

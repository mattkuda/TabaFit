/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    VStack, Text, Button, Input, TextArea,
    HStack,
    Checkbox,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from 'react-query';
import { ShareWorkoutScreenNavigationProp } from '../../types/navigationTypes';
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
    const navigation = useNavigation<ShareWorkoutScreenNavigationProp>();
    const saveWorkoutMutation = useMutateSaveWorkout();
    const [isWorkoutSaved, setIsWorkoutSaved] = useState(isInMyWorkouts);
    const [saveWorkoutSwitch, setSaveWorkoutSwitch] = useState(isInMyWorkouts);
    const queryClient = useQueryClient();

    const handleSaveWorkout = (): Promise<void> => new Promise((resolve, reject) => {
        if (authState?.userId && workout) {
            saveWorkoutMutation.mutate({
                workout: {
                    ...workout,
                    userId,
                },
            }, {
                onSuccess: () => {
                    setIsWorkoutSaved(true);
                    resolve();
                },
                onError: () => {
                    reject();
                },
            });
        } else {
            resolve();
        }
    });

    const handleReturnHome = (): void => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'WorkoutsScreen' }],
        });
        navigation.navigate('HomePage');
    };

    const handleShareWorkout = (): void => {
        if (saveWorkoutSwitch && !isWorkoutSaved) {
            handleSaveWorkout().finally(() => {
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
            });
        } else {
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
        }
    };

    const getTimeOfDay = (date: Date): string => {
        const hour = date.getHours();

        if (hour >= 4 && hour < 11) return 'Morning';
        if (hour >= 11 && hour < 14) return 'Lunch';
        if (hour >= 14 && hour <= 17) return 'Afternoon';
        return 'Evening';
    };

    useEffect(() => {
        const timeOfDay = getTimeOfDay(completedAt);

        setWorkoutTitle(`${timeOfDay} Tabata`);
    }, [completedAt]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: (): JSX.Element => (
                <Button
                    size="lg"
                    variant="ghost"
                    onPress={handleShareWorkout}
                >
                    Share
                </Button>
            ),
        });
    }, [handleShareWorkout, navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (): JSX.Element => (
                <Button
                    colorScheme="dull"
                    size="lg"
                    variant="ghost"
                    onPress={handleReturnHome}
                >
                    Exit
                </Button>
            ),
        });
    }, [handleReturnHome, navigation]);

    return (
        <VStack backgroundColor="gray9" flex={1} p={4} space={4}>
            <Input
                fontSize="md"
                placeholder="Enter Post Name"
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
            />
            <TextArea
                autoCompleteType={undefined}
                fontSize="md"
                h={40}
                placeholder="Describe your workout"
                value={workoutDescription}
                onChangeText={setWorkoutDescription}
            />
            <HStack alignItems="center" space={4}>
                <Text>{!isWorkoutSaved ? 'Save workout to library when sharing?' : 'Workout saved to library'}</Text>
                <Checkbox
                    bgColor={saveWorkoutSwitch ? 'primary' : 'gray9'}
                    isChecked={isWorkoutSaved || saveWorkoutSwitch}
                    isDisabled={isWorkoutSaved}
                    key="Kettlebell-checkbox"
                    size="lg"
                    value="Kettlebells"
                    onChange={(): void => setSaveWorkoutSwitch(!saveWorkoutSwitch)}
                />
            </HStack>
        </VStack>
    );
};

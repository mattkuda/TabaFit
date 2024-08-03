/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Text, Button, Input, TextArea,
    HStack,
    Checkbox,
    Icon,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { ShareWorkoutScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { useMutateShareWorkout } from '../../mutations/useMutateSharePost';
import { ShareWorkoutScreenRouteProp } from '../../navigation/navigationTypes';
import { useCreateWorkout } from '../../mutations/workoutMutations';
import { GradientVStack } from '../common/GradientVStack';
import { useWorkoutOwnership } from '../../hooks/useUserInfo';

export const ManualWorkoutScreen = (): JSX.Element => {
    const route = useRoute<ShareWorkoutScreenRouteProp>();
    const { workout, completedAt } = route.params;
    const [workoutTitle, setWorkoutTitle] = useState('');
    const [workoutDescription, setWorkoutDescription] = useState('');
    const shareWorkoutMutation = useMutateShareWorkout();
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<ShareWorkoutScreenNavigationProp>();
    const saveWorkoutMutation = useCreateWorkout();
    const { isWorkoutCreatedByUser, isWorkoutSavedByUser } = useWorkoutOwnership(workout?._id.toString());
    const isSaved = isWorkoutCreatedByUser || isWorkoutSavedByUser;
    const [saveWorkoutSwitch, setSaveWorkoutSwitch] = useState(isSaved);
    const queryClient = useQueryClient();
    const [isSavingComplete, setIsSavingComplete] = useState(false);

    const handleSaveWorkout = (): Promise<void> => new Promise((resolve, reject) => {
        if (authState?.userId && workout) {
            saveWorkoutMutation.mutate({
                workout: {
                    ...workout,
                    userId,
                },
            }, {
                onSuccess: () => {
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
        setIsSavingComplete(false); // Reset saving complete state
        if (saveWorkoutSwitch && !isSaved) {
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
                    rightIcon={<Icon as={Ionicons} color="flame.500" name="add" size="lg" />}
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
        <GradientVStack flex={1} p={4} space={4}>
            <Input
                backgroundColor="gray.900"
                fontSize="md"
                placeholder="Enter Post Name"
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
            />
            <TextArea
                autoCompleteType={undefined}
                backgroundColor="gray.900"
                fontSize="md"
                h={40}
                placeholder="Describe your workout"
                value={workoutDescription}
                onChangeText={setWorkoutDescription}
            />
            <HStack alignItems="center" space={4}>
                <Text>
                    {!isSaved && !isSavingComplete ? 'Save workout to library when sharing?' : 'Workout saved to library'}
                </Text>
                <Checkbox
                    bgColor={saveWorkoutSwitch ? 'primary' : 'gray.900'}
                    borderColor="gray.600"
                    borderWidth={1}
                    isChecked={isSaved || saveWorkoutSwitch}
                    isDisabled={isSaved}
                    key="save-workout-switch"
                    size="lg"
                    value="save-workout-switch"
                    onChange={(): void => setSaveWorkoutSwitch(!saveWorkoutSwitch)}
                />
            </HStack>
        </GradientVStack>
    );
};

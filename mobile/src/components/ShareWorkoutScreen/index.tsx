/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Text, Button, Input, TextArea, HStack, Checkbox, Icon, Divider, VStack,
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
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';
import { formatBodyParts, formatEquipmentSettings } from '../../util/util';

export const ShareWorkoutScreen = (): JSX.Element => {
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
        navigation.navigate('HomePage', { scrollToTop: true });
    };

    const handleShareWorkout = (): void => {
        setIsSavingComplete(false); // Reset saving complete state
        if (saveWorkoutSwitch && !isSaved) {
            handleSaveWorkout().finally(() => {
                shareWorkoutMutation.mutate({
                    userId,
                    workout: {
                        ...workout,
                        _id: undefined, // Ensure the backend generates the ID
                    },
                    title: workoutTitle.trim(),
                    description: workoutDescription.trim(),
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
                    disabled={!workoutTitle || shareWorkoutMutation.isLoading}
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

    const formattedTotalWorkoutTime = getFormattedTimeForTabataWorkout(workout);

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
                returnKeyType="done"
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
            />
            <TextArea
                blurOnSubmit
                autoCompleteType={undefined}
                backgroundColor="gray.900"
                fontSize="md"
                h={40}
                placeholder="Describe your workout"
                returnKeyType="done"
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
            <Divider backgroundColor="gray6" />
            <VStack space={4}>
                <Text fontSize="lg" justifyContent="center">
                    Stats:
                </Text>
                {/* <WorkoutPostDisplay workout={workout} />

                <HStack justifyContent="space-between" mt={2}>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="body-outline" size="lg" />
                        <Text>
                            {`${workout.tabatas.length} ${workout.tabatas.length === 1 ? 'Tabata' : 'Tabatas'}`}
                        </Text>
                    </VStack>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="time-outline" size="lg" />
                        <Text>{formattedTotalWorkoutTime}</Text>
                    </VStack>
                </HStack>
                <HStack justifyContent="space-between" mt={2}>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="body-outline" size="lg" />
                        <Text>
                            {`${workout.tabatas.length} ${workout.tabatas.length === 1 ? 'Tabata' : 'Tabatas'}`}
                        </Text>
                    </VStack>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="time-outline" size="lg" />
                        <Text>{formattedTotalWorkoutTime}</Text>
                    </VStack>
                </HStack> */}

                <Text>
                    {`Tabatas: ${workout.tabatas.length}`}
                </Text>
                <Text>
                    {`Duration: ${formattedTotalWorkoutTime}`}
                </Text>
                <Text>
                    {`Focus: ${formatBodyParts(workout.includeSettings)}`}
                </Text>
                <Text>
                    {`Equipment: ${formatEquipmentSettings(workout.equipment)}`}
                </Text>
            </VStack>
        </GradientVStack>
    );
};

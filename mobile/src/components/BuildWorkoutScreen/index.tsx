import React, { useCallback, useEffect, useState } from 'react';
import {
    VStack, IconButton, Icon, HStack, Text, Pressable, Input, Toast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'react-native';
import { useQueryClient } from 'react-query';
import { TabataExercise, TabataWorkout } from '../../types/workouts';
import { WorkoutsStackParamList } from '../../navigation/navigationTypes';
import { useMutateSaveWorkout, useMutateUpdateWorkout } from '../../mutations/useMutateSaveWorkout';
import { buildNewTabataInitialState, emptyTabata, shuffleExercises } from '../shuffleUtil';
import { useAuth } from '../../context/AuthContext';
import { BuildWorkoutScreenNavigationProp } from '../../types/navigationTypes';

export type TabataCircuit = (TabataExercise | null)[];

type TabataItemProps = {
    tabataCircuit: TabataCircuit;
    circuitIndex: number;
    changeExercise: (tabataIndex: number, exerciseIndex: number) => void;
    moveTabataUp: (index: number) => void;
    moveTabataDown: (index: number) => void;
    removeTabata: (index: number) => void;
    updateExercisesOrder: (tabataIndex: number, newExercisesOrder: TabataExercise[]) => void;
};

const TabataItem = ({
    tabataCircuit,
    circuitIndex,
    changeExercise,
    moveTabataUp,
    moveTabataDown,
    removeTabata,
    updateExercisesOrder,
}: TabataItemProps): JSX.Element => (
    <VStack borderColor="coolGray.300" borderRadius="md" borderWidth={1} mb={4} mt={4} space={4}>
        <HStack alignItems="center" justifyContent="space-between">
            <IconButton
                icon={<Icon as={Ionicons} name="arrow-up" size="6" />}
                onPress={(): void => moveTabataUp(circuitIndex)}
            />
            <Text bold fontSize="lg">
                Tabata
                {' '}
                {circuitIndex + 1}
            </Text>
            <IconButton
                icon={<Icon as={Ionicons} name="arrow-down" size="6" />}
                onPress={(): void => moveTabataDown(circuitIndex)}
            />
            <IconButton
                icon={<Icon as={Ionicons} color="red.600" name="close-circle" size="6" />}
                onPress={(): void => removeTabata(circuitIndex)}
            />
        </HStack>
        <NestableDraggableFlatList<TabataExercise>
            data={tabataCircuit}
            keyExtractor={(item, index): string => `exercise-${circuitIndex}-${index}`}
            renderItem={({ item, drag, getIndex }): JSX.Element => {
                const index = getIndex();

                return (
                    <ScaleDecorator>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Pressable flex={1} onPress={(): void => changeExercise(circuitIndex, index)}>
                                <Text style={item ? {} : { fontStyle: 'italic' }}>{item?.name || `Select exercise ${index}`}</Text>
                            </Pressable>
                            <IconButton icon={<Icon as={Ionicons} name="menu" />} onLongPress={drag} />
                        </HStack>
                    </ScaleDecorator>
                );
            }}
            onDragEnd={({ data }): void => updateExercisesOrder(circuitIndex, data)}
        />
    </VStack>
);

type BuildWorkoutScreenRouteProp = RouteProp<WorkoutsStackParamList, 'BuildWorkoutScreen'>;

export const BuildWorkoutScreen: React.FC<BuildWorkoutScreenNavigationProp> = (): JSX.Element => {
    const navigation = useNavigation<BuildWorkoutScreenNavigationProp>();
    const route = useRoute<BuildWorkoutScreenRouteProp>();
    const { authState: { userId } } = useAuth();
    const customWorkout = route?.params?.customWorkout;
    const isSavedWorkoutByUser = route?.params?.customWorkout && route?.params?.customWorkout.userId === userId;
    const isShuffle = route?.params?.isShuffle || false;
    const [workout, setWorkout] = useState<TabataWorkout>(customWorkout || buildNewTabataInitialState);
    const saveWorkoutMutation = useMutateSaveWorkout();
    const { authState } = useAuth();
    const [workoutName, setWorkoutName] = useState(customWorkout?.name || '');
    const queryClient = useQueryClient();
    const updateWorkoutMutation = useMutateUpdateWorkout();

    const addTabata = (): void => {
        setWorkout((currentWorkout) => ({
            ...currentWorkout,
            tabatas: [...workout.tabatas, emptyTabata],
        }));
    };

    const removeTabata = (index: number): void => {
        setWorkout((currentWorkout) => ({
            ...currentWorkout,
            tabatas: currentWorkout.tabatas.filter((_, i) => i !== index),
        }));
    };

    const moveTabataUp = (index: number): void => {
        if (index === 0) return;
        setWorkout((currentWorkout) => {
            const newTabatas = [...currentWorkout.tabatas];

            [newTabatas[index - 1], newTabatas[index]] = [newTabatas[index], newTabatas[index - 1]];
            return { ...currentWorkout, tabatas: newTabatas };
        });
    };

    const moveTabataDown = (index: number): void => {
        if (index === workout.tabatas.length - 1) return;
        setWorkout((currentWorkout) => {
            const newTabatas = [...currentWorkout.tabatas];

            [newTabatas[index], newTabatas[index + 1]] = [newTabatas[index + 1], newTabatas[index]];
            return { ...currentWorkout, tabatas: newTabatas };
        });
    };

    const startWorkout = (): void => {
        navigation.navigate('TabataTimerScreen', { workout });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const validateWorkout = (): boolean => {
        if (!workoutName.trim()) {
            Toast.show({
                title: 'Workout name required',
                bgColor: 'red.500',
                placement: 'top',
            });
            return false;
        }

        for (let i = 0; i < workout.tabatas.length; i++) {
            if (workout.tabatas[i].some((exercise) => exercise === null)) {
                Toast.show({
                    title: `Incomplete Tabata: Circuit ${i + 1}`,
                    bgColor: 'red.500',
                    placement: 'top',
                });
                return false;
            }
        }

        return true;
    };

    const handleSaveOrUpdateWorkout = useCallback((): void => {
        if (!validateWorkout()) {
            return;
        }

        const workoutData: TabataWorkout = {
            ...workout,
            name: workoutName,
            createdAt: new Date().toISOString(),
            userId: authState.userId,
        };

        const onSuccessCallback = (): void => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries('my-saved-workouts');
            queryClient.invalidateQueries(['workout', workout._id.toString()]);
            navigation.goBack();
        };

        if (isSavedWorkoutByUser) {
            updateWorkoutMutation.mutate({
                workoutId: workout._id.toString(),
                workout: workoutData,
            }, {
                onSuccess: onSuccessCallback,
            });
        } else {
            saveWorkoutMutation.mutate({
                workout: workoutData,
            }, {
                onSuccess: onSuccessCallback,
            });
        }
    }, [validateWorkout, workout, workoutName, authState.userId, isSavedWorkoutByUser, queryClient,
        navigation, updateWorkoutMutation, saveWorkoutMutation]);

    useEffect(() => {
        if (isShuffle) {
            navigation.setOptions({
                // eslint-disable-next-line react/no-unstable-nested-components
                headerRight: (): JSX.Element => (
                    <Button title="Start" onPress={startWorkout} />
                ),
            });
        } else {
            navigation.setOptions({
                // eslint-disable-next-line react/no-unstable-nested-components
                headerRight: (): JSX.Element => (
                    <Button
                        title={isSavedWorkoutByUser ? 'Update' : 'Save'}
                        onPress={handleSaveOrUpdateWorkout}
                    />
                ),
            });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, handleSaveOrUpdateWorkout]);

    const updateExercisesOrder = (tabataIndex: number, newExercisesOrder: TabataExercise[]): void => {
        setWorkout((currentWorkout) => {
            const updatedTabatas = [...currentWorkout.tabatas];

            updatedTabatas[tabataIndex] = newExercisesOrder;
            return { ...currentWorkout, tabatas: updatedTabatas };
        });
    };

    const handleSelectExercise = (tabataIndex: number, exerciseIndex: number): void => {
        navigation.navigate('SelectExerciseScreen', {
            onSelectWorkout: (selectedExercise) => {
                setWorkout((currentWorkout) => {
                    const updatedTabatas = [...currentWorkout.tabatas];
                    const updatedExercises = [...updatedTabatas[tabataIndex]];

                    updatedExercises[exerciseIndex] = selectedExercise;
                    updatedTabatas[tabataIndex] = updatedExercises;
                    return { ...currentWorkout, tabatas: updatedTabatas };
                });
            },
        });
    };

    const handleChange = (text: string): void => setWorkoutName(text);

    const triggerShuffle = (): void => {
        // Assuming 'workout' is the current state of the workout being built
        // and it contains the settings for the shuffle
        if (workout.includeSettings) {
            const {
                includeUpper, includeLower, includeAbs, includeCardio,
            } = workout.includeSettings;
            const selectedEquipment = workout.equipment; // Assuming this is where the selected equipment is stored

            const shuffledTabatas = shuffleExercises(
                workout.numberOfTabatas,
                selectedEquipment,
                includeUpper,
                includeLower,
                includeAbs,
                includeCardio,
            );

            setWorkout((prev) => ({
                ...prev,
                tabatas: shuffledTabatas,
            }));
        }
    };

    useEffect(() => {
        if (isShuffle) {
            triggerShuffle();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <VStack space={4}>
            {isShuffle ? (
                <IconButton
                    icon={<Icon as={Ionicons} name="shuffle" />}
                    onPress={(): void => triggerShuffle()}
                />
            ) : (
                <Input
                    mb={4}
                    placeholder="Enter Workout Name"
                    value={workoutName}
                    onChangeText={handleChange}
                />
            )}
            <NestableScrollContainer>
                {workout.tabatas.map((tabataCircuit, index) => (
                    <TabataItem
                        changeExercise={handleSelectExercise}
                        circuitIndex={index}
                        moveTabataDown={moveTabataDown}
                        moveTabataUp={moveTabataUp}
                        removeTabata={removeTabata}
                        tabataCircuit={tabataCircuit}
                        updateExercisesOrder={updateExercisesOrder}
                    />
                ))}
            </NestableScrollContainer>
            <Button title="Add Tabata" onPress={addTabata} />
        </VStack>
    );
};

import React, { useCallback, useEffect, useState } from 'react';
import {
    VStack, IconButton, Icon, HStack, Text, Pressable, Input,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'react-native';
import { useQueryClient } from 'react-query';
import { TabataExercise, TabataWorkout } from '../../types/workouts';
import { WorkoutsStackParamList } from '../../navigation/navigationTypes';
import { useMutateSaveWorkout } from '../../mutations/useMutateSaveWorkout';
import { buildNewTabataInitialState, shuffleExercises } from '../ShuffleScreen/util';
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

const emptyTabata: TabataCircuit = [{
    _id: 'lb1', name: 'Squats', types: ['Lower Body'], description: 'Standard squats.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
},
{
    _id: 'lb2', name: 'Lunges', types: ['Lower Body'], description: 'Alternating lunges.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
},
{
    _id: 'lb3', name: 'Glute Bridges', types: ['Lower Body'], description: 'Hip lifts for glute strength.', difficulty: 'Easy', videoLink: '', equipment: ['None'],
}, {
    _id: 'lb4', name: 'Step-Ups', types: ['Lower Body'], description: 'Step onto a raised platform.', difficulty: 'Medium', videoLink: '', equipment: ['None'],
}];

type BuildWorkoutScreenRouteProp = RouteProp<WorkoutsStackParamList, 'BuildWorkoutScreen'>;

export const BuildWorkoutScreen: React.FC<BuildWorkoutScreenNavigationProp> = (): JSX.Element => {
    const navigation = useNavigation<BuildWorkoutScreenNavigationProp>();
    const route = useRoute<BuildWorkoutScreenRouteProp>();

    const { isShuffle, customWorkout } = route.params;

    const [workout, setWorkout] = useState<TabataWorkout>(customWorkout || buildNewTabataInitialState);
    // const navigation = useNavigation<BuildWorkoutScreenRouteProp>();
    const saveWorkoutMutation = useMutateSaveWorkout();
    const { authState } = useAuth();
    const queryClient = useQueryClient();
    const [workoutName, setWorkoutName] = useState('');
    // const [showSettingsModal, setShowSettingsModal] = useState(false);

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
    const saveWorkout = useCallback((): void => {
        const workoutToSave: TabataWorkout = {
            ...workout,
            name: workoutName,
            createdAt: new Date().toDateString(),
            userId: authState.userId,
        };

        saveWorkoutMutation.mutate({
            workout: workoutToSave,
        }, {
            onSuccess: () => {
                console.log('Workout saved!');
                console.log('Todo: handle nav to my workouts');
                queryClient.invalidateQueries('my-saved-workouts');
                navigation.navigate('LoadWorkoutScreen');
            },
        });
    }, [workout, workoutName, authState.userId, saveWorkoutMutation, queryClient, navigation]);

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: (): JSX.Element => (
                <Button title="Save" onPress={saveWorkout} />
            ),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, saveWorkout]);

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

            console.log('shuffledTabatas');
            console.log(shuffledTabatas);

            setWorkout((prev) => ({
                ...prev,
                tabatas: shuffledTabatas,
            }));
        }
    };

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
            <Text>
                isShuffle:
                {' '}
                {isShuffle}
            </Text>
            <Text>
                customWorkout:
                {' '}
                {JSON.stringify(customWorkout)}
            </Text>
            <Button title="Add Tabata" onPress={addTabata} />
        </VStack>
    );
};

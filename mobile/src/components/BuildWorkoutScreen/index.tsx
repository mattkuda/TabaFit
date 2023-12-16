import React, { useState } from 'react';
import {
    VStack, Input, Button, IconButton, Icon, HStack, Text, Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useNavigation } from '@react-navigation/native';
import { TabataExercise } from '../../types/workouts';
import { BuildWorkoutScreenRouteProp } from '../../navigation/navigationTypes';

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

const dummyData: TabataCircuit = [{
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

export const BuildTabataScreen: React.FC = (): JSX.Element => {
    const [workoutName, setWorkoutName] = useState<string>('');
    const [tabatas, setTabatas] = useState<TabataCircuit[]>([
        dummyData,
    ]);
    const navigation = useNavigation<BuildWorkoutScreenRouteProp>();

    const addTabata = (): void => {
        setTabatas([...tabatas, dummyData]);
    };

    const removeTabata = (index: number): void => {
        setTabatas(tabatas.filter((_, i) => i !== index));
    };

    const moveTabataUp = (index: number): void => {
        if (index === 0) return;
        const newTabatas = [...tabatas];

        [newTabatas[index - 1], newTabatas[index]] = [newTabatas[index], newTabatas[index - 1]];
        setTabatas(newTabatas);
    };

    const moveTabataDown = (index: number): void => {
        if (index === tabatas.length - 1) return;
        const newTabatas = [...tabatas];

        [newTabatas[index], newTabatas[index + 1]] = [newTabatas[index + 1], newTabatas[index]];
        setTabatas(newTabatas);
    };

    const saveWorkout = (): void => {
        // Implement workout save functionality
    };

    const updateExercisesOrder = (tabataIndex: number, newExercisesOrder: TabataExercise[]): void => {
        const updatedTabatas = [...tabatas];

        updatedTabatas[tabataIndex] = newExercisesOrder;
        setTabatas(updatedTabatas);
    };

    const handleSelectExercise = (tabataIndex: number, exerciseIndex: number): void => {
        navigation.navigate('SelectExerciseScreen', {
            onSelectWorkout: (selectedExercise) => {
                setTabatas((currentTabatas) => {
                    const updatedTabatas = [...currentTabatas];
                    const updatedExercises = [...updatedTabatas[tabataIndex]];

                    updatedExercises[exerciseIndex] = selectedExercise;
                    updatedTabatas[tabataIndex] = updatedExercises;

                    return updatedTabatas;
                });
            },
        });
    };

    return (
        <VStack space={4}>
            <Input
                placeholder="Enter workout name"
                value={workoutName}
                onChangeText={setWorkoutName}
            />
            <NestableScrollContainer>
                {tabatas.map((tabataCircuit, index) => (
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
            <Button mt={2} onPress={addTabata}>Add Tabata</Button>
            <Button mt={2} onPress={saveWorkout}>Save Workout</Button>
        </VStack>
    );
};

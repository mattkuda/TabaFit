/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
    VStack, Input, Button, IconButton, Icon, HStack, Text, Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { TabataExercise } from '../../types/workouts';

export type TabataCircuit = (TabataExercise | null)[];

const TabataItem = ({
    tabataCircuit,
    circuitIndex,
    updateExercise,
    moveTabataUp,
    moveTabataDown,
    removeTabata,
    updateExercisesOrder,
}): JSX.Element => (
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
        <DraggableFlatList<TabataExercise>
            data={tabataCircuit.slice(0, 4)}
            keyExtractor={(index): string => `exercise-${circuitIndex}-${index}`}
            renderItem={({ item, drag, getIndex }): JSX.Element => {
                const index = getIndex();

                return (
                    <HStack alignItems="center" justifyContent="space-between">
                        <Pressable flex={1} onPress={(): void => updateExercise(circuitIndex, index)}>
                            <Text style={item ? {} : { fontStyle: 'italic' }}>
                                {item?.name || `Select exercise ${index}`}
                            </Text>
                        </Pressable>
                        <IconButton icon={<Icon as={Ionicons} name="menu" />} onPress={drag} />
                    </HStack>
                );
            }}
            onDragEnd={({ data }): void => updateExercisesOrder(circuitIndex, data)}
        />
    </VStack>
);

export const BuildTabataScreen: React.FC = (): JSX.Element => {
    const [workoutName, setWorkoutName] = useState<string>('');
    const [tabatas, setTabatas] = useState<TabataCircuit[]>([
        [null, null, null, null],
    ]);

    const addTabata = (): void => {
        setTabatas([...tabatas, [null, null, null, null]]);
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

    const updateExercise = (tabataIndex: number, exerciseIndex: number): void => {
        console.log('Update exercise at Tabata:', tabataIndex, 'Exercise:', exerciseIndex);
        // Implement exercise update functionality
    };

    const saveWorkout = (): void => {
        // Implement workout save functionality
    };

    const updateExercisesOrder = (tabataIndex: number, newExercisesOrder: TabataExercise[]): void => {
        const updatedTabatas = [...tabatas];

        updatedTabatas[tabataIndex] = newExercisesOrder;
        setTabatas(updatedTabatas);
    };

    return (
        <VStack space={4}>
            <Input
                placeholder="Enter workout name"
                value={workoutName}
                onChangeText={setWorkoutName}
            />
            {tabatas.map((tabataCircuit, index) => (
                <TabataItem
                    circuitIndex={index}
                    key={`tabata-${index}`}
                    moveTabataDown={moveTabataDown}
                    moveTabataUp={moveTabataUp}
                    removeTabata={removeTabata}
                    tabataCircuit={tabataCircuit}
                    updateExercise={updateExercise}
                    updateExercisesOrder={updateExercisesOrder}

                />
            ))}
            <Button mt={2} onPress={addTabata}>Add Tabata</Button>
            <Button mt={2} onPress={saveWorkout}>Save Workout</Button>
        </VStack>
    );
};

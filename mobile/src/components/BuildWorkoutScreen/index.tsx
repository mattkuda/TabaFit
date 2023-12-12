import React, { useState } from 'react';
import {
    VStack, Input, Button, IconButton, Icon, HStack, Text,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { TabataExercise } from '../../types/workouts';

export type TabataCircuit = (TabataExercise | null)[]

const TabataItem = ({
    tabata,
    index,
    updateExercise,
    removeTabata,
    drag,
}): JSX.Element => (
    <VStack borderColor="coolGray.300" borderRadius="md" borderWidth={1} mb={4} mt={4} p={4} space={4}>
        <HStack alignItems="center" justifyContent="space-between">
            <Text bold fontSize="lg">
                Tabata
                {' '}
                {index + 1}
            </Text>
            <IconButton
                icon={<Icon as={Ionicons} color="red.600" name="close-circle" size="6" />}
                onPress={(): void => removeTabata(index)}
            />
        </HStack>
        {tabata.exercises.slice(0, 4).map((exercise, exerciseIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <Button key={exerciseIndex} variant="ghost" onPress={(): void => updateExercise(index, exerciseIndex)}>
                {exercise?.name || <Text style={{ fontStyle: 'italic' }}>Select exercise</Text>}
            </Button>
        ))}
        <IconButton icon={<Icon as={Ionicons} name="menu" size="md" />} onPress={drag} />
    </VStack>
);

export const BuildTabataScreen: React.FC = (): JSX.Element => {
    const [workoutName, setWorkoutName] = useState<string>('');
    const [tabatas, setTabatas] = useState<TabataCircuit[]>([
        [null, null, null, null], // Initialize with one empty tabata
    ]);

    const addTabata = (): void => {
        setTabatas([...tabatas, [null, null, null, null]]);
    };

    const removeTabata = (index: number): void => {
        setTabatas(tabatas.filter((_, i) => i !== index));
    };

    const updateExercise = (tabataIndex: number, exerciseIndex: number): void => {
    // You'll need to implement this function to update the exercise
        console.log('Update exercise at Tabata:', tabataIndex, 'Exercise:', exerciseIndex);
    };

    const saveWorkout = (): void => {
    // Use a mutation hook to save the workout
    };

    return (
        <VStack space={4}>
            <Input
                placeholder="Enter workout name"
                value={workoutName}
                onChangeText={setWorkoutName}
            />
            <DraggableFlatList<TabataCircuit>
                data={tabatas}
                keyExtractor={(item, index): string => `tabata-${index}`}
                renderItem={({
                    item, getIndex, drag,
                }): JSX.Element => (
                    <TabataItem
                        drag={drag}
                        index={getIndex()}
                        removeTabata={removeTabata}
                        tabata={item}
                        updateExercise={updateExercise}
                    />
                )}
                onDragEnd={({ data }): void => setTabatas(data)}
            />
            <Button mt={2} onPress={addTabata}>Add Tabata</Button>
            <Button mt={2} onPress={saveWorkout}>Save Workout</Button>
        </VStack>
    );
};

import React, { useState, useEffect } from 'react';
import {
    Button, Checkbox, VStack, HStack, Text, IconButton, Icon, ScrollView,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
import { TabataWorkout, TabataCircuit } from '../../types/workouts';

type CheckboxItemProps = {
    label: string;
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, value, setValue }) => (
    <Checkbox isChecked={value} value="" onChange={(): void => setValue(!value)}>
        {label}
    </Checkbox>
);

export const ShuffleScreen: React.FC = () => {
    // const navigation = useNavigation();
    const [includeUpper, setIncludeUpper] = useState<boolean>(true);
    const [includeLower, setIncludeLower] = useState<boolean>(false);
    const [includeAbs, setIncludeAbs] = useState<boolean>(true);
    const [includeCardio, setIncludeCardio] = useState<boolean>(false);
    // Add states for the new exercise types
    const [includeGlutes, setIncludeGlutes] = useState<boolean>(false);
    const [includeSpicy, setIncludeSpicy] = useState<boolean>(false);

    const [numTabatas, setNumTabatas] = useState<number>(9);
    const [shuffledWorkouts, setShuffledWorkouts] = useState<TabataWorkout[]>([]);

    // Placeholder for the actual shuffle function
    const shuffleWorkout = (): void => {
        console.log('Shuffling workout...');
        // TODO: Implement the shuffle logic based on selected types and number of Tabatas
        // This is where you would access your database or state management to fetch exercises
        // based on the selected types and then shuffle them into TabataCircuits

        // For now, we'll just create an array with dummy data
        // This should be replaced with your actual shuffling and selection logic
        const dummyTabataCircuit: TabataCircuit = [
            // ... populate with actual exercises based on selected types
        ];

        const dummyWorkout: TabataWorkout = {
            _id: '1',
            name: 'Shuffled Workout',
            description: 'This is a shuffled workout based on user preferences',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: 'user-id',
            warmupDuration: 10,
            tabatas: new Array(numTabatas).fill(dummyTabataCircuit),
            restDuration: 10,
            exerciseDuration: 20,
            circuits: numTabatas,
            intermisionDuration: 60,
            cooldownDuration: 0,
        };

        setShuffledWorkouts(new Array(numTabatas).fill(dummyWorkout));
    };

    useEffect(() => {
        shuffleWorkout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <VStack flex={1} px={4} space={4}>
            <HStack alignItems="center" justifyContent="space-between" pt={4}>
                {/* Reshuffle and Total Time */}
                <IconButton
                    icon={<Icon as={Ionicons} name="shuffle" />}
                    onPress={shuffleWorkout}
                />
                <Text fontSize="md">Total Time: 45:00</Text>
                {/* ... other header content */}
            </HStack>

            {/* Exercise type checkboxes */}
            <HStack alignItems="center" justifyContent="space-between">
                <CheckboxItem label="Upper" setValue={setIncludeUpper} value={includeUpper} />
                <CheckboxItem label="Lower" setValue={setIncludeLower} value={includeLower} />
                <CheckboxItem label="Abs" setValue={setIncludeAbs} value={includeAbs} />
                <CheckboxItem label="Cardio" setValue={setIncludeCardio} value={includeCardio} />
                <CheckboxItem label="Glutes" setValue={setIncludeGlutes} value={includeGlutes} />
                <CheckboxItem label="Spicy" setValue={setIncludeSpicy} value={includeSpicy} />
            </HStack>

            {/* +/- for numTabatas */}
            <HStack alignItems="center" justifyContent="center">
                <IconButton
                    icon={<Icon as={Ionicons} name="remove" />}
                    onPress={(): void => setNumTabatas((prev) => Math.max(prev - 1, 1))}
                />
                <Text mx={2}>
                    {numTabatas}
                    {' '}
                    Tabatas
                </Text>
                <IconButton
                    icon={<Icon as={Ionicons} name="add" />}
                    onPress={(): void => setNumTabatas((prev) => prev + 1)}
                />
            </HStack>

            {/* More button - to be implemented later */}
            <Button onPress={(): void => console.log('More settings')}>More</Button>

            {/* Scrollable Tabata Cards */}
            <ScrollView>
                {shuffledWorkouts.map((workout, index) => (
                    <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} key={workout._id} mt={2} p={4} space={2}>
                        <Text bold fontSize="md">
                            Tabata
                            {' '}
                            {index + 1}
                        </Text>
                        {workout.tabatas[index].map((exercise) => (
                            <Text key={exercise._id}>{exercise.name}</Text>
                        ))}
                    </VStack>
                ))}
            </ScrollView>

            {/* Pinned START button */}
            <Button bottom={0} position="absolute" width="100%" onPress={(): void => console.log('Start Workout')}>
                Start
            </Button>
        </VStack>
    );
};
import React, { useState, useEffect } from 'react';
import {
    Button, Checkbox, VStack, HStack, Text, IconButton, Icon, ScrollView,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
import { TabataWorkout } from '../../types/workouts';
import { shuffleWorkout } from './shuffleWorkouts';

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

    const [shuffledWorkout, setShuffledWorkout] = useState<TabataWorkout>();

    const triggerShuffle = (): void => {
        const workout = shuffleWorkout(
            numTabatas,
            includeUpper,
            includeLower,
            includeAbs,
            includeCardio,
        // Pass other types if needed
        );

        setShuffledWorkout(workout);
    };

    // Call the shuffleWorkout function to generate the workout
    useEffect(() => {
        triggerShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numTabatas, includeUpper, includeLower, includeAbs, includeCardio, includeGlutes, includeSpicy]);

    return (
        <VStack flex={1} px={4} space={4}>
            <HStack alignItems="center" justifyContent="space-between" pt={4}>
                {/* Reshuffle and Total Time */}
                <IconButton
                    icon={<Icon as={Ionicons} name="shuffle" />}
                    onPress={(): void => triggerShuffle()}
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
                {shuffledWorkout?.tabatas.map((circuit, index) => (
                    <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} mt={2} p={4} space={2}>
                        <Text bold fontSize="md">
                            Tabata
                            {' '}
                            {index + 1}
                        </Text>
                        {circuit.map((exercise) => (
                            <Text>{exercise.name}</Text> // Make sure each exercise has a unique key
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

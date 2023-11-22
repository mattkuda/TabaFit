import React, { useState, useEffect } from 'react';
import {
    Button, Checkbox, VStack, HStack, Text, IconButton, Icon, ScrollView,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSetRecoilState } from 'recoil';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { TabataTimerScreenNavigationProp } from '../../types/navigationTypes';
import { showFooterState } from '../../atoms/showFooterAtom';
import { TabataWorkout } from '../../types/workouts';
import { shuffleWorkout } from './shuffleWorkouts';
import { ShuffleScreenRouteProp } from '../../navigation/navigationTypes';

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
    const route = useRoute<ShuffleScreenRouteProp>();
    const routeWorkout = route.params?.workout;
    const [includeUpper, setIncludeUpper] = useState<boolean>(true);
    const [includeLower, setIncludeLower] = useState<boolean>(true);
    const [includeAbs, setIncludeAbs] = useState<boolean>(true);
    const [includeCardio, setIncludeCardio] = useState<boolean>(true);
    const [numTabatas, setNumTabatas] = useState<number>(6);
    const [shuffledWorkout, setShuffledWorkout] = useState<TabataWorkout>(routeWorkout);
    const setShowFooter = useSetRecoilState(showFooterState);
    const navigation = useNavigation<TabataTimerScreenNavigationProp>();
    const { authState } = useAuth();
    const userId = authState?.userId;

    useEffect(() => {
        setShowFooter(false);

        return () => {
            setShowFooter(true);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const triggerShuffle = (): void => {
        const workout = shuffleWorkout(
            numTabatas,
            includeUpper,
            includeLower,
            includeAbs,
            includeCardio,
            userId,
        );

        setShuffledWorkout(workout);
    };

    // Call the shuffleWorkout function to generate the workout
    useEffect(() => {
        if (!routeWorkout) {
            triggerShuffle();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Call the shuffleWorkout function to generate the workout
    useEffect(() => {
        triggerShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numTabatas, includeUpper, includeLower, includeAbs, includeCardio]);

    useFocusEffect(
        React.useCallback(() => {
            if (!route.params?.workout) {
                const workout = shuffleWorkout(
                    numTabatas,
                    includeUpper,
                    includeLower,
                    includeAbs,
                    includeCardio,
                    userId,
                );

                setShuffledWorkout(workout);
            } else {
                setShuffledWorkout(route.params.workout);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [route.params?.workout]),
    );

    const handleStartWorkout = (): void => {
        // Navigate to the WorkoutTimerPage with the shuffledWorkout
        if (shuffledWorkout) {
            navigation.navigate('TabataTimer', { workout: shuffledWorkout });
        }
    };

    return (
        <VStack flex={1} px={4} space={4}>
            <HStack alignItems="center" justifyContent="space-between" pt={4}>
                <Button onPress={(): void => navigation.goBack()}>Go Back</Button>
                <IconButton
                    icon={<Icon as={Ionicons} name="shuffle" />}
                    onPress={(): void => triggerShuffle()}
                />
                <Text fontSize="md">Total Time: 45:00</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
                <CheckboxItem label="Upper" setValue={setIncludeUpper} value={includeUpper} />
                <CheckboxItem label="Lower" setValue={setIncludeLower} value={includeLower} />
                <CheckboxItem label="Abs" setValue={setIncludeAbs} value={includeAbs} />
                <CheckboxItem label="Cardio" setValue={setIncludeCardio} value={includeCardio} />
            </HStack>
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
                <Text mx={2}>
                    Route workout:
                    {' '}
                    {routeWorkout ? 'Y' : 'N'}
                </Text>
            </HStack>
            {/* More button - to be implemented later */}
            <Button onPress={(): void => console.log('More settings')}>More</Button>
            <ScrollView>
                {shuffledWorkout?.tabatas.map((circuit, index) => (
                    <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} mt={2} p={4} space={2}>
                        <Text bold fontSize="md">
                            Tabata
                            {' '}
                            {index + 1}
                        </Text>
                        {circuit.slice(0, 4).map((exercise) => (
                            <Text>{exercise.name}</Text>
                        ))}
                    </VStack>
                ))}
            </ScrollView>
            {/* Pinned START button */}
            <Button bottom={0} position="absolute" width="100%" onPress={(): void => handleStartWorkout()}>
                Start
            </Button>
        </VStack>
    );
};

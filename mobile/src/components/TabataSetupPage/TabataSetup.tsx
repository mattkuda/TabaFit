import React, { useState, useEffect } from 'react';
import {
    Button, Input, Text, VStack, HStack, Icon, IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const calculateWorkoutTime = (
    warmup: number,
    work: number,
    rest: number,
    exercises: number,
    circuits: number,
    intermission: number,
    cooldown: number,
): number => warmup + cooldown + (work + rest) * exercises * circuits + intermission * (circuits - 1);

const IntervalInput = ({ label, value, setValue }): JSX.Element => (
    <HStack alignItems="center" space={4}>
        <Text>
            {label}
            :
            {' '}
        </Text>
        <Input
            keyboardType="number-pad"
            value={String(value)}
            w="50"
            onChangeText={(val): void => setValue(Number(val))}
        />
    </HStack>
);

export const TabataSetup = ({ navigation }): JSX.Element => {
    const [warmup, setWarmup] = useState(10);
    const [work, setWork] = useState(20);
    const [rest, setRest] = useState(10);
    const [exercises, setExercises] = useState(8);
    const [circuits, setCircuits] = useState(4);
    const [intermission, setIntermission] = useState(60);
    const [cooldown, setCooldown] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    useEffect(() => {
        const time = calculateWorkoutTime(
            warmup,
            work,
            rest,
            exercises,
            circuits,
            intermission,
            cooldown,
        );

        setTotalTime(time);
    }, [warmup, work, rest, exercises, circuits, intermission, cooldown]);

    const handleStartButtonPress = (): void => {
        navigation.navigate('Workout', {
            screen: 'WorkoutTimerPage',
            params: {
                warmup,
                work,
                rest,
                exercises,
                circuits,
                intermission,
                cooldown,
            },
        });
    };

    return (
        <VStack alignItems="center" space={4}>
            <IconButton
                icon={<Icon as={Ionicons} name="arrow-back" />}
                left={0}
                position="absolute"
                top={0}
                onPress={(): void => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'WorkoutsPage' }],
                    });
                    navigation.navigate('WorkoutsPage');
                }}
            />
            <Text>
                Total Workout Time:
                {' '}
                {totalTime}
                {' '}
                seconds
            </Text>
            <IntervalInput label="Warmup" setValue={setWarmup} value={warmup} />
            <IntervalInput label="Work" setValue={setWork} value={work} />
            <IntervalInput label="Rest" setValue={setRest} value={rest} />
            <IntervalInput label="Exercises" setValue={setExercises} value={exercises} />
            <IntervalInput label="Circuits" setValue={setCircuits} value={circuits} />
            <IntervalInput label="Intermission" setValue={setIntermission} value={intermission} />
            <IntervalInput label="Cooldown" setValue={setCooldown} value={cooldown} />
            <Button
                colorScheme="danger"
                onPress={handleStartButtonPress}
            >
                Start
            </Button>
        </VStack>
    );
};

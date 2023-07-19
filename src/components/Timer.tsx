import React, { useState, useEffect } from 'react';
import {
    VStack, Text, Button, IconButton, Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { useSetRecoilState } from 'recoil';
import { TabNavigatorParamList, TimerScreenNavigationProp } from '../types/navigationTypes';
import { showFooterState } from '../atoms/showFooterAtom';

type TimerProps = {
    route: RouteProp<TabNavigatorParamList, 'Timer'>;
};

export const Timer: React.FC<TimerProps> = ({ route }) => {
    const {
        warmup, work, rest, exercises: exercisesParam, circuits, intermission, cooldown,
    } = route.params;

    const navigation = useNavigation<TimerScreenNavigationProp>();
    const [currentInterval, setCurrentInterval] = useState('warmup');
    const [exercisesDone, setExercisesDone] = useState(0);
    const [circuitsDone, setCircuitsDone] = useState(0);
    const [seconds, setSeconds] = useState(warmup);
    const [isActive, setIsActive] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const setShowFooter = useSetRecoilState(showFooterState);

    useEffect(() => {
        setShowFooter(false); // Hide the tab bar when the Timer component is mounted

        return () => {
            setShowFooter(true); // Show the tab bar when the Timer component is unmounted
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = (): void => {
        setIsActive(!isActive);
    };

    const reset = (): void => {
        setIsReset(true);
        setIsActive(false);
        setCurrentInterval('warmup');
        setExercisesDone(0);
        setCircuitsDone(0);
        setSeconds(warmup);
        setRemainingTime(totalWorkoutTime);
    };

    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - (hours * 3600)) / 60);
        const currSeconds = time - (hours * 3600) - (minutes * 60);

        const hoursStr = hours < 10 ? `0${hours}` : hours;
        const minsStr = minutes < 10 ? `0${minutes}` : minutes;
        const secsStr = seconds < 10 ? `0${currSeconds}` : currSeconds;

        return hours > 0 ? `${hoursStr}:${minsStr}:${secsStr}` : `${minsStr}:${secsStr}`;
    };

    useEffect(() => {
        setTotalWorkoutTime(warmup + circuits * (exercisesParam * (work + rest)
        + intermission) + cooldown - intermission);
        setRemainingTime(warmup + circuits * (exercisesParam * (work + rest) + intermission) + cooldown - intermission);
    }, [warmup, work, rest, exercisesParam, circuits, intermission, cooldown]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && !isReset) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                    setRemainingTime(remainingTime - 1);
                } else if (currentInterval === 'warmup') {
                    setCurrentInterval('work');
                    setSeconds(work);
                } else if (currentInterval === 'work' && exercisesDone < exercisesParam - 1) {
                    setCurrentInterval('rest');
                    setSeconds(rest);
                    setExercisesDone(exercisesDone + 1);
                } else if (currentInterval === 'work' && exercisesDone === exercisesParam - 1) {
                    setCurrentInterval('rest');
                    setSeconds(rest);
                    setExercisesDone(0);
                    setCircuitsDone(circuitsDone + 1);
                } else if (currentInterval === 'rest' && exercisesDone < exercisesParam - 1) {
                    setCurrentInterval('work');
                    setSeconds(work);
                    setExercisesDone(exercisesDone + 1);
                } else if (currentInterval === 'rest' && exercisesDone === exercisesParam - 1 && circuitsDone < circuits - 1) {
                    setCurrentInterval('intermission');
                    setSeconds(intermission);
                } else if (currentInterval === 'intermission' && circuitsDone < circuits - 1) {
                    setCurrentInterval('work');
                    setSeconds(work);
                } else if (circuitsDone === circuits - 1 && currentInterval !== 'cooldown') {
                    setCurrentInterval('cooldown');
                    setSeconds(cooldown);
                } else if (currentInterval === 'cooldown') {
                    setIsActive(false);
                }
            }, 1000);
        } else if (!isActive && seconds !== 0 && !isReset) {
            if (interval) {
                clearInterval(interval);
            }
        } else if (isReset) {
            setIsReset(false);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, seconds, isReset, exercisesParam, work, circuits,
        currentInterval, remainingTime, cooldown, intermission,
        exercisesDone, circuitsDone, rest]);

    return (
        <VStack alignItems="center" space={4}>
            <IconButton
                icon={<Icon as={Ionicons} name="arrow-back" />}
                left={0}
                position="absolute"
                top={0}
                onPress={(): void => navigation.navigate('Home')}
            />
            <Text>{`Total remaining time: ${formatTime(remainingTime)}`}</Text>
            {/* eslint-disable-next-line no-nested-ternary */}
            <Text color={currentInterval === 'work' ? 'green.500' : currentInterval === 'cooldown' ? 'orange.500' : 'yellow.500'} fontSize="6xl">
                {formatTime(seconds)}
            </Text>

            <Text>{`${exercisesDone}/${exercisesParam} exercises done`}</Text>
            <Text>{`${circuitsDone}/${circuits} circuits done`}</Text>
            <Text>{`Current: ${currentInterval.toUpperCase()}`}</Text>
            <Button onPress={toggle}>{isActive ? 'Pause' : 'Start'}</Button>
            <Button onPress={reset}>Reset</Button>
        </VStack>
    );
};

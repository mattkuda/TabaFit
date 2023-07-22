import React, { useState, useEffect } from 'react';
import {
    VStack, Text, Button, IconButton, Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { useSetRecoilState } from 'recoil';
import { TabNavigatorParamList, TimerScreenNavigationProp } from '../../types/navigationTypes';
import { showFooterState } from '../../atoms/showFooterAtom';
import { Intervals } from '../../util/constants';

type WorkoutTimerPageProps = {
    route: RouteProp<TabNavigatorParamList, 'WorkoutTimerPage'>;
};

export const WorkoutTimerPage: React.FC<WorkoutTimerPageProps> = ({ route }) => {
    const {
        warmupDuration, exerciseDuration, restDuration,
        exercises, circuits,
        intermisionDuration, cooldownDuration,
    } = route.params;

    const navigation = useNavigation<TimerScreenNavigationProp>();
    const [currentInterval, setCurrentInterval] = useState<Intervals>(Intervals.Warmup);
    const [exercisesDone, setExercisesDone] = useState(0);
    const [circuitsDone, setCircuitsDone] = useState(0);
    const [seconds, setSeconds] = useState(warmupDuration);
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
        setCurrentInterval(Intervals.Warmup);
        setExercisesDone(0);
        setCircuitsDone(0);
        setSeconds(warmupDuration);
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
        setTotalWorkoutTime(warmupDuration + circuits * (exercises.length * (exerciseDuration + restDuration)
        + intermisionDuration) + cooldownDuration - intermisionDuration);
        setRemainingTime(warmupDuration + circuits * (
            exercises.length * (exerciseDuration + restDuration) + intermisionDuration)
        + cooldownDuration - intermisionDuration);
    }, [warmupDuration, exerciseDuration, restDuration, exercises,
        circuits, intermisionDuration, cooldownDuration]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && !isReset) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                    setRemainingTime(remainingTime - 1);
                } else {
                    switch (currentInterval) {
                        case Intervals.Warmup:
                            setCurrentInterval(Intervals.Exercise);
                            setSeconds(exerciseDuration);
                            break;
                        case Intervals.Exercise:
                            setCurrentInterval(Intervals.Rest);
                            setSeconds(restDuration);
                            break;
                        case Intervals.Rest:
                            if (exercisesDone < exercises.length - 1) {
                                setCurrentInterval(Intervals.Exercise);
                                setSeconds(exerciseDuration);
                                setExercisesDone(exercisesDone + 1);
                            } else {
                                setCurrentInterval(Intervals.Intermission);
                                setSeconds(intermisionDuration);
                                setCircuitsDone(circuitsDone + 1);
                            }
                            break;
                        case Intervals.Intermission:
                            if (circuitsDone < circuits - 1) {
                                setCurrentInterval(Intervals.Exercise);
                                setSeconds(exerciseDuration);
                                setExercisesDone(0);
                            } else {
                                setCurrentInterval(Intervals.Cooldown);
                                setSeconds(cooldownDuration);
                            }
                            break;
                        case Intervals.Cooldown:
                            setIsActive(false);
                            break;
                        default: break;
                    }
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
    }, [isActive, seconds, isReset,
        exercises, exerciseDuration, circuits,
        currentInterval, remainingTime, cooldownDuration, intermisionDuration,
        exercisesDone, circuitsDone, restDuration]);

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
            <Text>{`Total remaining time: ${formatTime(remainingTime)}`}</Text>
            {/* eslint-disable-next-line no-nested-ternary */}
            <Text color={currentInterval === Intervals.Exercise ? 'green.500' : currentInterval === Intervals.Cooldown ? 'orange.500' : 'yellow.500'} fontSize="6xl">
                {formatTime(seconds)}
            </Text>
            {/* TODO: Write formatters for exercise ands circuit displays */}
            <Text>
                Exercises:
                {' '}
                {currentInterval === Intervals.Intermission || currentInterval === Intervals.Warmup ? `0/${exercises.length}` : `${exercisesDone + 1}/${exercises.length}`}
            </Text>
            <Text>
                Circuits:
                {' '}
                {currentInterval === Intervals.Intermission && `0/${circuits}`}
                {currentInterval !== Intervals.Intermission
                && (circuitsDone === 0 && currentInterval === Intervals.Warmup)
                    ? `0/${circuits}`
                    : `${circuitsDone + 1}/${circuits}`}

            </Text>
            <Text>{`Current: ${currentInterval.toUpperCase()}`}</Text>
            <Button onPress={toggle}>{isActive ? 'Pause' : 'Start'}</Button>
            <Button onPress={reset}>Reset</Button>
        </VStack>
    );
};

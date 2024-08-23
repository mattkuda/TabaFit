/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable global-require */
import React, {
    useState, useEffect, useCallback,
} from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import {
    VStack, Text, IconButton, Icon,
    Box, Flex,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSetRecoilState } from 'recoil';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabataTimerScreenRouteProp } from '../../navigation/navigationTypes';
import { TabataExercise } from '../../types/workouts';
import { Intervals } from '../../util/constants';
import { TimerScreenNavigationProp } from '../../types/navigationTypes';
import { showFooterState } from '../../atoms/showFooterAtom';
import { calculateTotalWorkoutTime, formatTime } from './util';
import { GradientVStack } from '../common/GradientVStack';

const sounds = {
    beep: require('../../../assets/sounds/beep.wav'),
};

export const TabataTimerScreen = (): JSX.Element => {
    const route = useRoute<TabataTimerScreenRouteProp>();
    const {
        warmupDuration, exerciseDuration, restDuration,
        tabatas, exercisesPerTabata, numberOfTabatas,
        intermisionDuration, cooldownDuration,
    } = route.params.workout;
    const { isInMyWorkouts } = route.params;

    const navigation = useNavigation<TimerScreenNavigationProp>();
    const [currentInterval, setCurrentInterval] = useState<Intervals>(Intervals.Warmup);
    const [exercisesDone, setExercisesDone] = useState(0);
    const [circuitsDone, setCircuitsDone] = useState(0);
    const [seconds, setSeconds] = useState(warmupDuration);
    const [isActive, setIsActive] = useState(true);
    const [isReset, setIsReset] = useState(false);
    const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [currentExercise, setCurrentExercise] = useState<TabataExercise | null>(null);
    const currentTabata = tabatas[circuitsDone];
    const setShowFooter = useSetRecoilState(showFooterState);
    const [hasStartPlayed, setHasStartPlayed] = useState(false);
    const insets = useSafeAreaInsets();
    const [sound, setSound] = useState<Audio.Sound>();

    useKeepAwake();

    async function playSound(name: string): Promise<void> {
        const soundToPlay = sounds[name.toLowerCase()];
        const { sound: newSound } = await Audio.Sound.createAsync(soundToPlay, { shouldPlay: true });

        setSound(newSound);

        await newSound.playAsync();
    }

    const speak = (text: string): void => {
        Speech.speak(text, {
            language: 'en-US',
            pitch: 1.0,
            rate: 1.0,
        });
    };

    useEffect(() => {
        if (!hasStartPlayed) {
            Speech.speak('Starting your tabata workout');
            setHasStartPlayed(true);
        }
    }, [hasStartPlayed]);

    useEffect(() => (sound
        ? (): void => {
            sound.unloadAsync();
        }
        : undefined), [sound]);
    useFocusEffect(
        useCallback(() => {
            setShowFooter(false);

            return () => setShowFooter(true);
        }, [setShowFooter]),
    );

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
        setCurrentExercise(null);
    };

    const navigateToSharePostScreen = (): void => {
        navigation.navigate('ShareWorkoutScreen', {
            // Pass any data you need for sharing the workout
            workout: route.params.workout,
            completedAt: new Date(),
            isInMyWorkouts,
        });
    };

    const mockFinish = (): void => {
        reset();
        navigation.navigate('ShareWorkoutScreen', {
            // Pass any data you need for sharing the workout
            workout: route.params.workout,
            completedAt: new Date(),
            isInMyWorkouts,
        });
    };

    useEffect(() => {
        const calculatedTotal = calculateTotalWorkoutTime(
            warmupDuration,
            exerciseDuration,
            restDuration,
            numberOfTabatas,
            exercisesPerTabata,
            intermisionDuration,
            cooldownDuration,
        );

        setTotalWorkoutTime(calculatedTotal);
        setRemainingTime(calculatedTotal);
    }, [warmupDuration, exerciseDuration, restDuration, numberOfTabatas,
        exercisesPerTabata, intermisionDuration, cooldownDuration]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && !isReset) {
            interval = setInterval(() => {
                let nextInterval = currentInterval;
                let nextSeconds = seconds;
                let nextExercise = currentExercise;
                let nextExercisesDone = exercisesDone;
                let nextCircuitsDone = circuitsDone;

                if (seconds > 1) {
                    nextSeconds = seconds - 1;
                } else {
                    switch (currentInterval) {
                        case Intervals.Warmup:
                            nextInterval = Intervals.Exercise;
                            nextSeconds = exerciseDuration;
                            [nextExercise] = currentTabata;
                            break;
                        case Intervals.Exercise:
                            nextInterval = Intervals.Rest;
                            nextSeconds = restDuration;
                            nextExercise = null;
                            break;
                        case Intervals.Rest:
                            if (exercisesDone < 8 - 1) {
                                nextInterval = Intervals.Exercise;
                                nextSeconds = exerciseDuration;
                                nextExercisesDone = exercisesDone + 1;
                                nextExercise = currentTabata[nextExercisesDone > 3
                                    ? nextExercisesDone - 4 : nextExercisesDone];
                            } else {
                                if (circuitsDone < numberOfTabatas - 1) {
                                    // Only go to Intermission if there are more circuits to go
                                    nextInterval = Intervals.Intermission;
                                    nextSeconds = intermisionDuration;
                                } else {
                                    // If it was the last circuit, go to Cooldown
                                    nextInterval = Intervals.Cooldown;
                                    nextSeconds = cooldownDuration;
                                }
                                nextExercise = null;
                                nextCircuitsDone = circuitsDone + 1;
                            }
                            break;
                        case Intervals.Intermission:
                            nextInterval = Intervals.Exercise;
                            nextSeconds = exerciseDuration;
                            nextExercisesDone = 0;
                            [nextExercise] = currentTabata;
                            break;
                        case Intervals.Cooldown:
                            setIsActive(false);
                            clearInterval(interval);
                            speak('Workout complete');
                            navigateToSharePostScreen();
                            return;
                        default:
                            break;
                    }
                }

                if (nextSeconds === 3 || nextSeconds === 2 || nextSeconds === 1) {
                    playSound('beep');
                } else if (nextInterval === Intervals.Exercise) {
                    if (nextSeconds === exerciseDuration) {
                        speak(nextExercise?.name ?? 'Exercise');
                    }
                } else if (nextInterval === Intervals.Rest && nextSeconds === restDuration) {
                    speak('Rest');
                } else if (nextSeconds === 6 && (currentInterval === Intervals.Rest
                    || currentInterval === Intervals.Intermission
                    || currentInterval === Intervals.Warmup)) {
                    speak('Next up');
                } else if (nextSeconds === 5 && (currentInterval === Intervals.Rest
                    || currentInterval === Intervals.Intermission
                    || currentInterval === Intervals.Warmup)) {
                    const exerciseName = currentTabata[nextExercisesDone]?.name
                        || (exercisesDone === exercisesPerTabata ? 'minute rest' : currentTabata[0]?.name);

                    speak(exerciseName);
                }

                setCurrentInterval(nextInterval);
                setSeconds(nextSeconds);
                setCurrentExercise(nextExercise);
                setExercisesDone(nextExercisesDone);
                setCircuitsDone(nextCircuitsDone);
                setRemainingTime(remainingTime - 1);
            }, 1000);
        } else if (!isActive && isReset) {
            clearInterval(interval);
            setIsReset(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, isReset, seconds, remainingTime, currentInterval, exercisesDone, circuitsDone,
        warmupDuration, exerciseDuration, restDuration, exercisesPerTabata, numberOfTabatas,
        intermisionDuration, cooldownDuration, currentTabata, currentExercise]);

    const handleSkip = (): void => {
        let nextInterval = currentInterval;
        let nextSeconds = 0;
        let nextExercise = currentExercise;
        let nextExercisesDone = exercisesDone;
        let nextCircuitsDone = circuitsDone;

        const timeSkipped = seconds; // Capture the time being skipped

        if (currentInterval === Intervals.Warmup) {
            nextInterval = Intervals.Exercise;
            nextSeconds = exerciseDuration;
            [nextExercise] = currentTabata;
        } else if (currentInterval === Intervals.Exercise) {
            nextInterval = Intervals.Rest;
            nextSeconds = restDuration;
            nextExercise = null;
        } else if (currentInterval === Intervals.Rest) {
            if (exercisesDone < exercisesPerTabata - 1) {
                nextInterval = Intervals.Exercise;
                nextSeconds = exerciseDuration;
                nextExercisesDone = exercisesDone + 1;
                nextExercise = currentTabata[nextExercisesDone > 3
                    ? nextExercisesDone - 4 : nextExercisesDone];
            } else {
                if (circuitsDone < numberOfTabatas - 1) {
                    nextInterval = Intervals.Intermission;
                    nextSeconds = intermisionDuration;
                } else {
                    nextInterval = Intervals.Cooldown;
                    nextSeconds = cooldownDuration;
                }
                nextExercise = null;
                nextCircuitsDone = circuitsDone + 1;
            }
        } else if (currentInterval === Intervals.Intermission) {
            nextInterval = Intervals.Exercise;
            nextSeconds = exerciseDuration;
            nextExercisesDone = 0;
            [nextExercise] = currentTabata;
        } else if (currentInterval === Intervals.Cooldown) {
            setIsActive(false);
            speak('Workout complete');
            navigateToSharePostScreen();
            return;
        }

        setCurrentInterval(nextInterval);
        setSeconds(nextSeconds);
        setCurrentExercise(nextExercise);
        setExercisesDone(nextExercisesDone);
        setCircuitsDone(nextCircuitsDone);
        setRemainingTime((prev) => prev - timeSkipped); // Adjust remaining time correctly
    };

    const formatSplitTime = (input: number): { minutes: string, secs: string } => {
        const formattedTime = formatTime(input);
        const [minutes, secs] = formattedTime.split(':');

        return { minutes, secs };
    };

    const nextExerciseText: string = ((): string => {
        if (currentInterval === Intervals.Warmup) {
            return currentTabata[0].name;
        } if (currentInterval === Intervals.Rest && exercisesDone < exercisesPerTabata - 1) {
            return currentTabata[exercisesDone >= 3 ? exercisesDone - 3 : exercisesDone + 1].name;
        } if (currentInterval === Intervals.Intermission) {
            return currentTabata[0].name;
        }
        return '';
    })();

    return (
        <GradientVStack
            flex={1}
            style={{
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: insets.top,
            }}
        >
            <Flex align="center" direction="row" justify="space-between" mb="4" pl={4} pr={4} w="100%">
                <VStack alignItems="center" space={2}>
                    <Text color="gray.200" fontSize="lg">Exercises</Text>
                    <Text fontSize="xl">
                        {currentInterval === Intervals.Intermission || currentInterval === Intervals.Warmup
                            ? `0/${exercisesPerTabata}`
                            : `${exercisesDone + 1}/${exercisesPerTabata}`}
                    </Text>
                </VStack>
                <VStack alignItems="center" space={2}>
                    <Text color="gray.200" fontSize="lg">Tabatas</Text>
                    <Text fontSize="xl">
                        {currentInterval === Intervals.Intermission && `0/${numberOfTabatas}`}
                        {currentInterval === Intervals.Exercise || currentInterval === Intervals.Rest || currentInterval === Intervals.Cooldown
                            ? `${circuitsDone + 1}/${numberOfTabatas}`
                            : `${circuitsDone}/${numberOfTabatas}`}
                    </Text>
                </VStack>
                <VStack alignItems="center" space={2}>
                    <Text color="gray.200" fontSize="lg">Total Time</Text>
                    <Text fontSize="xl">{formatTime(remainingTime)}</Text>
                </VStack>
            </Flex>
            {/* This is very hacky codee to replicate a monospaced font */}
            <Flex alignItems="flex-end" direction="row" flex={1}>
                <Text
                    color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Cooldown ? 'flame.500' : 'yellow.500'}
                    flex={1}
                    style={{
                        fontSize: 150,
                        textAlign: 'right',
                        height: 135,
                        lineHeight: 165,
                    }}
                >
                    {formatSplitTime(seconds).minutes}
                </Text>
                <Text
                    color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Cooldown ? 'flame.500' : 'yellow.500'}
                    style={{
                        fontSize: 150,
                        textAlign: 'center',
                        height: 135,
                        lineHeight: 150,
                    }}
                >
                    :
                </Text>
                <Text
                    color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Cooldown ? 'flame.500' : 'yellow.500'}
                    flex={1}
                    style={{
                        fontSize: 150,
                        textAlign: 'left',
                        height: 135,
                        lineHeight: 165,
                    }}
                >
                    {formatSplitTime(seconds).secs}
                </Text>
            </Flex>
            <VStack alignItems="center" flex={1} justifyContent="flex-start" space={2}>
                <Text
                    bold
                    // eslint-disable-next-line no-nested-ternary
                    color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Cooldown ? 'flame.500' : 'yellow.500'}
                    style={{ fontSize: 40, textAlign: 'center', lineHeight: 50 }}
                >
                    {currentExercise ? currentExercise.name.toUpperCase() : (currentInterval === Intervals.Warmup
                        ? 'GET READY!' : currentInterval.toUpperCase())}
                </Text>
                <Box alignItems="center" flex={1} justifyContent="center">
                    {nextExerciseText && (
                        <Text bold color="gray.300" style={{ fontSize: 40, textAlign: 'center', lineHeight: 50 }}>
                            {`NEXT UP: ${nextExerciseText.toUpperCase()}`}
                        </Text>
                    )}
                </Box>
            </VStack>
            {/* Controls row */}
            <Box mb={4} mt={-4} p="4" width="100%">
                <Flex
                    alignItems="center"
                    direction="row"
                    // @ts-expect-error
                    gap={6}
                    justify="center"
                >
                    {isActive ? (
                        <Box alignItems="center" flexDirection="row" justifyContent="flex-end" width="70px">
                            <IconButton
                                alignSelf="right"
                                borderColor="gray.300"
                                borderRadius="full"
                                borderWidth="1"
                                icon={<Icon as={Ionicons} color="white" name="flag" size="lg" />}
                                w="46px"
                                onPress={mockFinish}
                            />
                        </Box>
                    ) : (
                        <Box alignItems="center" flexDirection="row" justifyContent="flex-end" width="70px">
                            <IconButton
                                borderColor="gray.300"
                                borderRadius="full"
                                borderWidth="1"
                                icon={<Icon as={Ionicons} color="white" name="close" size="lg" />}
                                onPress={(): void => navigation.navigate('WorkoutsScreen')}
                            />
                        </Box>
                    )}
                    <IconButton
                        borderColor="gray.300"
                        borderRadius="full"
                        borderWidth="1"
                        height={100}
                        icon={<Icon as={Ionicons} color="white" name={isActive ? 'pause' : 'play'} pl={isActive ? 0 : 1} size="6xl" />}
                        width={100}
                        onPress={toggle}
                    />
                    <Box width="70px">
                        <IconButton
                            borderColor="gray.300"
                            borderRadius="full"
                            borderWidth="1"
                            icon={<Icon as={Ionicons} color="white" name="play-skip-forward" size="lg" />}
                            w="46px"
                            onPress={handleSkip}
                        />
                    </Box>

                </Flex>
            </Box>
        </GradientVStack>
    );
};

/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable global-require */
import React, {
    useState, useEffect, useCallback, useRef,
} from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import {
    VStack, Text, IconButton, Icon, Box, Flex, Image,
    useTheme, HStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSetRecoilState } from 'recoil';
import { Audio, ResizeMode, Video } from 'expo-av';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Animated } from 'react-native';
import { TabataTimerScreenRouteProp } from '../../navigation/navigationTypes';
import { TabataExercise } from '../../types/workouts';
import { Intervals } from '../../util/constants';
import { TimerScreenNavigationProp } from '../../types/navigationTypes';
import { showFooterState } from '../../atoms/showFooterAtom';
import { calculateTotalWorkoutTime, formatTime } from './util';
import { GradientVStack } from '../common/GradientVStack';
import { exerciseIconDictionary } from '../../util/util';
import { videoAssets } from '../../utils/videoAssets';

const WARMUP_DURATION = 10;
const sounds = {
    beep: require('../../../assets/sounds/beep.wav'),
    victory: require('../../../assets/sounds/victory-horns.wav'),
};

const getVideoSource = (exerciseId: string): any => (exerciseId in videoAssets ? videoAssets[exerciseId] : null);

const getNextUpExercise = (
    currentInterval: Intervals,
    exercisesDone: number,
    exercisesPerTabata: number,
    currentTabata: TabataExercise[],
    // circuitsDone: number,
): TabataExercise | null => {
    if (currentInterval === Intervals.Warmup) {
        return currentTabata[0];
    }
    if (currentInterval === Intervals.Rest && exercisesDone < exercisesPerTabata - 1) {
        return currentTabata[exercisesDone >= 3 ? exercisesDone - 3 : exercisesDone + 1];
    }
    if (currentInterval === Intervals.Intermission) {
        return currentTabata[0];
    }
    if (currentInterval === Intervals.Rest) {
        return currentTabata[exercisesDone] || null;
    }
    return null;
};

const shouldShowNextExerciseVideo = (
    currentInterval: Intervals,
    seconds: number,
    exercisesDone: number,
    exercisesPerTabata: number,
    circuitsDone: number,
    numberOfTabatas: number,
): boolean => {
    if (seconds > 6) return false;
    if (currentInterval === Intervals.Warmup) return true;
    if (currentInterval === Intervals.Rest && exercisesDone < exercisesPerTabata - 1) return true;
    if (currentInterval === Intervals.Intermission && circuitsDone < numberOfTabatas - 1) return true;
    return false;
};

export const TabataTimerScreen = (): JSX.Element => {
    const route = useRoute<TabataTimerScreenRouteProp>();
    const {
        exerciseDuration, restDuration,
        tabatas, exercisesPerTabata, numberOfTabatas,
        intermisionDuration,
    } = route.params.workout;
    const { isInMyWorkouts } = route.params;
    const ref = useRef(null);

    const navigation = useNavigation<TimerScreenNavigationProp>();
    const [currentInterval, setCurrentInterval] = useState<Intervals>(Intervals.Warmup);
    const [exercisesDone, setExercisesDone] = useState(0);
    const [circuitsDone, setCircuitsDone] = useState(0);
    const [seconds, setSeconds] = useState(WARMUP_DURATION);
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
    const { colors } = useTheme();
    const [videoSource, setVideoSource] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(1));

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
        setSeconds(WARMUP_DURATION);
        setRemainingTime(totalWorkoutTime + WARMUP_DURATION);
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

    const handleWorkoutComplete = (): void => {
        // Play victory sound (async call)
        setIsActive(false);
        // clearInterval(interval);
        playSound('victory');
        // Speak completion message (async call)
        const message = `Workout complete. You completed ${tabatas.length} ${tabatas.length === 1 ? 'Tabata' : 'Tabatas'} and exercised for ${totalWorkoutTime / 60} minutes.`;

        setTimeout(() => {
            speak(message);
        }, 2000);
        navigateToSharePostScreen();
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
            exerciseDuration,
            restDuration,
            numberOfTabatas,
            exercisesPerTabata,
            intermisionDuration,
        );

        setTotalWorkoutTime(calculatedTotal);
        setRemainingTime(calculatedTotal + WARMUP_DURATION);
    }, [exerciseDuration, restDuration, numberOfTabatas,
        exercisesPerTabata, intermisionDuration]);

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
                            // setCurrentExercise(nextExercise); // Force the state update here
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
                                    handleWorkoutComplete();
                                    return;
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
                    const exerciseName = getNextUpExercise(currentInterval, exercisesDone, exercisesPerTabata, currentTabata)?.name;

                    if (exerciseName?.length) {
                        speak(`Next up: ${exerciseName}`);
                    }
                }

                setCurrentExercise(nextExercise);
                setCurrentInterval(nextInterval);
                setSeconds(nextSeconds);
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
        exerciseDuration, restDuration, exercisesPerTabata, numberOfTabatas,
        intermisionDuration, currentTabata, currentExercise]);

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
                    handleWorkoutComplete();
                    return;
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
            handleWorkoutComplete();
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

    const nextExerciseText = getNextUpExercise(currentInterval, exercisesDone, exercisesPerTabata, currentTabata)?.name;
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const animationRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            animationRef.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnimation, {
                        toValue: 1.1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            );
            animationRef.current.start();
        } else if (animationRef.current) {
            animationRef.current.stop();
        }

        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, [isActive, currentExercise, scaleAnimation]);

    // Define the color logic with the hex values from the theme
    const iconColor = currentInterval === Intervals.Exercise
        // @ts-ignore
        ? colors.easyGreen // Access the 'easyGreen' color's hex value
        : currentInterval === Intervals.Intermission
            // @ts-ignore
            ? colors.flame[500]
            : colors.yellow[500];

    useEffect(() => {
        const nextExercise = getNextUpExercise(currentInterval, exercisesDone, exercisesPerTabata, currentTabata);
        const newVideoSource = getVideoSource((currentExercise || nextExercise)?._id || 'default');

        if (newVideoSource !== videoSource) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVideoSource(newVideoSource);
                if (ref.current) {
                    ref.current.loadAsync(newVideoSource);
                }
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [currentExercise, currentInterval, exercisesDone, exercisesPerTabata, currentTabata, fadeAnim, videoSource]);

    return (
        <GradientVStack
            flex={1}
            style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
        >
            {/* Progression Row */}
            <Flex align="center" direction="row" justify="space-between" pb={2} px={4} style={{ flex: 0 }} w="100%">
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
                        {currentInterval === Intervals.Exercise || currentInterval === Intervals.Rest
                            ? `${circuitsDone + 1}/${numberOfTabatas}`
                            : `${circuitsDone}/${numberOfTabatas}`}
                    </Text>
                </VStack>
                <VStack alignItems="center" space={2}>
                    <Text color="gray.200" fontSize="lg">Total Time</Text>
                    <Text fontSize="xl">{formatTime(remainingTime)}</Text>
                </VStack>
            </Flex>

            {/* New Parent Box for Video and Timer Section */}
            <Box flex={1} width="100%">
                {/* Video/Icon Section */}
                <Box height="50%" width="100%">
                    {currentExercise || shouldShowNextExerciseVideo(currentInterval, seconds, exercisesDone, exercisesPerTabata, circuitsDone, numberOfTabatas) ? (
                        videoSource ? (
                            <Animated.View style={{
                                opacity: fadeAnim,
                                width: '100%',
                                height: '100%',
                            }}
                            >
                                <Video
                                    isLooping
                                    isMuted
                                    ref={ref}
                                    resizeMode={ResizeMode.COVER}
                                    shouldPlay={isActive}
                                    source={videoSource}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Animated.View>
                        ) : (
                            <Flex
                                alignItems="center"
                                justifyContent="center"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                                    <Image
                                        alt="Exercise Icon"
                                        size="xl"
                                        source={exerciseIconDictionary[currentExercise?.types[0]]}
                                        style={{
                                            tintColor: iconColor,
                                        }}
                                    />
                                </Animated.View>
                            </Flex>
                        )
                    ) : (
                        <Flex
                            alignItems="center"
                            justifyContent="center"
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                                {currentInterval !== Intervals.Warmup
                                    ? (
                                        <Image
                                            alt="Get ready icon"
                                            size="xl"
                                            source={exerciseIconDictionary.Recovery}
                                            style={{
                                                tintColor: iconColor,
                                            }}
                                        />
                                    )
                                    : (
                                        <Image
                                            alt="Get ready icon"
                                            size="xl"
                                            source={exerciseIconDictionary.GetReady}
                                            style={{
                                                tintColor: iconColor,
                                            }}
                                        />
                                    )}
                            </Animated.View>
                        </Flex>
                    )}
                </Box>

                {/* Interval Name and Timer Display */}
                <VStack alignItems="center" height="50%" width="100%">
                    <Text
                        bold
                        color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Intermission ? 'flame.500' : 'yellow.500'}
                        fontSize="4xl"
                        textAlign="center"
                    >
                        {currentExercise ? currentExercise.name : (currentInterval === Intervals.Warmup ? 'Get Ready!' : currentInterval)}
                    </Text>
                    <HStack alignItems="center" justifyContent="center">
                        <Text
                            color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Intermission ? 'flame.500' : 'yellow.500'}
                            flex={1}
                            fontSize="9xl"
                            lineHeight={130}
                            textAlign="right"
                        >
                            {formatSplitTime(seconds).minutes}
                        </Text>
                        <Text
                            color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Intermission ? 'flame.500' : 'yellow.500'}
                            fontSize="9xl"
                            lineHeight={130}
                            pb={4}
                            textAlign="center"
                        >
                            :
                        </Text>
                        <Text
                            color={currentInterval === Intervals.Exercise ? 'easyGreen' : currentInterval === Intervals.Intermission ? 'flame.500' : 'yellow.500'}
                            flex={1}
                            fontSize="9xl"
                            lineHeight={130}
                            textAlign="left"
                        >
                            {formatSplitTime(seconds).secs}
                        </Text>
                    </HStack>
                    <Text bold color="gray.300" fontSize="2xl" textAlign="center">
                        {nextExerciseText ? `Next Up: ${nextExerciseText}` : ' '}
                    </Text>
                </VStack>
            </Box>

            {/* Controls Row */}
            <Box p="4" style={{ flex: 0 }} width="100%">
                <Flex
                    alignItems="center"
                    direction="row"
                    // @ts-expect-error
                    gap={6}
                    justify="center"
                >
                    {isActive ? (
                        <Box alignItems="center" flexDirection="row" justifyContent="flex-end" width="70px">
                            {process.env.EXPO_PUBLIC_ENVIRONMENT !== 'production' && (
                                <IconButton
                                    alignSelf="right"
                                    borderColor="gray.300"
                                    borderRadius="full"
                                    borderWidth="1"
                                    icon={<Icon as={Ionicons} color="white" name="flag" size="lg" />}
                                    w="46px"
                                    onPress={mockFinish}
                                />
                            )}
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

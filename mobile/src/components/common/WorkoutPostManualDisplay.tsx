import React from 'react';
import {
    HStack, VStack, Text, Icon, Box,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { getFormattedTimeForManualWorkout } from '../TabataTimerScreen/util';

type PostCardProps = {
    manualTabatas: number;
};

export const WorkoutPostManualDisplay: React.FC<PostCardProps> = ({ manualTabatas }) => {
    // Make this its own prop
    const formattedTotalWorkoutTime = getFormattedTimeForManualWorkout(manualTabatas);

    return (
        <TouchableOpacity
            style={{
                width: '100%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
        >
            <Box
                bg={{
                    linearGradient: {
                        colors: ['workoutDisplayGray', 'workoutDisplayGrayDark'],
                        start: [0, 1],
                        end: [1, 0],
                    },
                }}
                borderColor="white"
                borderRadius="md"
                borderWidth={1}
                mt={2}
                p={2}
            // bg={{
            //     linearGradient: {
            //         colors: getWorkoutDifficultyGradient(workout.numberOfTabatas),
            //         start: [0, 1],
            //         end: [1, 0],
            //     },
            // }}
            // bg={{
            //     linearGradient: {
            //         colors: ['workoutDisplayGray', workoutGradient[0]],
            //         start: [0.5, 0.5],
            //         end: [1.3, 1.3],

            //     },
            // }}
            >
                <HStack
                    justifyContent="space-between"
                    pl={2}
                    space={4}
                >
                    <HStack
                        alignItems="center"
                        space={2}
                    >
                        <Icon as={Ionicons} color="white" name="barbell-outline" size="sm" />
                        <Text bold italic fontSize="md">
                            Manual Workout
                        </Text>
                    </HStack>
                </HStack>
                {/* <Text italic fontSize="sm" pl={8}>
                    {formatBodyParts(workout.includeSettings)}
                </Text> */}
                <HStack justifyContent="space-between" mt={2}>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="body-outline" size="md" />
                        <Text fontSize="sm">
                            {`${manualTabatas} ${manualTabatas === 1 ? 'Tabata' : 'Tabatas'}`}
                        </Text>
                    </VStack>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="time-outline" size="md" />
                        <Text fontSize="sm">{formattedTotalWorkoutTime}</Text>
                    </VStack>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};

import React from 'react';
import {
    HStack, VStack, Text, Icon, Box,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { HomeScreenNavigationProp } from '../../types/navigationTypes';
import { formatBodyParts, getWorkoutDifficultyGradient } from '../../util/util';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';
import { TabataWorkout } from '../../types/workouts';

type PostCardProps = {
    workout: TabataWorkout;
};

export const WorkoutPostDisplay: React.FC<PostCardProps> = ({ workout }) => {
    // Make this its own prop
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const formattedTotalWorkoutTime = getFormattedTimeForTabataWorkout(workout);

    const handleWorkoutNamePress = (): void => {
        if (workout._id) {
            navigation.navigate('ViewWorkoutScreen', { workout, workoutId: workout._id.toString() });
        }
    };

    const workoutGradient = getWorkoutDifficultyGradient(workout.difficulty);

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
            onPress={handleWorkoutNamePress}
        >
            <Box
                bg={{
                    linearGradient: {
                        colors: ['workoutDisplayGray', 'workoutDisplayGrayDark'],
                        start: [0, 1],
                        end: [1, 0],
                    },
                }}
                borderColor={workoutGradient[0]}
                borderRadius="md"
                borderWidth={1}
                mt={2}
                p={2}
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
                        <Icon as={Ionicons} color={workoutGradient[0]} name="barbell-outline" size="sm" />
                        <Text bold fontSize="md" onPress={handleWorkoutNamePress}>
                            {workout.name}
                        </Text>
                    </HStack>
                </HStack>
                <Text italic fontSize="sm" pl={8}>
                    {formatBodyParts(workout.includeSettings)}
                </Text>
                <HStack justifyContent="space-between" mt={2}>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="body-outline" size="md" />
                        <Text fontSize="sm">
                            {`${workout.tabatas.length} ${workout.tabatas.length === 1 ? 'Tabata' : 'Tabatas'}`}
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

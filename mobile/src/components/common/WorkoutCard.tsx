import React, { FC } from 'react';
import { format } from 'date-fns';
import {
    Box, VStack, Text, HStack, Icon, Button,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { TabataWorkoutWithUserInfo } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';
import { ProfilePicture } from '../ProfilePicture';
import { getWorkoutDifficultyGradient } from '../../util/util';

interface WorkoutCardProps {
    workout: TabataWorkoutWithUserInfo;
    isInMyWorkouts: boolean;
    // onDelete?: (workout: TabataWorkoutWithUserInfo) => void;
    // onEdit?: () => void;
    // onSave?: () => void;
    // onUnsave?: () => void;
}

// const MenuTrigger = ({ triggerProps }): JSX.Element => (
//     <Pressable accessibilityLabel="More options menu" {...triggerProps}>
//         <Icon as={Ionicons} name="ellipsis-vertical-outline" size="md" />
//     </Pressable>
// );

export const WorkoutCard: FC<WorkoutCardProps> = ({
    workout, isInMyWorkouts,
}) => {
    const navigation = useNavigation<StackNavigationProp<TabNavigatorParamList>>();
    const formattedDate = format(new Date(workout.createdAt), 'MMMM do, yyyy');

    const handleQuickStart = (): void => {
        navigation.navigate('TabataTimerScreen', { workout, isInMyWorkouts });
    };

    const handleClickCard = (): void => {
        navigation.navigate('ViewWorkoutScreen', { workoutId: workout._id.toString() });
    };

    const workoutDifficultyColor = getWorkoutDifficultyGradient(workout.difficulty);

    return (
        <TouchableOpacity
            style={{
                width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
            }}
            onPress={handleClickCard}
        >
            <Box
                bg={{
                    linearGradient: {
                        colors: ['workoutDisplayGray', 'workoutDisplayGrayDark'],
                        start: [0, 1],
                        end: [1, 0],
                    },
                }}
                borderColor={workoutDifficultyColor}
                borderRadius="md"
                borderWidth={1}
                // @ts-expect-error
                gap={4}
                justifyContent="space-between"
                my={2}
                p="4"
                rounded="lg"
            >
                <VStack space={4}>
                    <HStack alignItems="center" justifyContent="flex-start">
                        <Icon as={Ionicons} color={getWorkoutDifficultyGradient(workout.difficulty)} mr={2} name="barbell-outline" size="md" />
                        <Text
                            ellipsizeMode="tail"
                            fontSize="lg"
                            numberOfLines={2}
                            style={{
                                fontWeight: 'bold',
                            }}
                        >
                            {workout.name}
                        </Text>
                    </HStack>
                    <Box alignItems="center" flexDirection="row" justifyContent="space-between">
                        <Box alignItems="center" flexDirection="row">
                            <ProfilePicture
                                borderWidth={1}
                                isTabaFitAdmin={workout?.isPremade}
                                size="xs"
                                user={workout?.user}
                            />
                            <Text style={{ marginLeft: 8 }}>
                                {workout?.isPremade ? 'TabaFit' : `${workout?.user?.firstName} ${workout?.user?.lastName}`}
                            </Text>
                        </Box>
                        {!workout.isPremade && <Text>{formattedDate}</Text>}
                    </Box>
                </VStack>
                <HStack justifyContent="space-between">
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="body-outline" size="md" />
                        <Text fontSize="sm">
                            {`${workout.tabatas.length} ${workout.tabatas.length === 1 ? 'Tabata' : 'Tabatas'}`}
                        </Text>
                    </VStack>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="time-outline" size="md" />
                        <Text fontSize="sm">{getFormattedTimeForTabataWorkout(workout)}</Text>
                    </VStack>
                </HStack>
                <HStack justifyContent="space-between" space={4}>
                    <Button
                        colorScheme="secondary"
                        endIcon={(
                            <Icon
                                as={Ionicons}
                                color="white"
                                name="information-circle"
                            />
                        )}
                        size="md"
                        variant="ghost"
                        onPress={handleClickCard}
                    >
                        Details
                    </Button>
                    <TouchableOpacity onPress={handleQuickStart}>
                        {/* Build Workout Row */}
                        <Box
                            alignItems="center"
                            bg={{
                                linearGradient: {
                                    colors: ['flame.500', 'cherry.500'],
                                    start: [0, 1],
                                    end: [1, 0],
                                },
                            }}
                            borderRadius="full"
                            flexDirection="row"
                            // @ts-expect-error
                            gap={2}
                            justifyContent="center"
                            p="2"
                            px={4}
                            width={150}
                        >
                            <Text>
                                Quick Start
                            </Text>
                            <Icon as={Ionicons} name="flash" />
                        </Box>
                    </TouchableOpacity>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};
